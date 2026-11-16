'use client';

import React, { useState, useEffect } from 'react';
import { WhiteboardCanvas } from '@/components/WhiteboardCanvas';
import { LessonControls } from '@/components/LessonControls';
import { ChatTutor } from '@/components/ChatTutor';
import { TopicSelector } from '@/components/TopicSelector';
import { useLessonPlayer } from '@/lib/useLessonPlayer';
import { Lesson } from '@/types/lesson';
import { SAMPLE_LESSONS } from '@/lib/sampleLessons';
import confetti from 'canvas-confetti';
import {
  GraduationCap,
  Sparkles,
  GitBranch,
  ExternalLink,
  Award,
  Clock
} from 'lucide-react';

export default function Home() {
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(SAMPLE_LESSONS['binary-search']);
  const [isLoadingLesson, setIsLoadingLesson] = useState(false);
  const [isDarkBoard, setIsDarkBoard] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Core lesson player hook
  const {
    isPlaying,
    currentTime,
    totalDuration,
    currentSceneIndex,
    currentScene,
    sceneElapsedTime,
    playbackRate,
    isMuted,
    sceneOffsets,
    pause,
    togglePlay,
    seekTo,
    jumpScene,
    skip,
    restart,
    setPlaybackRate,
    toggleMute
  } = useLessonPlayer(currentLesson);

  // Trigger celebration confetti when reaching end of lesson
  useEffect(() => {
    if (totalDuration > 0 && currentTime >= totalDuration - 0.5) {
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }, [currentTime, totalDuration]);

  // Load a topic (via Gemini API or fallback)
  const handleSelectTopic = async (topic: string) => {
    setIsLoadingLesson(true);
    setStatusMessage(null);
    pause();

    const lower = topic.toLowerCase();
    if (lower.includes('binary search')) {
      setCurrentLesson(SAMPLE_LESSONS['binary-search']);
      setStatusMessage('Loaded flagship lesson: Binary Search Algorithm');
      setIsLoadingLesson(false);
      return;
    }
    if (lower.includes('neural')) {
      setCurrentLesson(SAMPLE_LESSONS['neural-networks']);
      setStatusMessage('Loaded flagship lesson: Neural Networks & Backprop');
      setIsLoadingLesson(false);
      return;
    }
    if (lower.includes('tcp') || lower.includes('handshake')) {
      setCurrentLesson(SAMPLE_LESSONS['tcp-handshake']);
      setStatusMessage('Loaded flagship lesson: TCP Three-Way Handshake');
      setIsLoadingLesson(false);
      return;
    }
    if (lower.includes('photosynthesis')) {
      setCurrentLesson(SAMPLE_LESSONS['photosynthesis']);
      setStatusMessage('Loaded flagship lesson: Photosynthesis in Plants');
      setIsLoadingLesson(false);
      return;
    }
    if (lower.includes('pythagor')) {
      setCurrentLesson(SAMPLE_LESSONS['pythagorean-theorem']);
      setStatusMessage('Loaded flagship lesson: Pythagorean Theorem');
      setIsLoadingLesson(false);
      return;
    }

    try {
      const res = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });

      if (!res.ok) {
        throw new Error(`API returned status ${res.status}`);
      }

      const data = await res.json();
      if (data.lesson) {
        setCurrentLesson(data.lesson);
        if (data.warning) {
          setStatusMessage(data.warning);
        } else {
          setStatusMessage(`Live AI Generation with ${data.modelUsed || 'Gemini'}: "${data.lesson.title}"`);
        }
      }
    } catch (err: unknown) {
      console.error('Failed to generate lesson:', err);
      const fallback = SAMPLE_LESSONS['binary-search'];
      setCurrentLesson(fallback);
      setStatusMessage('Connected to offline backup curriculum.');
    } finally {
      setIsLoadingLesson(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Ambient Radial Neon Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-indigo-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* 1. Futuristic Glassmorphic Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#050811]/85 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Project Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-300 bg-clip-text text-transparent">
                  Braynix Whiteboard Tutor
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                  Gemini Synced
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Technical Assignment Demo • Nikhil Jangid</p>
            </div>
          </div>

          {/* Right Header Navigation */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/nikhiljangid120/ai-whiteboard-tutor"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 transition shadow-sm"
            >
              <GitBranch className="w-4 h-4 text-cyan-400" />
              <span>GitHub Repo</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>
      </header>

      {/* Status banner */}
      {statusMessage && (
        <div className="bg-gradient-to-r from-cyan-950/60 via-indigo-950/60 to-slate-950/60 border-b border-cyan-500/30 py-2.5 px-4 text-center text-xs font-semibold text-cyan-300 flex items-center justify-center gap-2 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>{statusMessage}</span>
          <button
            onClick={() => setStatusMessage(null)}
            className="ml-3 text-cyan-400 hover:text-white underline text-[11px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-8 flex-1">
        {/* Topic Input Search bar / Hero section */}
        <TopicSelector
          onSelectTopic={handleSelectTopic}
          isLoading={isLoadingLesson}
          currentTopic={currentLesson?.topic}
        />

        {/* Active Lesson Stage */}
        {currentLesson && (
          <section className="flex flex-col gap-4">
            {/* Lesson Title Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-5 rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-white/10 shadow-2xl">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 mb-1">
                  <span className="uppercase tracking-wider">Lesson Subject:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-semibold">
                    {currentLesson.topic}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {currentLesson.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
                  {currentLesson.overview}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-2xl bg-slate-800/80 border border-white/10 text-slate-300 text-xs font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  ~{Math.round(totalDuration)}s Lesson
                </span>
                <span className="px-3 py-1.5 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  {currentLesson.scenes.length} Scenes
                </span>
              </div>
            </div>

            {/* Grid: Whiteboard + Player Controls on Left, AI Tutor Chat on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (Whiteboard Canvas & Controls) */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                {/* Whiteboard Canvas */}
                <WhiteboardCanvas
                  currentScene={currentScene}
                  sceneElapsedTime={sceneElapsedTime}
                  isPlaying={isPlaying}
                  isDarkBoard={isDarkBoard}
                  onToggleDarkBoard={() => setIsDarkBoard(!isDarkBoard)}
                />

                {/* Lesson Playback & Timeline Controls */}
                <LessonControls
                  isPlaying={isPlaying}
                  currentTime={currentTime}
                  totalDuration={totalDuration}
                  currentSceneIndex={currentSceneIndex}
                  scenes={currentLesson.scenes}
                  sceneOffsets={sceneOffsets}
                  playbackRate={playbackRate}
                  isMuted={isMuted}
                  onTogglePlay={togglePlay}
                  onSeek={seekTo}
                  onSkip={skip}
                  onRestart={restart}
                  onJumpScene={jumpScene}
                  onChangeRate={setPlaybackRate}
                  onToggleMute={toggleMute}
                />
              </div>

              {/* Right Column (AI Tutor Multi-Tab Studio Assistant) */}
              <div className="lg:col-span-4 flex flex-col">
                <ChatTutor
                  topic={currentLesson.topic}
                  lessonTitle={currentLesson.title}
                  currentScene={currentScene}
                  scenes={currentLesson.scenes}
                  suggestedQuestions={currentLesson.suggestedQuestions}
                  activeNarration={currentScene?.narration}
                  onJumpToScene={jumpScene}
                />
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-white/10 bg-[#050811]/90 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-white">
              Braynix Studios Technical Assignment
            </span>
            <span>• Submitted by Nikhil Jangid (<a href="mailto:nikhiljangid343@gmail.com" className="hover:text-cyan-400 underline">nikhiljangid343@gmail.com</a>)</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500">
            <span>Next.js 14</span>
            <span>•</span>
            <span>TypeScript</span>
            <span>•</span>
            <span>HTML5 Canvas</span>
            <span>•</span>
            <span>Google Gemini 3.6</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
