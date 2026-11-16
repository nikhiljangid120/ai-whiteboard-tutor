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
  Sun,
  Moon,
  ExternalLink,
  Award
} from 'lucide-react';

export default function Home() {
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(SAMPLE_LESSONS['binary-search']);
  const [isLoadingLesson, setIsLoadingLesson] = useState(false);
  const [isDarkBoard, setIsDarkBoard] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
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
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [currentTime, totalDuration]);

  // Load a topic (via Gemini API or fallback)
  const handleSelectTopic = async (topic: string) => {
    setIsLoadingLesson(true);
    setStatusMessage(null);
    pause();

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
          setStatusMessage(`Generated live with Gemini AI: "${data.lesson.title}"`);
        }
      }
    } catch (err: unknown) {
      console.error('Failed to generate lesson:', err);
      // Fallback to sample lesson
      const fallback = SAMPLE_LESSONS['binary-search'];
      setCurrentLesson(fallback);
      setStatusMessage('Connected to offline curriculum backup.');
    } finally {
      setIsLoadingLesson(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* 1. Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Project Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  Braynix Whiteboard Tutor
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  <Sparkles className="w-2.5 h-2.5 text-indigo-500" />
                  AI Sync
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Technical Assignment Demo</p>
            </div>
          </div>

          {/* Right Header Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
              title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <a
              href="https://github.com/Braynix-Studios/ai-whiteboard-tutor-assignment"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <GitBranch className="w-4 h-4 text-indigo-500" />
              <span>Assignment Spec</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>
      </header>

      {/* Status or notification toast banner */}
      {statusMessage && (
        <div className="bg-indigo-50 dark:bg-indigo-950/60 border-b border-indigo-100 dark:border-indigo-900 py-2 px-4 text-center text-xs font-medium text-indigo-800 dark:text-indigo-300 flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>{statusMessage}</span>
          <button
            onClick={() => setStatusMessage(null)}
            className="ml-3 text-indigo-500 hover:text-indigo-800 underline text-[11px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-8">
        {/* Topic Input Search bar / Hero section */}
        <TopicSelector
          onSelectTopic={handleSelectTopic}
          isLoading={isLoadingLesson}
          currentTopic={currentLesson?.topic}
        />

        {/* Active Lesson Section */}
        {currentLesson && (
          <section className="flex flex-col gap-4">
            {/* Lesson Title Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-0.5">
                  <span className="uppercase tracking-wider">Lesson Topic:</span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300">
                    {currentLesson.topic}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {currentLesson.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  {currentLesson.overview}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                  ⏱ ~{Math.round(totalDuration)}s Interactive
                </span>
                <span className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  Step-by-step
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

              {/* Right Column (AI Tutor Chat & Narration Transcript) */}
              <div className="lg:col-span-4 flex flex-col">
                <ChatTutor
                  topic={currentLesson.topic}
                  lessonTitle={currentLesson.title}
                  currentScene={currentScene}
                  suggestedQuestions={currentLesson.suggestedQuestions}
                  activeNarration={currentScene?.narration}
                />
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Braynix Studios Technical Assignment
            </span>
            <span>• Submitted by Nikhil Jangid</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Next.js 14 • TypeScript • Tailwind CSS • Google Gemini AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
