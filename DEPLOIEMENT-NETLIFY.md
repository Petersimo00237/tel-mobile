# Déploiement de TEL Mobile sur GitHub + Netlify

## Configuration du projet
- Framework : React + TypeScript + Vite
- Commande de build : `npm run build`
- Dossier publié : `dist`
- Le site est prévu pour être publié à la racine du domaine Netlify.
- Le fichier `public/_redirects` conserve le routage React Router lors de l'accès direct à une page.

## Publication
1. Extraire le ZIP et ouvrir le dossier qui contient directement `package.json`, `index.html`, `src/` et `public/`.
2. Envoyer ces fichiers à la racine d'un dépôt GitHub (ne pas envoyer le dossier parent qui contient le projet, ni `node_modules/`, ni `dist/`, ni `.git/`).
3. Dans Netlify, choisir **Add new site > Import an existing project**, connecter GitHub et choisir le dépôt.
4. Paramètres : branche `main`, commande `npm run build`, dossier de publication `dist`. Le fichier `netlify.toml` les définit déjà.
5. Cliquer sur **Deploy site** et ouvrir l'URL `https://...netlify.app`.
6. Pour les modifications suivantes : `git add .`, `git commit -m "Mise à jour du site"` puis `git push`. Netlify reconstruira automatiquement le site.

## Tester avant le déploiement
```bash
npm ci
npm run typecheck
npm run build
npm run preview
```

## Si le site est blanc
- Dans Netlify > Deploys > dernier déploiement > Deploy log, vérifier la première erreur rouge.
- Si le build échoue, vérifier Node 20, les dépendances et le nom exact des fichiers/imports.
- Si le build réussit mais que la page est blanche, vérifier que `vite.config.ts` contient `base: '/'` pour un domaine Netlify à la racine. Vider le cache du navigateur et vérifier la console.
- Pour les erreurs de navigation, garder `public/_redirects` avec `/* /index.html 200`.
- Le service worker a été corrigé pour ne plus demander `/logo.jpg`, fichier inexistant dans le projet.

## Important avant ouverture au public
Le catalogue contient des produits et prix de démonstration. Vérifier le stock, les tarifs, les coordonnées de contact, les images et les mentions légales avant de recevoir des commandes.
