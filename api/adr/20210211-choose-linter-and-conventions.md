# Choose Linter & Conventions

## Status

accepted

## Context

We want to establish a convention for developers to follow so the code in these libraries are written consistently. Linters help us verify that we are following conventions. Formatters help us follow conventions without having to manually type, and fix everything, or have the conventions memorized. Some packages offer both linting, and formatting.

[JSLint](https://www.npmjs.com/package/jslint) is a linter written by Douglas Crockford, and serves as a good baseline for traditional JavaScript conventions, which are designed to help us write code that reads the same way it will be interpreted by the JavaScript interpreter. It is opinionated, and rigid in that it doesn't allow you to configure all of it's opinions. JSLint supports linting, but not formatting.

[JSHint](https://www.npmjs.com/package/jshint) is based on JSLint, but allows all configurations to be modified. However, it draws a line on the opinions it makes based on what the author describes as being "stylistic" opinions. I disagree with the authors interpretation based on the fact that the library doesn't support linting all variable definitions to the top of a file. That the interpreter makes 2 passes on every file, and hoists the variables to the top makes this less stylistic, and more realistic, IMO. JSHint supports linting, but not formatting.

[Standard JS](https://standardjs.com/) is both a convention, and a linter. It is a significant departure from the interpreter based standards, choosing instead to focus on keystroke reduction. It's most notable differences are 2-space indentation, and the omission of semi-colons. The 2 character indentation allows more code to fit per-line when using an 80 char width rule, and is easier to type for developers who prefer spaces to tabs. The removal of semi-colons is based on the fact that JavaScript interpreters are generally forgiving when developers forget a semi-colon. However, this can lead to astonishment, and inconsistency. In the following example throws an error because a semi-colon is required between the `'hello'` string, and the IIFE for the interpreter to be able to make sense of it. So it should be noted that some of Standard's conventions are conditional, and therefore harder to follow, or remember than the conventions it rallies against.

```JavaScript
const foo = 'hello'

(() => {
  console.log(foo)
})()
```

Standard JS is gaining popularity, and is widely adopted at R&P. This is not true across all of our clients. For instance, Slack expects traditional conventions, like those we'd see with JSLint, to be followed (i.e. 4-space indentation, with semi-colons all the time). Standard supports linting, but not formatting.

[ESLint](https://www.npmjs.com/package/eslint) is much more flexible than any of the libraries mentioned so far. Instead of offering opinions, even on what is style, and what is convention, ESLint is an extensible, configurable library that evaluates patterns in code. It can be used to lint, as well as to format. Plugins that support auto-formatting are available for most modern IDE's, as well as VIM. Through plugins, ESLint can be used to enforce Standard JS conventions. The TypeScript organization is abandoning their own linter in favor of ESLint, so it also supports TypeScript. ESLint can be installed as a dev-dependency, and added to git hooks, so linting can be used to stop pushes to git repositories.

Finally, style guides often help describe linting conventions in more instructional format, and AirBnB has one of the most comprehensive styles guides for JavaScript, along with eslint plugins.

## Decision

This project will use ESLint, with AirBnB plugins.

## Consequences

Are established in [Context](#context)
