import {useState, useMemo, useEffect, FormEvent} from 'react'
import {Link, useParams, useSearchParams, Navigate} from 'react-router-dom'
import {ChevronRight, Heart, ShoppingCart, Trash2, Plus, Minus, Phone, Mail, MapPin, MessageCircle, Download, Search, Smartphone} from 'lucide-react'
import {products, categories, slug} from './data/catalog'
import {Product} from './types'
import {useStore, load} from './store'
import {business as b} from './config/business'
import {fcfa, buildWhatsAppUrl, buildOrderMailto, buildContactMailto, waLink, Customer} from './services/order'
import {useTitle} from './hooks/useTitle'
import {useInstall} from './hooks/useInstall'
import EmptyState from './components/EmptyState'

const Stars = ({n}: {n: number}) => <span className="stars" aria-label={`Note ${n} sur 5`}>{'★'.repeat(Math.round(n))}{'☆'.repeat(5 - Math.round(n))} <small>{n}</small></span>
export function Card({p}: {p: Product}) {
  const {add, wish, toggleWish} = useStore(); const on = wish.includes(p.id)
  return <article className="card pc">
    <span className="badges">{p.new && <span className="badge nw">Nouveau</span>}{p.oldPrice && <span className="badge">-{Math.round(100 - p.price / p.oldPrice * 100)}%</span>}</span>
    <button className={'heart' + (on ? ' on' : '')} aria-label={on ? 'Retirer de la wishlist' : 'Ajouter à la wishlist'} onClick={() => toggleWish(p.id)}><Heart size={18} fill={on ? 'currentColor' : 'none'}/></button>
    <Link to={`/produit/${p.slug}`}><img loading="lazy" src={p.images[0]} alt={p.name}/><h3>{p.name}</h3></Link><small className="br">{p.brand}{p.stock ? '' : ' · Rupture de stock'}</small>
    <Stars n={p.rating}/>
    <div className="price">{fcfa(p.price)}{p.oldPrice && <s>{fcfa(p.oldPrice)}</s>}</div>
    {p.oldPrice && <small className="sv2">Économie : {fcfa(p.oldPrice - p.price)}</small>}<button className="btn" disabled={!p.stock} onClick={() => add(p.id)}><ShoppingCart size={16}/>{p.stock ? 'Ajouter' : 'Indisponible'}</button>
  </article>
}
export const Grid = ({list}: {list: Product[]}) => <div className="grid">{list.map(p => <Card key={p.id} p={p}/>)}</div>
export const Sec = ({t, s, I, to, children}: {t: string; s?: string; I?: any; to?: string; children: any}) => <section className="sec"><div className="sh"><div><h2>{I && <I size={20} aria-hidden="true"/>}{t}</h2>{s && <p className="sb">{s}</p>}</div>{to && <Link className="all" to={to}>Voir tout <ChevronRight size={14} aria-hidden="true"/></Link>}</div>{children}</section>
const SPECIAL: Record<string, [string, (p: Product) => boolean]> = {promotions: ['En promotion', p => p.promotion], populaires: ['Les plus populaires', p => p.popular], nouveautes: ['Nouveautés', p => p.new]}
const PER = 6
export function Shop() {
  const {cat} = useParams(); const [sp, setSp] = useSearchParams(); const q = sp.get('q') || ''
  const [brand, setBrand] = useState(''), [max, setMax] = useState(0), [promo, setPromo] = useState(false), [stock, setStock] = useState(false), [sort, setSort] = useState('pop'), [page, setPage] = useState(1)
  const parent = Object.keys(categories).find(c => slug(c) === cat)
  const subName = Object.values(categories).flat().find(s => slug(s) === cat)
  const flt = SPECIAL[cat || '']
  const top = parent || (subName && Object.keys(categories).find(c => categories[c].includes(subName)))
  const title = parent || subName || (flt && flt[0]) || 'Notre boutique'
  useTitle(title)
  useEffect(() => { setPage(1) }, [brand, max, promo, stock, sort, q, cat])
  const list = useMemo(() => {
    const l = products.filter(p => (!parent || p.category === parent) && (!subName || p.subcategory === subName) && (!flt || flt[1](p)) && (!q || (p.name + ' ' + p.brand).toLowerCase().includes(q.toLowerCase())) && (!brand || p.brand === brand) && (!max || p.price <= max) && (!promo || p.promotion) && (!stock || p.stock > 0))
    return sort === 'asc' ? l.sort((a, c) => a.price - c.price) : sort === 'desc' ? l.sort((a, c) => c.price - a.price) : sort === 'rate' ? l.sort((a, c) => c.rating - a.rating) : l
  }, [parent, subName, flt, q, brand, max, promo, stock, sort])
  if (cat && !parent && !subName && !flt) return <Navigate to="/boutique" replace/>
  const pages = Math.ceil(list.length / PER) || 1
  return <>
    <div className="crumb"><Link to="/">Accueil</Link> › <Link to="/boutique">Boutique</Link>{cat && <> › {title}</>}</div>
    <h1>{title}</h1>
    <p className="crumb">{list.length} produit{list.length > 1 ? 's' : ''}</p>
    <div className="chips">{top ? categories[top].map(s => <Link key={s} className={'chip' + (slug(s) === cat ? ' on' : '')} to={`/boutique/${slug(s)}`}>{s}</Link>) : Object.keys(categories).map(c => <Link key={c} className="chip" to={`/boutique/${slug(c)}`}>{c}</Link>)}</div>
    <div className="filters">
      <input aria-label="Rechercher" placeholder="Rechercher un produit…" value={q} onChange={e => setSp(e.target.value ? {q: e.target.value} : {})}/>
      <select aria-label="Marque" value={brand} onChange={e => setBrand(e.target.value)}><option value="">Toutes les marques</option>{[...new Set(products.map(p => p.brand))].map(x => <option key={x}>{x}</option>)}</select>
      <select aria-label="Prix maximum" value={max} onChange={e => setMax(+e.target.value)}><option value={0}>Tous les prix</option>{[25000, 100000, 300000, 600000].map(x => <option key={x} value={x}>Jusqu'à {fcfa(x)}</option>)}</select>
      <select aria-label="Trier par" value={sort} onChange={e => setSort(e.target.value)}><option value="pop">Pertinence</option><option value="asc">Prix croissant</option><option value="desc">Prix décroissant</option><option value="rate">Mieux notés</option></select>
      <div><label><input type="checkbox" checked={promo} onChange={e => setPromo(e.target.checked)}/> Promotions</label><label><input type="checkbox" checked={stock} onChange={e => setStock(e.target.checked)}/> En stock</label></div>
    </div>
    {list.length ? <Grid list={list.slice((page - 1) * PER, page * PER)}/> : <EmptyState I={Search} t="Aucun résultat trouvé." d="Modifiez vos filtres ou votre recherche." to="/boutique" b="Explorer la boutique"/>}
    {pages > 1 && <div className="pager">{Array.from({length: pages}, (_, i) => <button key={i} className={'btn' + (i + 1 === page ? '' : ' ghost')} aria-label={`Page ${i + 1}`} onClick={() => setPage(i + 1)}>{i + 1}</button>)}</div>}
  </>
}

export function ProductPage() {
  const {slug: s} = useParams(); const p = products.find(x => x.slug === s)
  const [img, setImg] = useState(0), [qty, setQty] = useState(1); const {add, wish, toggleWish} = useStore()
  useTitle(p?.name || 'Produit'); useEffect(() => { setImg(0); setQty(1) }, [s])
  if (!p) return <Navigate to="/boutique" replace/>
  const on = wish.includes(p.id)
  return <>
    <div className="crumb"><Link to="/boutique">Boutique</Link> › <Link to={`/boutique/${slug(p.category)}`}>{p.category}</Link> › {p.name}</div>
    <div className="pp">
      <div><img className="main" src={p.images[img]} alt={p.name}/><div className="th">{p.images.map((im, i) => <button key={i} className={i === img ? 'on' : ''} aria-label={`Vue ${i + 1}`} onClick={() => setImg(i)}><img src={im} alt=""/></button>)}</div></div>
      <div>
        <h1>{p.name}</h1><p className="crumb">Marque : {p.brand} · Réf. {p.id.toUpperCase()}</p><Stars n={p.rating}/>
        <div className="price" style={{fontSize: 26, margin: '8px 0'}}>{fcfa(p.price)}{p.oldPrice && <s>{fcfa(p.oldPrice)}</s>}</div>
        <p>{p.description}</p><p><strong>{p.stock ? 'En stock' : 'Rupture de stock'}</strong></p>
        <div className="q"><button aria-label="Diminuer" onClick={() => setQty(Math.max(1, qty - 1))}><Minus size={14}/></button><b>{qty}</b><button aria-label="Augmenter" onClick={() => setQty(qty + 1)}><Plus size={14}/></button></div>
        <div className="nv"><button className="btn" disabled={!p.stock} onClick={() => add(p.id, qty)}><ShoppingCart size={16}/>Ajouter au panier</button><button className="btn ghost" onClick={() => toggleWish(p.id)}><Heart size={16} fill={on ? 'currentColor' : 'none'}/>{on ? 'Dans ma wishlist' : 'Wishlist'}</button></div>
        {!!Object.keys(p.specifications).length && <><h3>Caractéristiques</h3><table className="spec"><tbody>{Object.entries(p.specifications).map(([k, v]) => <tr key={k}><td>{k}</td><td>{v}</td></tr>)}</tbody></table></>}
        <h3>Avis</h3><p className="crumb">Note moyenne {p.rating}/5. Les avis détaillés seront disponibles avec le compte client.</p>
      </div>
    </div>
    <Sec t="Produits similaires"><Grid list={products.filter(x => x.id !== p.id && (x.subcategory === p.subcategory || x.category === p.category)).slice(0, 4)}/></Sec>
  </>
}

export function Cart() {
  useTitle('Panier'); const {lines, setQty, remove, total} = useStore()
  const items = lines.map(l => ({l, p: products.find(p => p.id === l.id)!})).filter(x => x.p)
  if (!items.length) return <EmptyState I={ShoppingCart} t="Votre panier est vide" d="Découvrez notre sélection de smartphones." to="/boutique" b="Découvrir la boutique"/>
  return <><h1>Mon panier ({items.length})</h1><div className="two">
    <div>{items.map(({l, p}) => <div className="card line" key={p.id}><img src={p.images[0]} alt=""/><div className="gr"><Link to={`/produit/${p.slug}`}>{p.name}</Link><div className="price">{fcfa(p.price)}</div><div className="q"><button aria-label="Diminuer" onClick={() => setQty(p.id, l.qty - 1)}><Minus size={14}/></button><b>{l.qty}</b><button aria-label="Augmenter" onClick={() => setQty(p.id, l.qty + 1)}><Plus size={14}/></button></div></div><div><b>{fcfa(p.price * l.qty)}</b><button className="ib" aria-label={`Supprimer ${p.name}`} onClick={() => remove(p.id)}><Trash2 size={18}/></button></div></div>)}
      <Link to="/boutique">← Continuer les achats</Link></div>
    <aside className="card sum"><div><span>Sous-total</span><b>{fcfa(total)}</b></div><div><span>Total</span><b>{fcfa(total)}</b></div><Link className="btn full" to="/commande">Passer commande</Link></aside></div></>
}

const emptyC: Customer = {name: '', phone: '', email: '', address: '', city: b.city, district: '', mode: 'Livraison', comment: ''}
export function Checkout() {
  useTitle('Commande'); const {lines, total, clear} = useStore(); const [step, setStep] = useState(1)
  const [c, setC] = useState<Customer>(() => ({...emptyC, ...load<Partial<Customer>>('byte-customer', {})}))
  const items = lines.map(l => { const p = products.find(x => x.id === l.id); return p ? {name: p.name, qty: l.qty, price: p.price} : null }).filter(Boolean) as {name: string; qty: number; price: number}[]
  if (!items.length) return <Navigate to="/panier" replace/>
  const set = (k: keyof Customer) => (e: any) => setC({...c, [k]: e.target.value})
  const next = (e: FormEvent) => { e.preventDefault(); localStorage.setItem('byte-customer', JSON.stringify(c)); setStep(2) }
  return <div className="prose"><h1>Commande</h1>
    <div className="steps">{['Livraison', 'Récapitulatif', 'Envoi'].map((t, i) => <span key={t} className={step === i + 1 ? 'on' : ''}>{i + 1}. {t}</span>)}</div>
    {step === 1 && <form onSubmit={next}>
      <label htmlFor="n">Nom complet *</label><input id="n" required value={c.name} onChange={set('name')}/>
      <label htmlFor="t">Téléphone *</label><input id="t" required type="tel" value={c.phone} onChange={set('phone')} placeholder="+237 6 XX XX XX XX"/>
      <label htmlFor="e">Email</label><input id="e" type="email" value={c.email} onChange={set('email')}/>
      <label htmlFor="m">Mode de réception</label><select id="m" value={c.mode} onChange={set('mode')}><option>Livraison</option><option>Retrait en boutique</option></select>
      <label htmlFor="a">Adresse *</label><input id="a" required value={c.address} onChange={set('address')}/>
      <label htmlFor="v">Ville *</label><input id="v" required value={c.city} onChange={set('city')}/>
      <label htmlFor="q">Quartier</label><input id="q" value={c.district} onChange={set('district')}/>
      <label htmlFor="c">Commentaire</label><textarea id="c" rows={3} value={c.comment} onChange={set('comment')}/>
      <p><button className="btn full" type="submit">Continuer</button></p></form>}
    {step === 2 && <><div className="card pad">{items.map(i => <div key={i.name} style={{display: 'flex', justifyContent: 'space-between', padding: '6px 0'}}><span>{i.name} × {i.qty}</span><b>{fcfa(i.price * i.qty)}</b></div>)}<hr/><div style={{display: 'flex', justifyContent: 'space-between'}}><b>Total</b><b>{fcfa(total)}</b></div></div>
      <div className="card pad">{c.name} · {c.phone}<br/>{c.address}, {c.city}{c.district && ` (${c.district})`}<br/>{c.mode}</div>
      <div className="nv"><button className="btn ghost" onClick={() => setStep(1)}>Modifier</button><button className="btn" onClick={() => setStep(3)}>Continuer</button></div></>}
    {step === 3 && <><p>Envoyez votre commande complète à TEL. Nous vous confirmons ensuite la disponibilité et la suite.</p>
      <a className="btn wa full" href={buildWhatsAppUrl(items, c)} target="_blank" rel="noopener noreferrer"><MessageCircle size={18}/>Commander via WhatsApp</a>
      <p><a className="btn full" href={buildOrderMailto(items, c)}><Mail size={18}/>Envoyer par email</a></p>
      <div className="nv"><button className="btn ghost" onClick={() => setStep(2)}>Retour</button><button className="btn ghost" onClick={() => { clear(); setStep(1) }}>Commande envoyée : vider le panier</button></div></>}
  </div>
}

export function Wishlist() {
  useTitle('Wishlist'); const {wish, toggleWish, add} = useStore(); const list = products.filter(p => wish.includes(p.id))
  if (!list.length) return <EmptyState I={Heart} t="Votre wishlist est vide." d="Touchez le cœur d'un produit pour le retrouver ici." to="/boutique" b="Découvrir la boutique"/>
  return <><h1>Ma wishlist ({list.length})</h1>{list.map(p => <div className="card line" key={p.id}><img src={p.images[0]} alt=""/><div className="gr"><Link to={`/produit/${p.slug}`}>{p.name}</Link><div className="price">{fcfa(p.price)}</div><small>{p.stock ? 'En stock' : 'Rupture de stock'}</small></div><button className="ib" aria-label="Ajouter au panier" disabled={!p.stock} onClick={() => add(p.id)}><ShoppingCart size={20}/></button><button className="ib" aria-label="Retirer de la wishlist" onClick={() => toggleWish(p.id)}><Trash2 size={20}/></button></div>)}</>
}

export function Contact() {
  useTitle('Contact'); const [f, setF] = useState({name: '', email: '', msg: ''})
  const send = (e: FormEvent) => { e.preventDefault(); location.href = buildContactMailto(f.name, f.email, f.msg) }
  return <div className="contact-page">
    <section className="contact-hero">
      <div>
        <span className="contact-kicker"><MessageCircle size={15}/> Service client TEL Mobile</span>
        <h1>Parlons de votre prochain smartphone.</h1>
        <p>Une question sur un modèle, le prix, la disponibilité ou votre commande ? Notre équipe est disponible pour vous répondre.</p>
      </div>
      <div className="contact-hero-mark"><Smartphone size={58}/></div>
    </section>
    <div className="contact-layout">
      <section>
        <div className="contact-info-grid">
          <a className="contact-info-card" href={waLink(`Bonjour ${b.name}, j'aimerais avoir des informations sur vos smartphones.`)} target="_blank" rel="noopener noreferrer">
            <span className="contact-icon wa"><MessageCircle size={22}/></span><span><strong>WhatsApp</strong><small>Échangez directement avec nous</small></span><ChevronRight size={18}/>
          </a>
          <a className="contact-info-card" href={`tel:${b.phone.replace(/\s/g, '')}`}>
            <span className="contact-icon"><Phone size={22}/></span><span><strong>Appelez-nous</strong><small>{b.phone}</small></span><ChevronRight size={18}/>
          </a>
          <a className="contact-info-card" href={`mailto:${b.email}`}>
            <span className="contact-icon"><Mail size={22}/></span><span><strong>E-mail</strong><small>{b.email}</small></span><ChevronRight size={18}/>
          </a>
          <div className="contact-info-card static">
            <span className="contact-icon"><MapPin size={22}/></span><span><strong>Notre boutique</strong><small>{b.address}, {b.city}, {b.country}</small></span>
          </div>
        </div>
        <div className="contact-hours card">
          <div className="contact-hours-title"><span className="status-dot"/> Nous sommes disponibles</div>
          <strong>{b.hours}</strong><span>Pour une réponse rapide concernant un produit ou une commande, privilégiez WhatsApp.</span>
        </div>
      </section>
      <section className="contact-form card">
        <div className="form-head"><span className="contact-icon"><Mail size={22}/></span><div><h2>Écrivez-nous</h2><p>Nous vous répondrons dès que possible.</p></div></div>
        <form onSubmit={send}>
          <div className="form-row"><div><label htmlFor="cn">Nom complet</label><input id="cn" required placeholder="Votre nom" value={f.name} onChange={e => setF({...f, name: e.target.value})}/></div><div><label htmlFor="ce">Adresse e-mail</label><input id="ce" type="email" required placeholder="vous@exemple.com" value={f.email} onChange={e => setF({...f, email: e.target.value})}/></div></div>
          <label htmlFor="cm">Votre message</label><textarea id="cm" rows={7} required placeholder="Expliquez-nous votre besoin…" value={f.msg} onChange={e => setF({...f, msg: e.target.value})}/>
          <button className="btn contact-submit" type="submit"><Mail size={17}/> Envoyer mon message</button>
          <p className="form-note">L'envoi ouvrira votre application e-mail avec le message prérempli.</p>
        </form>
      </section>
    </div>
  </div>
}

export function Install() {
  useTitle('Installation'); const {can, install} = useInstall()
  return <article className="prose"><h1>Installer {b.name}</h1>{can && <button className="btn" onClick={install}><Download size={16}/>Installer maintenant</button>}
    <div className="card pad"><h3>Android</h3>Dans Chrome, ouvrez le menu ⋮ puis « Installer l'application » ou « Ajouter à l'écran d'accueil ».</div>
    <div className="card pad"><h3>iPhone / iPad</h3>Dans Safari, touchez Partager puis « Sur l'écran d'accueil ».</div>
    <div className="card pad"><h3>Ordinateur</h3>Dans Chrome ou Edge, cliquez sur l'icône d'installation de la barre d'adresse, ou ouvrez le menu puis « Installer ».</div></article>
}

export function Account() {
  useTitle('Mon compte'); const c = load<Partial<Customer>>('byte-customer', {}); const {wish} = useStore()
  return <article className="prose"><h1>Mon compte</h1>
    <div className="card pad"><h3>Mes informations</h3>{c.name ? <p>{c.name}<br/>{c.phone}<br/>{c.email}</p> : <p>Aucune information enregistrée. Elles sont mémorisées sur cet appareil après votre première commande.</p>}</div>
    <Link className="card pad" to="/wishlist">Ma wishlist ({wish.length})</Link>
    <div className="card pad"><h3>Mes commandes</h3><p>L'historique des commandes nécessitera un compte client avec serveur (version ultérieure). Pour l'instant, vos commandes sont envoyées à TEL par WhatsApp ou email.</p></div>
    <button className="btn ghost" onClick={() => { localStorage.removeItem('byte-customer'); location.reload() }}>Effacer mes informations</button></article>
}

const DOCS: Record<string, string> = {confidentialite: 'Politique de confidentialité', retours: 'Retours et remboursements'}
export function Legal() {
  const {doc} = useParams(); const t = DOCS[doc || '']; useTitle(t || 'Information')
  if (!t) return <Navigate to="/" replace/>
  return <article className="prose"><h1>{t}</h1><p>Texte à compléter par {b.name} avant la mise en ligne. Pour toute question, contactez-nous : {b.email}.</p></article>
}
export const NotFound = () => <div className="empty"><h1>Page introuvable</h1><Link className="btn" to="/"><Search size={16}/>Retour à l'accueil</Link></div>
