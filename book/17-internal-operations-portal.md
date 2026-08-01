# Chapter 17: Internal Operations Portal

This chapter adds a second consumer of our deterministic Banking API: an employee-facing operations portal. Harbor Community Credit Union, its people, and its activity remain entirely fictional.

## Banking Concept

Financial institutions separate employee systems from member systems because their users have different responsibilities and information needs. A member needs to understand and act on their own accounts. An operations employee needs a cross-member view to support members, observe processing, and investigate workflow state. Operational dashboards emphasize queues, exceptions, health, and audit visibility rather than personal financial goals.

The portal demonstrates member lookup, transfer review, and operational awareness. It is deliberately read-only. Its fixed `operations-user` role is an educational boundary, **not** real authentication or production role-based access control.

## React Concept

`operations-web` is an independently runnable React application beside `member-web`. Each has its own entry point, routes, styling, tests, and build artifact. They can still reuse concepts—layouts, status badges, tables, loading patterns—without forcing two different audiences into one navigation model.

Both applications share an HTTP API rather than importing each other's application code. This preserves a clear contract and lets either frontend be developed and deployed independently.

## API Concept

One backend can serve different consumers. `/api/operations/dashboard`, `/api/operations/members`, and `/api/operations/transfers` expose operational views, while existing member endpoints expose a member-specific projection. In a real system these views might derive from the same business records while applying different authorization and disclosure rules. Here, fixed fixtures make the lesson safe and repeatable.

## Relationship to the Digital Banking Systems Laboratory

The Digital Banking Systems Laboratory models internal processing, status transitions, and operational monitoring. This chapter models an interface an employee might use on top of those processes. The systems simulation explains what happens inside; the operations portal demonstrates how workflow state becomes visible and useful to a human operator.

## Comparison with Traditional PHP

Traditional PHP systems often provide a separate administrative application and member portal, sometimes rendered by different templates but backed by shared services and databases. The two React builds preserve that separation at the frontend while Laravel supplies JSON instead of server-rendered pages.

## Comparison with AngularJS

An AngularJS implementation might define separate modules and route configurations for member and administrative areas. Separate bootstraps can prevent internal dependencies and navigation from leaking into the public application. React and Vite express the same architectural choice as two workspace applications, each with its own route tree.

## Engineering Tradeoffs

A single application with role-based routing can share more code and produce one deployment. It can also grow a complex route graph, ship irrelevant code, and make access boundaries harder to reason about. Separate applications offer operational simplicity for each audience, independent releases, and clearer ownership, but require multiple builds and intentional coordination of reusable design patterns and API contracts.

The correct choice depends on team structure, deployment constraints, rate of change, and how strongly the audiences differ. Separation improves maintainability only when duplicated behavior and dependencies remain controlled.

## Exercise

Add a deterministic **Recent failed verifications** widget to the operations dashboard. Define the API shape, include safe fictional timestamps and reasons, render empty and populated states, and test both. Do not add a database, vendor calls, or approval actions.
