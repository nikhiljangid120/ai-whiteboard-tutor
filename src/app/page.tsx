'use client';

import React, { useState, useEffect, useRef } from 'react';
import { WhiteboardCanvas } from '@/components/WhiteboardCanvas';
import { LessonControls } from '@/components/LessonControls';
import { ChatTutor } from '@/components/ChatTutor';
import { TopicSelector } from '@/components/TopicSelector';
import { useLessonPlayer } from '@/lib/useLessonPlayer';
import { Lesson, LessonScene } from '@/types/lesson';
import { SAMPLE_LESSONS } from '@/lib/sampleLessons';
import confetti from 'canvas-confetti';
import {
  GraduationCap,
  Sparkles,
  GitBranch,
  ExternalLink,
  Award,
  Clock,
  Search,
  ArrowRight,
  Loader2,
  Compass,
  Tv
} from 'lucide-react';

const QUICK_TOPICS = [
  'TypeScript',
  'Binary Search',
  'Neural Networks',
  'TCP Handshake',
  'Photosynthesis',
  'Pythagorean Theorem'
];

export default function Home() {
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(SAMPLE_LESSONS['binary-search']);
  const [isLoadingLesson, setIsLoadingLesson] = useState(false);
  const [isDarkBoard, setIsDarkBoard] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'studio' | 'explore'>('studio');
  const [headerSearchInput, setHeaderSearchInput] = useState('');
  const [streamingProgress, setStreamingProgress] = useState<string | null>(null);

  const activeEventSourceRef = useRef<EventSource | null>(null);

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

  // Clean up any open EventSource on unmount
  useEffect(() => {
    return () => {
      if (activeEventSourceRef.current) {
        activeEventSourceRef.current.close();
      }
    };
  }, []);

  // Load a topic with real-time SSE streaming or fast curated match
  const handleSelectTopic = async (topic: string) => {
    if (!topic.trim()) return;
    const cleanTopic = topic.trim();
    const lower = cleanTopic.toLowerCase();

    // Close any previous stream
    if (activeEventSourceRef.current) {
      activeEventSourceRef.current.close();
      activeEventSourceRef.current = null;
    }

    pause();
    setIsLoadingLesson(true);
    setStatusMessage(null);
    setStreamingProgress(null);
    setViewMode('studio');

    // 1. Instant Curated Flagship Matches (0ms latency)
    if (lower.includes('typescript')) {
      setCurrentLesson(SAMPLE_LESSONS['typescript']);
      setStatusMessage('Loaded flagship lesson: TypeScript Superpowers (Instant)');
      setIsLoadingLesson(false);
      return;
    }
    if (lower.includes('binary search') || (lower.includes('binary') && !lower.includes('tree'))) {
      setCurrentLesson(SAMPLE_LESSONS['binary-search']);
      setStatusMessage('Loaded flagship lesson: Binary Search Algorithm (Instant)');
      setIsLoadingLesson(false);
      return;
    }
    if (lower.includes('neural') || lower.includes('backprop')) {
      setCurrentLesson(SAMPLE_LESSONS['neural-networks']);
      setStatusMessage('Loaded flagship lesson: Neural Networks & Backprop (Instant)');
      setIsLoadingLesson(false);
      return;
    }
    if (lower.includes('tcp') || lower.includes('handshake')) {
      setCurrentLesson(SAMPLE_LESSONS['tcp-handshake']);
      setStatusMessage('Loaded flagship lesson: TCP Three-Way Handshake (Instant)');
      setIsLoadingLesson(false);
      return;
    }
    if (lower.includes('photosynthesis') || lower.includes('chloroplast')) {
      setCurrentLesson(SAMPLE_LESSONS['photosynthesis']);
      setStatusMessage('Loaded flagship lesson: Photosynthesis in Plants (Instant)');
      setIsLoadingLesson(false);
      return;
    }
    if (lower.includes('pythagor')) {
      setCurrentLesson(SAMPLE_LESSONS['pythagorean-theorem']);
      setStatusMessage('Loaded flagship lesson: Pythagorean Theorem (Instant)');
      setIsLoadingLesson(false);
      return;
    }

    // 2. Real-Time SSE Stream for Custom AI Topics (Starts Scene 1 in ~1.5s!)
    try {
      setStreamingProgress('Synthesizing Scene 1 in real time with Gemini...');
      const sseUrl = `/api/generate-lesson-stream?topic=${encodeURIComponent(cleanTopic)}`;
      const es = new EventSource(sseUrl);
      activeEventSourceRef.current = es;

      let partialLesson: Lesson | null = null;

      es.addEventListener('meta', (e) => {
        try {
          const meta = JSON.parse(e.data);
          partialLesson = {
            id: meta.id || `lesson-${Date.now()}`,
            topic: meta.topic || cleanTopic,
            title: meta.title || `${cleanTopic}: Visual Lesson`,
            overview: meta.overview || `Interactive whiteboard lesson on ${cleanTopic}.`,
            totalDuration: meta.totalDuration || 90,
            scenes: [],
            suggestedQuestions: []
          };
          setCurrentLesson(partialLesson);
          setStatusMessage(`Live AI Stream: Synthesizing "${partialLesson.title}"`);
        } catch (err) {
          console.error('Failed to parse SSE meta:', err);
        }
      });

      es.addEventListener('scene', (e) => {
        try {
          const scene: LessonScene = JSON.parse(e.data);
          setCurrentLesson((prev) => {
            if (!prev) {
              const newL: Lesson = {
                id: `lesson-${Date.now()}`,
                topic: cleanTopic,
                title: `${cleanTopic}: Visual Demonstration`,
                overview: `Mastering ${cleanTopic} with step-by-step whiteboard actions.`,
                totalDuration: scene.duration,
                scenes: [scene],
                suggestedQuestions: []
              };
              return newL;
            }
            if (prev.scenes.some((s) => s.id === scene.id)) {
              return prev;
            }
            const updatedScenes = [...prev.scenes, scene];
            const updatedDuration = updatedScenes.reduce((acc, s) => acc + s.duration, 0);
            return {
              ...prev,
              scenes: updatedScenes,
              totalDuration: updatedDuration
            };
          });

          setStreamingProgress(`Streamed Scene ${scene.id}: ${scene.title}`);
          // When Scene 1 arrives, dismiss the loading spinner so user can play immediately!
          if (scene.id === 1) {
            setIsLoadingLesson(false);
          }
        } catch (err) {
          console.error('Failed to parse SSE scene:', err);
        }
      });

      es.addEventListener('done', (e) => {
        try {
          const doneData = JSON.parse(e.data);
          if (doneData.suggestedQuestions) {
            setCurrentLesson((prev) =>
              prev ? { ...prev, suggestedQuestions: doneData.suggestedQuestions } : null
            );
          }
          setStatusMessage(`✓ AI Whiteboard Lesson Ready: ${cleanTopic}`);
          setStreamingProgress(null);
          setIsLoadingLesson(false);
          es.close();
          activeEventSourceRef.current = null;
        } catch (err) {
          console.error('Failed to parse SSE done:', err);
          es.close();
          activeEventSourceRef.current = null;
        }
      });

      es.onerror = (err) => {
        console.warn('SSE connection closed or error:', err);
        es.close();
        activeEventSourceRef.current = null;
        setIsLoadingLesson(false);
        setStreamingProgress(null);
      };
    } catch (err) {
      console.error('Streaming failed, calling standard API fallback:', err);
      // Fallback to standard endpoint
      try {
        const res = await fetch('/api/generate-lesson', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic: cleanTopic })
        });
        const data = await res.json();
        if (data.lesson) {
          setCurrentLesson(data.lesson);
          setStatusMessage(`Live AI Lesson Generated: "${data.lesson.title}"`);
        }
      } catch (fallbackErr) {
        console.error('Fallback error:', fallbackErr);
        setCurrentLesson(SAMPLE_LESSONS['binary-search']);
        setStatusMessage('Connected to offline backup curriculum.');
      } finally {
        setIsLoadingLesson(false);
        setStreamingProgress(null);
      }
    }
  };

  const handleHeaderSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearchInput.trim() && !isLoadingLesson) {
      handleSelectTopic(headerSearchInput.trim());
      setHeaderSearchInput('');
    }
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Ambient Radial Neon Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-indigo-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* 1. Pro Studio Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#050811]/90 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Left: Logo & Project Title */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setViewMode(viewMode === 'studio' ? 'explore' : 'studio')}
              className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25 hover:opacity-90 transition"
              title="Click to toggle Studio / Explore Mode"
            >
              <GraduationCap className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="font-black text-base tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-300 bg-clip-text text-transparent">
                  Braynix Whiteboard Tutor
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                  Gemini Synced
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Technical Assignment • Nikhil Jangid</p>
            </div>
          </div>

          {/* Center: Omnipresent Sleek Search Input */}
          <div className="flex-1 max-w-xl mx-2">
            <form onSubmit={handleHeaderSearchSubmit} className="relative flex items-center">
              <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={headerSearchInput}
                onChange={(e) => setHeaderSearchInput(e.target.value)}
                disabled={isLoadingLesson}
                placeholder="Teach me any topic (e.g. QuickSort, Docker, Quantum Computing)..."
                className="w-full py-2 pl-9 pr-24 rounded-2xl bg-slate-900/90 border border-white/15 focus:border-cyan-400/80 focus:ring-2 focus:ring-cyan-500/20 text-xs sm:text-sm text-white placeholder:text-slate-500 outline-none transition shadow-inner"
              />
              <button
                type="submit"
                disabled={!headerSearchInput.trim() || isLoadingLesson}
                className="absolute right-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-90 disabled:opacity-30 text-white font-bold text-[11px] sm:text-xs flex items-center gap-1 shadow-sm transition"
              >
                {isLoadingLesson ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <span>Teach</span>
                    <ArrowRight className="w-3 h-3" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Header Navigation */}
          <div className="flex items-center gap-2 shrink-0">
            {/* View Mode Switcher */}
            <button
              onClick={() => setViewMode(viewMode === 'studio' ? 'explore' : 'studio')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                viewMode === 'explore'
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
              title={viewMode === 'studio' ? 'Explore all topics' : 'Return to Whiteboard Studio'}
            >
              {viewMode === 'studio' ? (
                <>
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden md:inline">Topics</span>
                </>
              ) : (
                <>
                  <Tv className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden md:inline">Studio</span>
                </>
              )}
            </button>

            {/* GitHub Repo Button */}
            <a
              href="https://github.com/nikhiljangid120/ai-whiteboard-tutor"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 transition shadow-sm"
            >
              <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden lg:inline">GitHub</span>
              <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Quick Topic Chips Strip */}
        <div className="border-t border-white/5 bg-slate-950/60 px-4 sm:px-6 py-2 overflow-x-auto no-scrollbar flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            Instant Topics:
          </span>
          {QUICK_TOPICS.map((t) => {
            const isCurrent = currentLesson?.topic.toLowerCase().includes(t.toLowerCase());
            return (
              <button
                key={t}
                onClick={() => handleSelectTopic(t)}
                disabled={isLoadingLesson}
                className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium transition border ${
                  isCurrent
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-sm'
                    : 'bg-slate-900/60 border-white/5 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </header>

      {/* Streaming or Status banner */}
      {(streamingProgress || statusMessage) && (
        <div className="bg-gradient-to-r from-cyan-950/70 via-indigo-950/70 to-slate-950/70 border-b border-cyan-500/30 py-2 px-4 text-center text-xs font-semibold text-cyan-300 flex items-center justify-center gap-2 shadow-inner">
          {streamingProgress ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400 shrink-0" />
              <span>{streamingProgress}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{statusMessage}</span>
            </>
          )}
          <button
            onClick={() => {
              setStatusMessage(null);
              setStreamingProgress(null);
            }}
            className="ml-3 text-cyan-400 hover:text-white underline text-[11px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 flex flex-col gap-4 flex-1 w-full">
        {/* Explore Mode View */}
        {viewMode === 'explore' && (
          <div className="animate-in fade-in duration-200">
            <TopicSelector
              onSelectTopic={handleSelectTopic}
              isLoading={isLoadingLesson}
              currentTopic={currentLesson?.topic}
            />
          </div>
        )}

        {/* Pro Studio Mode View (Active Whiteboard Stage) */}
        {viewMode === 'studio' && currentLesson && (
          <section className="flex flex-col gap-3 flex-1">
            {/* Sleek Compact Lesson Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 sm:p-4 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-lg">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                  <span className="uppercase tracking-wider text-[10px]">Active Topic:</span>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-semibold text-[11px]">
                    {currentLesson.topic}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-black text-white mt-0.5">
                  {currentLesson.title}
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 line-clamp-1 max-w-3xl">
                  {currentLesson.overview}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2 self-start sm:self-center">
                <span className="px-2.5 py-1 rounded-xl bg-slate-800/80 border border-white/10 text-slate-300 text-[11px] font-semibold flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  ~{Math.round(totalDuration)}s
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[11px] font-semibold flex items-center gap-1.5">
                  <Award className="w-3 h-3 text-indigo-400" />
                  {currentLesson.scenes.length} Scenes
                </span>
              </div>
            </div>

            {/* Grid: Whiteboard + Player Controls on Left, AI Tutor Chat on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start flex-1">
              {/* Left Column (Whiteboard Canvas & Docked Controls) */}
              <div className="lg:col-span-8 flex flex-col gap-3">
                {/* Whiteboard Canvas */}
                <div className="w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950">
                  <WhiteboardCanvas
                    currentScene={currentScene}
                    sceneElapsedTime={sceneElapsedTime}
                    isPlaying={isPlaying}
                    isDarkBoard={isDarkBoard}
                    onToggleDarkBoard={() => setIsDarkBoard(!isDarkBoard)}
                  />
                </div>

                {/* Lesson Playback & Timeline Controls Docked Directly Under Canvas */}
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

              {/* Right Column (AI Tutor Studio Assistant) */}
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
      <footer className="mt-8 border-t border-white/10 bg-[#050811]/90 py-5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-white">
              Braynix Studios Technical Assignment
            </span>
            <span>• Nikhil Jangid (<a href="mailto:nikhiljangid343@gmail.com" className="hover:text-cyan-400 underline">nikhiljangid343@gmail.com</a>)</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500">
            <span>Next.js 14</span>
            <span>•</span>
            <span>TypeScript</span>
            <span>•</span>
            <span>SSE Real-Time Stream</span>
            <span>•</span>
            <span>HTML5 Canvas</span>
            <span>•</span>
            <span>Gemini 3.6</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
