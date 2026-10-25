import {useEffect, useRef, useState} from 'react'
import {Link} from 'react-router-dom'
import {ChevronLeft, ChevronRight, Sparkles, Tag, Star, Briefcase, Lightbulb, Headphones} from 'lucide-react'
import {banners} from '../data/banners'
const M: Record<string, [any, string]> = {nouveautes: [Sparkles, 'Nouveautés'], promotion: [Tag, 'Promotion'], populaires: [Star, 'Populaires'], marques: [Smartphone, 'Marques'], assistance: [Headphones, 'Assistance']}
import {Smartphone} from 'lucide-react'
export default function HeroSlider() {
  const list = banners.filter(b => b.active).sort((a, b) => a.order - b.order)
  const [i, setI] = useState(0), [paused, setPaused] = useState(false); const x0 = useRef<number | null>(null)
  const go = (n: number) => setI((n + list.length) % list.length)
  useEffect(() => {
    if (paused || list.length < 2 || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setI(v => (v + 1) % list.length), 5500)
    return () => clearInterval(t)
  }, [paused, list.length])
  if (!list.length) return null
  return <section className="slider" role="region" aria-roledescription="carrousel" aria-label="Annonces TEL"
    onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
    onTouchStart={e => { x0.current = e.touches[0].clientX; setPaused(true) }}
    onTouchEnd={e => { const d = e.changedTouches[0].clientX - (x0.current ?? 0); if (Math.abs(d) > 40) go(i + (d < 0 ? 1 : -1)); x0.current = null; setPaused(false) }}>
    <div className="track" style={{transform: `translateX(-${i * 100}%)`}}>
      {list.map((s, n) => { const [I, label] = M[s.type] || [Sparkles, 'Annonce']; return <div className="slide" key={s.id} aria-hidden={n !== i}>
        <div><span className="tag"><I size={14} aria-hidden="true"/>{label}</span><h2>{s.title}</h2><p className="sub">{s.subtitle}</p><p className="ds">{s.description}</p>
          <Link className="btn light" to={s.buttonLink} tabIndex={n === i ? 0 : -1}>{s.buttonText}</Link></div>
        <img src={s.image} alt="" loading={n === 0 ? 'eager' : 'lazy'}/></div> })}
    </div>
    <button className="sl-btn l dn" aria-label="Annonce précédente" onClick={() => go(i - 1)}><ChevronLeft/></button>
    <button className="sl-btn r dn" aria-label="Annonce suivante" onClick={() => go(i + 1)}><ChevronRight/></button>
    <div className="dots">{list.map((s, n) => <button key={s.id} className={n === i ? 'on' : ''} aria-label={`Annonce ${n + 1} sur ${list.length}`} aria-current={n === i} onClick={() => go(n)}/>)}</div>
  </section>
}
