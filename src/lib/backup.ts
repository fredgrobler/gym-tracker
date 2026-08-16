import { db } from '../db'

interface BackupFile {
  version: 1
  exportedAt: string
  enrollment: unknown[]
  settings: unknown[]
  sessions: unknown[]
  setLogs: unknown[]
  bodyMetrics: unknown[]
}

export async function exportBackup(): Promise<void> {
  const backup: BackupFile = {
    version: 1,
    exportedAt: new Date().toISOString(),
    enrollment: await db.enrollment.toArray(),
    settings: await db.settings.toArray(),
    sessions: await db.sessions.toArray(),
    setLogs: await db.setLogs.toArray(),
    bodyMetrics: await db.bodyMetrics.toArray(),
  }
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const stamp = new Date().toISOString().slice(0, 10)
  a.href = url
  a.download = `gym-tracker-backup-${stamp}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export async function importBackup(file: File): Promise<void> {
  const text = await file.text()
  const data = JSON.parse(text) as BackupFile
  if (data.version !== 1) throw new Error('Unrecognized backup file version')
  await db.transaction('rw', db.enrollment, db.settings, db.sessions, db.setLogs, db.bodyMetrics, async () => {
    await Promise.all([
      db.enrollment.clear(),
      db.settings.clear(),
      db.sessions.clear(),
      db.setLogs.clear(),
      db.bodyMetrics.clear(),
    ])
    await Promise.all([
      db.enrollment.bulkAdd(data.enrollment as never[]),
      db.settings.bulkAdd(data.settings as never[]),
      db.sessions.bulkAdd(data.sessions as never[]),
      db.setLogs.bulkAdd(data.setLogs as never[]),
      db.bodyMetrics.bulkAdd(data.bodyMetrics as never[]),
    ])
  })
}
