# Set Root Folder Conventions

## Status

accepted

## Context

Project organization conventions will help keep the repository organized.

## Decision

This project will follow open source conventions for naming the folders in the root directory.

* **adr/**: ("Architectural Decision Records") Records that document decisions for project architecture, and organizations
* **bin/**: ("binaries") Scripts that help developers orchestrate (i.e. running tests, building code, etc.)
* **dist/**: ("distribution") The rendered code, or library that will be deployed, or consumed (if applicable).
* **lib/**: ("libraries") 3rd party dependencies that are added manually
* **node_modules/**: Dependencies that are added via dependency management
* **src/**: ("source") The files developers write, which represent the library or app
* **src/lib**: ("libraries") Packages specific to this app, that are easier to maintain by treating them as their own packages


> NOTE the "dist" folder is volatile, and will be ignored in source control.

## Consequences

If TypeScript is used instead of JavaScript, linking to libraries outside of the src folder may not work with TypeScript. Some, if not all of the lib folder may need to live in the src folder to support transpilation. If that is the case, some dependencies will be at the root of the project, while others are nested in src/.
