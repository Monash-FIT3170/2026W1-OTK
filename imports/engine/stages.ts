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
        { speaker: 'enemy', text: 'HEY! You moved!' },
        { speaker: 'player', text: 'So did you.'},
        { speaker: 'enemy', text: 'Yeah, but I\'m supposed to! Why aren\'t you frozen like the others? '},
        { speaker: 'enemy', text: '*** Holds up a glowing Chronoshard *** '},
        { speaker: 'player', text: '!!!...  I need that.'},
        { speaker: 'enemy', text: 'I found it first. Another hero come to take my shiny treasure? ' },
        { speaker: 'enemy', text: 'Alright let\'s see what you got. You get one turn. Make it count.' },
        { speaker: 'player', text: 'One turn is all I need.' },
      ],
      outro: [
        { speaker: 'enemy', text: 'Alright! Alright! Take it!' },
        { speaker: 'player', text: 'Thanks. One down.' },
        { speaker: 'enemy', text: 'You\'re weird, you know...' },
        { speaker: 'player', text: 'Why?' },
        { speaker: 'enemy', text: 'You remind me of someone...' },
        { speaker: 'player', text: 'Huh? Who?' },
        { speaker: 'enemy', text: '...No idea. Now leave me alone!' },
      ],
    },
  },
  {
    stage: 2,
    BossClass: Frostwarden,
    scene: 'otkclone_bg_temple',
    dialogue: {
      intro: [
        { speaker: 'player', text: 'Brrr.... It\'s freezing cold in here. And the way forward is blocked by ice.' },
        { speaker: 'enemy', text: 'VESSEL!!!' },
        { speaker: 'player', text: 'Don\'t call me that! I am not a vessel! I am a person!' },
        { speaker: 'enemy', text: 'IT IS WHAT YOU ARE.' },
        { speaker: 'player', text: 'Then tell me what it means.' },
        { speaker: 'enemy', text: 'YOU CARRY THE CLOCK WITHIN YOU. IT IS YOUR BURDEN.' },
        { speaker: 'player', text: 'I don\'t understand. I\'m only carrying its pieces.' },
        { speaker: 'enemy', text: 'NO. YOU ARE CLOSER TO IT THAN YOU THINK.' },
        { speaker: 'player', text: 'Tell me more.' },
        { speaker: 'enemy', text: 'HE WHO IS ABOUT TO DIE DOESN\'T NEED ANSWERS.' },
        { speaker: 'player', text: 'Then I\'m getting my answers one way or another.' },

      ],
      outro: [
        { speaker: 'enemy', text: 'THE ICE...  IT\'S CRACKING...' },
        { speaker: 'player', text: 'Finally, the way forward is open.' },
      ],
    },
  },
  {
    stage: 3,
    BossClass: Undying,
    scene: 'underpass-overlaid',
    dialogue: {
      intro: [
        { speaker: 'enemy', text: 'You came back.' },
        { speaker: 'player', text: 'Back? You must be mistaking me for someone else.' },
        { speaker: 'enemy', text: 'You don\'t remember?' },
        { speaker: 'player', text: 'Remember what?' },
        { speaker: 'enemy', text: 'Never mind' },
        { speaker: 'player', text: 'You have something I need. I need that Chronoshard.' },
        { speaker: 'enemy', text: 'You always do. There\'s only one way to get it.' },
        { speaker: 'player', text: 'Have it your way.' },
        { speaker: 'enemy', text: 'Death has tried to claim me many times. It has always failed.' },
        { speaker: 'player', text: 'Then I will have to be quicker than death.' },
      ],
      outro: [
        { speaker: 'enemy', text: 'Finally...' },
        { speaker: 'player', text: 'You wanted to lose?' },
        { speaker: 'enemy', text: 'I died when time stopped. But death never finished its work with me.' },
        { speaker: 'player', text: 'How long have you been like this?' },
        { speaker: 'enemy', text: 'Long enough to watch you return more than once.' },
        { speaker: 'player', text: 'I\'ve never been here before! What are you talking about?' },
        { speaker: 'enemy', text: 'That\'s what you said last time.' },
        { speaker: 'player', text: 'What does that mean?' },
        { speaker: 'enemy', text: 'Keep going. Perhaps this time you\'ll find out.' },
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
        { speaker: 'enemy', text: 'Your stance has changed.' },
        { speaker: 'player', text: 'You know me too?' },
        { speaker: 'enemy', text: 'I know your patterns.' },
        { speaker: 'player', text: 'I don\'t have patterns.' },
        { speaker: 'enemy', text: 'Nonsense. Everyone does.' },
        { speaker: 'player', text: 'Then predict this!' },
      ],
      outro: [
        { speaker: 'enemy', text: 'Fast... faster than a shadow.' },
        { speaker: 'enemy', text: 'How is this possible? I can predict your every move.' },
        { speaker: 'player', text: 'That\'s the flaw in your programming. Machines look for patterns. We humans break them.' },
        { speaker: 'enemy', text: 'So you say... Your past versions weren\'t like you. They were so predictable.' },
        { speaker: 'player', text: 'You keep acting like you have met me before.' },
        { speaker: 'enemy', text: 'Because we have.' },
        { speaker: 'player', text: 'How? How is that possible?' },
        { speaker: 'enemy', text: 'Ask the Merchant. He remembers more than most.' },
      ],
    },
  },
  {
    stage: 6,
    BossClass: Merchant,
    scene: 'underpass-overlaid',
    dialogue: {
      intro: [
        { speaker: 'enemy', text: 'Welcome back.' },
        { speaker: 'player', text: 'Of course. You\'ve been expecting me. You\'re going to tell me we\'ve met before too.' },
        { speaker: 'enemy', text: 'Many times.' },
        { speaker: 'player', text: 'Then tell me who I am.' },
        { speaker: 'enemy', text: 'That is an expensive question.' },
        { speaker: 'player', text: 'I don\'t have money.' },
        { speaker: 'enemy', text: 'Fool! Money is worthless. I trade in something much more valuable.' },
        { speaker: 'enemy', text: 'Time... Memories... Possibilities...' },
        { speaker: 'player', text: 'And Chronoshards?' },
        { speaker: 'enemy', text: 'Those cost considerably more. Your life!' },
        { speaker: 'player', text: 'That\'s not for sale.' },

      ],
      outro: [
        { speaker: 'enemy', text: 'AHH... Terrible customer... Fine, the Chronoshard is yours.' },
        { speaker: 'player', text: 'Give me answers now!' },
        { speaker: 'enemy', text: 'Very well. Those powers you\'ve been using?' },
        { speaker: 'player', text: 'What about them?' },  
        { speaker: 'enemy', text: 'They are not yours. They are the powers of the great Ancient Clock.' },
        { speaker: 'enemy', text: 'Nothing the Clock gives is free.' },
        { speaker: 'player', text: 'What does it take in return then?' },  
        { speaker: 'enemy', text: 'A little more of you each time. That\'s the law of equivalent exchange.' },
        { speaker: 'enemy', text: 'To use great power, you must give up something of equal value.' },
        { speaker: 'player', text: 'What does that mean?' },
        { speaker: 'enemy', text: 'You\'ll understand soon enough...' },
      ],
    },
  },
  {
    stage: 7,
    BossClass: SecretBoss,
    scene: 'underpass-overlaid',
    dialogue: {
      intro: [
        { speaker: 'enemy', text: 'At last we meet.' },
        { speaker: 'player', text: 'You\'re the entity beyond the chronosphere!' },
        { speaker: 'enemy', text: 'You have carried me through every cycle. ' },
        { speaker: 'player', text: 'What do you mean?' },
        { speaker: 'enemy', text: 'I watched you from the beginning through the cracks. Every battle. Every death. Every power you accepted.' },
        { speaker: 'player', text: 'Why do you look like me?' },
        { speaker: 'enemy', text: 'I learnt what you could do across the infinite number of timelines, across infinite battles and infinite possibilities.' },
        { speaker: 'enemy', text: 'I am the echo of your actions, the shadow of your choices.' },
        { speaker: 'enemy', text: 'Every Guardian\'s strength. Every vessel\'s failure. Every power the Clock gave you.' },
        { speaker: 'enemy', text: 'I am the culmination of all your past versions.' },
        { speaker: 'player', text: 'So you\'re the perfect version of me?' },
        { speaker: 'enemy', text: 'I am the version that wins.' },
        { speaker: 'player', text: 'You say you accounted for every version of me... but you missed one though...' },
        { speaker: 'enemy', text: 'What?' },
        { speaker: 'player', text: 'This one!' },

      ],
      outro: [
        { speaker: 'enemy', text: 'How...?' },
        { speaker: 'player', text: 'You knew every version of me that followed the Clock.' },
        { speaker: 'player', text: 'But you never knew the one who would defy it.' },

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
