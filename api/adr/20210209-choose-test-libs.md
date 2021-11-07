# Choose Test Libraries

## Status

accepted

## Context

For developer/unit tests, we need a test framework, and an assertion library.

Over the years, many of the popular test frameworks have become bloated (jest has over 800,000 package dependencies :scream:), or outdated (mocha/jasmine pollute the global namespace, and are extremely rigid). Many of the new libraries are too simple (tape), too weird (vows), or too slow (ava). I wrote [supposed](https://github.com/losandes/supposed#supposed) to teach different approaches to testing (TDD/BDD/xunit/etc.).

Supposed is a fast, hackable test framework for Node.js, TypeScript, and the Browser. It runs tests concurrently, so test suites complete as quickly as possible. It has 0 dependencies (not counting dev-dependencies), and supports many Domain Service Languages (DSLs): BDD, TDD, xunit, custom.

Contrary to the testing frameworks, assertion libraries that were established years ago continue to be useful today.

## Decision

We will use [supposed](https://github.com/losandes/supposed#supposed) as the test framework, and [unexpected](https://unexpected.js.org/assertions/any/to-be/) as the assertion library.

## Consequences

If we choose to write tests xunit style, they will be compatible with most other frameworks, and we can change test frameworks if desired. This forgoes some of the best features of Supposed, so I propose we don't take that precaution. I've used supposed consistently since 2018, and am now generally disappointed, and slowed, when I work on projects that use other test libraries.