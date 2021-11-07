# Architecture Decision Records (ADRs)

By writing Architecture Decision Records (ADRs) and including them in the Pull-Request/Peer-Review process, we aim to:

-   promote change by sharing knowledge that empowers others to adapt and refactor
-   produce historical context by collaborating on decisions transparently, and tracking changes to decisions over time
-   establish consistency (i.e. choosing and following conventions)
-   provide resilience and reduce onboarding overhead by aiding the discovery process (i.e. as members join or leave a project/team)
-   promote pruning and debt payoff by sharing knowledge about temporary decisions or decisions that were made as a result of temporary constraints

You can [read more about ADRs here](https://github.com/joelparkerhenderson/architecture_decision_record).

## ADR Formats & Conventions

There are many different formats / templates for ADRs listed in the reading above. This article uses a template derived from [Michael Nygard's template for ADRs](https://github.com/joelparkerhenderson/architecture_decision_record/blob/master/adr_template_by_michael_nygard.md).

To make it easier to discover decisions, and to recognize changes to previous decisions, ADR records can follow a convention similar to naming database schema migrations, or git commit messages, using the following convention:

```
[yyyyMMdd]-[present-tense-imperative-verb-phrase-in-lower-kebab-case].md
```

For instance:

-   20200728-choose-file-naming-conventions.md
-   20200728-limit-wildcards-in-dependency-versioning.md
-   20200728-compose-domains.md

### Template

```markdown
# TITLE (short present tense imperative phrase, less than 50 characters)

## Status

[draft|proposed|accepted|rejected|deprecated|superseded]

## Context

-   **What** task or issue needs to be solved that motivates this decision or change?
-   **What** options do we have, what are their key features, and how much does each option cost (including OPEX vs CAPEX; consider [Value Modeling](https://www.nytimes.com/2018/09/01/opinion/sunday/how-make-big-decision.html))?
-   **What** are the constraints that impact this decision?
    -   Should those constraints be recognized continually? (i.e. regulatory, or enterprise compliance; patent infringement)
    -   Should those constraints be recognized until some event occurs? (i.e. another feature is completed; a change in policy is enforced)
    -   Do those constraints represent technical debt that should be paid down as soon as possible? (i.e. we had to ship in 2 days, something that should take 2 weeks; or this can't be finished until xyz happen)?
-   **What** efficiencies might this decision produce for the organization?
    -   Does it support a competitive advantage (i.e. marketing value)?
    -   Does it produce a reusable asset?
-   **What** do we need to learn in order to implement this decision? Does that learning provide a persistent value (i.e. talent growth or persistent organizational knowledge)?
-   **Who** solicited this decision and who is affected by it?
-   **Who**, if anyone, should be consulted before accepting, or overriding this decision (i.e. person, people, team, community, agency, etc.)
-   **Why** do we need to make this decision, or what problem does it solve? (if it isn't obvious - i.e. we know why we need to choose a language).
-   **How** do we know we need to make this decision? Are we addressing a proven need, or are we at risk of premature optimization?
-   **When** do we intend to implement this decision

## Decision

What decision, or change is being [proposed|accepted|rejected|deprecated|superseded]?

## Consequences

-   **What** becomes easier or more difficult to do as a result of this decision?
-   **What** are the consequences of _not_ making this decision? What are the consequences of making a _different_ decision (i.e. one of the other options discussed)?
-   **What** are the consequences of making _this_ decision (Think about what consequences will matter to future readers)?
-   **What** are the consequences of making this decision, and then changing the decision later? Does this decision back us into a corner? Do we need to experiment or evaluate further?
-   **What** are the consequences if the design doesn't work (does it carry risk; should/did we perform Failure Modes, and Effect Analysis (FMEA))?
-   **Who** is effected by this decision or change and how will they respond to it? Does this represent a pain point, or sunk cost that could result in emotionally, or strategically charged reactions to change?
```

### Inspiration

Sometimes it's hard to know where to start. What context is important? What is the right amount of information to share, so my ADRs are concise?

> Every time I make myself write out
>
> We are doing _____
> Because we see the problem of _____
> We know it's a problem because _____
> If we don't fix it, we'll see _____
> We'll know we've fixed it when we get _____
>
> the rest of the conversation/project/doc goes SO much easier.
>
> -- a tweet by Cindy Alvarez @cindyalvarez
