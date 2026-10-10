<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Projet — Site vitrine Charline Hays, avocate

Site vitrine one-page (Next.js App Router, export statique, Tailwind v4) avec demande de rendez-vous (le client envoie une prise de contact et ses disponibilités facultatives, Charline fixe le rendez-vous depuis `/admin`) : Supabase (Postgres, auth admin, fonctions serveur dans `supabase/`) et Brevo pour les emails. Espace `/admin` client-side. Voir `README.md`.

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
- Site au nom propre de Charline Hays, indépendante : ne pas présenter le cabinet Darmon comme employeur ; l'adresse (156 avenue Victor Hugo, 75116 Paris) n'est que le lieu de rendez-vous.
- `output: "export"` : toute route metadata (robots/sitemap) doit être `force-static` ; images non optimisées.
- Fonctions serveur Deno dans `supabase/functions` (exclues du tsconfig Next) ; types de la base générés dans `lib/database.types.ts`.
- Secret professionnel : ne stocker que le strict nécessaire à la prise de rendez-vous.
- Tester avec `npm run dev:test` (base locale, emails capturés par Mailpit) ; ne jamais tester sur la production. Valeurs locales des fonctions dans `supabase/functions/.env`, jamais dans `[edge_runtime.secrets]` (poussées en prod par `supabase secrets set`).

## À compléter avant mise en ligne
- Mentions légales : SIREN, toque, assureur RCP, hébergeur (placeholders `[À compléter…]`).
- Réserver le domaine `haysavocat.fr` et l'authentifier dans Brevo (expéditeur `rendez-vous@haysavocat.fr`). Email de contact provisoire : `charlinehays.avocat@gmail.com` (Google Workspace à décider).
- Créer le projet Supabase (région UE), déployer migrations et fonctions, créer le compte admin (voir `README.md`).
- Remettre `NOTIFY_EMAIL` sur l'adresse de Charline (actuellement redirigé vers le développeur) et supprimer les demandes de test de la base de production.
- Remplacer `public/portrait.jpg` (extrait du scan du CV) par la photo originale.
