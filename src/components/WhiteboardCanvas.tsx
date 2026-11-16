'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { WhiteboardAction, LessonScene } from '@/types/lesson';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Download,
  PenTool,
  Highlighter,
  Eraser,
  Sparkles
} from 'lucide-react';

interface AnnotationPoint {
  x: number;
  y: number;
  color: string;
  width: number;
  isHighlighter?: boolean;
}

interface WhiteboardCanvasProps {
  currentScene: LessonScene | null;
  sceneElapsedTime: number;
  isPlaying: boolean;
  isDarkBoard?: boolean;
  onToggleDarkBoard?: () => void;
  onNextScene?: () => void;
  onPrevScene?: () => void;
  currentSceneIndex?: number;
  totalScenes?: number;
}

export const WhiteboardCanvas: React.FC<WhiteboardCanvasProps> = ({
  currentScene,
  sceneElapsedTime,
  isPlaying,
  isDarkBoard = true,
  onToggleDarkBoard,
  onNextScene,
  onPrevScene,
  currentSceneIndex = 0,
  totalScenes = 1
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Pan & Zoom
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Interactive Learner Drawing Mode
  const [activeTool, setActiveTool] = useState<'cursor' | 'pen' | 'highlighter' | 'laser'>('cursor');
  const [penColor, setPenColor] = useState<string>('#38bdf8'); // Cyan default
  const [userStrokes, setUserStrokes] = useState<AnnotationPoint[][]>([]);
  const [currentStroke, setCurrentStroke] = useState<AnnotationPoint[]>([]);
  const [laserPos, setLaserPos] = useState<{ x: number; y: number } | null>(null);

  const VIRTUAL_WIDTH = 800;
  const VIRTUAL_HEIGHT = 450;

  // Soundwave animation frame counter
  const animTickRef = useRef<number>(0);

  // Canvas Drawing Routine
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    animTickRef.current += 1;
    const tick = animTickRef.current;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Background Styling (Studio Obsidian Dark vs Crisp Modern White)
    const bgColor = isDarkBoard ? '#090d16' : '#ffffff';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Subtle Radial Ambient Glow in Dark Mode
    if (isDarkBoard) {
      const gradient = ctx.createRadialGradient(
        width / 2,
        height * 0.25,
        20,
        width / 2,
        height * 0.25,
        width * 0.65
      );
      gradient.addColorStop(0, 'rgba(56, 189, 248, 0.07)');
      gradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.04)');
      gradient.addColorStop(1, 'rgba(9, 13, 22, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }

    // Modern Studio Grid (Subtle Crosshair / Dots)
    const dotSpacing = 28 * zoom;
    const offsetX = (pan.x * zoom) % dotSpacing;
    const offsetY = (pan.y * zoom) % dotSpacing;

    ctx.fillStyle = isDarkBoard ? 'rgba(148, 163, 184, 0.08)' : 'rgba(148, 163, 184, 0.2)';
    for (let x = offsetX; x < width; x += dotSpacing) {
      for (let y = offsetY; y < height; y += dotSpacing) {
        ctx.beginPath();
        ctx.arc(x, y, 1.2 * Math.min(zoom, 1.4), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Coordinate mapping from virtual 800x450
    const baseScale = Math.min(width / VIRTUAL_WIDTH, height / VIRTUAL_HEIGHT);
    const finalScale = baseScale * zoom;
    const originX = (width - VIRTUAL_WIDTH * finalScale) / 2 + pan.x;
    const originY = (height - VIRTUAL_HEIGHT * finalScale) / 2 + pan.y;

    ctx.save();
    ctx.translate(originX, originY);
    ctx.scale(finalScale, finalScale);

    // Render Scene Actions
    if (currentScene && currentScene.actions) {
      currentScene.actions.forEach((action) => {
        if (action.timeOffset > sceneElapsedTime) return;

        const age = sceneElapsedTime - action.timeOffset;
        const progress = Math.min(age / 0.35, 1);

        ctx.save();
        ctx.globalAlpha = progress;
        renderAction(ctx, action, isDarkBoard, progress, tick);
        ctx.restore();
      });
    } else {
      ctx.fillStyle = isDarkBoard ? '#64748b' : '#94a3b8';
      ctx.font = '500 18px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Select any topic above to launch your AI Whiteboard session', VIRTUAL_WIDTH / 2, VIRTUAL_HEIGHT / 2);
    }

    // Render User Annotations (Pen & Highlighter)
    const allStrokes = currentStroke.length > 0 ? [...userStrokes, currentStroke] : userStrokes;
    allStrokes.forEach((stroke) => {
      if (stroke.length < 2) return;
      ctx.save();
      const first = stroke[0];
      ctx.strokeStyle = first.color;
      ctx.lineWidth = first.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      if (first.isHighlighter) {
        ctx.globalAlpha = 0.35;
      }
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i].x, stroke[i].y);
      }
      ctx.stroke();
      ctx.restore();
    });

    // Render Laser Pointer
    if (laserPos && activeTool === 'laser') {
      ctx.save();
      const pulse = 1 + Math.sin(tick * 0.15) * 0.3;
      ctx.beginPath();
      ctx.arc(laserPos.x, laserPos.y, 14 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(laserPos.x, laserPos.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.restore();
    }

    ctx.restore(); // restore scaled context

    // Floating Live Subtitle & Equalizer Bar (Real-Time Synchronized Speech Display)
    if (currentScene && currentScene.narration) {
      renderTutorSubtitles(
        ctx,
        width,
        height,
        isDarkBoard,
        currentScene.narration,
        sceneElapsedTime,
        currentScene.duration || 15,
        isPlaying,
        tick
      );
    }

    ctx.restore();
  }, [currentScene, sceneElapsedTime, zoom, pan, isDarkBoard, userStrokes, currentStroke, laserPos, activeTool, isPlaying]);

  useEffect(() => {
    let animId: number;
    const loop = () => {
      draw();
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [draw]);

  // Convert screen coordinates to virtual 800x450 coordinates
  const getVirtualCoords = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const baseScale = Math.min(width / VIRTUAL_WIDTH, height / VIRTUAL_HEIGHT);
    const finalScale = baseScale * zoom;
    const originX = (width - VIRTUAL_WIDTH * finalScale) / 2 + pan.x;
    const originY = (height - VIRTUAL_HEIGHT * finalScale) / 2 + pan.y;

    const screenX = clientX - rect.left;
    const screenY = clientY - rect.top;

    return {
      x: (screenX - originX) / finalScale,
      y: (screenY - originY) / finalScale
    };
  };

  // Mouse Interaction Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeTool === 'cursor' || e.button === 1 || e.shiftKey) {
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    } else if (activeTool === 'pen' || activeTool === 'highlighter') {
      const v = getVirtualCoords(e.clientX, e.clientY);
      setCurrentStroke([
        {
          x: v.x,
          y: v.y,
          color: penColor,
          width: activeTool === 'highlighter' ? 14 : 3.5,
          isHighlighter: activeTool === 'highlighter'
        }
      ]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
    } else if (activeTool === 'laser') {
      setLaserPos(getVirtualCoords(e.clientX, e.clientY));
    } else if ((activeTool === 'pen' || activeTool === 'highlighter') && currentStroke.length > 0) {
      const v = getVirtualCoords(e.clientX, e.clientY);
      setCurrentStroke((prev) => [
        ...prev,
        {
          x: v.x,
          y: v.y,
          color: penColor,
          width: activeTool === 'highlighter' ? 14 : 3.5,
          isHighlighter: activeTool === 'highlighter'
        }
      ]);
    }
  };

  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
    }
    if (currentStroke.length > 0) {
      setUserStrokes((prev) => [...prev, currentStroke]);
      setCurrentStroke([]);
    }
  };

  const handleClearAnnotations = () => {
    setUserStrokes([]);
    setCurrentStroke([]);
  };

  const handleExportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `braynix-whiteboard-${currentScene?.title?.replace(/\s+/g, '-').toLowerCase() || 'lesson'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error(err));
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[420px] md:min-h-[520px] flex flex-col rounded-3xl overflow-hidden border transition-all duration-300 shadow-2xl ${
        isDarkBoard
          ? 'bg-[#090d16] border-slate-800 shadow-cyan-950/20'
          : 'bg-white border-slate-200 shadow-slate-200/50'
      } select-none`}
    >
      {/* Top Floating Glass Command Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: Live Session Indicator with Scene Navigation */}
        <div className="pointer-events-auto flex items-center gap-2 bg-slate-900/85 dark:bg-slate-900/90 text-white backdrop-blur-xl px-3.5 py-1.5 rounded-2xl border border-white/10 shadow-lg text-xs font-semibold">
          <div className="relative flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping absolute" />
            <span className="w-2 h-2 rounded-full bg-cyan-500 relative" />
          </div>
          <span className="tracking-wide text-cyan-400">AI Whiteboard</span>

          {currentScene && (
            <div className="flex items-center gap-1.5 border-l border-slate-700/80 pl-2">
              {onPrevScene && (
                <button
                  onClick={onPrevScene}
                  disabled={currentSceneIndex === 0}
                  className="px-1 py-0.5 rounded text-slate-300 hover:text-cyan-300 disabled:opacity-20 transition text-sm font-bold"
                  title="Previous Scene"
                >
                  ‹
                </button>
              )}
              <span className="text-cyan-300 font-bold">
                {currentSceneIndex + 1}/{totalScenes}
              </span>
              {onNextScene && (
                <button
                  onClick={onNextScene}
                  disabled={currentSceneIndex >= totalScenes - 1}
                  className="px-1 py-0.5 rounded text-slate-300 hover:text-cyan-300 disabled:opacity-20 transition text-sm font-bold"
                  title="Next Scene"
                >
                  ›
                </button>
              )}
              <span className="hidden sm:inline text-slate-300 font-normal truncate max-w-[180px]">
                • {currentScene.title}
              </span>
            </div>
          )}
        </div>

        {/* Center: Learner Interactive Drawing Tools */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-900/85 text-white backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 shadow-lg">
          <button
            onClick={() => setActiveTool('cursor')}
            className={`p-2 rounded-xl transition ${
              activeTool === 'cursor' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'text-slate-300 hover:bg-white/10'
            }`}
            title="Pan / Select"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTool('pen')}
            className={`p-2 rounded-xl transition ${
              activeTool === 'pen' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'text-slate-300 hover:bg-white/10'
            }`}
            title="Learner Pen (Draw on board)"
          >
            <PenTool className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTool('highlighter')}
            className={`p-2 rounded-xl transition ${
              activeTool === 'highlighter' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'text-slate-300 hover:bg-white/10'
            }`}
            title="Neon Highlighter"
          >
            <Highlighter className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTool('laser')}
            className={`p-2 rounded-xl transition ${
              activeTool === 'laser' ? 'bg-rose-500 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/10'
            }`}
            title="Laser Pointer"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Color choices when pen is selected */}
          {(activeTool === 'pen' || activeTool === 'highlighter') && (
            <div className="flex items-center gap-1.5 border-l border-white/15 pl-1.5">
              {['#38bdf8', '#34d399', '#f59e0b', '#ec4899', '#f8fafc'].map((color) => (
                <button
                  key={color}
                  onClick={() => setPenColor(color)}
                  style={{ backgroundColor: color }}
                  className={`w-3.5 h-3.5 rounded-full transition transform hover:scale-125 ${
                    penColor === color ? 'ring-2 ring-white ring-offset-1 ring-offset-slate-900 scale-110' : ''
                  }`}
                />
              ))}
            </div>
          )}

          {userStrokes.length > 0 && (
            <button
              onClick={handleClearAnnotations}
              className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-xl transition"
              title="Clear User Drawings"
            >
              <Eraser className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right: Canvas Viewport Controls */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-900/85 text-white backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 shadow-lg">
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.2, 2.5))}
            className="p-2 text-slate-300 hover:bg-white/10 rounded-xl transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.2, 0.6))}
            className="p-2 text-slate-300 hover:bg-white/10 rounded-xl transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            className="p-2 text-slate-300 hover:bg-white/10 rounded-xl transition"
            title="Reset Pan & Zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-4 bg-white/20 mx-0.5" />

          {onToggleDarkBoard && (
            <button
              onClick={onToggleDarkBoard}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/20 transition"
              title="Toggle Chalkboard / Whiteboard"
            >
              {isDarkBoard ? 'Slate' : 'White'}
            </button>
          )}

          <button
            onClick={handleExportPNG}
            className="p-2 text-slate-300 hover:bg-white/10 rounded-xl transition"
            title="Export Board as PNG"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={handleToggleFullscreen}
            className="p-2 text-slate-300 hover:bg-white/10 rounded-xl transition"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`w-full h-full flex-1 ${
          activeTool === 'pen' || activeTool === 'highlighter'
            ? 'cursor-crosshair'
            : activeTool === 'laser'
            ? 'cursor-none'
            : isPanning
            ? 'cursor-grabbing'
            : 'cursor-grab'
        }`}
      />
    </div>
  );
};

