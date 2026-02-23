# Architecture du Projet : Dashboard Gestion Auchan

**Démo :** https://asernum-job-test.vercel.app
**Code source :** https://github.com/Charles-Bally/asernum_job-test
**Identifiants de test :** `admin@asernum-job.com` / `Password1234@`

---

## Vision du Projet

Concevoir une interface d'administration robuste, scalable et maintenable. L'architecture repose sur des **systèmes autonomes** : chaque système UI (dialogs, modales, tables, sidebars, toasts) est un micro-module avec sa propre structure interne (components + hooks + services + store + types + barrel export). L'approche "Design System First" garantit la cohérence via tokens CSS, composants custom et registres d'assets centralisés. La priorité : écrire du code qui se maintient comme un produit, pas comme un test technique.

## Structure du Projet

```
src/
├── __tests__/                # Tests unitaires (Vitest + Testing Library)
├── animations/               # Configurations d'animations Framer Motion
├── app/                      # App Router Next.js (layouts, pages, API routes)
│   ├── api/                  #   Route Handlers (auth, CRUD, seed, export)
│   ├── auth/                 #   Pages authentification (login, reset password)
│   └── dashboard/            #   Pages protégées (magasins, clients, stats, profil)
├── components/
│   ├── dashboard/            # Composants métier (navbar, cartes, grilles, stats)
│   │   ├── clients/          #   Gestion clients
│   │   ├── gestion/          #   Gestion utilisateurs
│   │   ├── statistiques/     #   Graphiques et KPIs
│   │   ├── store/            #   Détail magasin
│   │   └── transactions/     #   Historique transactions
│   ├── demo/                 # DevTools (seed, reset, overlay de progression)
│   ├── dialog_system/        # Système de dialogues (alertes, confirmations)
│   ├── menu/                 # Slide panel et navigation
│   ├── modal_system/         # Système de modales (wizards, tabs, URL sync)
│   ├── sidebar_system/       # Panneaux latéraux par entité
│   ├── table_system/         # Moteur de tables (tri, filtres, pagination, export)
│   ├── toast_system/         # Notifications typées avec animations
│   ├── providers/            # Providers React (QueryProvider)
│   └── ui/
│       ├── render/           #   CustomButton, CustomIcon, CustomImage, CustomLink
│       └── forms/            #   8 composants de formulaire custom
├── constants/                # Registres centralisés (ICONS, IMAGES, endpoints, routes)
├── hooks/                    # Hooks globaux (controllers, useMediaQuery, useProfile)
├── lib/                      # Utilitaires (cn(), helpers)
├── services/
│   ├── api/                  # Orchestration API (apiRequest, JWT, OTP, Prisma)
│   └── http/                 # Client HTTP custom (factory + middlewares)
├── store/                    # Stores Zustand globaux (auth, page, bird)
└── types/                    # Types partagés (User, Store, Client, Transaction)
```

Chaque système (`dialog_system`, `modal_system`, `table_system`, `sidebar_system`, `toast_system`) suit la même structure interne : `components/ + hooks/ + services/ + store/ + types/ + index.ts`. Ce pattern rend chaque système autonome, testable isolément, et remplaçable sans impact sur le reste de l'application.

## Stack Technique

| Catégorie   | Technologie                                     |
| ----------- | ----------------------------------------------- |
| Framework   | Next.js 16 + React 19 + TypeScript 5.9 (Strict) |
| Styling     | Tailwind CSS v4 + Framer Motion                 |
| State       | Zustand 5 + TanStack Query 5                    |
| HTTP        | Axios (client custom avec middlewares)          |
| Formulaires | React Hook Form                                 |
| BDD         | PostgreSQL 17 + Prisma ORM                      |
| Auth        | JWT (access/refresh) + bcrypt + OTP             |
| Tests       | Vitest + Testing Library                        |
| Paquets     | pnpm                                            |

## Architecture Frontend -- Les Choix Structurants

### Cinq Systèmes de Composants Autonomes

Chaque système suit le pattern : `components/ + hooks/ + services/ + store/ + types/ + index.ts`

**Dialog System** -- Alertes, confirmations, suppressions. API promise-based (`const result = await dialog({...})`), stacking avec z-index dynamique, rendu via portail React. Chaque dialog retourne une promesse résolue avec l'action choisie.

