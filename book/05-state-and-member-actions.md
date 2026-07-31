# Chapter 5: State and member actions

The Harbor dashboard can now respond to a member. Each fictional account starts with **Card unlocked** and offers a **Lock card** button. Activating it immediately changes the card to **Card locked** and offers **Unlock card**. This interaction teaches React's rendering cycle, but it does not issue a banking command.

> **Changing React state does not change a bank account.** The control is a browser-only simulation, so every account repeats: “Simulation only — no banking system has been updated.”

## Props describe the projection; state describes the interaction

The dashboard fixture still supplies account **props**: display name, masked suffix, balances, ownership, product status, and other metadata. Props arrive from a parent and remain read-only. Locking a simulated card does not edit that account object, so its nickname, balance, ownership, and projection timestamp remain unchanged.

`CardControls` owns one state value:

```jsx
const [isCardLocked, setIsCardLocked] = useState(false);
```

This **state** records temporary interaction in this mounted component. It starts as `false`, and React preserves it between renders. Every `AccountCard` renders its own `CardControls`, so checking can be locked without changing savings. This is the smallest component that reasonably owns the value: the dashboard does not need it, and no global store, context, or shared state is required.

Props answer “what account projection was supplied?” State answers “what has the member done in this temporary interface?” Neither is an authoritative card record.

## Event handlers and re-rendering

The button connects a browser event to a readable handler. `handleLockCard` calls `setIsCardLocked(true)`; `handleUnlockCard` calls `setIsCardLocked(false)`. Calling a state setter asks React to render `CardControls` again. During that render, the current value selects visible status text, button text, accessible label, and the next handler.

React then updates only the necessary DOM. The component function runs again, but React does not reload the page and does not mutate the fixture. The status is visible text and an `aria-live` announcement rather than a color-only cue. The native button works with pointer and keyboard input, and its account-specific accessible name makes its action unambiguous.

The sequence is:

1. the member activates **Lock card**;
2. React invokes `handleLockCard`;
3. the handler requests a state update;
4. React re-renders `CardControls` with `isCardLocked` set to `true`;
5. the browser shows **Card locked** and **Unlock card**.

This can look optimistic because feedback is immediate. It is still only interface state. Refreshing or remounting the page resets it, and no other browser or banking channel learns about it. **Changing React state does not change a bank account.**

## A command is not a record

In banking, “lock this card” is a **command**: a request for an authoritative system to perform an action. “This card is locked” is a **recorded fact** that an authorized system would expose after accepting that command. A production experience must not turn a local click into an apparently authoritative banking record by itself.

A real application would send an authenticated, authorized API request, handle rejection and uncertainty, and use backend confirmation to update or refresh the displayed card status. It would also need appropriate audit, security, fraud, concurrency, and error-handling decisions. Those concerns are intentionally outside this chapter. There is no API request, backend, or persistence here.

The simulation is valid local state because its claim is explicitly limited: it demonstrates what an immediate interaction feels like, clearly labels itself non-authoritative, affects only its account component, and can be discarded safely. Local state is also appropriate for interface-only details such as an expanded section or temporary display preference. Server state is necessary when the value represents a banking fact that must survive refreshes, appear in other channels, or affect real processing.

## Comparing rendering models

### Traditional PHP

In a traditional PHP flow, a button normally submits an HTTP request. The server handles it and renders a new page (or redirects to one), so the browser displays new server-generated HTML. JavaScript can alter that model, but the familiar baseline couples interaction to a request and page response.

React can update this dashboard's browser interface immediately through local state. Its event handler schedules a component re-render without requesting a new document. That speed is useful for interaction, but it does not provide server authority. For a real card lock, React would still need an API and confirmed server state.

### AngularJS

AngularJS is often taught through two-way binding: a scope value and a control can update one another, with the framework propagating the change through bindings. React instead makes this example's update explicit. A button calls a named handler, the handler calls a state setter, and state flows into rendered output. Props continue flowing down without being written back to the fixture.

Not every AngularJS application uses identical patterns, but the teaching distinction matters here: React has no automatic two-way binding between the button and account data. The code names the owner, event, state transition, and result. That explicit path helps prevent temporary UI state from being mistaken for the supplied banking projection.

## Engineering tradeoffs

Keeping state inside `CardControls` isolates accounts and avoids unnecessary dashboard re-renders or coordination. Lifting the value to `AccountDashboard` would make sense only if another component needed to coordinate with it. A global store would add indirection without a shared-state problem.

The important tradeoff is authority, not merely code location. Local state is fast, simple, and appropriate for reversible presentation behavior. It cannot provide durable truth, cross-device consistency, backend validation, or confirmation that a banking command succeeded. Banking applications must ultimately rely on backend confirmation before presenting a real card status as authoritative. An optimistic interface may temporarily show an intended result, but it must communicate progress and failure and reconcile with server state.

## Exercise: hide one account's balances

Add a fictional **Hide balances** toggle for one account using local state. Do not change the fixture. Keep the state in the smallest component that owns the display, provide a keyboard-accessible button with a clear label, replace both balance amounts with understandable visible text, and ensure the other account remains visible.

Then add interaction tests showing that hiding and revealing works and that the other account is unaffected. Explain in a comment or test name why this display preference is safe local state while an actual balance is server state. Do not add persistence or implement a banking request.

## Chapter boundaries

This chapter adds only React `useState`, named event handlers, accessible buttons, and interaction tests. It adds no fetch call, REST API, form, routing, backend, persistent storage, global state, TypeScript, PHP, or React Native. The card action is fictional and resets with the interface.
