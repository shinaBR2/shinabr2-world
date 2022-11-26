---
sidebar_position: 2
---

# Working with theme

Let's say I am working on a new site call 'new_site', it may contains some different styles. Here is the example structure in the `ui` package.

.
+-- new_site
| +-- styles1
| | +-- theme.ts
| +-- styles2
| | +-- theme.ts
| +-- styles3
| | +-- theme.ts
+-- sui-base
| +-- baseTheme.ts

All `theme.ts` files in the folder `new_site/styles**` will be extends the `baseTheme.ts` file
