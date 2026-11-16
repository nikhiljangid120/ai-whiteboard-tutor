'use client';

import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  FastForward,
  Rewind,
  Sparkles
} from 'lucide-react';
import { LessonScene } from '@/types/lesson';

interface LessonControlsProps {
  isPlaying: boolean;
  currentTime: number;
  totalDuration: number;
  currentSceneIndex: number;
  scenes: LessonScene[];
  sceneOffsets: { index: number; start: number; end: number; duration: number }[];
  playbackRate: number;
  isMuted: boolean;
  onTogglePlay: () => void;
  onSeek: (seconds: number) => void;
  onSkip: (delta: number) => void;
  onRestart: () => void;
  onJumpScene: (index: number) => void;
  onChangeRate: (rate: number) => void;
  onToggleMute: () => void;
}

export const LessonControls: React.FC<LessonControlsProps> = ({
  isPlaying,
  currentTime,
  totalDuration,
  currentSceneIndex,
  scenes,
  sceneOffsets,
  playbackRate,
  isMuted,
  onTogglePlay,
  onSeek,
  onSkip,
  onRestart,
  onJumpScene,
  onChangeRate,
  onToggleMute
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <div className="w-full flex flex-col gap-3 p-4 md:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg">
      {/* 1. Timeline Scrubber with Scene Chapter Markers */}
      <div className="flex flex-col gap-1.5">
        <div className="relative w-full h-3 group cursor-pointer flex items-center">
          {/* Progress bar background */}
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative border border-slate-200/50 dark:border-slate-700/50">
            {/* Filled progress */}
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 transition-all duration-75"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Chapter divider ticks */}
          {sceneOffsets.map((offset, i) => {
            if (i === 0) return null;
            const leftPct = (offset.start / totalDuration) * 100;
            return (
              <div
                key={i}
                className="absolute top-0 bottom-0 w-[2px] bg-slate-300 dark:bg-slate-600 pointer-events-none"
                style={{ left: `${leftPct}%` }}
              />
            );
          })}

          {/* Range input slider */}
          <input
            type="range"
            min={0}
            max={totalDuration || 100}
            step={0.1}
            value={currentTime}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            title="Drag to seek"
          />
        </div>

        {/* Timestamps */}
        <div className="flex justify-between items-center text-xs font-medium text-slate-500 dark:text-slate-400 px-0.5">
          <span>{formatTime(currentTime)}</span>
          <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
            Scene {currentSceneIndex + 1} of {scenes.length}: {scenes[currentSceneIndex]?.title}
          </span>
          <span>{formatTime(totalDuration)}</span>
        </div>
      </div>

      {/* 2. Playback Control Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Left: Quick scene jump / info */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onRestart}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            title="Restart Lesson"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSkip(-5)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            title="Rewind 5 seconds"
          >
            <Rewind className="w-4 h-4" />
          </button>

          {/* Large Main Play/Pause Button */}
          <button
            onClick={onTogglePlay}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold flex items-center gap-2 shadow-md hover:shadow-indigo-500/25 transition active:scale-95"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>{currentTime >= totalDuration ? 'Replay' : 'Play'}</span>
              </>
            )}
          </button>

          <button
            onClick={() => onSkip(5)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            title="Forward 5 seconds"
          >
            <FastForward className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Audio Voice & Speed Controls */}
        <div className="flex items-center gap-2">
          {/* Mute/Voice Toggle */}
          <button
            onClick={onToggleMute}
            className={`p-2 rounded-xl transition flex items-center gap-1.5 text-xs font-medium border ${
              isMuted
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
            }`}
            title={isMuted ? 'Unmute Tutor Voice' : 'Mute Tutor Voice'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-500" />}
            <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Voice Narration'}</span>
          </button>

          {/* Speed Selector */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            {[0.75, 1, 1.25, 1.5].map((rate) => (
              <button
                key={rate}
                onClick={() => onChangeRate(rate)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  playbackRate === rate
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Scene Quick Navigation Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          Scenes:
        </span>
        {scenes.map((scene, idx) => {
          const isActive = idx === currentSceneIndex;
          return (
            <button
              key={scene.id}
              onClick={() => onJumpScene(idx)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition flex items-center gap-1.5 border ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-300 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 shadow-sm'
                  : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isActive ? 'bg-indigo-600 dark:bg-indigo-400' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              />
              <span>
                {idx + 1}. {scene.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
