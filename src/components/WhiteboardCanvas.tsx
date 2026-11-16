'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { WhiteboardAction, LessonScene } from '@/types/lesson';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Download, Sun, Moon } from 'lucide-react';

interface WhiteboardCanvasProps {
  currentScene: LessonScene | null;
  sceneElapsedTime: number; // seconds into current scene
  isDarkBoard?: boolean;
  onToggleDarkBoard?: () => void;
}

export const WhiteboardCanvas: React.FC<WhiteboardCanvasProps> = ({
  currentScene,
  sceneElapsedTime,
  isDarkBoard = false,
  onToggleDarkBoard
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Virtual canvas dimensions (16:9 ratio)
  const VIRTUAL_WIDTH = 800;
  const VIRTUAL_HEIGHT = 450;

  // Handle Canvas Drawing
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
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

    // Background styling
    const bgColor = isDarkBoard ? '#0f172a' : '#ffffff';
    const gridDotColor = isDarkBoard ? '#334155' : '#e2e8f0';

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Subtle grid dots pattern
    const dotSpacing = 24 * zoom;
    const offsetX = (pan.x * zoom) % dotSpacing;
    const offsetY = (pan.y * zoom) % dotSpacing;

    ctx.fillStyle = gridDotColor;
    for (let x = offsetX; x < width; x += dotSpacing) {
      for (let y = offsetY; y < height; y += dotSpacing) {
        ctx.beginPath();
        ctx.arc(x, y, 1.2 * Math.min(zoom, 1.5), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Coordinate mapping from virtual 800x450 to actual canvas size with pan & zoom
    const baseScale = Math.min(width / VIRTUAL_WIDTH, height / VIRTUAL_HEIGHT);
    const finalScale = baseScale * zoom;
    const originX = (width - VIRTUAL_WIDTH * finalScale) / 2 + pan.x;
    const originY = (height - VIRTUAL_HEIGHT * finalScale) / 2 + pan.y;

    ctx.save();
    ctx.translate(originX, originY);
    ctx.scale(finalScale, finalScale);

    if (currentScene && currentScene.actions) {
      // Render all actions whose timeOffset <= sceneElapsedTime
      currentScene.actions.forEach((action) => {
        if (action.timeOffset > sceneElapsedTime) return;

        // Progressive reveal opacity animation (0 to 1 over 0.3s)
        const age = sceneElapsedTime - action.timeOffset;
        const progress = Math.min(age / 0.35, 1);

        ctx.save();
        ctx.globalAlpha = progress;

        renderAction(ctx, action, isDarkBoard, progress);
        ctx.restore();
      });
    } else {
      // Empty state placeholder
      ctx.fillStyle = isDarkBoard ? '#64748b' : '#94a3b8';
      ctx.font = '500 18px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Select a topic to start the interactive whiteboard lesson', VIRTUAL_WIDTH / 2, VIRTUAL_HEIGHT / 2);
    }

    ctx.restore();
    ctx.restore();
  }, [currentScene, sceneElapsedTime, zoom, pan, isDarkBoard]);

  useEffect(() => {
    let animId: number;
    const renderLoop = () => {
      draw();
      animId = requestAnimationFrame(renderLoop);
    };
    animId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animId);
  }, [draw]);

  // Export board as PNG
  const handleExportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `whiteboard-${currentScene?.title?.replace(/\s+/g, '-').toLowerCase() || 'lesson'}.png`;
    link.href = image;
    link.click();
  };

  // Toggle fullscreen
  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error(err));
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
    }
  };

  // Mouse pan controls
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
    }
  };

  const handleMouseUp = () => setIsPanning(false);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[380px] md:min-h-[480px] flex flex-col rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 select-none"
    >
      {/* Top Floating Whiteboard Header */}
      <div className="absolute top-3 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-700/80 shadow-sm text-xs font-semibold text-slate-700 dark:text-slate-200">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Interactive Canvas</span>
          {currentScene && (
            <span className="text-slate-400 dark:text-slate-500 font-normal">
              • Scene {currentScene.id}: {currentScene.title}
            </span>
          )}
        </div>

        {/* Toolbar controls */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-1.5 rounded-full border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.2, 2.5))}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.2, 0.6))}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition"
            title="Reset Zoom & Pan"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-700 mx-0.5" />

          {onToggleDarkBoard && (
            <button
              onClick={onToggleDarkBoard}
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition"
              title={isDarkBoard ? 'Switch to Whiteboard' : 'Switch to Slate Board'}
            >
              {isDarkBoard ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          <button
            onClick={handleExportPNG}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition"
            title="Download Canvas PNG"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={handleToggleFullscreen}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* HTML5 Canvas Element */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`w-full h-full flex-1 ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
      />
    </div>
  );
};

/**
 * High-quality canvas rendering helper for individual whiteboard actions
 */
function renderAction(
  ctx: CanvasRenderingContext2D,
  action: WhiteboardAction,
  isDark: boolean,
  progress: number
) {
  const defaultStroke = isDark ? '#f8fafc' : '#1e293b';
  const defaultText = isDark ? '#f1f5f9' : '#0f172a';

  switch (action.type) {
    case 'title': {
      const text = action.text || '';
      const y = action.y || 45;
      const fontSize = action.fontSize || 24;

      ctx.font = `700 ${fontSize}px system-ui, -apple-system, sans-serif`;
      ctx.fillStyle = action.color || (isDark ? '#60a5fa' : '#2563eb');
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 60, y);

      // Subtle underline accent
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = (action.color || (isDark ? '#60a5fa' : '#2563eb')) + '44';
      ctx.moveTo(60, y + fontSize * 0.7);
      ctx.lineTo(60 + Math.min(ctx.measureText(text).width * progress, 350), y + fontSize * 0.7);
      ctx.stroke();
      break;
    }

    case 'text': {
      const text = action.text || '';
      const x = action.x || 80;
      const y = action.y || 100;
      const fontSize = action.fontSize || 16;

      ctx.font = `${action.bold ? '700' : '500'} ${fontSize}px system-ui, -apple-system, sans-serif`;
      ctx.fillStyle = action.color || defaultText;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(text, x, y);
      break;
    }

    case 'box': {
      const x = action.x || 80;
      const y = action.y || 100;
      const w = action.width || 180;
      const h = action.height || 100;
      const radius = 12;

      ctx.beginPath();
      ctx.roundRect(x, y, w, h, radius);

      if (action.fill) {
        ctx.fillStyle = action.fill;
        ctx.fill();
      }

      ctx.lineWidth = action.strokeWidth || 2;
      ctx.strokeStyle = action.stroke || defaultStroke;
      if (action.dashed) {
        ctx.setLineDash([6, 4]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Label at top or center
      if (action.label) {
        ctx.font = '600 14px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = action.stroke || defaultStroke;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(action.label, x + w / 2, y + 20);
      }
      break;
    }

    case 'circle': {
      const x = action.x || 200;
      const y = action.y || 200;
      const r = action.radius || 40;

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);

      if (action.fill) {
        ctx.fillStyle = action.fill;
        ctx.fill();
      }

      ctx.lineWidth = action.strokeWidth || 2.5;
      ctx.strokeStyle = action.stroke || defaultStroke;
      ctx.stroke();

      if (action.label) {
        ctx.font = '600 14px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = action.stroke || defaultStroke;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(action.label, x, y - 8);
      }
      break;
    }

    case 'arrow': {
      const fx = action.fromX || 100;
      const fy = action.fromY || 100;
      const tx = action.toX || 250;
      const ty = action.toY || 100;
      const color = action.color || (isDark ? '#38bdf8' : '#0284c7');

      // Animate line length with progress
      const curTx = fx + (tx - fx) * progress;
      const curTy = fy + (ty - fy) * progress;

      const angle = Math.atan2(curTy - fy, curTx - fx);
      const headlen = 10;

      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = color;
      ctx.moveTo(fx, fy);
      ctx.lineTo(curTx, curTy);
      ctx.stroke();

      // Arrow head
      if (progress > 0.8) {
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
      }

      // Middle label badge
      if (action.label && progress > 0.5) {
        const midX = (fx + tx) / 2;
        const midY = (fy + ty) / 2 - 12;

        ctx.font = '600 12px system-ui, -apple-system, sans-serif';
        const labelWidth = ctx.measureText(action.label).width + 12;

        ctx.fillStyle = isDark ? '#1e293b' : '#ffffff';
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(midX - labelWidth / 2, midY - 10, labelWidth, 20, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(action.label, midX, midY);
      }
      break;
    }

    case 'line': {
      const fx = action.fromX || 80;
      const fy = action.fromY || 100;
      const tx = action.toX || 300;
      const ty = action.toY || 100;

      ctx.beginPath();
      ctx.lineWidth = action.strokeWidth || 3;
      ctx.strokeStyle = action.stroke || defaultStroke;
      if (action.dashed) ctx.setLineDash([5, 5]);
      ctx.moveTo(fx, fy);
      ctx.lineTo(fx + (tx - fx) * progress, fy + (ty - fy) * progress);
      ctx.stroke();
      ctx.setLineDash([]);
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
        const cellX = x + idx * (cellSize + 4);
        const cellY = y;
        const isActive = activeIndices.length === 0 || activeIndices.includes(idx);

        // Cell box
        ctx.beginPath();
        ctx.roundRect(cellX, cellY, cellSize, cellSize, 8);
        ctx.fillStyle = isActive
          ? isDark ? '#1e293b' : '#ffffff'
          : isDark ? '#090d16' : '#f1f5f9';
        ctx.fill();

        ctx.lineWidth = isActive ? 2 : 1;
        ctx.strokeStyle = isActive
          ? isDark ? '#60a5fa' : '#3b82f6'
          : isDark ? '#334155' : '#cbd5e1';
        ctx.stroke();

        // Index label above cell
        ctx.font = '500 11px monospace';
        ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(`[${idx}]`, cellX + cellSize / 2, cellY - 4);

        // Value inside cell
        ctx.font = '700 18px monospace';
        ctx.fillStyle = isActive ? (isDark ? '#f8fafc' : '#0f172a') : '#94a3b8';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(val), cellX + cellSize / 2, cellY + cellSize / 2);
      });

      // Pointers (e.g. Left, Mid, Right)
      pointers.forEach((ptr) => {
        const ptrX = x + ptr.index * (cellSize + 4) + cellSize / 2;
        const isTop = ptr.position === 'top';
        const ptrY = isTop ? y - 28 : y + cellSize + 16;
        const ptrColor = ptr.color || '#3b82f6';

        ctx.font = '700 12px system-ui, -apple-system, sans-serif';
        const txtWidth = ctx.measureText(ptr.label).width + 12;

        ctx.fillStyle = ptrColor;
        ctx.beginPath();
        ctx.roundRect(ptrX - txtWidth / 2, isTop ? ptrY - 14 : ptrY, txtWidth, 22, 6);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(ptr.label, ptrX, isTop ? ptrY - 3 : ptrY + 11);

        // Pointer triangle
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
      const boxW = textWidth + 36;
      const boxH = subtext ? 68 : 48;

      ctx.beginPath();
      ctx.roundRect(x, y, boxW, boxH, 10);
      ctx.fillStyle = isDark ? '#1e293b' : '#f8fafc';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = isDark ? '#818cf8' : '#6366f1';
      ctx.stroke();

      ctx.font = '700 20px Georgia, Cambria, serif';
      ctx.fillStyle = isDark ? '#e0e7ff' : '#3730a3';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, x + 18, y + (subtext ? 22 : boxH / 2));

      if (subtext) {
        ctx.font = '500 12px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
        ctx.fillText(subtext, x + 18, y + 48);
      }
      break;
    }

    case 'badge': {
      const text = action.text || '';
      const x = action.x || 80;
      const y = action.y || 100;

      ctx.font = '600 13px system-ui, -apple-system, sans-serif';
      const textWidth = ctx.measureText(text).width;
      const paddingX = 14;
      const h = 28;
      const w = textWidth + paddingX * 2;

      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 14);
      ctx.fillStyle = action.bgColor || (isDark ? '#1e3a8a' : '#dbeafe');
      ctx.fill();

      ctx.fillStyle = action.textColor || (isDark ? '#93c5fd' : '#1e40af');
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
      const color = action.color || '#f59e0b';

      ctx.beginPath();
      ctx.roundRect(x - 4, y - 4, w + 8, h + 8, 10);
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
  }
}
