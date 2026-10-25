import {createContext, useCallback, useContext, useEffect, useState, ReactNode} from 'react'
import {products} from './data/catalog'
type Line = {id: string; qty: number}
export const load = <T,>(k: string, d: T): T => { try { return JSON.parse(localStorage.getItem(k) || '') } catch { return d } }
type Ctx = {lines: Line[]; wish: string[]; toast: string; count: number; total: number; add: (id: string, q?: number) => void; setQty: (id: string, q: number) => void; remove: (id: string) => void; clear: () => void; toggleWish: (id: string) => void}
const C = createContext<Ctx>(null!)
export const useStore = () => useContext(C)
export function Store({children}: {children: ReactNode}) {
  const [lines, setLines] = useState<Line[]>(() => load('byte-cart', []))
  const [wish, setWish] = useState<string[]>(() => load('byte-wish', []))
  const [toast, setToast] = useState('')
  useEffect(() => { localStorage.setItem('byte-cart', JSON.stringify(lines)) }, [lines])
  useEffect(() => { localStorage.setItem('byte-wish', JSON.stringify(wish)) }, [wish])
  const notify = useCallback((m: string) => { setToast(m); setTimeout(() => setToast(''), 2200) }, [])
  const add = (id: string, q = 1) => { setLines(ls => ls.some(l => l.id === id) ? ls.map(l => l.id === id ? {...l, qty: l.qty + q} : l) : [...ls, {id, qty: q}]); notify('Ajouté au panier') }
  const setQty = (id: string, q: number) => setLines(ls => ls.map(l => l.id === id ? {...l, qty: Math.max(1, q)} : l))
  const remove = (id: string) => { setLines(ls => ls.filter(l => l.id !== id)); notify('Produit retiré du panier') }
  const toggleWish = (id: string) => { setWish(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]); notify('Wishlist mise à jour') }
  const total = lines.reduce((s, l) => s + (products.find(p => p.id === l.id)?.price ?? 0) * l.qty, 0)
  const count = lines.reduce((s, l) => s + l.qty, 0)
  return <C.Provider value={{lines, wish, toast, count, total, add, setQty, remove, clear: () => setLines([]), toggleWish}}>{children}</C.Provider>
}
