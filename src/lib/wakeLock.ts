// Screen Wake Lock API (Safari 16.4+). Falls back to a muted, looping, invisible
// video element on older iOS Safari, which is the long-standing community workaround
// for keeping the screen awake without the native API.
let sentinel: WakeLockSentinel | null = null
let fallbackVideo: HTMLVideoElement | null = null

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
  // Generate a real (not fabricated) silent video stream at runtime via canvas.captureStream,
  // rather than embedding a hand-written binary blob that may not decode correctly.
  const canvas = document.createElement('canvas')
  canvas.width = 2
  canvas.height = 2
  const ctx = canvas.getContext('2d')
  const draw = () => {
    if (ctx) {
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, 2, 2)
    }
    requestAnimationFrame(draw)
  }
  draw()
  const stream = (canvas as HTMLCanvasElement & { captureStream: (fps?: number) => MediaStream }).captureStream(1)
  v.srcObject = stream
  document.body.appendChild(v)
  fallbackVideo = v
  return v
}

export async function acquireWakeLock(): Promise<void> {
  if ('wakeLock' in navigator) {
    try {
      sentinel = await (navigator as unknown as { wakeLock: { request: (t: 'screen') => Promise<WakeLockSentinel> } }).wakeLock.request('screen')
      return
    } catch {
      // fall through to video fallback
    }
  }
  try {
    const v = ensureFallbackVideo()
    await v.play()
  } catch {
    // best effort only
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
  if (fallbackVideo) {
    fallbackVideo.pause()
  }
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
