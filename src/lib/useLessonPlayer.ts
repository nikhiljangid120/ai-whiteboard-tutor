'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Lesson, LessonScene } from '@/types/lesson';

export interface LessonPlayerState {
  isPlaying: boolean;
  currentTime: number;
  totalDuration: number;
  currentSceneIndex: number;
  currentScene: LessonScene | null;
  sceneElapsedTime: number;
  playbackRate: number;
  isMuted: boolean;
  isVoiceSupported: boolean;
  voiceName: string;
}

export function useLessonPlayer(lesson: Lesson | null) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVoiceSupported, setIsVoiceSupported] = useState<boolean>(true);
  const [voiceName, setVoiceName] = useState<string>('Default AI Voice');

  const animFrameRef = useRef<number | null>(null);
  const lastTickTimeRef = useRef<number | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const currentTimeRef = useRef<number>(0);
  const playbackRateRef = useRef<number>(1);
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sceneIndexRef = useRef<number>(0);
  const sceneOffsetsRef = useRef<{ index: number; start: number; end: number; duration: number }[]>([]);
  const lessonRef = useRef<Lesson | null>(lesson);

  // Keep refs in sync for animation loop
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    currentTimeRef.current = currentTime;
  }, [currentTime]);

  useEffect(() => {
    playbackRateRef.current = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    lessonRef.current = lesson;
  }, [lesson]);

  // Compute total duration and scene boundary timestamps
  const { totalDuration, sceneOffsets } = useMemo(() => {
    if (!lesson || !lesson.scenes || lesson.scenes.length === 0) {
      return { totalDuration: 0, sceneOffsets: [] };
    }

    const offsets: { index: number; start: number; end: number; duration: number }[] = [];
    let cumulative = 0;

    lesson.scenes.forEach((scene, idx) => {
      const dur = scene.duration || 20;
      offsets.push({
        index: idx,
        start: cumulative,
        end: cumulative + dur,
        duration: dur
      });
      cumulative += dur;
    });

    return { totalDuration: cumulative, sceneOffsets: offsets };
  }, [lesson]);

  useEffect(() => {
    sceneOffsetsRef.current = sceneOffsets;
  }, [sceneOffsets]);

  // Find active scene based on currentTime
  const currentSceneIndex = useMemo(() => {
    if (!sceneOffsets.length) return 0;
    const found = sceneOffsets.find((s) => currentTime >= s.start && currentTime < s.end);
    if (found) return found.index;
    if (currentTime >= totalDuration) return sceneOffsets.length - 1;
    return 0;
  }, [currentTime, sceneOffsets, totalDuration]);

  const currentScene: LessonScene | null = useMemo(() => {
    if (!lesson || !lesson.scenes || lesson.scenes.length === 0) return null;
    return lesson.scenes[currentSceneIndex] || null;
  }, [lesson, currentSceneIndex]);

  const sceneElapsedTime = useMemo(() => {
    if (!sceneOffsets[currentSceneIndex]) return 0;
    return Math.max(0, currentTime - sceneOffsets[currentSceneIndex].start);
  }, [currentTime, currentSceneIndex, sceneOffsets]);

  // Sync sceneIndexRef
  useEffect(() => {
    sceneIndexRef.current = currentSceneIndex;
  }, [currentSceneIndex]);

  // Check Web Speech API support
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsVoiceSupported(true);

      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Natural') ||
              v.name.includes('Google') ||
              v.name.includes('Samantha') ||
              v.name.includes('Neural'))
        );
        if (preferred) setVoiceName(preferred.name);
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    } else {
      setIsVoiceSupported(false);
    }
  }, []);

  // Stop any active speech
  const stopSpeech = useCallback(() => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    currentUtteranceRef.current = null;
  }, []);

  // Speak a scene's narration with optional custom rate
  const speakSceneNarration = useCallback(
    (scene: LessonScene, startOffsetSeconds: number = 0, rateOverride?: number) => {
      if (!isVoiceSupported || isMuted || typeof window === 'undefined') return;

      stopSpeech();

      const text = scene.narration;
      if (!text) return;

      // Slice text if user seeked midway into the scene
      let spokenText = text;
      if (startOffsetSeconds > 0 && scene.duration > 0) {
        const ratio = Math.min(startOffsetSeconds / scene.duration, 0.9);
        const words = text.split(' ');
        const wordIndex = Math.floor(words.length * ratio);
        spokenText = words.slice(wordIndex).join(' ');
      }

      if (!spokenText.trim()) return;

      const rateToUse = rateOverride !== undefined ? rateOverride : playbackRateRef.current;
      const utterance = new SpeechSynthesisUtterance(spokenText);
      utterance.rate = rateToUse;
      utterance.pitch = 1.0;

      // Select good voice
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Natural') ||
            v.name.includes('Google') ||
            v.name.includes('Samantha') ||
            v.name.includes('Neural'))
      ) || voices.find((v) => v.lang.startsWith('en'));

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      // Auto-advance scene smoothly when speech finishes (eliminating dead silence between scenes)
      utterance.onend = () => {
        if (autoAdvanceTimerRef.current) {
          clearTimeout(autoAdvanceTimerRef.current);
          autoAdvanceTimerRef.current = null;
        }
        const scenes = lessonRef.current?.scenes || [];
        const currentIdx = sceneIndexRef.current;
        if (isPlayingRef.current && currentIdx < scenes.length - 1) {
          autoAdvanceTimerRef.current = setTimeout(() => {
            if (isPlayingRef.current) {
              const nextIdx = sceneIndexRef.current + 1;
              const nextStart = sceneOffsetsRef.current[nextIdx]?.start;
              if (nextStart !== undefined) {
                setCurrentTime(nextStart);
              }
            }
          }, 1200);
        }
      };

      currentUtteranceRef.current = utterance;
      // Chrome Windows SpeechSynthesis requires a tiny timeout after cancel() to avoid dropped utterances
      setTimeout(() => {
        if (isPlayingRef.current && !isMuted) {
          window.speechSynthesis.speak(utterance);
        }
      }, 25);
    },
    [isVoiceSupported, isMuted, stopSpeech]
  );

  // Scene transition watcher: when scene changes while playing, speak new narration
  const prevSceneIndexRef = useRef<number>(currentSceneIndex);
  useEffect(() => {
    if (isPlaying && currentSceneIndex !== prevSceneIndexRef.current) {
      if (currentScene) {
        speakSceneNarration(currentScene, 0);
      }
    }
    prevSceneIndexRef.current = currentSceneIndex;
  }, [currentSceneIndex, isPlaying, currentScene, speakSceneNarration]);

  // Main animation / timeline clock loop
  useEffect(() => {
    if (!isPlaying) {
      lastTickTimeRef.current = null;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      return;
    }

    const tick = (timestamp: number) => {
      if (lastTickTimeRef.current === null) {
        lastTickTimeRef.current = timestamp;
      }

      const deltaSeconds = ((timestamp - lastTickTimeRef.current) / 1000) * playbackRateRef.current;
      lastTickTimeRef.current = timestamp;

      setCurrentTime((prevTime) => {
        const nextTime = prevTime + deltaSeconds;
        if (nextTime >= totalDuration) {
          setIsPlaying(false);
          stopSpeech();
          return totalDuration;
        }
        return nextTime;
      });

      if (isPlayingRef.current) {
        animFrameRef.current = requestAnimationFrame(tick);
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, totalDuration, stopSpeech]);

  // Playback actions
  const play = useCallback(() => {
    if (currentTimeRef.current >= totalDuration) {
      setCurrentTime(0);
    }
    setIsPlaying(true);
    if (currentScene) {
      speakSceneNarration(currentScene, sceneElapsedTime);
    }
  }, [totalDuration, currentScene, sceneElapsedTime, speakSceneNarration]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    stopSpeech();
  }, [stopSpeech]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const seekTo = useCallback(
    (seconds: number) => {
      const clamped = Math.max(0, Math.min(seconds, totalDuration));
      setCurrentTime(clamped);

      const targetScene = sceneOffsets.find((s) => clamped >= s.start && clamped < s.end);
      if (targetScene && lesson?.scenes[targetScene.index]) {
        const offsetInScene = clamped - targetScene.start;
        if (isPlaying) {
          speakSceneNarration(lesson.scenes[targetScene.index], offsetInScene);
        } else {
          stopSpeech();
        }
      }
    },
    [totalDuration, sceneOffsets, lesson, isPlaying, speakSceneNarration, stopSpeech]
  );

  const jumpScene = useCallback(
    (index: number) => {
      if (!sceneOffsets[index]) return;
      seekTo(sceneOffsets[index].start);
    },
    [sceneOffsets, seekTo]
  );

  const nextScene = useCallback(() => {
    const scenes = lesson?.scenes || [];
    if (currentSceneIndex < scenes.length - 1) {
      jumpScene(currentSceneIndex + 1);
    }
  }, [currentSceneIndex, lesson, jumpScene]);

  const prevScene = useCallback(() => {
    if (currentSceneIndex > 0) {
      jumpScene(currentSceneIndex - 1);
    }
  }, [currentSceneIndex, jumpScene]);

  const skip = useCallback(
    (deltaSeconds: number) => {
      seekTo(currentTime + deltaSeconds);
    },
    [currentTime, seekTo]
  );

  const restart = useCallback(() => {
    stopSpeech();
    setCurrentTime(0);
    setIsPlaying(true);
    if (lesson?.scenes[0]) {
      speakSceneNarration(lesson.scenes[0], 0);
    }
  }, [lesson, speakSceneNarration, stopSpeech]);

  // Instant Speed Change mid-playback
  const changeSpeed = useCallback(
    (newRate: number) => {
      setPlaybackRate(newRate);
      playbackRateRef.current = newRate;
      if (isPlaying && currentScene) {
        // Immediately restart speech at current progress with new speed rate
        speakSceneNarration(currentScene, sceneElapsedTime, newRate);
      }
    },
    [isPlaying, currentScene, sceneElapsedTime, speakSceneNarration]
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (next) {
        stopSpeech();
      } else if (isPlaying && currentScene) {
        speakSceneNarration(currentScene, sceneElapsedTime);
      }
      return next;
    });
  }, [isPlaying, currentScene, sceneElapsedTime, speakSceneNarration, stopSpeech]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, [stopSpeech]);

  return {
    isPlaying,
    currentTime,
    totalDuration,
    currentSceneIndex,
    currentScene,
    sceneElapsedTime,
    playbackRate,
    isMuted,
    isVoiceSupported,
    voiceName,
    sceneOffsets,
    play,
    pause,
    togglePlay,
    seekTo,
    jumpScene,
    nextScene,
    prevScene,
    skip,
    restart,
    setPlaybackRate: changeSpeed,
    toggleMute
  };
}
