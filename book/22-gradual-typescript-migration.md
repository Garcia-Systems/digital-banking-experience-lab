# Chapter 22: Gradual TypeScript Migration

## Banking Concept

Financial software commonly lives for decades. Regulations, products, integrations, and member expectations change while accounts must remain available and historical behavior must remain explainable. A complete rewrite concentrates risk and can discard knowledge encoded in tested software. A gradual migration is therefore a better laboratory model: improve one boundary at a time, preserve observable behavior, and keep every intermediate revision deployable.

In this chapter the PHP API remains authoritative. TypeScript describes the account projection consumed by the experience layer; it does not turn that projection into a ledger or make a balance correct.

## TypeScript Concept

TypeScript adds a static type checker and editor information to JavaScript. It can detect passing a string where cents must be a number, misspelling an account field, or forgetting a union case before code runs. Types disappear during compilation, so they add no production runtime work.

Adoption can be incremental. This repository keeps `allowJs` enabled and `checkJs` disabled: existing JavaScript continues to build while selected `.ts` and `.tsx` files receive strict checks. Pure formatters are a low-risk first step, followed here by a dashboard client, a web balance component, and a native account card. The small `Account`, `DashboardProjection`, and `TransferSummary` contracts document only today's deterministic API.

Run the actual compiler from the repository root:

```bash
npm run typecheck
```

The root command invokes TypeScript in strict, no-output mode for the focused member-web and mobile configurations. It checks `dashboard.ts`, `BalanceSummary.tsx`, the shared banking types, the typed web formatter, and `AccountCard.tsx`. Vite and Expo can transpile TypeScript syntax while building, but transpilation is not the static guarantee: `npm run typecheck` is the canonical compiler check. JavaScript remains supported and only this deliberately migrated slice is checked.

The transfer type is a discriminated union. Its `status` distinguishes accepted/completed transfers from rejected transfers, for which `failureReason` is required. The projection's optional `reason` demonstrates an optional property without inventing new API behavior.

### Compile-time types are not runtime validation

A response from the network is unknown at runtime. TypeScript cannot prevent a server, proxy, or fixture from returning malformed JSON. The dashboard client therefore calls the existing `validateDashboard` function before treating a payload as `Dashboard`. The PHP API remains the source of truth, and server-side input validation remains mandatory.

## Relationship to the Digital Banking Systems Laboratory

Strong typing makes experience code easier to navigate, refactor, and review. It improves the consistency with which clients interpret an account data contract. It does **not** establish available funds, authorize transfers, validate ownership, provide idempotency, or replace an authoritative ledger. Those banking correctness responsibilities stay at trusted system boundaries.

## Comparison with JavaScript

JavaScript accepts any value until the operation executes:

```js
export function formatCents(cents) {
  return currencyFormatter.format(cents / 100);
}
```

TypeScript states the expectation and return value for tools and reviewers:

```ts
export function formatCents(cents: number): string {
  return currencyFormatter.format(cents / 100);
}
```

A typed component similarly makes its props explicit:

```ts
interface BalanceSummaryProps {
  availableBalanceCents: number;
  currentBalanceCents: number;
}
```

Neither example validates untrusted JSON. The type checker helps while writing and building code; runtime checks protect execution boundaries.

## Engineering Tradeoffs

- **Migration cost:** configuration, types, and changed files take time. Small vertical slices limit risk and preserve a useful comparison with JavaScript.
- **Developer productivity:** completion, navigation, and earlier feedback often repay that cost, especially when contracts are shared by many components.
- **Runtime performance:** types are erased, so TypeScript itself adds no runtime type checking. Builds perform an additional static analysis step; explicit runtime validators still have their normal cost.
- **Learning curve:** contributors must learn annotations, narrowing, optional values, and unions. Simple domain types are preferable to advanced generic programming in an incremental migration.

## Exercise

Migrate one additional member-web or React Native component to TypeScript. Add typed props and return values where useful, retain runtime validation at external boundaries, and preserve every existing test. Do not migrate an entire application or change a banking workflow.
