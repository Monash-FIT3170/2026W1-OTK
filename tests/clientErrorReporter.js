import { Meteor } from 'meteor/meteor';

/**
 * Installs browser error handlers for the test run.
 *
 * This lives in its own module so that tests/main.js can import it *first*.
 * `import` statements are hoisted above the module body, so handlers registered
 * inside main.js itself would only be installed after every test module had
 * already been evaluated - too late to see a throw during loading. Handlers in
 * a separately imported module are installed before the imports that follow it.
 *
 * It is needed because the puppeteer driver in meteortesting:browser-tests only
 * forwards browser `console` messages; it never listens for `pageerror`. An
 * uncaught error while the test bundle loads therefore surfaces in CI as a bare
 * "0 passing" plus "CLIENT FAILURES: 1" - the driver counts uncaught errors -
 * with nothing to say what actually threw.
 */
if (Meteor.isClient) {
  // Formatted into a single string because the driver reads console arguments
  // with `jsonValue()`, which flattens an Error to `{}`.
  const report = (label, message, stack) => {
    console.error(`[tests] ${label}: ${message}\n${stack || '(no stack)'}`);
  };

  window.addEventListener('error', (event) => {
    report('uncaught error', event.message, event.error && event.error.stack);
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    report(
      'unhandled rejection',
      (reason && reason.message) || String(reason),
      reason && reason.stack
    );
  });
}
