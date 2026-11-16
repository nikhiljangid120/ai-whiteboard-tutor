'use client';

import React, { useState } from 'react';
import { Search, Sparkles, BookOpen, Layers, Zap, ArrowRight, Loader2, Network, Dna, BrainCircuit } from 'lucide-react';

interface TopicSelectorProps {
  onSelectTopic: (topic: string) => void;
  isLoading: boolean;
  currentTopic?: string;
}

const FEATURED_TOPICS = [
  {
    title: 'Binary Search Algorithm',
    category: 'Algorithms',
    icon: Layers,
    badge: 'Popular',
    desc: 'O(log N) divide-and-conquer search with visual pointers and search-space halving',
    tagColor: 'from-cyan-500 to-blue-500'
  },
  {
    title: 'How Neural Networks Learn',
    category: 'AI & Deep Learning',
    icon: BrainCircuit,
    badge: 'Deep Tech',
    desc: 'Weights, biases, activation functions, loss, and gradient descent backpropagation',
    tagColor: 'from-purple-500 to-indigo-500'
  },
  {
    title: 'TCP Three-Way Handshake',
    category: 'Systems & Networks',
    icon: Network,
    badge: 'Networking',
    desc: 'SYN, SYN-ACK, and ACK reliable connection establishment protocol',
    tagColor: 'from-emerald-500 to-teal-500'
  },
  {
    title: 'Photosynthesis in Plants',
    category: 'Biology',
    icon: Dna,
    badge: 'Cell Biology',
    desc: 'Light-dependent and Calvin cycle reactions inside chloroplast cells',
    tagColor: 'from-amber-500 to-emerald-500'
  },
  {
    title: 'Pythagorean Theorem',
    category: 'Mathematics',
    icon: BookOpen,
    badge: 'Visual Proof',
    desc: 'a² + b² = c² geometric square areas, proofs, and 3-4-5 integer triples',
    tagColor: 'from-rose-500 to-purple-500'
  },
  {
    title: 'QuickSort Algorithm',
    category: 'Algorithms',
    icon: Zap,
    badge: 'Sorting',
    desc: 'Pivot selection, partition algorithm, recursion tree, and worst-case analysis',
    tagColor: 'from-blue-500 to-cyan-500'
  }
];

export const TopicSelector: React.FC<TopicSelectorProps> = ({
  onSelectTopic,
  isLoading,
  currentTopic
}) => {
  const [topicInput, setTopicInput] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topicInput.trim() && !isLoading) {
      onSelectTopic(topicInput.trim());
    }
  };

  const categories = ['All', 'Algorithms', 'AI & Deep Learning', 'Systems & Networks', 'Biology', 'Mathematics'];

  const filteredTopics = activeCategory === 'All'
    ? FEATURED_TOPICS
    : FEATURED_TOPICS.filter((t) => t.category === activeCategory);

  return (
    <div className="w-full flex flex-col items-center max-w-5xl mx-auto px-4 py-8 text-center">
      {/* Top Status Pill */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 text-white border border-white/10 shadow-lg text-xs font-semibold mb-5 backdrop-blur-xl">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent font-bold">
          Braynix Studios • AI Whiteboard Tutor
        </span>
        <span className="text-slate-500 font-normal">|</span>
        <span className="text-slate-300">Synchronized Voice & Canvas</span>
      </div>

      {/* Main Hero Header */}
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-4">
        Learn Any Concept Through{' '}
        <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Live Whiteboard & Voice
        </span>
      </h1>
      <p className="text-sm sm:text-base text-slate-300 max-w-2xl mb-8 leading-relaxed font-normal">
        Type any subject. Our AI tutor will synthesize an interactive ~2-minute lesson with step-by-step whiteboard drawings and synchronized voice narration.
      </p>

      {/* Glassmorphic Search Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-2xl mb-8">
        <div className="relative flex items-center shadow-2xl rounded-3xl overflow-hidden border border-white/15 bg-slate-900/85 backdrop-blur-2xl transition focus-within:border-cyan-400/80 focus-within:ring-2 focus-within:ring-cyan-500/20">
          <div className="pl-5 pr-2 text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            disabled={isLoading}
            placeholder="Type any topic (e.g. Dijkstra, Black Holes, Photosynthesis, Neural Networks)..."
            className="w-full py-4 px-2 text-sm sm:text-base text-white bg-transparent outline-none placeholder:text-slate-500 font-medium"
          />
          <div className="pr-2.5">
            <button
              type="submit"
              disabled={!topicInput.trim() || isLoading}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:opacity-90 disabled:opacity-40 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition transform active:scale-95"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing...</span>
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

        {/* Loading Step Feedback */}
        {isLoading && (
          <div className="mt-4 p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 flex items-center justify-center gap-3 text-xs sm:text-sm text-cyan-300 animate-pulse shadow-lg">
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            <span>AI Tutor is drafting structured curriculum, visual scenes & synchronized script...</span>
          </div>
        )}
      </form>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-center gap-2 flex-wrap mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition border ${
              activeCategory === cat
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/60 text-slate-400 border-white/5 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Topic Grid */}
      <div className="w-full text-left">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Curated Flagship Interactive Lessons:
          </span>
          {currentTopic && (
            <span className="text-xs text-cyan-400 font-medium">Currently viewing: {currentTopic}</span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredTopics.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => onSelectTopic(item.title)}
                disabled={isLoading}
                className="group relative p-4 rounded-2xl text-left bg-slate-900/80 hover:bg-slate-900 text-white border border-white/10 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-slate-400">{item.category}</span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-cyan-300 border border-white/10">
                      {item.badge}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition">
                      <Icon className="w-4 h-4 shrink-0" />
                    </div>
                    <span>{item.title}</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">{item.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
