import {useEffect, useState, FormEvent, lazy, Suspense} from 'react'
import {Link, NavLink, Route, Routes, useLocation, useNavigate} from 'react-router-dom'
import {Home, ShoppingBag , ShoppingCart, Heart, Menu, Search, X, Tag, Sparkles, Info, Phone, Download, ChevronDown, Mail, MapPin, MessageCircle, Smartphone} from 'lucide-react'
import SearchBox from './components/SearchBox'
import {waLink} from './services/order'
import Skeleton from './components/Skeleton'
import {Home as HomePage} from './HomeV2'
import {business as b} from './config/business'
import {useStore} from './store'
import {useInstall} from './hooks/useInstall'
import {Shop, ProductPage, Cart, Checkout, Wishlist, Contact, Install, Legal, NotFound} from './pages'
const About = lazy(() => import('./pages2').then(m => ({default: m.About})))

const links = [['/', 'Accueil'], ['/boutique', 'Boutique'], ['/boutique/promotions', 'Promotions'], ['/boutique/nouveautes', 'Nouveautés'], ['/contact', 'Contact'], ['/a-propos', 'À propos']]
function Header() {
  const {count, wish} = useStore(); const [open, setOpen] = useState(false); const nv = useNavigate(); const {pathname} = useLocation()
  useEffect(() => { setOpen(false); window.scrollTo(0, 0) }, [pathname])
  const search = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); nv(`/boutique?q=${encodeURIComponent(String(new FormData(e.currentTarget).get('q') || ''))}`) }
  return <>
    <header className="hdr">
      <button className="ib mo" aria-label="Ouvrir le menu" onClick={() => setOpen(true)}><Menu/></button>
      <Link to="/" className="logo" aria-label={b.name}><img src="/logo.svg" alt={b.name}/></Link>
      <nav className="dn" aria-label="Navigation principale">{links.map(([to, t]) => <NavLink key={to} to={to} end={to === '/'}>{t}</NavLink>)}</nav>
      <span className="sp mo"/><SearchBox/>
      <Link className="ib mo" to="/boutique" aria-label="Rechercher"><Search/></Link>
      <Link className="ib" to="/wishlist" aria-label="Favoris"><Heart/>{wish.length > 0 && <i key={wish.length} className="bump">{wish.length}</i>}</Link>
      <Link className="ib" to="/panier" aria-label="Panier"><ShoppingCart/>{count > 0 && <i key={count} className="bump">{count}</i>}</Link>
    </header>
    {open && <><div className="ov" onClick={() => setOpen(false)}/><aside className="drawer" aria-label="Menu"><button className="ib" aria-label="Fermer le menu" onClick={() => setOpen(false)}><X/></button>
      {[{to: '/', t: 'Accueil', I: Home}, {to: '/boutique', t: 'Boutique', I: ShoppingBag}, {to: '/boutique/promotions', t: 'Promotions', I: Tag}, {to: '/boutique/nouveautes', t: 'Nouveautés', I: Sparkles}, {to: '/a-propos', t: 'À propos', I: Info}, {to: '/contact', t: 'Contact', I: Phone}, {to: '/wishlist', t: 'Favoris', I: Heart, n: wish.length}, {to: '/panier', t: 'Panier', I: ShoppingCart, n: count}, {to: '/installation', t: "Installer l'application", I: Download}].map(({to, t, I, n}) => <Link key={to} to={to}><I size={18}/>{t}{!!n && <i>{n}</i>}</Link>)}</aside></>}
  </>
}
function BottomNav() { const {count} = useStore(); const tabs = [{to: '/', I: Home, t: 'Accueil'}, {to: '/boutique', I: ShoppingBag, t: 'Boutique'}, {to: '/wishlist', I: Heart, t: 'Favoris'}, {to: '/contact', I: Phone, t: 'Contact'}, {to: '/panier', I: ShoppingCart, t: 'Panier'}]; return <nav className="bar mo" aria-label="Navigation mobile">{tabs.map(({to,I,t}) => <NavLink key={to} to={to} end={to === '/'}><I size={22}/>{t}{to === '/panier' && count > 0 && <i>{count}</i>}</NavLink>)}</nav> }
function FootCol({t, children}: {t: string; children: any}) { const [o, setO] = useState(false); return <section className={'fc' + (o ? ' open' : '')}><h3 className="fh"><button aria-expanded={o} onClick={() => setO(!o)}>{t}<ChevronDown size={18}/></button></h3><div className="fb">{children}</div></section> }
function Footer() { const soc = Object.entries(b.social).filter(([,u]) => u); return <footer className="foot"><div>
  <section><img src="/logo.svg" alt={b.name}/><p>{b.tagline}</p><p><Smartphone size={14}/> Boutique spécialisée en smartphones</p></section>
  <FootCol t="Boutique"><Link to="/boutique">Tous les smartphones</Link><Link to="/boutique/apple">Apple</Link><Link to="/boutique/samsung">Samsung</Link><Link to="/boutique/xiaomi">Xiaomi</Link><Link to="/boutique/tecno">Tecno</Link><Link to="/boutique/infinix">Infinix</Link></FootCol>
  <FootCol t="Aide"><Link to="/contact">Contact</Link><Link to="/installation">Installer l'application</Link><Link to="/info/retours">Retours et remboursements</Link><Link to="/info/confidentialite">Confidentialité</Link></FootCol>
  <FootCol t="Contact"><a href={`tel:${b.phone.replace(/\s/g, '')}`}><Phone size={14}/> {b.phone}</a><a href={waLink(`Bonjour ${b.name},`)} target="_blank" rel="noopener noreferrer"><MessageCircle size={14}/> WhatsApp</a><a href={`mailto:${b.email}`}><Mail size={14}/> {b.email}</a><span><MapPin size={14}/> {b.address}, {b.city}</span>{soc.map(([n,u]) => <a key={n} href={u} target="_blank" rel="noopener noreferrer">{n}</a>)}</FootCol>
  <p className="c">© {new Date().getFullYear()} {b.name}. Tous droits réservés.</p>
</div></footer> }
function Banner() { const {can,install}=useInstall(); const [hide,setHide]=useState(() => !!localStorage.getItem('byte-mobile-install-hide')); if(!can||hide)return null; return <div className="card banner" role="region" aria-label="Installation"><span>Installer {b.name}</span><span><button className="btn" onClick={install}>Installer</button> <button className="ib" aria-label="Plus tard" onClick={()=>{localStorage.setItem('byte-mobile-install-hide','1');setHide(true)}}><X size={18}/></button></span></div> }
export default function App() { const {toast}=useStore(); const {pathname}=useLocation(); return <><Header/><main className="wrap"><div key={pathname} className="fade"><Suspense fallback={<Skeleton/>}><Routes>
  <Route path="/" element={<HomePage/>}/><Route path="/boutique" element={<Shop/>}/><Route path="/boutique/:cat" element={<Shop/>}/><Route path="/produit/:slug" element={<ProductPage/>}/><Route path="/panier" element={<Cart/>}/><Route path="/commande" element={<Checkout/>}/><Route path="/wishlist" element={<Wishlist/>}/><Route path="/contact" element={<Contact/>}/><Route path="/installation" element={<Install/>}/><Route path="/a-propos" element={<About/>}/><Route path="/info/:doc" element={<Legal/>}/><Route path="*" element={<NotFound/>}/>
</Routes></Suspense></div></main><Footer/><BottomNav/><Banner/>{toast&&<div className="toast" role="status">{toast}</div>}</> }
