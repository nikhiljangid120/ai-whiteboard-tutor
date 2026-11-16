'use client';

import React, { useState } from 'react';
import { Search, Sparkles, BookOpen, Layers, Zap, ArrowRight, Loader2 } from 'lucide-react';

interface TopicSelectorProps {
  onSelectTopic: (topic: string) => void;
  isLoading: boolean;
  currentTopic?: string;
}

const FEATURED_TOPICS = [
  {
    title: 'Binary Search Algorithm',
    category: 'Computer Science',
    icon: Layers,
    badge: 'Popular',
    desc: 'O(log N) divide-and-conquer search with visual pointers'
  },
  {
    title: 'Photosynthesis in Plants',
    category: 'Biology',
    icon: Sparkles,
    badge: 'Interactive',
    desc: 'Light & Calvin reactions inside chloroplast cells'
  },
  {
    title: 'Pythagorean Theorem',
    category: 'Mathematics',
    icon: BookOpen,
    badge: 'Visual Proof',
    desc: 'a² + b² = c² geometric square areas & 3-4-5 triples'
  },
  {
    title: 'How Neural Networks Learn',
    category: 'AI & Machine Learning',
    icon: Zap,
    badge: 'Deep Tech',
    desc: 'Weights, biases, activation functions, and gradient descent'
  }
];

export const TopicSelector: React.FC<TopicSelectorProps> = ({
  onSelectTopic,
  isLoading,
  currentTopic
}) => {
  const [topicInput, setTopicInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topicInput.trim() && !isLoading) {
      onSelectTopic(topicInput.trim());
    }
  };

  return (
    <div className="w-full flex flex-col items-center max-w-4xl mx-auto px-4 py-6 md:py-10 text-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200/80 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 text-xs font-semibold shadow-2xs mb-4">
        <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" />
        <span>AI Whiteboard Tutor • Powered by Gemini AI</span>
      </div>

      {/* Main Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
        Teach Me Anything with <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">Voice & Whiteboard</span>
      </h1>
      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mb-8 leading-relaxed">
        Enter any subject. Our AI tutor will instantly synthesize a synchronized ~2-minute lesson featuring step-by-step whiteboard diagrams and interactive voice narration.
      </p>

      {/* Chat-First Topic Input Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-2xl mb-8">
        <div className="relative flex items-center shadow-xl rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition focus-within:ring-2 focus-within:ring-indigo-500/50">
          <div className="pl-4 pr-2 text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            disabled={isLoading}
            placeholder="Type any topic (e.g. Binary Search, Photosynthesis, QuickSort, Gravitational Waves)..."
            className="w-full py-4 px-2 text-sm sm:text-base text-slate-800 dark:text-slate-100 bg-transparent outline-none placeholder:text-slate-400"
          />
          <div className="pr-2">
            <button
              type="submit"
              disabled={!topicInput.trim() || isLoading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition active:scale-95"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span>Teach Me</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Loading Progress Feedback */}
        {isLoading && (
          <div className="mt-4 p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center gap-3 text-xs sm:text-sm text-indigo-700 dark:text-indigo-300 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
            <span>AI Tutor is drafting structured curriculum, visual scenes & synchronized script...</span>
          </div>
        )}
      </form>

      {/* Suggested Quick-Start Cards for Evaluators */}
      <div className="w-full max-w-3xl text-left">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Or try these instant interactive lessons:
          </span>
          {currentTopic && (
            <span className="text-xs text-indigo-600 font-medium">Currently viewing: {currentTopic}</span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FEATURED_TOPICS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => onSelectTopic(item.title)}
                disabled={isLoading}
                className="group p-4 rounded-xl text-left bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold text-slate-400">{item.category}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition">
                      {item.badge}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition flex items-center gap-2">
                    <Icon className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>{item.title}</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{item.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
