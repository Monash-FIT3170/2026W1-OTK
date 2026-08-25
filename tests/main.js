// Must stay first: it installs the browser error handlers that make a throw
// during test-bundle loading visible in CI. See tests/clientErrorReporter.js -
// imports are hoisted, so ordering here is what makes it work.
import './clientErrorReporter.js';

// Keep every test module below as a static `import`. @meteorjs/rspack builds the
// client test bundle from the import list in this file; switching one to
// `require()` drops it from the bundle and the suite silently reports "0 passing".

// ENEMY TESTS
import '../imports/ui/components/enemy/EnemyDisplay.test.jsx';
import '../imports/api/enemy/index.js';
//import '../imports/engine/enemy/DamageEnemy.tests.js';
import '../imports/api/enemy/enemy.tests.js';
import '../imports/engine/debuffs/Freeze.tests.js';
import '../imports/engine/debuffs/Timer.tests.js';

// GAME ENGINE / STAGE TESTS
import '../imports/engine/GameEngine.tests.js';
import '../imports/api/user-data/methods/advanceStage.tests.js';

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

// LANDING PAGE TESTS
import '../imports/ui/LandingPage.tests.jsx';

// TUTORIAL TESTS
import '../imports/ui/components/TutorialOverlay.tests.jsx';
import '../imports/ui/components/TutorialDemoScreen.tests.jsx';
import '../imports/ui/hooks/useTutorialEngine.tests.js';
import '../imports/api/auth/methods/markTutorialSeen.tests.js';
