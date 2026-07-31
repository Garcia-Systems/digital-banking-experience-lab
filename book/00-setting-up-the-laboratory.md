# 00: Setting up the laboratory

## Purpose

The Digital Banking Experience Laboratory is an executable textbook: explanations live beside small applications that can be run, changed, and tested. The fictional Harbor Community Credit Union gives every lesson a consistent domain without suggesting access to a real institution.

This is a **build-first** laboratory. Rather than reading a long language refresher, you will start the application, observe a concrete behavior, read the small amount of code responsible for it, and change that behavior with a test. The feedback loop turns abstract ideas into evidence.

## Scope today

This chapter's repository contains one React member web application in `apps/member-web`. It uses JavaScript, Vite, Vitest, and React Testing Library. There is no API, database, mobile application, employee portal, or TypeScript configuration yet. The dashboard reads deterministic fixtures directly so the lesson can concentrate on the interface boundary.

## The fictional-data rule

Harbor Community Credit Union, Alex Morgan, every account, and every balance are fictional. Never use real member data, credentials, account numbers, or transactions. Fixtures should have conspicuously synthetic identifiers, while the user interface must hide internal identifiers and render only masked account suffixes. Review `docs/security-boundaries.md` whenever adding a scenario.

## Install and run

From the repository root, install dependencies and start Vite:

```bash
npm install
npm run dev
```

Open the URL Vite prints. The default view uses the fresh fixture. Append `?scenario=stale` to see the deterministic stale state.

The root commands delegate to the member web workspace:

```bash
npm run lint
npm run format:check
npm run test
npm run build
```

`npm run test` runs Vitest once rather than leaving a watcher open. The tests render the application in a DOM-like environment and ask questions about output a member can perceive: headings, masked suffixes, formatted balances, timestamps, and warnings.

## Definition of done

You are done with this setup chapter when:

- dependencies install successfully;
- the fresh dashboard opens locally;
- the stale query-string scenario displays a warning;
- lint, format-check, tests, and production build all pass;
- you can explain why fixture identifiers are synthetic and why they do not appear in the interface.

## Exercise

Change Alex Morgan's display name in the fixture to another obviously fictional name. Run the tests, observe which user-visible expectation fails, update that expectation, and run the complete check suite again. Do not add a second source of member data.
