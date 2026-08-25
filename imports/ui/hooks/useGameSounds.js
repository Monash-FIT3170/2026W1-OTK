import { useEffect } from 'react';
import { soundManager } from '../soundManager';

export function useGameSounds(result) {
  useEffect(() => {
    if (result === undefined) return;
    if (result === 'playing') {
      soundManager.playBackgroundMusic('spark-mandrill');
      return;
    }
    if (result === 'stageCleared') {
      // Mid-run: sting the stage clear but keep the run's music going, since
      // the player is heading straight into the next fight.
      soundManager.playStageClear();
      return;
    }
    soundManager.stopMusic();
    if (result === 'win') soundManager.playStageClear();
    if (result === 'loss') soundManager.playGameOver();
  }, [result]);
}