**Modal System** -- Le plus riche. Wizards multi-étapes avec validation par étape, navigation par tabs, synchronisation URL bidirectionnelle (partage de liens avec état modal), stacking parent-enfant, event bus pour communication cross-modale, entity registry pour le rendu dynamique. Hook `useModalData` avec nested paths typés pour les formulaires complexes.

**Table System** -- Moteur de tables complet : pagination, recherche debounced (300ms), tri bidirectionnel, filtres rapides, DateRangePicker (dropdown desktop / bottom sheet mobile), export CSV, visibilité des colonnes par breakpoint responsive. Service `tableManager` avec registry pattern pour la synchronisation cross-tables après mutations.

**Sidebar System** -- Panneaux latéraux inline avec entity registry (User, Client, Cashier, Transaction). Chaque entité est un composant autonome avec son data fetching, ses actions et sa UI. Synchronisation URL pour navigation browser.

**Toast System** -- Notifications typées (success, error, warning, info) avec animations d'entrée/sortie.

### Couche de Composants Centralisée

Aucune balise HTML brute (`<button>`, `<a>`, `<img>`) n'est utilisée directement dans le projet. Tout passe par une couche de composants custom :

- **`CustomButton`** -- 6 variants (primary, secondary, outline, ghost, danger, none), 3 tailles, animations Framer Motion intégrées
- **`CustomLink`** -- Mêmes variants que CustomButton, gestion unifiée de la navigation interne/externe
- **`CustomIcon`** -- Affichage d'icônes via un registre centralisé `ICONS` (source unique de vérité)
- **`CustomImage`** -- Affichage d'images via un registre centralisé `IMAGES`

L'intérêt : modifier un comportement, un style ou une animation sur `CustomButton` propage le changement à l'ensemble de l'application instantanément. Zéro recherche-remplacement, zéro régression visuelle. Les registres `ICONS` et `IMAGES` centralisent chaque asset avec ses métadonnées (src, alt, aspectRatio) -- un asset se met à jour en un seul point.

### Design System et Tokens CSS

- Zéro couleur hardcodée dans le JSX : toutes via CSS variables puis `@theme inline` Tailwind v4
- Palette structurée : couleurs par rôle (admin=rouge, manager=indigo, resp-caisses=ambre, caissier=gris), par état (success/danger/warning/info), par surface
- Composition via `cn()` (clsx + tailwind-merge), jamais de template literals
- Police locale Sana Sans Alt (4 graisses WOFF2, `font-display: swap`)

### Formulaires

- 8 composants de formulaire custom : InputText, InputEmail, InputPassword (indicateur de force + critères visuels), InputOTP (4 chiffres, auto-advance, paste support), InputCheckbox, InputDropdown (Floating UI), InputMultiSelect (recherche async, infinite scroll), InputSearchDropdown
- Intégration React Hook Form
- InputPassword calcule la force (0-5) avec feedback visuel (Faible/Moyen/Fort)

## Stratégie de Rendu et Navigation

### SSR Prefetch

Pages dashboard et statistiques : Server Components avec `HydrationBoundary` + `dehydrate(queryClient)`. Prefetch parallèle via `Promise.all` -- contenu affiché instantanément, zéro loading state au montage client.

### Scroll Adaptatif

- **Mobile** : Infinite scroll via `useInfiniteQuery` + `react-intersection-observer` + TanStack Virtual pour la virtualisation. `ScrollToTopFAB` avec Framer Motion (apparaît à 400px de scroll)
- **Desktop** : Pagination classique avec `PaginationControls`

### Responsive

- `useMediaQuery` basé sur `useSyncExternalStore` (SSR-safe, pas de hydration mismatch)
- Layouts adaptatifs par device : infinite scroll vs pagination, wizard sidebar vs layout simple, dropdown vs bottom sheet (DateRangePicker), navbar vs drawer mobile (drag-to-close)

### États de chargement

