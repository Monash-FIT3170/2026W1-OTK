// stages.ts
// The ordered boss/scene table for a single run.
//
// Importing this module is also what registers each boss class with the
// enemyRegistry - registration runs as a module side effect at the bottom of
// every enemy file, so a class that is never imported can never be created
// from saved data.

import { Enemy } from './enemy/Enemy';
import { Goblin } from './enemy/enemies/Goblin';
import { Frostwarden } from './enemy/enemies/Frostwarden';
import { Timekeeper } from './enemy/enemies/Timekeeper';

// Not part of any stage, but kept registered so enemyRegistry can still
// reconstruct it - GameEngine used to carry this side-effect import.
import './enemy/enemies/IceCube';
import { Dragon } from './enemy/enemies/Dragon';

export type StageConfig = {
  stage: number;
  BossClass: new (data?: any) => Enemy;
  scene: string;
};

export const STAGES: StageConfig[] = [
  { stage: 1, BossClass: Goblin, scene: 'underpass-overlaid' },
  // TODO: swap to 'frostcavern' / 'clocktower' once the art lands. Stages 2 and
  // 3 deliberately reuse stage 1's background for now - see also the goblin
  // sprite aliases in ui/components/enemy/EnemyDisplay.jsx.
  { stage: 2, BossClass: Frostwarden, scene: 'otkclone_bg_temple' },
  { stage: 3, BossClass: Timekeeper, scene: 'underpass-overlaid' },
];

export const FIRST_STAGE = STAGES[0].stage;
export const FINAL_STAGE = STAGES[STAGES.length - 1].stage;

export function getStageConfig(stage: number): StageConfig {
  const config = STAGES.find((entry) => entry.stage === stage);
  if (!config) throw new Error(`Unknown stage: ${stage}`);
  return config;
}
