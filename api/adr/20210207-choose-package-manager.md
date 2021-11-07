# Choose a Package Manager

## Status

accepted

## Context

Choosing a package manager for a team, or project is an important decision. This record considers three different package managers: [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/lang/en/), and [pnpm](https://pnpm.js.org). The values we will consider are:

* security
* reliability
* features
* community (only widely used package managers are considered)

npm's most notable feature is that it is the most widely used package manager for JavaScript, and that it is both a package store, and a package manager to leverage that store. Since npm 6.4, npm has released several versions with reliability issues. Most noteably, npm has had intermittent install issues since npm 5, and it is common to have to delete the package_lock, and node_modules directories to get a working install. In addition to producing a folder structure that supports arbitrary code execution between adjacent packages, npm has released, and regressed to security concerns like [https to http downgrading](https://github.com/npm/npm/issues/20719). npm has no mono-repo features, but can be used with [lerna](https://lerna.js.org/) to be used in mono-repos.

Yarn has marginal improvements over npm at the cost of sending all package installation information to Facebook. Yarn is also both a package store (they use a mirror of npm's package store), and a package manager to leverage that store. Yarn was developed specifically to deal with the fact that npm doesn't do mono-repos. Yarn also produces a folder structure that supports arbitrary code execution between adjacent packages.

pnpm has significant improvements over both npm and yarn, is open-source, is actively supported, and supports mono-repos. pnpm uses the npm package store by default (it is a package manager only). Like Yarn, and npm, it can be configured to use additional, or alternative package stores.

* pnpm is as fast and sometimes faster than npm and yarn
* one version of a package is saved only ever once on a disk
* pnpm creates a non-flat node_modules directory, so code has no access to arbitrary packages, and is easier to navigate manually
* pnpm solves the ["phantom dependency" and "NPM doppelganger" problems](https://rushjs.io/pages/advanced/phantom_deps/)
* pnpm has a `recursive` feature which supports things like installing, testing, or linting all of the packages in the mono-repo (`i.e. pnpm recursive install`)
* here's a comparison of [lerna to pnpm](https://dev.to/zkochan/pnpm-vs-lerna-filtering-in-a-multi-package-repository-587i)
* pnpm's audit feature takes advantage of npm's security advisories, so it is not a downgrade to audit security features
* while pnpm's cli interface is not a 1:1 match with npm, most commands are the same, and is an easy transition

## Decision

use pnpm

## Consequences

Developers need to remember to use pnpm instead of npm to `pnpm add <pkg>`, and `pnpm install`.
