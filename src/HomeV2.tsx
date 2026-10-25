import {Link} from 'react-router-dom'
import {ChevronRight, Smartphone, Star, Sparkles, Tag, ShieldCheck, MessageCircle, Phone, CircleHelp} from 'lucide-react'
import {products, services, slug} from './data/catalog'
import {business as b} from './config/business'
import {waLink} from './services/order'
import {useTitle} from './hooks/useTitle'
import {Grid, Sec} from './pages'
import HeroSlider from './components/HeroSlider'
import Trust from './components/Trust'

const CATS = [
  {t: 'iPhone & Apple', k: 'Apple', I: Smartphone}, {t: 'Samsung Galaxy', k: 'Samsung', I: Smartphone},
  {t: 'Xiaomi & Redmi', k: 'Xiaomi', I: Smartphone}, {t: 'Tecno', k: 'Tecno', I: Smartphone},
  {t: 'Infinix', k: 'Infinix', I: Smartphone}, {t: 'Autres smartphones', k: 'Autres', I: CircleHelp},
]
export function Home() {
  useTitle('Accueil')
  const by = (f: (p: (typeof products)[0]) => boolean) => products.filter(f).slice(0, 4)
  return <>
    <HeroSlider/>
    <div className="band"><Sec t="Acheter par marque" s="Trouvez rapidement le smartphone qui vous correspond" I={Smartphone} to="/boutique"><div className="cats">{CATS.map(({t, k, I}) => {
      const l = products.filter(p => p.category === k)
      return <Link key={t} to={`/boutique/${slug(k)}`} className="card cat"><span className="ic"><I size={20}/></span><span><b>{t}</b><small>{l.length} modèle{l.length > 1 ? 's' : ''}</small></span>{l[0] && <img loading="lazy" src={l[0].images[0]} alt=""/>}<ChevronRight size={18}/></Link>
    })}</div></Sec></div>
    <Sec t="Les plus populaires" s="Les smartphones les plus consultés" I={Star} to="/boutique/populaires"><Grid list={by(p => p.popular)}/></Sec>
    <div className="band"><Sec t="Nouveautés" s="Découvrez les derniers modèles ajoutés" I={Sparkles} to="/boutique/nouveautes"><Grid list={by(p => p.new)}/></Sec></div>
    <Sec t="Promotions" s="Des prix réduits sur une sélection de téléphones" I={Tag} to="/boutique/promotions"><Grid list={by(p => p.promotion)}/></Sec>
    <div className="band"><Sec t="Pourquoi TEL Mobile" s="Une expérience pensée pour acheter simplement" I={ShieldCheck}><Trust/></Sec></div>
    <Sec t="Besoin d'aide ?" s="Des services utiles avant et après votre achat" I={Smartphone}><div className="grid">{services.slice(0, 4).map((s, i) => <div key={s.slug} className="card sv"><Smartphone aria-hidden="true"/><h3>{s.name}</h3><p>{s.short}</p>{i === 1 && <a className="btn wa" href={waLink(`Bonjour ${b.name}, j'ai besoin d'aide pour choisir un smartphone.`)} target="_blank" rel="noopener noreferrer">WhatsApp</a>}</div>)}</div></Sec>
    <section className="cta"><h2>Votre prochain smartphone est peut-être ici</h2><p>Parcourez le catalogue, ajoutez vos modèles au panier puis transmettez votre commande par le canal disponible.</p><div className="nv" style={{justifyContent: 'center'}}><Link className="btn light" to="/boutique"><Smartphone size={16}/>Voir la boutique</Link><a className="btn light" href={waLink(`Bonjour ${b.name}, je souhaite être conseillé pour choisir un smartphone.`)} target="_blank" rel="noopener noreferrer"><MessageCircle size={16}/>Être conseillé</a></div></section>
  </>
}
