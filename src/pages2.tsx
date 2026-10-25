import {Link} from 'react-router-dom'
import {ChevronRight, Smartphone, ShieldCheck, Target, Eye, Phone, MessageCircle} from 'lucide-react'
import {business as b} from './config/business'
import {useTitle} from './hooks/useTitle'
import {Sec} from './pages'
import {waLink} from './services/order'

export function About() {
  useTitle('À propos')
  return <>
    <section className="slider" style={{padding: '32px 20px', color: '#fff'}}><h1 style={{color: '#fff'}}>Votre boutique smartphone</h1><p>{b.name} propose une expérience simple pour découvrir des smartphones, comparer les modèles et transmettre une commande par WhatsApp ou email.</p></section>
    <Sec t={`Qui est ${b.name} ?`} I={Smartphone}><p className="prose">Nous sommes une boutique spécialisée dans les téléphones mobiles. Le catalogue met en avant notamment Apple, Samsung, Xiaomi, Tecno et Infinix, avec des modèles adaptés à différents budgets.</p></Sec>
    <div className="band"><div className="two2"><div className="card pad"><h2><Target aria-hidden="true"/> Notre mission</h2><p>Faciliter l'achat d'un smartphone grâce à un catalogue clair, des informations utiles et un parcours de commande simple.</p></div><div className="card pad"><h2><Eye aria-hidden="true"/> Notre vision</h2><p>Construire une expérience mobile fiable, rapide et centrée sur les besoins réels des acheteurs.</p></div></div></div>
    <Sec t="Nos engagements" I={ShieldCheck}><div className="grid"><div className="card pad"><b>Catalogue spécialisé</b><p>Une interface dédiée aux smartphones et à leurs caractéristiques.</p></div><div className="card pad"><b>Commande simple</b><p>Ajoutez vos produits au panier puis transmettez votre commande via le canal disponible.</p></div><div className="card pad"><b>Accompagnement</b><p>Notre équipe peut vous aider à choisir un modèle adapté à votre usage.</p></div></div></Sec>
    <section className="cta"><h2>Une question sur un téléphone ?</h2><div className="nv" style={{justifyContent: 'center'}}><a className="btn light" href={waLink(`Bonjour ${b.name}, j'aimerais être conseillé pour choisir un smartphone.`)} target="_blank" rel="noopener noreferrer"><MessageCircle size={16}/>WhatsApp</a><Link className="btn light" to="/contact"><Phone size={16}/>Contact</Link><Link className="btn light" to="/boutique">Voir la boutique <ChevronRight size={16}/></Link></div></section>
  </>
}
