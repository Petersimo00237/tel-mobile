import {Product, Service} from '../types'

export const slug = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export const categories: Record<string, string[]> = {
  Apple: ['iPhone'],
  Samsung: ['Galaxy S', 'Galaxy A'],
  Xiaomi: ['Xiaomi', 'Redmi'],
  Tecno: ['Camon', 'Spark'],
  Infinix: ['Note', 'Hot'],
  Autres: ['Smartphones'],
}

export const img = (title: string, accent = '#0b3d91') => 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'><defs><linearGradient id='g' x1='0' x2='1'><stop stop-color='#f4f7fb'/><stop offset='1' stop-color='#eaf2ff'/></linearGradient></defs><rect width='800' height='600' fill='url(#g)'/><ellipse cx='400' cy='505' rx='210' ry='28' fill='#dbe4f0'/><rect x='292' y='55' width='216' height='430' rx='34' fill='#151b27'/><rect x='304' y='72' width='192' height='396' rx='25' fill='${accent}'/><circle cx='400' cy='90' r='8' fill='#111827'/><rect x='326' y='120' width='148' height='190' rx='14' fill='#ffffff22'/><circle cx='350' cy='145' r='18' fill='#ffffff88'/><text x='400' y='365' font-size='27' text-anchor='middle' fill='white' font-family='Arial' font-weight='700'>${title}</text><text x='400' y='410' font-size='18' text-anchor='middle' fill='#ffffffcc' font-family='Arial'>SMARTPHONE</text></svg>`)

const mk = (name: string, price: number, oldPrice: number | undefined, category: string, subcategory: string, brand: string, rating: number, flags: string, specifications: Record<string, string>, accent: string): Product => ({
  id: slug(name), slug: slug(name), name, description: `${name} : smartphone de démonstration proposé par ${businessName}. Vérifiez le stock et les variantes avant commande.`, price, oldPrice, category, subcategory, brand,
  images: [`/${slug(name) === 'iphone-15' ? 'iphone15' : slug(name) === 'iphone-13' ? 'iphone13' : slug(name) === 'samsung-galaxy-s24' ? 'samsung-s24' : slug(name) === 'samsung-galaxy-a55' ? 'samsung-a55' : slug(name) === 'xiaomi-redmi-note-13-pro' ? 'redmi-note13' : slug(name) === 'xiaomi-14' ? 'xiaomi14' : slug(name) === 'tecno-camon-30' ? 'tecno-camon30' : slug(name) === 'tecno-spark-20' ? 'tecno-spark20' : slug(name) === 'infinix-note-40' ? 'infinix-note40' : slug(name) === 'infinix-hot-40' ? 'infinix-hot40' : 'iphone15'}.jpeg`], stock: flags.includes('s') ? 0 : 10, rating, specifications,
  popular: flags.includes('p'), featured: flags.includes('f'), new: flags.includes('n'), promotion: !!oldPrice,
})
const businessName = 'TEL Mobile'

export const products: Product[] = [
  mk('iPhone 15', 549000, 599000, 'Apple',   'iPhone', 'Apple', 4.8, 'pf', {'Écran': '6.1" Super Retina XDR', 'Puce': 'A16 Bionic', 'Stockage': '128 Go', 'Appareil photo': '48 MP', 'Réseau': '5G'}, '#111827'),
  mk('iPhone 13', 399000, undefined, 'Apple', 'iPhone', 'Apple', 4.7, 'p', {'Écran': '6.1" OLED', 'Puce': 'A15 Bionic', 'Stockage': '128 Go', 'Réseau': '5G'}, '#111827'),
  mk('Samsung Galaxy S24', 499000, 539000, 'Samsung', 'Galaxy S', 'Samsung', 4.8, 'pn', {'Écran': '6.2" Dynamic AMOLED 2X', 'RAM': '8 Go', 'Stockage': '256 Go', 'Appareil photo': '50 MP', 'Réseau': '5G'}, '#334155'),
  mk('Samsung Galaxy A55', 259000, undefined, 'Samsung', 'Galaxy A', 'Samsung', 4.6, 'p', {'Écran': '6.6" Super AMOLED', 'RAM': '8 Go', 'Stockage': '256 Go', 'Batterie': '5000 mAh', 'Réseau': '5G'}, '#475569'),
  mk('Xiaomi Redmi Note 13 Pro', 179000, 199000, 'Xiaomi', 'Redmi', 'Xiaomi', 4.6, 'fn', {'Écran': '6.67" AMOLED', 'RAM': '8 Go', 'Stockage': '256 Go', 'Appareil photo': '200 MP', 'Batterie': '5000 mAh'}, '#7c3aed'),
  mk('Xiaomi 14', 429000, undefined, 'Xiaomi', 'Xiaomi', 'Xiaomi', 4.7, 'p', {'Écran': '6.36" AMOLED', 'RAM': '12 Go', 'Stockage': '512 Go', 'Réseau': '5G'}, '#4c1d95'),
  mk('Tecno Camon 30', 159000, undefined, 'Tecno', 'Camon', 'Tecno', 4.5, 'n', {'Écran': '6.78" AMOLED', 'RAM': '8 Go', 'Stockage': '256 Go', 'Appareil photo': '50 MP', 'Batterie': '5000 mAh'}, '#0f766e'),
  mk('Tecno Spark 20', 89900, undefined, 'Tecno', 'Spark', 'Tecno', 4.4, 'p', {'Écran': '6.56"', 'RAM': '8 Go', 'Stockage': '256 Go', 'Batterie': '5000 mAh'}, '#0369a1'),
  mk('Infinix Note 40', 139000, 149000, 'Infinix', 'Note', 'Infinix', 4.5, 'fn', {'Écran': '6.78" AMOLED', 'RAM': '8 Go', 'Stockage': '256 Go', 'Batterie': '5000 mAh', 'Charge': '45 W'}, '#1d4ed8'),
  mk('Infinix Hot 40', 79900, undefined, 'Infinix', 'Hot', 'Infinix', 4.3, 'p', {'Écran': '6.78"', 'RAM': '8 Go', 'Stockage': '256 Go', 'Batterie': '5000 mAh'}, '#2563eb'),
  mk('Smartphone Android Démo', 69900, undefined, 'Autres', 'Smartphones', 'Autres', 4.0, 's', {'Écran': '6.5"', 'RAM': '4 Go', 'Stockage': '128 Go', 'Batterie': '5000 mAh'}, '#0b3d91'),
]

const sv = (name: string, short: string): Service => ({slug: slug(name), name, short, long: `${short}. Contactez ${businessName} pour connaître les disponibilités, tarifs et conditions.`})
export const services: Service[] = [
  sv('Conseil avant achat', 'Aide au choix selon votre budget, votre usage et vos priorités'),
  sv('Commande WhatsApp', 'Transmettez votre panier directement à notre équipe'),
  sv('Livraison', 'Organisation de la remise ou de la livraison selon les modalités disponibles'),
  sv('Assistance après achat', 'Questions sur la prise en main et les informations du produit'),
]
