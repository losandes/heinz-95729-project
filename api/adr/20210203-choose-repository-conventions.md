# Choose Repository, and Folder Conventions

## Status

accepted

## Context

> Before reading this ADR, you should read the use-screaming-architecture ADR.

It's common to find server-side apps in which code that represents multiple domains is mixed in together, requiring developers to read copius amounts of code to understand the structure, or to find code. Even when following DDD principles, many server-side apps tightly couple domain boundaries. Cross-domain dependencies are often embedded in source code (i.e. in require/using/import statements across domains). There may be multiple, competing organizational strategies (i.e. folders for Models, Controllers, etc. with mutliple domains in each, and then domain specific folders for services, and repositories).

A common form of coupling found in most server-side apps is that 3rd party dependencies are identified and loaded for all domains in a single file, or location (i.e. a single package.json for a NodeJS API).

While a single dependency graph (i.e. package.json) is simple to edit, and a single composition of multiple domains results in just a little mundane repitition, it introduces a form of shelf-time risk to a project: _accumulated dependency debt_.

> **rate of accumulation of dependency debt**: the amount of effort required to accept changes to 3rd party dependencies over time.

It's common for packages to have vulnerabilities. It's common for packages to be updated with breaking changes. As vulnerabilities and breaking changes accumulate over time, the complexity and effort required to accept changes also accumulates. In my experience, a NodeJS app accumulates no less than 1 week of effort to accept dependency changes per year (aka at least 1 week of accumulated dependency debt per year). How might we reduce this effort?

Ideally, we patch our dependencies no less than once per month. But what if monthly patching doesn't happen? And will patching once a month reduce the total accumulated debt? Maybe not.

To manage the rate of accumulation we don't need to untangle an intricate complexity. We don't need to find some perfect capacity:time ratio of maintenance and patching. This problem has already been solved by the open source community: the same 3rd parties from which we incur _accumulated dependency debt.

Open source projects are typically:

-   small and practical: they solve a specific problem (separation of concerns / single responsibility principle)
-   maintainable: because they are small, they have less dependencies and files, so it's generally easy to accept breaking changes
-   repeatable: the conventions for building open source packages are ubiquitous and well understood

How might we follow open source conventions in a single project? Enter the mono-repo, "a software development strategy where code for many projects is stored in the same repository" (https://en.wikipedia.org/wiki/Monorepo).

## Decision

This repository is a mono-repo. Domains will be authored as stand-alone packages, with their own package.json, and composition root per-package.

```
.
|__ src/
  |__ app1/
    |__ index.js
    |__ package.json
  |__ app1-lib/ (packages just for app1)
    |__ products/
      |__ src/
      |__ index.js
      |__ package.json
  |__ app2/
    |__ index.js
    |__ package.json
  |__ app2-lib/ (packages just for app2)
    |__ reports/
      |__ src/
      |__ index.js
      |__ package.json
  |__ lib/ (packages shared with all apps in this repo)
    |__ companies/
      |__ src/
      |__ index.js
      |__ package.json
    |__ people/
      |__ src/
      |__ index.js
      |__ package.json
  |__ package-nursery/ (packages we intend to open source)
    |__ koa-middleware/
      |__ src/
      |__ index.js
      |__ package.json
|__ package.json (for mono-repo scripts like testing each package recursively)
|__ README.md
```

> A benefit of composing domains as packages is that they become easier to share, as well as to copy and paste into other repositories, etc. because the packages are decoupled by design.

> The example provided also poses a solution to developing open source packages without allowing the distraction of publishing during a sprint: the `package-nursery` is a place we can create libraries, gather feedback, and use them for a while before promoting them to open source.

## Consequences

For teams that produce libraries, a private package manager is beneficial, and often required. Common options are [licensed npm accounts](https://www.npmjs.com/products), [Artifactory](https://jfrog.com/artifactory/), and [Github Packages](https://github.com/features/packages). If none of these are available, packages can be distributed by hand, using `npm pack` to produce tarballs.

If the github billing plan imposes a limit on the number of libraries, or if process control results in long wait times, and evaluation for new repositories, a mono-repo should be considered as an alternative to multiple repositories.

TypeScript transpilation does not elegantly handle the transpilation of non-ts file types, and also can be unforgiving of file-system references in mono-repo imports. So additional effort is required to produce distributions, and run tests when using TypeScript in a mono-repo. JavaScript is easier to maintain, and test in mono-repos. If TypeScript is the chosen language, mono-repos are not recommended (index.d.ts files are fine, and often helpful though).

If a private package manager is not available to host libraries, additional, mundane effort is required to leverage a library based organizational structure.

## npm pack, and tarballs

### Creating a package tarball

1. In the terminal, navigate into the package you wish to pack into a tarball
1. Open package.json and find all of the dependencies that are file path based (i.e. dependencies on the other packages in this folder)
1. Replace all of the `(file|link):../*` dependencies with the version of that package that you will depend on (i.e. `~1.0.0`). The easiest way to do this may be to package each of those first, so you might jump back up to 1 for each of those.
1. Once you save the package.json, execute `npm pack`.
1. Undo all of the changes you made to the package.json
1. If it doesn't already exist: `mkdir dist`
1. `mv [name-of-the-tarball-npm-created].tgz dist/[n.n.n].tgz`
1. `cp dist/[n.n.n].tgz ~/path/to/your/app/lib/[name-of-the-tarball-npm-created].tgz`

## Depending on tarballs

1. List all dependencies that are file-system references (i.e. `pnpm list | grep "link"`, or `npm ls | grep "/Users"`)
1. Create a *node_tarballs* directory
1. For each dependency, create a tarball if necessary, and copy it into the *node_tarballs* directory
1. Install each dependency, using the path to the tarball (i.e. `npm install --save ./node_tarballs/[name-of-the-tarball-npm-created].tgz`)

> NOTE that you have to install the tarballs in the right-to-left / outermost-to-innermost order of the dependency graph. npm will try to resolve packages from it's own registry if you install something that depends on a tarball you haven't installed yet.
