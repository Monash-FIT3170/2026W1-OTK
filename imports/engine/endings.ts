import type { DialogueLine, Difficulty } from './types';

const narrator = (text: string): DialogueLine => ({ speaker: 'narrator', text });
const player = (text: string): DialogueLine => ({ speaker: 'player', text });
const timekeeper = (text: string): DialogueLine => ({ speaker: 'enemy', speakerName: 'Timekeeper', text });
const clock = (text: string): DialogueLine => ({ speaker: 'enemy', speakerName: 'Clock', text });
const darkReflection = (text: string): DialogueLine => ({ speaker: 'enemy', speakerName: 'Dark Reflection', text });

// Shared revelation before either the normal sacrifice or secret encounter.
// Stage directions use narration; each beat advances individually.
export const SEVENTH_SHARD_REVELATION: DialogueLine[] = [
  narrator('The player approaches the shattered Clock.'),
  player('Six Chronoshards.'),
  player("That's all of them."),
  narrator('The six shards rise and slot into the Clock.'),
  narrator('The Clock glows intensely… then stops.'),
  player('What?'),
  player("Why isn't it working?"),
  timekeeper('Because…'),
  player('Huh?!? Who is that?'),
  timekeeper('The Timekeeper. What remains of him.'),
  timekeeper('it is incomplete.'),
  player('Incomplete?'),
  timekeeper('There must be… seven.'),
  player('Seven?'),
  player('There were six Guardians.'),
  player("I've collected every shard."),
  player("Isn't that enough?"),
  timekeeper('No.'),
  player('Then where is the seventh?'),
  player('Where do I find the final piece?'),
  timekeeper('…'),
  narrator('Long pause.'),
  timekeeper('It is you.'),
  player('…What?'),
  timekeeper('The seventh Chronoshard was used to create the Vessel.'),
  timekeeper('It is why you can move while the world remains frozen.'),
  timekeeper('Why the Clock answers you.'),
  timekeeper('Why you always return.'),
  player('So this was always the plan.'),
  timekeeper("Yes. This is your purpose. The clock created you to find it's pieces throughout each cycle to restore itself."),
  timekeeper('You return to what created you.'),
  player('And what happens to me?'),
  narrator('Pause.'),
  timekeeper('You cease to exist.'),
];

// Normal victory, after the final Guardian's outro.
export const NORMAL_ENDING: DialogueLine[] = [
  ...SEVENTH_SHARD_REVELATION,
  player('And if I refuse?'),
  timekeeper('The Chronosphere remains broken.'),
  timekeeper('Time cannot safely continue.'),
  timekeeper('And eventually…'),
  timekeeper('the entity will find another way through.'),
  player('So either I die…'),
  player('or everyone else does.'),
  timekeeper('Yes.'),
  narrator('The player looks toward the frozen world.'),
  player('I spent this whole journey trying to get home.'),
  player('Turns out there never was one.'),
  narrator('The player looks back at the Clock.'),
  player('But they still deserve theirs.'),
  player('Do it.'),
  narrator('The player places their hand on the Clock.'),
  narrator('Their body begins dissolving into light.'),
  clock('SEVENTH CHRONOSHARD DETECTED.'),
  clock('RESTORATION BEGINNING.'),
  narrator('The player disappears.'),
  narrator('The Clock becomes whole.'),
  narrator('11:59:59'),
  narrator('A loud TICK.'),
  narrator('12:00:00'),
  narrator('The Chronosphere reforms around the world.'),
  narrator('A dark silhouette beyond the barrier is pushed away.'),
  narrator('Rain falls. People move. Birds fly.'),
  narrator('Seven pieces became one.'),
  narrator('The Chronosphere was restored. The passage of time moves freely once again.'),
  narrator('And the world was given another tomorrow.'),
  narrator('12:00:01'),
  narrator('END'),
];

