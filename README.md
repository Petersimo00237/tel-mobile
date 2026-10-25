# BYTE Mobile

Boutique PWA spécialisée dans la vente de smartphones. Le projet conserve React + TypeScript + Vite, le panier local et le processus de commande par WhatsApp/e-mail.

## Lancer le projet

```bash
npm install
npm run dev
```

## Vérifications

```bash
npm run typecheck
npm run build
npm run preview
```

## Configuration commerciale

Modifier uniquement `src/config/business.ts` pour renseigner le vrai nom commercial, WhatsApp, e-mail, téléphone, adresse et réseaux sociaux.

## Catalogue

Les produits de démonstration sont définis dans `src/data/catalog.ts`. Ils doivent être remplacés par le stock réel avant mise en production.

## PWA

Le manifeste, les icônes et le service worker sont dans `public/`.
