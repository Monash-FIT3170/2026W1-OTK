import { useEffect } from 'react';
import { soundManager } from '../soundManager';

export function useGameSounds(result) {
  useEffect(() => {
    if (result === 'playing') soundManager.playBackgroundMusic('spark-mandrill');
    if (result === 'win') { soundManager.stopMusic(); soundManager.playStageClear(); }
    if (result === 'loss') { soundManager.stopMusic(); soundManager.playGameOver(); }
  }, [result]);
}