/**
 * Animated Real-Time Voice Subtitles and Equalizer Indicator
 */
function renderTutorSubtitles(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  isDark: boolean,
  narration: string,
  elapsed: number,
  duration: number,
  isPlaying: boolean,
  tick: number
) {
  if (!narration) return;
  ctx.save();

  // Extract spoken sentences to display active phrase
  const rawSentences = narration.match(/[^.!?]+[.!?]+/g) || [narration];
  const sentences = rawSentences.map((s) => s.trim()).filter((s) => s.length > 0);
  const numSentences = Math.max(sentences.length, 1);
  const sentenceDuration = duration / numSentences;
  const activeSentenceIndex = Math.min(Math.floor(elapsed / sentenceDuration), numSentences - 1);
  const currentSentence = (sentences[activeSentenceIndex] || narration).trim();

  // Floating Frosted Glass Subtitle Banner at bottom of canvas
  ctx.font = '600 13px system-ui, -apple-system, sans-serif';
  const textWidth = ctx.measureText(currentSentence).width;
  const barW = Math.min(Math.max(textWidth + 80, 320), width - 40);
  const barH = 38;
  const barX = (width - barW) / 2;
  const barY = height - barH - 16;

  // Frosted Pill Container
  ctx.beginPath();
  ctx.roundRect(barX, barY, barW, barH, 19);
  ctx.fillStyle = isDark ? 'rgba(9, 13, 22, 0.88)' : 'rgba(255, 255, 255, 0.94)';
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(99, 102, 241, 0.35)';
  if (isDark) {
    ctx.shadowColor = 'rgba(56, 189, 248, 0.18)';
    ctx.shadowBlur = 12;
  }
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Real-Time Animated Equalizer Bars on the Left
  const barsX = barX + 16;
  const barsCount = 5;
  for (let i = 0; i < barsCount; i++) {
    const wave = isPlaying ? Math.sin(tick * 0.2 + i * 0.75) * 0.5 + 0.5 : 0.2;
    const barH = 4 + wave * 15;
    const barSubX = barsX + i * 6;
    const barSubY = barY + (barH - barH) / 2;

    ctx.beginPath();
    ctx.roundRect(barSubX, barSubY, 3.5, barH, 2);
    ctx.fillStyle = isDark ? '#38bdf8' : '#6366f1';
    ctx.fill();
  }

  // Active Sentence Text with Safe Clipping
  ctx.font = '600 12.5px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  let displayText = currentSentence;
  const maxAvailableTextWidth = barW - 65;
  if (ctx.measureText(displayText).width > maxAvailableTextWidth) {
    while (ctx.measureText(displayText + '...').width > maxAvailableTextWidth && displayText.length > 10) {
      displayText = displayText.slice(0, -4);
    }
    displayText += '...';
  }

  ctx.fillText(displayText, barX + 52, barY + barH / 2);

  ctx.restore();
}

