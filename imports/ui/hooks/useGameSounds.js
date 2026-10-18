import { useEffect } from 'react';
import { soundManager } from '../soundManager';

// holdVictory: the boss's outro dialogue is still to come, so the battle
// music keeps playing and the stage-clear sting waits until it is dismissed.
export function useGameSounds(result, active, holdVictory = false) {
  useEffect(() => {
    if (!active || result === undefined) {
      soundManager.stopMusic();
      return;
    }
    // The battle track carries on under the outro dialogue; it is cut, and
    // the sting played, once the outro is dismissed.
    if (result === 'playing' || holdVictory) {
      soundManager.playBackgroundMusic('battle');
      return;
    }
    // Any non-playing result: cut the battle music first so the sting plays
    // clean. The next fight restarts the track from the top.
    soundManager.stopMusic();
    if (result === 'stageCleared' || result === 'win') {
      soundManager.playStageClear();
    }
    if (result === 'loss') soundManager.playGameOver();
  }, [result, active, holdVictory]);
}
