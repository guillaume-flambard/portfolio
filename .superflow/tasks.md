# Tasks — portfolio-nav-gallery

> Chaque tâche : 15-45 min, fichiers propres, `Verify:` explicite.

## T1 · Nav : lien Home + état actif
- Fichiers : `src/components/SiteNav.tsx`, `src/app/globals.css`, i18n `nav.home`
- Ajouter un lien Home (avant Work). État actif : `.on` quand `usePathname()` == `/` (Home) ou le segment match.
- Verify: `tsc --noEmit` + inspecter le DOM rendu (page courante `.on`, Home cliquable).

## T2 · /work = galerie FEATURED
- Fichiers : `src/app/[locale]/work/page.tsx`, i18n `work.*`
- Remplacer le rendu MAP par une grille FEATURED (cards avec `<img>`, lien `/work/[slug]`), même style que la home.
- Verify: `npm run build` + la page /work montre 8 cards avec images.

## T3 · /about : retirer la redite
- Fichiers : `src/app/[locale]/about/page.tsx`, i18n `about.*`
- Retirer les noms de produits répétés (PayKit, Echo Travel, lab) de la section services ; garder qui/stack/approche/services + CTA contact.
- Verify: `npm run build` + grep "PayKit|Echo Travel" absent de la section services.

## T4 · Gates finaux
- `tsc --noEmit` · `npm test` · `npm run lint` · `npm run build`
- Playwright : chaque lien nav va à la bonne page, lien courant `.on`.
- Verify: toutes les gates vertes.