// Secret victory includes the defeat dialogue, so the secret stage has no
// separate outro to repeat it before this sequence.
export const SECRET_ENDING: DialogueLine[] = [
  narrator('Dark Reflection is defeated.'),
  darkReflection('How…?'),
  player('You knew every version of me that followed the Clock.'),
  player("You never knew the one that didn't."),
  narrator('Dark Reflection begins collapsing into dark temporal energy.'),
  timekeeper('Its essence…'),
  player('What about it?'),
  timekeeper('It contains enough temporal power.'),
  timekeeper('Enough to become the seventh piece.'),
  player('Meaning?'),
  timekeeper('You do not have to die.'),
  narrator("The player looks at the Dark Reflection's energy."),
  player("Then let's finish this properly."),
  narrator("The Dark Reflection's essence flows into the Clock."),
  clock('SEVENTH SOURCE DETECTED.'),
  clock('RESTORATION BEGINNING.'),
  narrator('The Clock becomes whole.'),
  narrator('The Chronosphere reforms.'),
  narrator('There is no silhouette beyond it.'),
  timekeeper('The entity is gone.'),
  player('For good?'),
  timekeeper('Yes.'),
  narrator('The Clock begins to move.'),
  narrator('11:59:59'),
  narrator('12:00:00'),
  narrator('Rain falls. People begin moving.'),
  player('It’s finally midnight.'),
  timekeeper('Yes.'),
  player('Bit underwhelming.'),
  narrator('The next second passes.'),
  narrator('12:00:01'),
  timekeeper('What will you do now?'),
  player("I don't know."),
  narrator('The player looks toward the waking world.'),
  player('For once…'),
  player("I think that's a good thing."),
  narrator('The Chronosphere was restored.'),
  narrator('The threat beyond time was destroyed.'),
  narrator('The cycle was broken.'),
  narrator('And for the first time…'),
  narrator('the world had a future.'),
  narrator('And so did the player.'),
  narrator('Fade to black.'),
  narrator('TRUE END'),
];

// ---------------------------------------------------------------------------
// Easy and Medium endings
//
// The story is the same as Hard's sacrifice ending; only the number of
// Chronoshards changes (Easy: four Guardians + the Vessel, Medium: five + the
// Vessel). Hard's NORMAL_ENDING above is left exactly as written.
// ---------------------------------------------------------------------------

type ShardCount = {
  collected: string; // "Four" - Guardians' shards held when the Clock is tried
  guardians: string; // "four"
  total: string; // "five" - pieces the Clock needs
  ordinal: string; // "fifth" - the piece that is the Vessel
  // Easy ends on the Timekeeper himself, who has only just been defeated.
  // Medium (like Hard) has already fought him, so he returns as an echo.
  timekeeperJustFought: boolean;
};

const capitalise = (word: string): string => word.charAt(0).toUpperCase() + word.slice(1);

