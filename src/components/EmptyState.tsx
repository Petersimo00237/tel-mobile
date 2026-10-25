import {Link} from 'react-router-dom'
export default function EmptyState({I, t, d, to, b}: {I: any; t: string; d: string; to: string; b: string}) {
  return <div className="empty card"><I size={44} aria-hidden="true"/><h1>{t}</h1><p>{d}</p><Link className="btn" to={to}>{b}</Link></div>
}
