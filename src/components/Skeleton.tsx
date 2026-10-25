export default function Skeleton({n = 4}: {n?: number}) {
  return <div className="grid" role="status" aria-label="Chargement">{Array.from({length: n}, (_, i) => <div className="sk" key={i}/>)}</div>
}
