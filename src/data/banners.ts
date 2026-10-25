import {products} from './catalog'
export type Banner = {id: string; type: string; title: string; subtitle: string; description: string; image: string; buttonText: string; buttonLink: string; active: boolean; order: number}
const im = (id: string) => (products.find(p => p.id === id) || products[0]).images[0]
const maxDisc = Math.max(...products.filter(p => p.oldPrice).map(p => Math.round(100 - p.price / p.oldPrice! * 100)))
export const banners: Banner[] = [
  {id: 'new', type: 'nouveautes', title: 'Nouveaux smartphones', subtitle: 'Les dernières références à découvrir', description: 'Une sélection de téléphones pensée pour tous les budgets.', image: im('samsung-galaxy-s24'), buttonText: 'Voir les nouveautés', buttonLink: '/boutique/nouveautes', active: true, order: 1},
  {id: 'promo', type: 'promotion', title: 'Offres du moment', subtitle: `Jusqu'à ${maxDisc}% sur une sélection`, description: 'Profitez des promotions disponibles sur certains modèles.', image: im('iphone-15'), buttonText: 'Voir les promotions', buttonLink: '/boutique/promotions', active: true, order: 2},
  {id: 'brands', type: 'marques', title: 'Apple, Samsung, Xiaomi…', subtitle: 'Les marques que vous recherchez', description: 'Comparez rapidement les modèles et trouvez votre prochain smartphone.', image: im('xiaomi-redmi-note-13-pro'), buttonText: 'Explorer la boutique', buttonLink: '/boutique', active: true, order: 3},
  {id: 'contact', type: 'assistance', title: 'Besoin d’aide pour choisir ?', subtitle: 'Notre équipe vous accompagne', description: 'Envoyez votre besoin par WhatsApp avant de commander.', image: im('tecno-camon-30'), buttonText: 'Nous écrire', buttonLink: '/contact', active: true, order: 4},
]
