import './UserDataMethods';
import './drawCards';
import './executeCard';
import './newGame';
import './endTurn';
import './advanceStage';
import './finishDialogue';
import './applyTimerTick';
import './applyPowerup';
import './choosePowerUp';
import './usePowerUp';
import './saveTrainingHighScore';
import './getMyTrainingRank';
import './devJump';
// DEV TOOL: jumps the logged-in player straight to any boss dialogue so the
// story can be checked without winning every fight. Only works under
// `meteor run` / `meteor test` (Meteor.isDevelopment); refused in production.
// Overwrites the logged-in account's current run, so use a test account.
