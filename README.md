# Site de Maître Charline HAYS — haysavocat.fr

Site vitrine one-page (Next.js, export statique) avec prise de rendez-vous en ligne :

- **Site public** : demande de contact (objet, format, disponibilités facultatives), accusé de réception par email.
- **Espace `/admin`** : nouvelles demandes, fixation du rendez-vous (créneaux libres proposés, disponibilités du client en surbrillance), agenda, horaires, absences.
- **Supabase** (gratuit) : base Postgres, authentification de l'admin, fonctions serveur.
- **Brevo** (gratuit, 300 emails/jour) : envoi des emails à la charte du cabinet.

```
Site statique ──► contact-request (fonction serveur)   enregistre la demande, emails client + Charline
/admin ─────────► admin-booking (fonction serveur)     fixer / déplacer / refuser / annuler + email au client
             └──► free_slots (RPC, admins)             créneaux libres selon horaires, absences, RDV
             └──► tables (accès réservé aux admins)    horaires, absences, réglages
```

La base refuse deux rendez-vous confirmés qui se chevauchent (contrainte d'exclusion). Le logo des emails est servi par Supabase Storage (`public-assets/logo-email.png`, source : `supabase/assets/logo-email.png`).

## Environnement de test (développeur)

Une base Supabase locale, isolée de la production : **aucun email ne quitte la machine**.

```bash
npm run dev:test        # base locale + fonctions + site (Docker requis)
```

| | URL |
|---|---|
| Site | http://localhost:3000 |
| Admin de test | http://localhost:3000/admin — `dev@local.test` ou `charlinehays.avocat@gmail.com`, mot de passe `dev-local-123` |
| Emails envoyés (Mailpit) | http://127.0.0.1:54324 |
| Base de données (Studio) | http://127.0.0.1:54323 |

- `npm run db:reset` : remet la base à zéro avec les données d'exemple (`supabase/seed.sql`).
- `npm run db:types` : régénère `lib/database.types.ts` après une migration.
- `npm run db:stop` : arrête la base locale.

Secrets locaux des fonctions : `supabase/functions/.env` (ignoré par git), à créer depuis `supabase/functions/.env.example` :

```
MAILPIT_URL=http://supabase_inbucket_charline-hays-site:8025
SITE_URL=http://localhost:3000
NOTIFY_EMAIL=charline@local.test
LOGO_URL=http://127.0.0.1:54321/storage/v1/object/public/public-assets/logo-email.png
VAPID_KEYS={...}            # clés VAPID de dev
```

Pour recevoir les vrais emails Brevo sur sa propre boîte : retirer `MAILPIT_URL`, ajouter `BREVO_API_KEY` et `EMAIL_REDIRECT_TO=vous@exemple.fr`. Tous les emails sont alors redirigés vers cette adresse, sujet préfixé `[TEST → destinataire]`.

> Ne jamais mettre de valeurs locales dans `[edge_runtime.secrets]` de `supabase/config.toml` : `supabase secrets set` les enverrait en production.

## Application admin (PWA) et notifications

`/admin` s'installe comme une application (manifest `public/admin.webmanifest`, service worker `public/admin-sw.js`). La cloche de l'en-tête active les notifications push : chaque nouvelle demande déclenche une notification sur les appareils abonnés (table `push_subscriptions`).

- Android / ordinateur : bouton « Installer » dans l'en-tête, ou menu du navigateur.
- iPhone (iOS 16.4+) : Safari → Partager → « Sur l'écran d'accueil », puis activer la cloche **depuis l'app installée**.
- Clés VAPID : publique dans `NEXT_PUBLIC_VAPID_PUBLIC_KEY` (site), paire complète dans le secret Supabase `VAPID_KEYS` (JSON généré par `@negrel/webpush`). Une paire pour le dev, une autre pour la prod.

## Agenda abonné

La fonction `calendar-feed` publie les rendez-vous confirmés au format iCalendar, derrière un lien secret (`settings.calendar_token`). Dans `/admin > Disponibilités > Agenda`, Charline s'y abonne une fois (Google Agenda ou Calendrier iPhone/Mac) : les rendez-vous fixés, déplacés ou annulés s'y reflètent automatiquement. « Nouveau lien » invalide l'ancien.

## Mise en production

### 1. Supabase

1. Créer un projet sur [supabase.com](https://supabase.com), **région Europe (Paris `eu-west-3`)**.
2. Lier et déployer :
   ```bash
   npx supabase login
   npx supabase link --project-ref <ref-du-projet>
   npx supabase db push
   npx supabase functions deploy contact-request admin-booking calendar-feed
   curl -X POST "https://<ref>.supabase.co/storage/v1/object/public-assets/logo-email.png" \
     -H "Authorization: Bearer <service_role>" -H "Content-Type: image/png" -H "x-upsert: true" \
     --data-binary @supabase/assets/logo-email.png
   ```
3. Authentication > URL Configuration : Site URL `https://haysavocat.fr`, Redirect URL `https://haysavocat.fr/admin`.
4. Authentication > Sign In / Providers : **désactiver les inscriptions** (« Allow new users to sign up »).
5. Créer le compte de Charline (Authentication > Users > Add user, email `charlinehays.avocat@gmail.com`), puis dans le SQL Editor :
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'charlinehays.avocat@gmail.com';
   ```
   Elle choisit son mot de passe via « Mot de passe oublié » sur `/admin`.

### 2. Brevo

1. Créer un compte sur [brevo.com](https://www.brevo.com).
2. **Authentifier le domaine `haysavocat.fr`** (Expéditeurs, domaines > Domaines) : ajouter chez le registrar les enregistrements DNS fournis (DKIM, DMARC, code Brevo). Aucune boîte mail n'est nécessaire.
3. Créer l'expéditeur `rendez-vous@haysavocat.fr` et une clé API (SMTP & API > Clés API).

> Brevo n'autorise pas une adresse `@gmail.com` comme expéditeur. L'adresse Gmail reçoit les notifications et les réponses des clients (en-tête « Répondre à »), l'expéditeur technique est `rendez-vous@haysavocat.fr`.

### 3. Secrets et variables

```bash
cp supabase/functions/.env.example supabase/functions/.env   # renseigner BREVO_API_KEY
npx supabase secrets set --env-file supabase/functions/.env
```

Chez l'hébergeur du site (Vercel) : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Settings > API) et `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, puis rebuild.

### 4. Éviter la mise en veille

Un projet Supabase gratuit est mis en pause après 7 jours sans activité. Le workflow `.github/workflows/supabase-keepalive.yml` l'interroge tous les 3 jours : ajouter les secrets GitHub `SUPABASE_URL` et `SUPABASE_ANON_KEY` (Settings > Secrets and variables > Actions).

## Réglages par défaut

Modifiables dans `/admin > Disponibilités` : lundi–vendredi 9 h–12 h et 14 h–18 h, rendez-vous de 60 min. Ces horaires servent à proposer des créneaux libres quand Charline fixe un rendez-vous ; elle peut aussi choisir une autre heure.
