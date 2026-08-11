import { Meteor } from 'meteor/meteor';

// The puppeteer driver only forwards browser `console` messages, so an uncaught
// error while the client bundle loads is invisible in CI: the run just reports
// "0 passing" with one client failure and no explanation. Log it ourselves.
if (Meteor.isClient) {
  window.addEventListener('error', (event) => {
    console.error(
      'Uncaught client error while loading tests:',
      event.message,
      (event.error && event.error.stack) || ''
    );
  });
}

// ENEMY TESTS
import '../imports/ui/components/enemy/EnemyDisplay.test.jsx';
import '../imports/api/enemy/index.js';
//import '../imports/engine/enemy/DamageEnemy.tests.js';
import '../imports/api/enemy/enemy.tests.js';

// AUTH TESTS
import '/imports/api/auth/index.js';
import '/imports/api/auth/auth.tests.js';
import '/imports/api/auth/auth.app-tests.js';
import '/imports/ui/AccountRegistrationForm.tests.jsx';
import '/imports/ui/auth/LoginForm.tests.jsx';

// USER DATA TESTS
import '../imports/api/user-data/index.js';
import '../imports/api/user-data/userData.tests.js';

// SAVE GAME TESTS
import '/imports/ui/components/SaveGameButton.app-tests.jsx';
