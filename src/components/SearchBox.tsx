import {useEffect, useRef, useState, FormEvent} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {Search, X, Loader2} from 'lucide-react'
import {products, categories, slug} from '../data/catalog'
import {fcfa} from '../services/order'
export default function SearchBox() {
  const [v, setV] = useState(''), [q, setQ] = useState(''), [open, setOpen] = useState(false); const nv = useNavigate(); const ref = useRef<HTMLFormElement>(null)
  useEffect(() => { const t = setTimeout(() => setQ(v.trim().toLowerCase()), 200); return () => clearTimeout(t) }, [v])
  useEffect(() => { const f = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false) }; document.addEventListener('mousedown', f); return () => document.removeEventListener('mousedown', f) }, [])
  const loading = v.trim().toLowerCase() !== q
  const P = q ? products.filter(p => (p.name + ' ' + p.brand).toLowerCase().includes(q)).slice(0, 4) : []
  const C = q ? Object.keys(categories).concat(Object.values(categories).flat()).filter(c => c.toLowerCase().includes(q)).slice(0, 3) : []
  const none = !!q && !loading && !P.length && !C.length
  const done = () => { setOpen(false); setV('') }
  const submit = (e: FormEvent) => { e.preventDefault(); if (v.trim()) { nv(`/boutique?q=${encodeURIComponent(v.trim())}`); done() } }
  return <form ref={ref} className="sr sbx" role="search" onSubmit={submit}>
    <Search size={16} aria-hidden="true"/>
    <input value={v} onChange={e => { setV(e.target.value); setOpen(true) }} onFocus={() => setOpen(true)} aria-label="Rechercher un produit, une catégorie ou un article" placeholder="Rechercher un produit…" autoComplete="off"/>
    {loading && v.trim() && <Loader2 className="spin" size={16} aria-label="Recherche en cours"/>}
    {v && <button type="button" className="ib sx" aria-label="Effacer la recherche" onClick={() => setV('')}><X size={16}/></button>}
    {open && q && !loading && <div className="sug card">
      {!!P.length && <><h4>Produits</h4>{P.map(p => <Link key={p.id} to={`/produit/${p.slug}`} onClick={done}><span>{p.name}</span><b>{fcfa(p.price)}</b></Link>)}</>}
      {!!C.length && <><h4>Catégories</h4>{C.map(c => <Link key={c} to={`/boutique/${slug(c)}`} onClick={done}>{c}</Link>)}</>}
      {none && <div className="no"><p>Aucun résultat trouvé.</p><Link className="btn" to="/boutique" onClick={done}>Explorer la boutique</Link></div>}
    </div>}
  </form>
}
