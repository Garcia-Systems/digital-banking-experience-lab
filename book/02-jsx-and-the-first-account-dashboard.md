# 02: JSX and the first account dashboard

## JSX describes the dashboard with JavaScript

JSX is a syntax extension for JavaScript that lets a React component describe user interface elements beside the values and decisions that produce them. In this chapter, `AccountDashboard` returns familiar elements such as `main`, `section`, and headings, while expressions supply the fictional member name, account count, and account cards. A build step transforms that JSX into JavaScript calls React can evaluate.

JSX may resemble a template language, but it is JavaScript rather than a separate set of template directives. The dashboard's rendering decisions use ordinary JavaScript values, array methods, template literals, and operators. JSX supplies a readable element syntax around those expressions; it does not add a second expression language.

## Embedding banking values with braces

Curly braces move from JSX markup into a JavaScript expression. The welcome heading embeds `dashboard.member.displayName`, while the account summary embeds `dashboard.accounts.length`. `AccountCard` calls `formatCents(account.availableBalanceCents)` inside braces so integer cents remain the fixture's money representation and only become formatted dollars at the display boundary.

The account card also derives readable labels from fixture values. JavaScript string methods turn `checking` into `Checking` and `dormant` into `Dormant`. Template literals construct the accessible masked-account label and the activity heading identifier. The internal account ID is used for React's list key and a local heading relationship, but it is never presented as the member's account identifier; the visible identifier remains the masked suffix.

## Conditional rendering communicates status and freshness

Conditional rendering means selecting output from data. It does not require a separate component for every possibility. `AccountCard` renders the same status sentence for `open`, `dormant`, and `restricted` fixture values, placing the derived label into that sentence. Text communicates the status, so color is only supporting decoration.

The recent-activity section uses a readable conditional expression. A non-empty `transactions` array would produce a semantic list; an empty array produces **No recent transactions.** The fixtures are empty because this chapter teaches rendering, not transaction history or data retrieval.

`ProjectionStatus` uses another conditional expression. A fresh fixture says the projection is current and based on the latest available projection data. A stale fixture explicitly says balances may be out of date and that the dashboard is based on stale projection data. Both messages use `role="status"`; the orange stale treatment never carries the meaning by itself.

## Rendering arrays with `map`

`AccountDashboard` calls `dashboard.accounts.map(...)` to create one `AccountCard` for every account. The fresh fixture therefore produces both Everyday Checking and Member Savings without duplicating card markup. Each account's stable synthetic ID is its React `key`, which helps React associate each data item with its rendered card.

The activity branch demonstrates the same operation at a smaller scale: when activity exists, `account.transactions.map(...)` creates list items. Keeping the result inside a `ul` preserves the semantics of a collection. No API, state, hook, or transaction-history feature is needed to explain how an array becomes JSX.

## Composition keeps the page readable

Composition lets `AccountDashboard` establish the page structure while `ProjectionStatus` explains freshness and `AccountCard` presents one account. These small presentational components receive JavaScript values through props. They do not own state or retrieve data. The split makes the mapped list easy to read without hiding the chapter's core expressions behind excessive abstractions.

The resulting elements also retain banking semantics: headings organize the page and each card, an `article` contains one account, definition lists pair current and available balance labels with their amounts, and the activity collection uses a list when entries exist.

## JSX compared with AngularJS templates

An AngularJS template commonly puts Angular-specific directives and expressions into HTML, such as a repeat directive for accounts or a conditional directive for the stale warning, with values exposed through a scope. This dashboard instead stays in JavaScript: ordinary `map` renders accounts and a JavaScript conditional chooses freshness text. Data flows into presentational React components through props; there is no AngularJS scope, directive language, or two-way binding.

## JSX compared with server-rendered PHP

Server-rendered PHP typically executes on a server, combines values and control structures with markup, then sends the resulting HTML for a request. This dashboard's JSX is transformed into JavaScript and evaluated as part of the React application in the browser. Its fixture objects flow through the component tree to produce the interface. Although both approaches can interpolate a name or loop over accounts, JSX expressions participate directly in the same JavaScript module as `map`, formatting calls, props, and components. This chapter adds no PHP or backend.

## Try the implemented scenarios

1. Run `npm run dev` and inspect the default fresh dashboard. Confirm the Checking and Savings badges, Open and Dormant status text, two account cards, and two empty-activity messages.
2. Confirm that available and current balance remain separately labeled and account numbers remain masked.
3. Add `?scenario=stale` and compare the explicit stale-projection message with the default current-projection message.
4. Run `npm run test` to verify the same user-visible JSX behavior deterministically.

The dashboard remains intentionally read-only. Its statuses, balances, transactions, and freshness metadata are fictional fixture values designed to teach how JavaScript expressions become accessible UI output.
