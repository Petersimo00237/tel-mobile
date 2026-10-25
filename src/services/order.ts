import {business as b} from '../config/business'
export type Customer = {name: string; phone: string; email: string; address: string; city: string; district: string; mode: string; comment: string}
export type Item = {name: string; qty: number; price: number}
export const fcfa = (n: number) => new Intl.NumberFormat('fr-FR').format(n).replace(/[\u202f\u00a0]/g, ' ') + ' FCFA'
export const waLink = (text: string) => `https://wa.me/${b.whatsapp}?text=${encodeURIComponent(text)}`
export function buildOrderMessage(items: Item[], c: Customer) {
  const total = items.reduce((s, i) => s + i.qty * i.price, 0)
  return [`Bonjour ${b.name},`, '', 'Je souhaite passer la commande suivante :', '',
    ...items.flatMap(i => [`Produit : ${i.name}`, `- Quantité : ${i.qty}`, `- Prix : ${fcfa(i.price)}`, '']),
    `Total : ${fcfa(total)}`, '', 'Informations client :', `Nom : ${c.name}`, `Téléphone : ${c.phone}`, `Email : ${c.email || '-'}`,
    `Adresse : ${c.address}`, `Ville : ${c.city}`, `Quartier : ${c.district || '-'}`, `Mode de réception : ${c.mode}`,
    ...(c.comment ? [`Commentaire : ${c.comment}`] : []), '', 'Merci de confirmer ma commande.'].join('\n')
}
export const buildWhatsAppUrl = (items: Item[], c: Customer) => waLink(buildOrderMessage(items, c))
export const buildOrderMailto = (items: Item[], c: Customer) => `mailto:${b.email}?subject=${encodeURIComponent('Nouvelle commande ' + b.name)}&body=${encodeURIComponent(buildOrderMessage(items, c))}`
export const buildContactMailto = (name: string, email: string, msg: string) => `mailto:${b.email}?subject=${encodeURIComponent('Message depuis le site ' + b.name)}&body=${encodeURIComponent(`${msg}\n\n${name}\n${email}`)}`
