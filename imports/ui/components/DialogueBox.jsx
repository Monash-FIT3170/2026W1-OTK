import React, { useCallback, useEffect, useRef, useState } from 'react';

const TYPE_INTERVAL_MS = 25;

// How each kind of speaker is drawn. 'enemy' takes its name from the enemyName
// prop; a null name means no name plate (narrator).
const SPEAKER_STYLES = {
  player: {
    name: 'You',
    nameClass: 'text-emerald-400',
    textClass: 'text-white',
  },
  enemy: {
    name: null,
    nameClass: 'text-red-400',
    textClass: 'text-white',
  },
  narrator: {
    name: null,
    nameClass: '',
    textClass: 'text-slate-300 italic',
  },
};

/**
 * Boss dialogue panel. Fills whatever box its parent gives it - App.jsx gives
 * it the entire lower half of the battle screen, in place of the card hand -
 * before the fight (intro) and after the boss dies (outro).
 *
 * Click the box, or press Space / Enter, to advance: the first press completes
 * the line that is still typing out, the next moves to the following line, and
 * pressing on the last line calls onFinish. "Skip" jumps straight to onFinish.
 *
 * onFinish is called at most once, however fast the player clicks.
 *
 * @param {{ speaker: 'player' | 'enemy' | 'narrator', text: string }[]} lines
 * @param {string} enemyName - shown as the name of every 'enemy' line
 * @param {string} finishHint - prompt shown on the last line ("Click to begin"
 *   suits an intro; an outro wants something like "Click to continue")
 * @param {() => void} onFinish - dialogue completed or skipped
 */
export function DialogueBox({
  lines = [],
  enemyName = 'Enemy',
  finishHint = 'Click to continue',
  onFinish,
}) {
  const [lineIndex, setLineIndex] = useState(0);
  const [shownChars, setShownChars] = useState(0);
  const finishedRef = useRef(false);

  const line = lines[lineIndex];
  const text = line?.text ?? '';
  const lineDone = shownChars >= text.length;
  const isLastLine = lineIndex >= lines.length - 1;

  // Typewriter effect: restarts for every new line.
  useEffect(() => {
    setShownChars(0);
    if (!text) return undefined;
    const id = setInterval(() => {
      setShownChars((n) => {
        if (n + 1 >= text.length) clearInterval(id);
        return n + 1;
      });
    }, TYPE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [lineIndex, text]);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onFinish?.();
  }, [onFinish]);

  const advance = useCallback(() => {
    if (!lineDone) {
      setShownChars(text.length);
    } else if (isLastLine) {
      finish();
    } else {
      // Reset together with the index so the new line never renders for a
      // frame at the previous line's length.
      setShownChars(0);
      setLineIndex((i) => i + 1);
    }
  }, [lineDone, isLastLine, text, finish]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== ' ' && event.key !== 'Enter') return;
      // Don't hijack Space/Enter from the settings dialog or any other
      // control the player is interacting with.
      if (
        event.target instanceof Element &&
        event.target.closest('button, input, select, textarea, dialog')
      ) {
        return;
      }
      event.preventDefault();
      advance();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [advance]);

  // Nothing to say: hand control straight back instead of trapping the player
  // behind an empty box.
  useEffect(() => {
    if (lines.length === 0) finish();
  }, [lines.length, finish]);

  if (!line) return null;

  // Anything that isn't the player or the boss reads as narration, so an
  // unexpected speaker value degrades gracefully instead of blanking the box.
  const speaker =
    line.speaker === 'player' || line.speaker === 'enemy'
      ? line.speaker
      : 'narrator';
  const style = SPEAKER_STYLES[speaker];
  const speakerName = speaker === 'enemy' ? enemyName : style.name;

  // Fills whatever box the parent gives it (w-full h-full), edge to edge. Sizes
  // are in design-canvas pixels (the game canvas is 1920x1080 and scaled), so
  // they are deliberately large.
  return (
    <div className="relative w-full h-full" data-testid="dialogue-box">
      <div
        role="button"
        tabIndex={0}
        onClick={advance}
        className="relative flex flex-col justify-center w-full h-full border-t-4 border-slate-500 bg-slate-900 px-48 py-12 cursor-pointer select-none"
      >
        {/* The narrator has no name plate - just the text. */}
        {speakerName && (
          <p
            className={`text-4xl font-bold tracking-wide mb-4 ${style.nameClass}`}
            data-testid="dialogue-speaker"
          >
            {speakerName}
          </p>
        )}

        <p
          className={`text-5xl leading-relaxed ${style.textClass}`}
          data-testid="dialogue-text"
        >
          {text.slice(0, shownChars)}
        </p>

        <div className="absolute bottom-6 right-12 flex items-center gap-4">
          {lineDone && (
            <span className="text-slate-400 text-2xl animate-pulse">
              {isLastLine ? finishHint : 'Click to continue'}
            </span>
          )}
        </div>
      </div>

      {/* A sibling of the clickable box (not inside it), so clicking Skip
          never also counts as a click-to-advance. */}
      <button
        type="button"
        className="absolute top-8 right-12 text-slate-400 hover:text-slate-200 text-2xl transition-colors"
        onClick={finish}
      >
        Skip
      </button>
    </div>
  );
}

export default DialogueBox;
