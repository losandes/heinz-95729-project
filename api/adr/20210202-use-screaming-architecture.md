# Use a Screaming Architecture (DDD)

## Status

accepted

## Context

Most modern web app, and API development takes advantage of existing frameworks to deliver functionality (i.e. express, or koa for Node.js, MVC for .NET, Spring Boot for Java, Sinatra for Ruby, etc.). The traditional file, and folder organization conventions found in many server-side projects reflects the domains that have meaning to the developers of those frameworks: models, views, controllers, etc. We'll refer to these as, _framework capability domains_.

Application developers spend most of their time working in _application domains_: users, companies, projects, work-spaces, channels, etc. Architects spend much of their time working in _architectural domains_: apis, messaging, notifications, storage, etc. Given the amount of time we spend in these domains, does it make sense to organize around framework capabilities?

## Decision

In a [Screaming Architecture](https://8thlight.com/blog/uncle-bob/2011/09/30/Screaming-Architecture.html), we organize web apps, and APIs around the application domains (Domain Driven Design (DDD)).

```
.
|__ src
  |__ my-app
  |__ lib
    |__ companies
    |__ people
    |__ products
```

Organizing application domains categorically is an easy way to start, but it isn't a requirement of a screaming architecture. It's good to perform Failure Modes & Effect Analysis (FMEA) to consider ways in which categories might need to be coupled, how they might break if they are decoupled, and which domains are most likely to be refactored into other services, or libraries.

In the above example, reports could be an aspect of each domain, but they are given their own domain so the reports can be refactored into a microservice later, if desired.

### Domains

Inside each domain, we expect to find models, framework capabilities, and domain behaviors.

```
.
|__ companies
  |__ src
    |__ companies-controller.js
    |__ companies-repo.js
    |__ Company.js
    |__ ...
|__ index.js
|__ package.json
```

### Behaviors

Behavior files are named using present tense imperative phrases that describe the behavior that the domain is capable of. For instance:

```
.
|__ companies
  |__ src
    |__ ...
    |__ create-company.js
    |__ get-company.js
    |__ update-company.js
|__ index.js
|__ package.json
```

> It may be tempting to make behaviors granular: to take a functional approach to these and make them easier to test (i.e. breaking `create-company` into: `validate-request-body`, `make-id`, `save-to-db`, `cast-to-company`). However, this often results in exposing implementation details at the file level, which can defeat the core concept of a screaming architecture: to quickly understand domains, and their capabilities without reading any code, and to find functionality without needing intellisense, or cmd+f (find).

### Goals of a Screaming Architecture

-   **Promote discovery**: it's easier to discover all of the files that belong to a given feature when they are located in the same folder
-   **Reduce reverse-engineering**: when we create files for each behavior, we reduce the need to reverse engineer the contents of files as part of discovery. We are less likely to need an IDE's ability to “Go to declaration”, and “Find usages”.
-   **Decouple by domain boundary**: If we are disciplined in encapsulating cross-domain dependencies, then a screaming architecture can reduce the effort required to refactor domains into their own services, or libraries (monolith to micro-service refactoring; mono-repo to multi-repo)

### Values of a Screaming Architecture

-   **Developer comprehension**: organize, and name files so they promote discovery, and reduce reverse engineering
-   **Developer workflow**: reduce context-switching, and reduce the distance between the files developers often touch when adding new, and modifying existing features. (_Try navigating the structure via the command line, instead of using an IDE, and then look for opportunities to reduce the necessity for changing directories (`cd`)_)
-   **Shallow graphs**: to promote discovery, avoid nesting both files, and control flow. Functions shouldn't call one another, rather they should produce deterministic outputs and be chained together/piped in the controllers.
-   **Refactorability**: assume we may need to pluck a domain out of the product and move it elsewhere. What can we do to make that trivial?