function buildVictoryEnding(count: ShardCount): DialogueLine[] {
  const { collected, guardians, total, ordinal, timekeeperJustFought } = count;
  return [
    narrator('The player approaches the shattered Clock.'),
    player(`${collected} Chronoshards.`),
    player("That's all of them."),
    narrator(`The ${collected.toLowerCase()} shards rise and slot into the Clock.`),
    narrator('The Clock glows intensely… then stops.'),
    player('What?'),
    player("Why isn't it working?"),
    ...(timekeeperJustFought
      ? [narrator('The Timekeeper struggles to speak.'), timekeeper('Because…')]
      : [
          timekeeper('Because…'),
          player('Huh?!? Who is that?'),
          timekeeper('The Timekeeper. What remains of him.'),
        ]),
    timekeeper('It is incomplete.'),
    player('Incomplete?'),
    timekeeper(`There must be… ${total}.`),
    player(`${capitalise(total)}?`),
    player(`There were ${guardians} Guardians.`),
    player("I've collected every shard."),
    player("Isn't that enough?"),
    timekeeper('No.'),
    player(`Then where is the ${ordinal}?`),
    player('Where do I find the final piece?'),
    timekeeper('…'),
    narrator('Long pause.'),
    timekeeper('It is you.'),
    player('…What?'),
    timekeeper(`The ${ordinal} Chronoshard was used to create the Vessel.`),
    timekeeper('It is why you can move while the world remains frozen.'),
    timekeeper('Why the Clock answers you.'),
    timekeeper('Why you always return.'),
    player('So this was always the plan.'),
    timekeeper("Yes. This is your purpose. The clock created you to find it's pieces throughout each cycle to restore itself."),
    timekeeper('You return to what created you.'),
    player('And what happens to me?'),
    narrator('Pause.'),
    timekeeper('You cease to exist.'),
    player('And if I refuse?'),
    timekeeper('The Chronosphere remains broken.'),
    timekeeper('Time cannot safely continue.'),
    timekeeper('And eventually…'),
    timekeeper('the entity will find another way through.'),
    player('So either I die…'),
    player('or everyone else does.'),
    timekeeper('Yes.'),
    narrator('The player looks toward the frozen world.'),
    player('I spent this whole journey trying to get home.'),
    player('Turns out there never was one.'),
    narrator('The player looks back at the Clock.'),
    player('But they still deserve theirs.'),
    player('Do it.'),
    narrator('The player places their hand on the Clock.'),
    narrator('Their body begins dissolving into light.'),
    timekeeper('Thank you… and forgive me.'),
    clock(`${ordinal.toUpperCase()} CHRONOSHARD DETECTED.`),
    clock('RESTORATION BEGINNING.'),
    narrator('The player disappears.'),
    narrator('The Clock becomes whole.'),
    narrator('11:59:59'),
    narrator('A loud TICK.'),
    narrator('12:00:00'),
    narrator('The Chronosphere reforms around the world.'),
    narrator('A dark silhouette beyond the barrier is pushed away.'),
    narrator('Rain falls. People move. Birds fly.'),
    narrator(`${capitalise(total)} pieces became one.`),
    narrator('The Chronosphere was restored. The passage of time moves freely once again.'),
    narrator('And the world was given another tomorrow.'),
    narrator('12:00:01'),
    narrator('END'),
  ];
}

export const EASY_ENDING: DialogueLine[] = buildVictoryEnding({
  collected: 'Four',
  guardians: 'four',
  total: 'five',
  ordinal: 'fifth',
  timekeeperJustFought: true,
});

export const MEDIUM_ENDING: DialogueLine[] = buildVictoryEnding({
  collected: 'Five',
  guardians: 'five',
  total: 'six',
  ordinal: 'sixth',
  timekeeperJustFought: false,
});

// Added after the ending of a run that used no power-ups on Easy or Medium,
// pointing players at the secret route that only Hard has.
export const HARD_MODE_TEASER: DialogueLine[] = [
  narrator('The Clock ticks once, faintly.'),
  narrator('The Clock took what it was owed.'),
  narrator('But some echoes refuse to be spent.'),
  narrator('Somewhere beyond the Chronosphere, something is still watching.'),
  narrator('Face all six Guardians in Hard Mode to learn what the cycle was hiding.'),
];

const VICTORY_ENDINGS: Record<Difficulty, DialogueLine[]> = {
  easy: EASY_ENDING,
  medium: MEDIUM_ENDING,
  hard: NORMAL_ENDING,
};

// The sequence played after the final boss of a run. The secret ending belongs
// to the secret boss and only exists on Hard. `noPowerUps` adds the Hard-mode
// teaser to Easy and Medium endings.
export function getEnding(
  difficulty: Difficulty,
  secret: boolean = false,
  noPowerUps: boolean = false
): DialogueLine[] {
  if (secret) return SECRET_ENDING;
  const ending = VICTORY_ENDINGS[difficulty] ?? NORMAL_ENDING;
  return noPowerUps && difficulty !== 'hard' ? [...ending, ...HARD_MODE_TEASER] : ending;
}
