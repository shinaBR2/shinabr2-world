---
slug: firebase-functions-deployment
title: Deploy Firebase Functions in monorepo with pnpm
authors: [ShinaBR2]
tags: [Firebase, monorepo, pnpm]
---

## NOTE

```
// .pnpmfile.cjs
module.exports = {
  hooks: {
    readPackage(pkg) {
      pkg.dependenciesMeta = pkg.dependenciesMeta || {};
      for (const [depName, depVersion] of Object.entries(pkg.dependencies)) {
        if (depVersion.startsWith("workspace:")) {
          pkg.dependenciesMeta[depName] = {
            injected: true,
          };
        }
      }
      return pkg;
    },
  },
};

```

## First working version

Solution: https://github.com/Madvinking/pnpm-isolate-workspace
Steps:

- Run `pnpx pnpm-isolate-workspace api` at the root folder
- Build local, Run `cp -r apps/api/dist apps/api/_isolated_`
- Change the `firebase.json` `source` field to `"source": "apps/api/_isolated_",`
- Build local, then copy the `apps/api/dist` folder into `apps/api/_isolated_/dist`
- Go to the `apps/api/_isolated_` run `pnpm install`
- Go to the `apps/api/_isolated_` rename `package.json` to `package-dev.json`
- Go to the `apps/api/_isolated_` rename `package-prod.json` to `package.json`
- Replace all `workspace:*` with `file:` protocol
- Finally run `firebase deploy --only functions` at the root folder
