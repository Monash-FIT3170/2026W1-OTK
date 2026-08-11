import { Meteor } from 'meteor/meteor';

// The `imports/api/*/index.js` modules register Meteor methods and publications.
// In the real app they are only ever loaded from `server/main.js`, so the client
// bundle has no stubs for them. Loading them here with a plain `import` would put
// them in BOTH test bundles, which registers every server method body as a client
// stub. Those stubs run server-only APIs in the browser -- in particular the
// `auth.createTestUser` stub would call the *client* `Accounts.createUser`, which
// means "create a user AND log in as them" and corrupts the accounts login state,
// breaking `Meteor.loginWithPassword` in the auth tests.
//
// `require` inside the guard keeps the API modules server-only, matching how the
// real app loads them.
//
// Under `meteor test --full-app` (Meteor.isAppTest) the app's own `server/main.js`
// already loads these modules, so loading them here would be redundant. Note that
// `--full-app` (npm run test:integration) is currently broken for an unrelated
// reason: the app and the test bundle are separate rspack compilations, so any
// collection module reachable from both evaluates twice and throws
// `There is already a collection named "enemies"`.
if (Meteor.isServer && !Meteor.isAppTest) {
  require('../imports/api/enemy/index.js');
  require('/imports/api/auth/index.js');
  require('../imports/api/user-data/index.js');
}

// ENEMY TESTS
import '../imports/ui/components/enemy/EnemyDisplay.test.jsx';
//import '../imports/engine/enemy/DamageEnemy.tests.js';
import '../imports/api/enemy/enemy.tests.js';

// AUTH TESTS
import '/imports/api/auth/auth.tests.js';
import '/imports/api/auth/auth.app-tests.js';
import '/imports/ui/AccountRegistrationForm.tests.jsx';
import '/imports/ui/auth/LoginForm.tests.jsx';

// USER DATA TESTS
import '../imports/api/user-data/userData.tests.js';

// SAVE GAME TESTS
import '/imports/ui/components/SaveGameButton.app-tests.jsx';
