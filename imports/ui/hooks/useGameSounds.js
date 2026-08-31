import { useEffect } from 'react';
import { soundManager } from '../soundManager';

export function useGameSounds(result, active) {
  useEffect(() => {
    if (!active || result === undefined) {
      soundManager.stopMusic();
      return;
    }
    if (result === 'playing') {
      soundManager.playBackgroundMusic('spark-mandrill');
      return;
    }
    // Any non-playing result: cut the battle music first so the sting plays
    // clean. The next fight restarts the track from the top.
    soundManager.stopMusic();
    if (result === 'stageCleared' || result === 'win') {
      soundManager.playStageClear();
    }
    if (result === 'loss') soundManager.playGameOver();
  }, [result, active]);
}