- Skeleton loading sur cartes, lignes de table, info cards -- `animate-pulse` + staggered Framer Motion
- `AuchanLoader` fullscreen (pulsation logo, z-index max)
- Empty states configurables (icône, message, bouton d'action)

## API Next.js

L'API est construite en Route Handlers Next.js avec Prisma ORM et PostgreSQL. Elle gère l'authentification JWT (access 1h, refresh 30j, OTP), le CRUD complet sur 7 modèles (User, Store, Transaction, Client, CashierHistory, AccountEvent, Otp), l'export CSV, et le seeding de données de démo. Le client HTTP frontend utilise un pipeline de middlewares (auth, logging, default) via une factory `createHttpClient()`.

## DevTools et Expérience de Revue

- Bouton `DevTools` sur la page de login (en bas à droite, semi-transparent)
- En production ce bouton ne serait pas présent, mais il est volontairement laissé pour faciliter la revue technique lorsque qu'il y a zero data ou pas.
- **Reset & Seed** : réinitialise la base avec un jeu de données réaliste (magasins, managers, caissiers, clients, transactions). Overlay animé avec progress bar et étapes numérotées
- **Clear Database** : vide toutes les données (conserve l'admin par défaut `admin@asernum-job.com` / `Password1234@`) pour tester les empty states
- Permet au recruteur de visualiser l'interface dans tous ses états (vide, peuplée, chargement)

## Performance et Qualité

- Optimisations poussées pour viser un score Lighthouse proche de 100 sur l'accessibilité et les Best Practices
- SEO : Metadata API, OG Image, `noindex`/`nofollow` (admin interne)
- Transitions et feedbacks visuels calibrés pour un usage intensif (spring physics, stagger, easing custom `[0.22, 1, 0.36, 1]`) -- l'objectif est de guider l'utilisateur sans le distraire, en cohérence avec un outil métier utilisé au quotidien
- Mascotte Auchan animée sur les pages auth (suivi du regard sur toggle mot de passe)
- Tests unitaires Vitest sur la logique métier
- Chiffrement AES sur le stockage client (cookies, sessionStorage, Zustand persist)
- Sécurité API : réponses uniformes sur les endpoints sensibles (forgot-password retourne toujours succès, que l'email existe ou non) pour éviter l'énumération de comptes

## Installation et Lancement

### Pré-requis

- **Node.js** >= 18
- **pnpm** -- Si non installé :
  ```bash
  npm install -g pnpm
  ```
- **Docker** -- Nécessaire pour la base de données PostgreSQL locale

### 1. Cloner le projet et installer les dépendances

```bash
git clone https://github.com/Charles-Bally/asernum_job-test.git
cd asernum_job-test
pnpm install
```

### 2. Configurer les variables d'environnement

Copier le fichier d'exemple et renseigner les valeurs :

```bash
cp .env.example .env
```

Variables à configurer dans `.env` :

| Variable                         | Description                           |
| -------------------------------- | ------------------------------------- |
| `NEXT_PUBLIC_ENCRYPTION_KEY`     | Clé de chiffrement AES (client)       |
| `NEXT_PUBLIC_ENCRYPTION_API_KEY` | Clé de chiffrement AES (API)          |
| `NEXT_PUBLIC_AES_IV`             | Vecteur d'initialisation AES          |
| `NEXT_PUBLIC_AES_SECRET_KEY`     | Clé secrète AES                       |
| `JWT_ACCESS_SECRET`              | Secret pour les tokens JWT d'accès    |
| `JWT_REFRESH_SECRET`             | Secret pour les tokens JWT de refresh |
| `BREVO_API_KEY`                  | Clé API Brevo (envoi d'emails OTP)    |
| `DATABASE_URL`                   | URL de connexion PostgreSQL           |

Les valeurs par défaut de `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_API_URL`, `BREVO_SENDER_EMAIL` et `BREVO_SENDER_NAME` sont déjà configurées.

### 3. Démarrer la base de données avec Docker

```bash
docker compose up -d
```

ou

```bash
docker-compose up -d
```

Cela lance un conteneur PostgreSQL 17 (Alpine) accessible sur le port **5433** :

| Paramètre | Valeur             |
| --------- | ------------------ |
| Host      | `localhost`        |
| Port      | `5433`             |
| User      | `postgres`         |
| Password  | `postgres`         |
| Database  | `asernum_job_test` |

Mettre à jour `DATABASE_URL` dans `.env` en conséquence :

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/asernum_job_test
```

### 4. Initialiser le schéma de la base

```bash
pnpm prisma db push
```

### 5. Lancer le projet

```bash
# Développement
pnpm dev

# Tests
pnpm test
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000). Utiliser le bouton **DevTools** sur la page de login pour peupler la base avec des données de démo (environ 30s sur le lien vercel).

## Note d'arbitrage

Architecture pensée pour la maintenabilité : chaque système est un mini-framework réutilisable, isolé et testable. Responsive Mobile-First : chaque écran s'adapte (layouts, navigation, scroll, pickers). Le code est structuré pour qu'un nouveau développeur puisse comprendre et contribuer immédiatement.