/**
 * High-End Vector Canvas Renderer for Whiteboard Actions
 */
function renderAction(
  ctx: CanvasRenderingContext2D,
  action: WhiteboardAction,
  isDark: boolean,
  progress: number,
  tick: number
) {
  const defaultStroke = isDark ? '#f8fafc' : '#0f172a';
  const defaultText = isDark ? '#f1f5f9' : '#0f172a';

  // Smooth cubic ease-out for fluid physics-based entrance
  const easeProgress = 1 - Math.pow(1 - progress, 3);

  // Safe vertical margin below the top floating command bar
  const safeYOffset = 30;

  switch (action.type) {
    case 'title': {
      const text = action.text || '';
      const y = Math.max((action.y || 50) + safeYOffset, 80);
      const fontSize = action.fontSize || 24;

      ctx.save();
      ctx.font = `800 ${fontSize}px system-ui, -apple-system, sans-serif`;
      ctx.fillStyle = action.color || (isDark ? '#38bdf8' : '#2563eb');
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      if (isDark) {
        ctx.shadowColor = 'rgba(56, 189, 248, 0.35)';
        ctx.shadowBlur = 10;
      }
      ctx.fillText(text, 60, y);

      // Glowing Neon underline accent
      ctx.beginPath();
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = action.color || (isDark ? '#38bdf8' : '#2563eb');
      ctx.moveTo(60, y + fontSize * 0.7);
      ctx.lineTo(60 + Math.min(ctx.measureText(text).width * easeProgress, 460), y + fontSize * 0.7);
      ctx.stroke();
      ctx.restore();
      break;
    }

    case 'text': {
      const text = action.text || '';
      const x = action.x || 80;
      const y = (action.y || 100) + (action.y && action.y < 85 ? safeYOffset : 0);
      const fontSize = action.fontSize || 16;
      const offsetY = (1 - easeProgress) * 5;

      ctx.save();
      ctx.font = `${action.bold ? '700' : '500'} ${fontSize}px system-ui, -apple-system, sans-serif`;
      ctx.fillStyle = action.color || defaultText;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(text, x, y + offsetY);
      ctx.restore();
      break;
    }

    case 'box': {
      const x = action.x || 80;
      const rawY = action.y || 100;
      const y = rawY < 85 ? rawY + safeYOffset : rawY;
      const w = action.width || 180;
      const h = action.height || 100;
      const radius = 14;

      ctx.save();
      // Smooth subtle spring scale
      const scale = 0.95 + 0.05 * easeProgress;
      ctx.translate(x + w / 2, y + h / 2);
      ctx.scale(scale, scale);
      ctx.translate(-(x + w / 2), -(y + h / 2));

      ctx.beginPath();
      ctx.roundRect(x, y, w, h, radius);

      if (action.fill) {
        ctx.fillStyle = action.fill;
        ctx.fill();
      }

      ctx.lineWidth = action.strokeWidth || 2;
      ctx.strokeStyle = action.stroke || defaultStroke;
      if (isDark) {
        ctx.shadowColor = action.stroke || 'rgba(56, 189, 248, 0.25)';
        ctx.shadowBlur = 8;
      }
      if (action.dashed) {
        ctx.setLineDash([6, 5]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.shadowBlur = 0;

      if (action.label) {
        // Modern card header strip
        ctx.beginPath();
        ctx.roundRect(x, y, w, 28, [radius, radius, 0, 0]);
        ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.03)';
        ctx.fill();

        // 3 mini terminal dots on left
        const dotColors = ['#ef4444', '#f59e0b', '#10b981'];
        dotColors.forEach((dColor, i) => {
          ctx.beginPath();
          ctx.arc(x + 14 + i * 8, y + 14, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = dColor;
          ctx.fill();
        });

        ctx.font = '700 12.5px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = action.stroke || defaultStroke;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(action.label, x + w / 2, y + 14);
      }
      ctx.restore();
      break;
    }

    case 'circle': {
      const x = action.x || 200;
      const rawY = action.y || 200;
      const y = rawY < 85 ? rawY + safeYOffset : rawY;
      const r = action.radius || 40;

      ctx.save();
      const scale = 0.95 + 0.05 * easeProgress;
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.translate(-x, -y);

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);

      if (action.fill) {
        ctx.fillStyle = action.fill;
        ctx.fill();
      }

      ctx.lineWidth = action.strokeWidth || 2.5;
      ctx.strokeStyle = action.stroke || defaultStroke;
      if (isDark) {
        ctx.shadowColor = action.stroke || 'rgba(56, 189, 248, 0.25)';
        ctx.shadowBlur = 8;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      if (action.label) {
        ctx.font = '700 14px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = action.stroke || defaultStroke;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(action.label, x, y);
      }
      ctx.restore();
      break;
    }

    case 'arrow': {
      const fx = action.fromX || 100;
      const rawFy = action.fromY || 100;
      const fy = rawFy < 85 ? rawFy + safeYOffset : rawFy;
      const tx = action.toX || 250;
      const rawTy = action.toY || 100;
      const ty = rawTy < 85 ? rawTy + safeYOffset : rawTy;
      const color = action.color || (isDark ? '#38bdf8' : '#0284c7');

      const curTx = fx + (tx - fx) * easeProgress;
      const curTy = fy + (ty - fy) * easeProgress;

      const angle = Math.atan2(curTy - fy, curTx - fx);
      const headlen = 11;

      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = color;
      ctx.moveTo(fx, fy);
      ctx.lineTo(curTx, curTy);
      ctx.stroke();

      if (easeProgress > 0.8) {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.moveTo(curTx, curTy);
        ctx.lineTo(
          curTx - headlen * Math.cos(angle - Math.PI / 6),
          curTy - headlen * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          curTx - headlen * Math.cos(angle + Math.PI / 6),
          curTy - headlen * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();

        // High-Tech Animated Packet / Signal Pulse Flowing Along Wire
        const packetT = ((tick * 0.025) % 1);
        const px = fx + (tx - fx) * packetT;
        const py = fy + (ty - fy) * packetT;

        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.fill();

        // Glowing particle tail
        const tailX = px - Math.cos(angle) * 7;
        const tailY = py - Math.sin(angle) * 7;
        ctx.beginPath();
        ctx.arc(tailX, tailY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      }

      if (action.label && easeProgress > 0.4) {
        const midX = (fx + tx) / 2;
        const midY = (fy + ty) / 2 - 14;

        ctx.font = '600 12px system-ui, -apple-system, sans-serif';
        const labelWidth = ctx.measureText(action.label).width + 16;

        ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(midX - labelWidth / 2, midY - 11, labelWidth, 22, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(action.label, midX, midY);
      }
      break;
    }

    case 'array': {
      const x = action.x || 80;
      const y = action.y || 150;
      const values = action.arrayValues || [];
      const activeIndices = action.activeIndices || [];
      const pointers = action.pointers || [];
      const cellSize = 54;

      values.forEach((val, idx) => {
        const cellX = x + idx * (cellSize + 5);
        const cellY = y;
        const isActive = activeIndices.length === 0 || activeIndices.includes(idx);

        // Glassmorphism card cell
        ctx.beginPath();
        ctx.roundRect(cellX, cellY, cellSize, cellSize, 10);
        ctx.fillStyle = isActive
          ? isDark ? 'rgba(30, 41, 59, 0.9)' : '#ffffff'
          : isDark ? 'rgba(15, 23, 42, 0.4)' : '#f1f5f9';
        ctx.fill();

        ctx.lineWidth = isActive ? 2.5 : 1;
        ctx.strokeStyle = isActive
          ? isDark ? '#38bdf8' : '#2563eb'
          : isDark ? '#334155' : '#cbd5e1';
        ctx.stroke();

        // Index label
        ctx.font = '600 11px monospace';
        ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(`[${idx}]`, cellX + cellSize / 2, cellY - 5);

        // Cell value
        ctx.font = '700 19px monospace';
        ctx.fillStyle = isActive ? (isDark ? '#f8fafc' : '#0f172a') : '#64748b';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(val), cellX + cellSize / 2, cellY + cellSize / 2);
      });

      // Pointer Labels & Arrow Badges with gentle hover float
      pointers.forEach((ptr) => {
        const ptrX = x + ptr.index * (cellSize + 5) + cellSize / 2;
        const isTop = ptr.position === 'top';
        const floatOffset = Math.sin(tick * 0.1) * 3;
        const ptrY = isTop ? y - 30 + floatOffset : y + cellSize + 16 + floatOffset;
        const ptrColor = ptr.color || '#38bdf8';

        ctx.font = '800 12px system-ui, -apple-system, sans-serif';
        const txtWidth = ctx.measureText(ptr.label).width + 16;

        ctx.fillStyle = ptrColor;
        ctx.beginPath();
        ctx.roundRect(ptrX - txtWidth / 2, isTop ? ptrY - 14 : ptrY, txtWidth, 24, 8);
        ctx.fill();

        ctx.fillStyle = '#090d16';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(ptr.label, ptrX, isTop ? ptrY - 2 : ptrY + 12);

        // Triangle tip
        ctx.beginPath();
        if (isTop) {
          ctx.moveTo(ptrX, y - 4);
          ctx.lineTo(ptrX - 5, y - 10);
          ctx.lineTo(ptrX + 5, y - 10);
        } else {
          ctx.moveTo(ptrX, y + cellSize + 4);
          ctx.lineTo(ptrX - 5, y + cellSize + 10);
          ctx.lineTo(ptrX + 5, y + cellSize + 10);
        }
        ctx.closePath();
        ctx.fillStyle = ptrColor;
        ctx.fill();
      });
      break;
    }

    case 'equation': {
      const x = action.x || 80;
      const y = action.y || 100;
      const text = action.text || '';
      const subtext = action.subtext || '';

      ctx.font = '700 22px Georgia, Cambria, serif';
      const textWidth = Math.max(ctx.measureText(text).width, 240);
      const boxW = textWidth + 40;
      const boxH = subtext ? 70 : 50;

      ctx.beginPath();
      ctx.roundRect(x, y, boxW, boxH, 12);
      ctx.fillStyle = isDark ? 'rgba(30, 41, 59, 0.7)' : '#f8fafc';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = isDark ? '#818cf8' : '#6366f1';
      ctx.stroke();

      ctx.font = '700 20px Georgia, Cambria, serif';
      ctx.fillStyle = isDark ? '#e0e7ff' : '#3730a3';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, x + 20, y + (subtext ? 24 : boxH / 2));

      if (subtext) {
        ctx.font = '500 12px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
        ctx.fillText(subtext, x + 20, y + 50);
      }
      break;
    }

    case 'badge': {
      const text = action.text || '';
      const x = action.x || 80;
      const y = action.y || 100;

      ctx.font = '700 13px system-ui, -apple-system, sans-serif';
      const textWidth = ctx.measureText(text).width;
      const paddingX = 16;
      const h = 30;
      const w = textWidth + paddingX * 2;

      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 15);
      ctx.fillStyle = action.bgColor || (isDark ? 'rgba(56, 189, 248, 0.15)' : '#dbeafe');
      ctx.fill();

      ctx.fillStyle = action.textColor || (isDark ? '#38bdf8' : '#1e40af');
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, x + paddingX, y + h / 2);
      break;
    }

    case 'highlight': {
      const x = action.x || 80;
      const y = action.y || 100;
      const w = action.width || 100;
      const h = action.height || 60;
      const color = action.color || '#38bdf8';

      ctx.beginPath();
      ctx.roundRect(x - 5, y - 5, w + 10, h + 10, 12);
      ctx.lineWidth = 3;
      ctx.strokeStyle = color;
      ctx.stroke();

      ctx.fillStyle = color + '22';
      ctx.fill();
      break;
    }

    case 'icon': {
      const x = action.x || 100;
      const y = action.y || 100;
      const color = action.color || '#10b981';

      ctx.save();
      ctx.translate(x, y);

      if (action.iconType === 'check') {
        ctx.beginPath();
        ctx.arc(0, 0, 16, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#ffffff';
        ctx.moveTo(-6, 0);
        ctx.lineTo(-2, 5);
        ctx.lineTo(6, -4);
        ctx.stroke();
      } else if (action.iconType === 'sun') {
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        for (let i = 0; i < 8; i++) {
          const a = (i * Math.PI) / 4;
          ctx.beginPath();
          ctx.lineWidth = 2.5;
          ctx.strokeStyle = color;
          ctx.moveTo(Math.cos(a) * 18, Math.sin(a) * 18);
          ctx.lineTo(Math.cos(a) * 24, Math.sin(a) * 24);
          ctx.stroke();
        }
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }

      ctx.restore();
      break;
    }

    default:
      break;
  }
}
