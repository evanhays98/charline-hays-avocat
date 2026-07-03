<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Projet — Site vitrine Charline Hays, avocate

Site vitrine one-page (Next.js App Router, export statique, Tailwind v4). Aucun back-end : contact par téléphone et email uniquement, le formulaire ouvre un `mailto:`.

## Charte graphique (ne pas dévier)
- Marine `--color-navy #13264b` (dominant), marine profond `#0c1a38`, fond `--color-paper #fbfaf6`, encre `#212a3e`, or `--color-gold #a8862f` (filets et surtitres uniquement), hairlines `#e5e2d9`.
- Titres : Playfair Display (`font-serif`). Corps : Mulish (`font-sans`).
- Pas de cartes arrondies : listes à filets, style institutionnel. Référence visuelle validée : `design/maquette-validee.html`.

## Règles de code
- Un composant par fichier `.tsx`, exports nommés en arrow functions ; default export réservé aux pages/layout.
- Pas de boucles `for`/`while` : `.map`/`.filter`/`.reduce`. Immutabilité. Early returns.
- Types avant implémentation ; jamais `any` ; éviter `as` ; pas de types redondants quand l'inférence suffit.
- Pas de commentaires : le code doit être auto-explicite.
- Contenu éditorial centralisé dans `lib/content.ts` (typé).

## Contraintes métier
- Ne jamais employer « spécialiste » (réservé au certificat de spécialisation) — dire « domaines d'intervention ».
- Site au nom propre de Charline Hays, indépendante : ne pas présenter le cabinet Darmon comme employeur ; l'adresse (47 avenue Hoche, 75008 Paris) n'est que le lieu de rendez-vous.
- `output: "export"` : toute route metadata (robots/sitemap) doit être `force-static` ; images non optimisées.

## À compléter avant mise en ligne
- Mentions légales : SIREN, toque, assureur RCP, hébergeur (placeholders `[À compléter…]`).
- Réserver le domaine `charlinehays-avocat.fr` et créer l'email `contact@charlinehays-avocat.fr`.
- Remplacer `public/portrait.jpg` (extrait du scan du CV) par la photo originale.
