// Screen Wake Lock API (Safari 16.4+). Falls back to a muted, looping, invisible
// video element on older iOS Safari, which is the long-standing community workaround
// for keeping the screen awake without the native API.
let sentinel: WakeLockSentinel | null = null
let fallbackVideo: HTMLVideoElement | null = null
let rafId: number | null = null

function startCanvasStream(): MediaStream {
  const canvas = document.createElement('canvas')
  canvas.width = 2
  canvas.height = 2
  const ctx = canvas.getContext('2d')
  // The canvas must keep producing frames for the stream to stay live, but a full
  // rAF loop is wasteful — throttle to ~2fps, which is plenty to hold the stream open.
  let last = 0
  const draw = (t: number) => {
    if (ctx && t - last > 500) {
      last = t
      ctx.fillStyle = ctx.fillStyle === '#000000' ? '#010101' : '#000000'
      ctx.fillRect(0, 0, 2, 2)
    }
    rafId = requestAnimationFrame(draw)
  }
  rafId = requestAnimationFrame(draw)
  return (canvas as HTMLCanvasElement & { captureStream: (fps?: number) => MediaStream }).captureStream(2)
}

function ensureFallbackVideo(): HTMLVideoElement {
  if (fallbackVideo) return fallbackVideo
  const v = document.createElement('video')
  v.setAttribute('playsinline', '')
  v.muted = true
  v.loop = true
  v.style.position = 'fixed'
  v.style.width = '1px'
  v.style.height = '1px'
  v.style.opacity = '0'
  v.style.pointerEvents = 'none'
  v.srcObject = startCanvasStream()
  document.body.appendChild(v)
  fallbackVideo = v
  return v
}

function teardownFallback(): void {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  if (fallbackVideo) {
    fallbackVideo.pause()
    const stream = fallbackVideo.srcObject as MediaStream | null
    stream?.getTracks().forEach((t) => t.stop())
    fallbackVideo.srcObject = null
    fallbackVideo.remove()
    fallbackVideo = null
  }
}

export async function acquireWakeLock(): Promise<void> {
  if (sentinel || fallbackVideo) return // already held
  if ('wakeLock' in navigator) {
    try {
      sentinel = await (
        navigator as unknown as { wakeLock: { request: (t: 'screen') => Promise<WakeLockSentinel> } }
      ).wakeLock.request('screen')
      // The OS drops the lock when the page is hidden; clear our handle so a later
      // reacquire isn't skipped by the guard above.
      sentinel.addEventListener?.('release', () => {
        sentinel = null
      })
      return
    } catch {
      // fall through to video fallback
    }
  }
  try {
    await ensureFallbackVideo().play()
  } catch {
    teardownFallback() // don't leave a dead element + rAF loop running
  }
}

export async function releaseWakeLock(): Promise<void> {
  if (sentinel) {
    try {
      await sentinel.release()
    } catch {
      // ignore
    }
    sentinel = null
  }
  teardownFallback()
}

export function reacquireOnVisible(): () => void {
  const handler = () => {
    if (document.visibilityState === 'visible') {
      void acquireWakeLock()
    }
  }
  document.addEventListener('visibilitychange', handler)
  return () => document.removeEventListener('visibilitychange', handler)
}
