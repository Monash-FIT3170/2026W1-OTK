import React, { useState } from 'react';
import { soundManager } from '../soundManager';

const VolumeRow = ({
  label,
  initialValue,
  initialEnabled,
  onVolumeChange,
  onMuteChange,
}) => {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [value, setValue] = useState(initialValue);

  const handleMute = (e) => {
    const checked = e.target.checked;
    setEnabled(checked);
    onMuteChange(!checked);
  };

  const handleSlider = (e) => {
    const v = Number(e.target.value);
    setValue(v);
    onVolumeChange(v / 100);
  };

  return (
    <div className="flex items-center gap-4">
      <input
        type="checkbox"
        className="checkbox checkbox-primary"
        checked={enabled}
        onChange={handleMute}
        aria-label={`Toggle ${label}`}
      />
      <span className="w-32 text-2xl font-medium">{label}</span>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={handleSlider}
        disabled={!enabled}
        className="range range-primary range-sm flex-1"
      />
    </div>
  );
};

const Settings = () => {
  return (
    <>
      {/* Settings gear button — opens the modal */}
      <button
        className="btn btn-ghost btn-circle"
        onClick={() => document.getElementById('settings-modal').showModal()}
        aria-label="Open settings"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

      {/* DaisyUI modal (native <dialog>) */}
      <dialog id="settings-modal" className="modal">
        <div
          className="modal-box"
          style={{ fontFamily: '"Micro 5", monospace' }}
        >
          <h3 className="font-bold text-4xl mb-6">Settings</h3>

          <div className="space-y-5">
            <VolumeRow
              label="Main Volume"
              initialValue={Math.round(soundManager.masterVolume * 100)}
              initialEnabled={!soundManager.isMuted}
              onVolumeChange={(v) => soundManager.setMasterVolume(v)}
              onMuteChange={(muted) => soundManager.setMuted(muted)}
            />
            <VolumeRow
              label="Music"
              initialValue={Math.round(soundManager.musicVolume * 100)}
              initialEnabled={!soundManager.isMusicMuted}
              onVolumeChange={(v) => soundManager.setMusicVolume(v)}
              onMuteChange={(muted) => soundManager.setMusicMuted(muted)}
            />
            <VolumeRow
              label="SFX"
              initialValue={Math.round(soundManager.sfxVolume * 100)}
              initialEnabled={!soundManager.isSfxMuted}
              onVolumeChange={(v) => soundManager.setSfxVolume(v)}
              onMuteChange={(muted) => soundManager.setSfxMuted(muted)}
            />
          </div>
        </div>

        {/* Click outside to close */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default Settings;
