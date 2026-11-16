'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageSquare, BookOpen, Sparkles, Loader2, ListOrdered, CheckCircle2 } from 'lucide-react';
import { ChatMessage, LessonScene } from '@/types/lesson';

interface ChatTutorProps {
  topic: string;
  lessonTitle: string;
  currentScene: LessonScene | null;
  scenes?: LessonScene[];
  suggestedQuestions: string[];
  activeNarration?: string;
  onJumpToScene?: (index: number) => void;
}

export const ChatTutor: React.FC<ChatTutorProps> = ({
  topic,
  lessonTitle,
  currentScene,
  scenes = [],
  suggestedQuestions,
  activeNarration,
  onJumpToScene
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'transcript' | 'curriculum'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'tutor',
      text: `Welcome! I'm your AI Whiteboard Tutor. As you watch the whiteboard lesson, feel free to ask questions about the diagrams, equations, or time complexity at any time!`,
      timestamp: 'Just now'
    }
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (questionToSend?: string) => {
    const q = (questionToSend || inputQuestion).trim();
    if (!q || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          lessonTitle,
          sceneTitle: currentScene?.title,
          question: q,
          chatHistory: messages
        })
      });

      if (!res.ok) throw new Error('Failed to fetch tutor response');

      const data = await res.json();
      const tutorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'tutor',
        text: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sceneRef: currentScene?.id
      };
      setMessages((prev) => [...prev, tutorMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'tutor',
        text: "I'm having a brief connection delay, but feel free to review the whiteboard steps or try asking again in a moment!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col h-[540px] md:h-[620px] rounded-3xl bg-slate-900/85 dark:bg-slate-950/90 text-white backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden transition-all">
      {/* 1. Header with Multi-Tab Switcher */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10 bg-slate-900/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/25">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold tracking-wide text-white flex items-center gap-1.5">
              <span>AI Tutor Studio</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </h3>
            <p className="text-[10px] text-slate-400">Context-Aware Pedagogical Assistant</p>
          </div>
        </div>

        {/* Tab switch pills */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-2xl border border-white/5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1 rounded-xl flex items-center gap-1.5 transition ${
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat</span>
          </button>
          <button
            onClick={() => setActiveTab('transcript')}
            className={`px-3 py-1 rounded-xl flex items-center gap-1.5 transition ${
              activeTab === 'transcript'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Voice Script</span>
          </button>
          <button
            onClick={() => setActiveTab('curriculum')}
            className={`px-3 py-1 rounded-xl flex items-center gap-1.5 transition ${
              activeTab === 'curriculum'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Curriculum</span>
          </button>
        </div>
      </div>

      {/* 2. Tab Contents */}
      {activeTab === 'chat' ? (
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-700">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'tutor' && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center shrink-0 text-xs shadow-md">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-tr-none shadow-md shadow-cyan-600/15'
                      : 'bg-slate-800/80 text-slate-100 rounded-tl-none border border-white/10'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span
                    className={`block mt-1 text-[10px] ${
                      msg.sender === 'user' ? 'text-cyan-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-slate-700 text-slate-200 flex items-center justify-center shrink-0 text-xs">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center shrink-0 text-xs animate-pulse">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-slate-800/80 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2 text-xs text-slate-400 border border-white/5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                  <span>Tutor is formulating pedagogical answer...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts Horizontal Slider */}
          {suggestedQuestions && suggestedQuestions.length > 0 && (
            <div className="px-3 py-2 bg-slate-900/60 border-t border-white/5">
              <div className="flex items-center gap-1.5 mb-1.5 text-[11px] font-bold text-slate-400">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>Suggested Follow-ups:</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="shrink-0 text-left text-xs bg-slate-800/80 text-slate-200 hover:text-cyan-300 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-white/5 hover:border-cyan-500/40 transition shadow-sm"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Chat Input */}
          <div className="p-3 border-t border-white/10 bg-slate-900/80">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                placeholder="Ask anything about this whiteboard lesson..."
                className="flex-1 bg-slate-800/80 text-white placeholder:text-slate-400 px-4 py-2.5 rounded-2xl text-xs sm:text-sm border border-white/10 focus:border-cyan-400 outline-none transition"
              />
              <button
                type="submit"
                disabled={!inputQuestion.trim() || isLoading}
                className="p-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-90 disabled:opacity-40 text-white rounded-2xl transition shadow-md shadow-cyan-500/20"
                title="Send Question"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      ) : activeTab === 'transcript' ? (
        /* Live Voice Narration Transcript Tab */
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Current Spoken Audio Transcript:</span>
            </div>
            <p className="text-sm text-slate-200 italic leading-relaxed">
              &ldquo;{activeNarration || currentScene?.narration || 'No active narration.'}&rdquo;
            </p>
          </div>

          {currentScene?.keyConcept && (
            <div className="p-4 rounded-2xl bg-slate-800/70 border border-white/5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Key Pedagogical Concept
              </h4>
              <p className="text-sm text-slate-200 font-medium leading-relaxed">{currentScene.keyConcept}</p>
            </div>
          )}

          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-white/5 text-xs text-slate-400 leading-relaxed">
            <span className="font-bold text-slate-300 block mb-1">Timeline & Voice Synchronization:</span>
            As the tutor speaks, every diagram, pointer, equation, and badge renders at that exact timestamp. Scrubbing the progress bar below recalculates both audio and whiteboard visuals instantly.
          </div>
        </div>
      ) : (
        /* Full Curriculum Scene List Tab */
        <div className="flex-1 p-4 overflow-y-auto space-y-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
            Lesson Scenes ({scenes.length} steps):
          </div>
          {scenes.map((scene, idx) => {
            const isCurrent = scene.id === currentScene?.id;
            return (
              <button
                key={scene.id}
                onClick={() => onJumpToScene && onJumpToScene(idx)}
                className={`w-full text-left p-3 rounded-2xl border transition flex items-start gap-3 ${
                  isCurrent
                    ? 'bg-cyan-500/15 border-cyan-400/40 text-cyan-200 shadow-md'
                    : 'bg-slate-800/50 border-white/5 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="w-6 h-6 rounded-xl bg-slate-700/80 flex items-center justify-center shrink-0 text-xs font-mono font-bold text-cyan-400">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold truncate">{scene.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{scene.keyConcept || scene.narration}</p>
                </div>
                <span className="text-[10px] font-mono font-semibold text-slate-500 shrink-0">
                  ~{scene.duration}s
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
