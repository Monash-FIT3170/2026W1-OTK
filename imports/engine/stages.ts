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
import { Undying } from './enemy/enemies/Undying';

// Not part of any stage, but kept registered so enemyRegistry can still
// reconstruct it - GameEngine used to carry this side-effect import.
import './enemy/enemies/IceCube';
import { Dragon } from './enemy/enemies/Dragon';
import { Ninja } from './enemy/enemies/Ninja';
import { Merchant } from './enemy/enemies/Merchant';
import { SecretBoss } from './enemy/enemies/SecretBoss';
import type { DialogueKind, DialogueLine, SeenDialogue } from './types';

export type StageDialogue = {
  intro: DialogueLine[]; // plays before the player can touch the fight
  outro: DialogueLine[]; // plays once the boss is down, before the stage-clear / result screen
};

export type StageConfig = {
  stage: number;
  BossClass: new (data?: any) => Enemy;
  scene: string;
  dialogue: StageDialogue;
};

// TODO(story): every line below is placeholder copy - replace with the real
// lore. A stage with an empty intro/outro array simply skips that dialogue.
export const STAGES: StageConfig[] = [
  {
    stage: 1,
    BossClass: Goblin,
    scene: 'underpass-overlaid',
    dialogue: {
      intro: [
        { speaker: 'enemy', text: 'Another hero come to take my treasure? You get one turn. Make it count.' },
        { speaker: 'player', text: 'One turn is all I need.' },
      ],
      outro: [
        { speaker: 'enemy', text: 'Impossible... in a single turn?' },
        { speaker: 'player', text: 'The road ahead is long. Time to keep moving.' },
      ],
    },
  },
  {
    stage: 2,
    BossClass: Frostwarden,
    scene: 'otkclone_bg_temple',
    dialogue: {
      intro: [
        { speaker: 'enemy', text: 'The temple has been frozen for a thousand years. So will you be.' },
        { speaker: 'player', text: 'Not if I finish this before the frost sets in.' },
      ],
      outro: [
        { speaker: 'enemy', text: 'The ice... it is cracking.' },
        { speaker: 'player', text: 'Then the way forward is open.' },
      ],
    },
  },
  {
    stage: 3,
    BossClass: Undying,
    scene: 'underpass-overlaid',
    dialogue: {
      intro: [
        { speaker: 'enemy', text: 'Death has tried to claim me many times. It has always failed.' },
        { speaker: 'player', text: 'Then I will have to be quicker than death.' },
      ],
      outro: [
        { speaker: 'enemy', text: 'So this is what it feels like to fall...' },
        { speaker: 'player', text: 'Rest now.' },
      ],
    },
  },
  {
    stage: 4,
    BossClass: Timekeeper,
    scene: 'otkclone_bg_palace_overlaid',
    dialogue: {
      intro: [
        { speaker: 'enemy', text: 'Every second you spend here belongs to me.' },
        { speaker: 'player', text: 'Then I will not waste a single one.' },
      ],
      outro: [
        { speaker: 'enemy', text: 'Time itself... slipping from my grasp.' },
        { speaker: 'player', text: 'It was never yours to keep.' },
      ],
    },
  },
  {
    stage: 5,
    BossClass: Ninja,
    scene: 'underpass-overlaid',
    dialogue: {
      intro: [
        { speaker: 'enemy', text: 'You will not even see the blade that ends you.' },
        { speaker: 'player', text: 'Then I will have to land mine first.' },
      ],
      outro: [
        { speaker: 'enemy', text: 'Fast... faster than a shadow.' },
        { speaker: 'player', text: 'Only one more turn to go.' },
      ],
    },
  },
  {
    stage: 6,
    BossClass: Merchant,
    scene: 'underpass-overlaid',
    dialogue: {
      intro: [
        { speaker: 'enemy', text: 'Everything has a price, friend. Even your life.' },
        { speaker: 'player', text: 'Not for sale.' },
      ],
      outro: [
        { speaker: 'enemy', text: 'A fair trade... I suppose.' },
        { speaker: 'player', text: 'I will take it from here.' },
      ],
    },
  },
  {
    stage: 7,
    BossClass: SecretBoss,
    scene: 'underpass-overlaid',
    dialogue: {
      intro: [
        { speaker: 'enemy', text: 'You came all this way without a crutch. Impressive. Now face yourself.' },
        { speaker: 'player', text: 'I know every move. I made them all.' },
      ],
      outro: [
        { speaker: 'enemy', text: 'Strange... losing feels a lot like winning.' },
        { speaker: 'player', text: 'It is over.' },
      ],
    },
  },
];

export const FIRST_STAGE = STAGES[0].stage;
export const FINAL_STAGE = STAGES[STAGES.length - 2].stage;   // -2 as the last stage is the secret boss
export const SECRET_BOSS_STAGE = STAGES[STAGES.length - 1].stage;

export function getStageConfig(stage: number): StageConfig {
  const config = STAGES.find((entry) => entry.stage === stage);
  if (!config) throw new Error(`Unknown stage: ${stage}`);
  return config;
}

export function getStageDialogue(stage: number, kind: DialogueKind): DialogueLine[] {
  return getStageConfig(stage).dialogue[kind];
}

// Mongo-safe key for a stage inside the account-level SeenDialogue record
// (a bare numeric path segment like "seenDialogue.1.intro" is ambiguous with
// an array index).
export function dialogueKey(stage: number): string {
  return `stage${stage}`;
}

// True when this stage's dialogue still has to be shown to the player: the
// stage has lines for it and the account has not seen them yet.
export function shouldShowDialogue(
  stage: number,
  kind: DialogueKind,
  seen?: SeenDialogue | null
): boolean {
  if (getStageDialogue(stage, kind).length === 0) return false;
  return !seen?.[dialogueKey(stage)]?.[kind];
}
