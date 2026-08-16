import { useEffect, useState } from 'react'

export default function VideoSheet({
  videoId,
  title,
  onClose,
}: {
  videoId: string
  title: string
  onClose: () => void
}) {
  const [online, setOnline] = useState(navigator.onLine)

  useEffect(() => {
    const goOnline = () => setOnline(true)
    const goOffline = () => setOnline(false)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  // youtube-nocookie.com is YouTube's privacy-enhanced embed domain — no tracking
  // cookies set until playback actually starts. loop=1 + playlist=<same id> is the
  // documented way to loop a single video (loop alone is ignored otherwise).
  // Deliberately omits modestbranding=1: that long-deprecated param reliably throws
  // YouTube error 153 ("video player configuration error") on this video library.
  // Deliberately omits autoplay=1 too: iOS Safari blocks unmuted iframe autoplay
  // outside a tightly-scoped gesture anyway, and starting audio the instant the
  // sheet opens would talk over whatever the user's already playing in their
  // headphones — better to show the thumbnail and let them tap play themselves.
  const src = `https://www.youtube-nocookie.com/embed/${videoId}?loop=1&playlist=${videoId}&rel=0&playsinline=1`

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <h2 style={{ fontSize: 17, marginBottom: 12 }}>{title}</h2>
        {online ? (
          <div className="video-frame">
            <iframe
              src={src}
              title={`${title} form demo`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="video-offline">
            <p>No connection — form videos need a live connection to stream from YouTube.</p>
          </div>
        )}
        <button className="btn btn-secondary btn-block" style={{ marginTop: 16 }} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}
