# Limit Wildcards in Dependency Versioning

## Status

accepted

## Context

NPM describes SEMVER as `[MAJOR_RELEASE].[MINOR_RELEASE].[PATCH]`. Another way to comprehend this is: `[BREAKING_CHANGE].[FEATURE_DEVELOPMENT].[HOTFIX]`. The latter terminology will be used for the remainder of this document.

By default, when you `npm install --save` a dependency, NPM sets the version to allow _feature development_ releases (i.e. `^1.0.4`). While this sounds harmless, because there _should_ be no breaking changes, not all library authors use SEMVER, and not all authors are diligent enough to ensure continuity. For instance, a popular database package, [knex](https://knexjs.org/) uses a versioning strategy that allows breaking changes in the `[MINOR_RELEASE]` position (i.e. their version strategy is `[REWRITE].[BREAKING_CHANGE].[FEATURE]`).

Allowing automatic feature development inclusion increases the likelihood of breaking changes/works on my machine scenarios without added benefit since we can't have developed against those new features that don't exist yet. On the other hand, _hotfixes_ are less likely to introduce breaking changes, and often come with security benefits.

Following are example SEMVER conventions you can use in package.json:

* **Install Latest Hotfix**: `1.0` or `1.0.x` or `~1.0.4`
* **Install Latest Feature Development**: `1` or `1.x` or `^1.0.4`
* **Install Latest Breaking Changes**: `*` or `x`

## Decision

Project repositories should include an `.npmrc` file with at least the following configuration that limits updates to _wild hotfixes_.

```Shell
# [project]/.npmrc
save-prefix=~
```

## Consequences

If a lib author bundles security patches into a feature-development/minor release, we won't automatically consume it, so developers should upgrade packages manually on a regular basis. Consider using [Dependabot](https://dependabot.com/) to facilitate this effort.
