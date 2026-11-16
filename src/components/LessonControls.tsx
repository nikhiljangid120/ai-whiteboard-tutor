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
  Sparkles,
  Layers
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
    <div className="w-full flex flex-col gap-3.5 p-4 sm:p-5 rounded-3xl bg-slate-900/90 dark:bg-slate-950/90 text-white backdrop-blur-2xl border border-white/10 shadow-2xl transition-all">
      {/* 1. Neon Scrubber Bar with Scene Flags */}
      <div className="flex flex-col gap-1.5">
        <div className="relative w-full h-4 group cursor-pointer flex items-center">
          {/* Track background */}
          <div className="w-full h-2.5 bg-slate-800/80 rounded-full overflow-hidden relative border border-white/5">
            {/* Filled glowing progress */}
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 shadow-[0_0_12px_rgba(56,189,248,0.5)] transition-all duration-75 relative"
              style={{ width: `${progressPercent}%` }}
            >
              <span className="absolute right-0 top-0 bottom-0 w-2 bg-white/80 rounded-full shadow-[0_0_8px_white]" />
            </div>
          </div>

          {/* Chapter divider ticks */}
          {sceneOffsets.map((offset, i) => {
            if (i === 0) return null;
            const leftPct = (offset.start / totalDuration) * 100;
            const isPassed = currentTime >= offset.start;
            return (
              <div
                key={i}
                className={`absolute top-0 bottom-0 w-[2px] pointer-events-none transition-colors ${
                  isPassed ? 'bg-cyan-400/80 shadow-[0_0_6px_rgba(56,189,248,0.8)]' : 'bg-slate-700'
                }`}
                style={{ left: `${leftPct}%` }}
              />
            );
          })}

          {/* Hidden range input */}
          <input
            type="range"
            min={0}
            max={totalDuration || 100}
            step={0.1}
            value={currentTime}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            title="Drag to seek anywhere in timeline"
          />
        </div>

        {/* Timestamps & Active Scene Chip */}
        <div className="flex justify-between items-center text-xs font-semibold px-0.5">
          <span className="font-mono text-cyan-400 tabular-nums">{formatTime(currentTime)}</span>
          <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[11px]">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span className="truncate max-w-[220px] sm:max-w-[340px]">
              Scene {currentSceneIndex + 1}/{scenes.length}: {scenes[currentSceneIndex]?.title}
            </span>
          </div>
          <span className="font-mono text-slate-400 tabular-nums">{formatTime(totalDuration)}</span>
        </div>
      </div>

      {/* 2. Main Playback Controls Dock */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/5">
        {/* Left Playback Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRestart}
            className="p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-2xl transition"
            title="Restart Lesson (0:00)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSkip(-5)}
            className="p-2.5 text-slate-400 hover:text-cyan-400 hover:bg-white/10 rounded-2xl transition flex items-center gap-1 text-xs"
            title="Rewind 5 seconds"
          >
            <Rewind className="w-4 h-4" />
            <span className="hidden sm:inline font-mono">-5s</span>
          </button>

          {/* Primary Glow Play/Pause Button */}
          <button
            onClick={onTogglePlay}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(56,189,248,0.35)] transition transform active:scale-95 text-xs sm:text-sm tracking-wide"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>{currentTime >= totalDuration ? 'Replay' : 'Play Lesson'}</span>
              </>
            )}
          </button>

          <button
            onClick={() => onSkip(5)}
            className="p-2.5 text-slate-400 hover:text-cyan-400 hover:bg-white/10 rounded-2xl transition flex items-center gap-1 text-xs"
            title="Forward 5 seconds"
          >
            <span className="hidden sm:inline font-mono">+5s</span>
            <FastForward className="w-4 h-4" />
          </button>
        </div>

        {/* Right Dock: Voice & Speed Selector */}
        <div className="flex items-center gap-2.5">
          {/* Voice Narration Pill */}
          <button
            onClick={onToggleMute}
            className={`px-3 py-1.5 rounded-2xl transition flex items-center gap-1.5 text-xs font-semibold border ${
              isMuted
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
            }`}
            title={isMuted ? 'Unmute Tutor Voice' : 'Mute Tutor Voice'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Voice Narration'}</span>
          </button>

          {/* Rate Selector */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-2xl border border-white/5 text-xs font-bold">
            {[0.75, 1, 1.25, 1.5].map((rate) => (
              <button
                key={rate}
                onClick={() => onChangeRate(rate)}
                className={`px-2.5 py-1 rounded-xl transition ${
                  playbackRate === rate
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Scene Chapter Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar border-t border-white/5">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          Scenes:
        </span>
        {scenes.map((scene, idx) => {
          const isActive = idx === currentSceneIndex;
          const isFinished = sceneOffsets[idx] && currentTime >= sceneOffsets[idx].end;
          return (
            <button
              key={scene.id}
              onClick={() => onJumpScene(idx)}
              className={`shrink-0 px-3.5 py-1.5 rounded-2xl text-xs font-medium transition flex items-center gap-2 border ${
                isActive
                  ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.2)]'
                  : isFinished
                  ? 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  : 'bg-slate-800/30 border-slate-700/30 text-slate-400 hover:bg-slate-800/60'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isActive
                    ? 'bg-cyan-400 animate-pulse'
                    : isFinished
                    ? 'bg-emerald-400'
                    : 'bg-slate-600'
                }`}
              />
              <span className="truncate max-w-[140px]">
                {idx + 1}. {scene.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
