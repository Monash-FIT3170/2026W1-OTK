import { useEffect } from 'react';
import { soundManager } from '../soundManager';

export function useGameSounds(result) {
  useEffect(() => {
    if (result === undefined) return;
    if (!result) {
      soundManager.playBackgroundMusic('spark-mandrill');
    } else {
      soundManager.stopMusic();
      if (result === 'win') soundManager.playStageClear();
      if (result === 'loss') soundManager.playGameOver();
    }
  }, [result]);
}
