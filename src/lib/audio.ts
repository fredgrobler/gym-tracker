let ctx: AudioContext | null = null

/** Must be called synchronously inside a user gesture (tap) to unlock audio on iOS Safari. */
export function unlockAudio(): void {
  if (!ctx) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    ctx = new Ctor()
  }
  if (ctx.state === 'suspended') {
    void ctx.resume()
  }
}

export function playChime(): void {
  if (!ctx) return
  const now = ctx.currentTime
  ;[0, 0.18, 0.36].forEach((offset, i) => {
    const osc = ctx!.createOscillator()
    const gain = ctx!.createGain()
    osc.type = 'sine'
    osc.frequency.value = i === 2 ? 880 : 660
    gain.gain.setValueAtTime(0, now + offset)
    gain.gain.linearRampToValueAtTime(0.25, now + offset + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.16)
    osc.connect(gain)
    gain.connect(ctx!.destination)
    osc.start(now + offset)
    osc.stop(now + offset + 0.18)
  })
}
