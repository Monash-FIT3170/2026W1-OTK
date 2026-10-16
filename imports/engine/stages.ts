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
import { Ninja } from './enemy/enemies/Ninja';
import { Merchant } from './enemy/enemies/Merchant';
import { SecretBoss } from './enemy/enemies/SecretBoss';
import { Difficulty } from './types';
import type { DialogueLine, SeenDialogue } from './types';
import { SEVENTH_SHARD_REVELATION } from './endings';

// Not part of any stage, but kept registered so enemyRegistry can still
// reconstruct it - GameEngine used to carry this side-effect import.
import { IceCube } from './enemy/enemies/IceCube';
import { Dragon } from './enemy/enemies/Dragon';

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
        // Opening sequence, followed by the Goblin encounter.
        { speaker: 'narrator', text: '11:59:59.' },
        { speaker: 'narrator', text: 'One second before midnight.' },
        { speaker: 'narrator', text: 'And for longer than anyone remembers… that second has never passed.' },
        { speaker: 'narrator', text: 'The player wakes beside a shattered glowing Clock.' },
        { speaker: 'player', text: 'Where am I…?' },
        { speaker: 'player', text: 'I remember another place.' },
        { speaker: 'player', text: 'Another life.' },
        { speaker: 'player', text: 'But not how I got here.' },
        { speaker: 'narrator', text: 'The shattered Clock pulses.' },
        { speaker: 'player', text: 'That Clock…' },
        { speaker: 'player', text: 'Maybe it can get me home.' },
        { speaker: 'narrator', text: 'Six fragments of the ancient Clock remain scattered across the world, frozen in time.' },
        { speaker: 'narrator', text: 'Chronoshards.' },
        { speaker: 'narrator', text: 'Each is guarded by one of the powerful ancient demigods known as the Guardians of Time.' },
        { speaker: 'narrator', text: 'Six pieces.' },
        { speaker: 'narrator', text: 'Fix the Clock.' },
        { speaker: 'narrator', text: 'Find a way home.' },
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
        { speaker: 'enemy', text: 'You have returned.' },
        { speaker: 'player', text: 'There it is again.' },
        { speaker: 'player', text: "Everyone keeps telling me I've been here before." },
        { speaker: 'enemy', text: 'You have.' },
        { speaker: 'player', text: 'Who am I?' },
        { speaker: 'enemy', text: 'A Vessel.' },
        { speaker: 'player', text: 'A vessel for what?' },
        { speaker: 'enemy', text: 'The Clock.' },
        { speaker: 'player', text: 'No.' },
        { speaker: 'player', text: 'I came from another world.' },
        { speaker: 'enemy', text: 'There was no other world.' },
        { speaker: 'player', text: 'I remember it.' },
        { speaker: 'enemy', text: 'You remember what the Clock gave you.' },
        { speaker: 'player', text: 'Why would it do that?' },
        { speaker: 'enemy', text: 'Because a Vessel requires purpose.' },
        { speaker: 'enemy', text: 'A reason to move forward.' },
        { speaker: 'player', text: 'So my memories are fake?' },
        { speaker: 'enemy', text: 'Fragments.' },
        { speaker: 'enemy', text: 'A past created to lead you here.' },
        { speaker: 'player', text: 'And this has happened before.' },
        { speaker: 'enemy', text: 'Countless times.' },
        { speaker: 'player', text: 'Then why is the world frozen?' },
        { speaker: 'enemy', text: 'Because I froze it.' },
        { speaker: 'player', text: 'You did this?' },
        { speaker: 'enemy', text: 'To save it.' },
        { speaker: 'player', text: 'From what?' },
        { speaker: 'enemy', text: 'The Chronosphere once surrounded this world.' },
        { speaker: 'enemy', text: 'A barrier between our reality and something beyond time.' },
        { speaker: 'enemy', text: 'An entity powerful enough to tear through it.' },
        { speaker: 'enemy', text: 'When the Chronosphere broke, it began crossing into our world.' },
        { speaker: 'enemy', text: 'It was one second away.' },
        { speaker: 'player', text: 'So you shattered the Clock.' },
        { speaker: 'enemy', text: 'Yes.' },
        { speaker: 'enemy', text: 'And froze that second forever.' },
        { speaker: 'player', text: 'You trapped everyone.' },
        { speaker: 'enemy', text: 'I kept them alive.' },
        { speaker: 'player', text: "This isn't living." },
        { speaker: 'enemy', text: 'No.' },
        { speaker: 'enemy', text: 'It is survival.' },
        { speaker: 'player', text: "Then I'll restore the Clock." },
        { speaker: 'player', text: "I'll fix the Chronosphere." },
        { speaker: 'enemy', text: 'You have said that before.' },
        { speaker: 'player', text: "Then maybe this time I'll actually do it." },
        { speaker: 'enemy', text: 'Come, Vessel.' },
        { speaker: 'enemy', text: 'Let us see.' },
      ],
      outro: [
        { speaker: 'narrator', text: 'The Timekeeper is defeated.' },
        { speaker: 'enemy', text: 'So…' },
        { speaker: 'enemy', text: 'You might reach the end of the cycle this time after all...' },
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
        { speaker: 'player', text: 'I\'m guessing you know me too?' },
        { speaker: 'enemy', text: 'I know your patterns.' },
        { speaker: 'player', text: 'I don\'t have patterns.' },
        { speaker: 'enemy', text: 'Nonsense. Everyone does.' },
        { speaker: 'player', text: 'Then predict this!' },
      ],
      outro: [
        { speaker: 'enemy', text: 'Fast... faster than a shadow.' },
        { speaker: 'enemy', text: 'How is this possible? I can predict your every move.' },
        { speaker: 'player', text: 'Heh... I guess I\'ve had my fair share of practice' },
        { speaker: 'enemy', text: 'So you say... Your past versions weren\'t like you. They were so predictable.' },
        { speaker: 'player', text: 'What happens to me after I fix the clock?' },
        { speaker: 'player', text: 'What lies beyond the Chronosphere? What lies beyond time itself?' },
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
        { speaker: 'player', text: 'Then tell me what happens to me after I fix the Clock?' },
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
        ...SEVENTH_SHARD_REVELATION,
        { speaker: 'narrator', text: 'The Clock begins pulling at the player.' },
        { speaker: 'narrator', text: 'Nothing happens.' },
        { speaker: 'player', text: "…That's new." },
        { speaker: 'enemy', speakerName: 'Timekeeper', text: 'Impossible.' },
        { speaker: 'player', text: 'What?' },
        { speaker: 'enemy', speakerName: 'Timekeeper', text: 'The Clock cannot reclaim you.' },
        { speaker: 'player', text: 'Why?' },
        { speaker: 'enemy', speakerName: 'Timekeeper', text: 'You refused its power.' },
        { speaker: 'enemy', speakerName: 'Timekeeper', text: 'You never traded yourself away.' },
        { speaker: 'enemy', speakerName: 'Timekeeper', text: 'The seventh Chronoshard remains within you…' },
        { speaker: 'enemy', speakerName: 'Timekeeper', text: 'But you are no longer merely a piece of the Clock.' },
        { speaker: 'player', text: 'Then what am I?' },
        { speaker: 'enemy', speakerName: 'Timekeeper', text: 'Something no Vessel has ever become.' },
        { speaker: 'enemy', speakerName: 'Timekeeper', text: 'Independent.' },
        { speaker: 'narrator', text: 'The Clocktower shakes violently.' },
        { speaker: 'player', text: "What's happening?" },
        { speaker: 'enemy', speakerName: 'Timekeeper', text: 'The Chronosphere…' },
        { speaker: 'enemy', speakerName: 'Timekeeper', text: 'Something is crossing through.' },
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
      // The defeat dialogue is part of SECRET_ENDING in endings.ts.
      outro: [],
    },
  },
];

export const FIRST_STAGE = STAGES[0].stage;
export const SECRET_BOSS_STAGE = STAGES[STAGES.length - 1].stage;

export function getStageConfig(stage: number): StageConfig {
  const config = STAGES.find((entry) => entry.stage === stage);
  if (!config) throw new Error(`Unknown stage: ${stage}`);
  return config;
}

/**
 * Function to determine the final stage number based on the difficulty
 * @param difficulty String representing the difficulty: 'easy', 'medium' or 'hard'
 * @returns The final stage number
 */
export function getFinalStageFromDifficulty(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'easy':
      return 4;
    case 'medium':
      return 5;
    case 'hard':
      return 6;
    default:
      throw new Error(`Unknown difficulty: ${difficulty}`)
  }
}

export function getStageDialogue(stage: number, kind: 'intro' | 'outro'): DialogueLine[] {
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
  kind: 'intro' | 'outro',
  seen?: SeenDialogue | null
): boolean {
  if (getStageDialogue(stage, kind).length === 0) return false;
  return !seen?.[dialogueKey(stage)]?.[kind];
}
