import {useEffect, useState} from 'react'
let deferred: any = null
const subs = new Set<() => void>()
addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; subs.forEach(f => f()) })
export function useInstall() {
  const [, tick] = useState(0)
  useEffect(() => { const f = () => tick(n => n + 1); subs.add(f); return () => { subs.delete(f) } }, [])
  return {can: !!deferred, install: async () => { if (!deferred) return; deferred.prompt(); await deferred.userChoice; deferred = null; subs.forEach(f => f()) }}
}
