# SPEC — Portfolio nav + galerie (correctif)

> Bet: `portfolio-nav-gallery` · Appetite: session courante · Mode: ordered
> Problème : l'utilisateur ne trouve pas la home (pas de lien), /work liste 67 expérimentations
> sans photos, /about redit les produits. Les vrais projets (FEATURED, galeries photos) ne sont
> visibles que sur la home.

## Scope
1. **Nav** : + lien Home, + état actif sur la page courante (`.on`). Nav = Home · Work · Lab ↗ · About · Contact.
2. **/work** : remplacer le listing MAP (67 items) par la **galerie FEATURED avec images** (même rendu que la home, pages détail `/work/[slug]`).
3. **/about** : retirer la redite produits (PayKit, Echo Travel) ; garder qui/stack/approche/services.
4. **i18n** fr+en : + `nav.home`, ajuster les textes work.

## Acceptance (Given-When-Then)
- GIVEN un visiteur sur n'importe quelle page, WHEN il regarde la nav, THEN il voit Home · Work · Lab · About · Contact et la page courante est marquée active (`.on`).
- GIVEN la home, WHEN on clique le logo ou Home, THEN on reste/revient sur la home.
- GIVEN /work, WHEN la page charge, THEN elle montre la galerie des 8 FEATURED avec leurs images (pas le listing textuel).
- GIVEN /about, WHEN on lit le contenu, THEN aucun nom de produit en redite de /work.
- GIVEN /work/largo, WHEN on clique une card de la galerie, THEN on atterrit sur la page détail.

## Constraints
- Pas de nouveau design system : réutiliser `src/styles/tokens.css` + `globals.css` existants.
- Pas de nouvelle dépendance runtime.
- Fichiers en anglais pour le code, i18n fr+en pour les textes.
- La galerie de la home reste intacte (vitrine).
