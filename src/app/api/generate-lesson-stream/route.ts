import { NextRequest } from 'next/server';
import { Lesson, LessonScene } from '@/types/lesson';
import { SAMPLE_LESSONS } from '@/lib/sampleLessons';

export const dynamic = 'force-dynamic';

interface GeminiPart {
  text?: string;
}

interface GeminiCandidate {
  content?: {
    parts?: GeminiPart[];
  };
}

interface GeminiApiResponse {
  candidates?: GeminiCandidate[];
}

const CANDIDATE_MODELS = [
  'gemini-3.6-flash',
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash-lite',
  'gemini-flash-lite-latest'
];

/**
 * Fallback generator that produces custom structured scenes if the AI model is slow or unavailable
 */
function createAlgorithmicLesson(topic: string): Lesson {
  const clean = topic.trim();
  const slug = clean.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return {
    id: `stream-${slug}-${Date.now()}`,
    topic: clean,
    title: `Understanding ${clean}: Visual Demonstration`,
    overview: `An interactive breakdown of ${clean}, exploring foundational mechanics, core architecture, and real-world execution.`,
    totalDuration: 95,
    scenes: [
      {
        id: 1,
        title: `Introduction to ${clean}`,
        duration: 20,
        narration: `Welcome to this whiteboard session on ${clean}. Let us begin by breaking down what ${clean} is, why it matters, and the core architectural principles that define how it works.`,
        keyConcept: `Foundational overview and problem domain of ${clean}.`,
        actions: [
          { type: 'title', timeOffset: 0, text: `${clean}: Core Architecture`, fontSize: 24, color: '#38bdf8', y: 40 },
          { type: 'text', timeOffset: 1, text: `Fundamental Paradigm & Overview`, fontSize: 16, color: '#94a3b8', x: 80, y: 110 },
          {
            type: 'box',
            timeOffset: 3,
            x: 80,
            y: 150,
            width: 280,
            height: 140,
            stroke: '#38bdf8',
            fill: 'rgba(56, 189, 248, 0.1)',
            label: `${clean} Domain`
          },
          {
            type: 'box',
            timeOffset: 6,
            x: 440,
            y: 150,
            width: 280,
            height: 140,
            stroke: '#818cf8',
            fill: 'rgba(129, 140, 248, 0.1)',
            label: 'System Execution & Output'
          },
          {
            type: 'arrow',
            timeOffset: 9,
            fromX: 360,
            fromY: 220,
            toX: 440,
            toY: 220,
            label: 'Data Flow',
            color: '#38bdf8'
          },
          { type: 'badge', timeOffset: 12, text: 'Stage 1: Initialization', bgColor: 'rgba(56, 189, 248, 0.2)', textColor: '#38bdf8', x: 80, y: 320 }
        ]
      },
      {
        id: 2,
        title: `Mechanisms & Key Dynamics`,
        duration: 25,
        narration: `Now let's examine the inner mechanics. Inside ${clean}, operations are orchestrated through a sequence of state transformations and verified logic.`,
        keyConcept: `Step-by-step state changes and operational lifecycle.`,
        actions: [
          { type: 'title', timeOffset: 0, text: `${clean}: Step-by-Step Execution`, fontSize: 24, color: '#818cf8', y: 40 },
          {
            type: 'circle',
            timeOffset: 2,
            x: 180,
            y: 200,
            radius: 50,
            stroke: '#38bdf8',
            fill: 'rgba(56, 189, 248, 0.15)',
            label: 'Input'
          },
          {
            type: 'arrow',
            timeOffset: 5,
            fromX: 230,
            fromY: 200,
            toX: 350,
            toY: 200,
            label: 'Processing',
            color: '#a78bfa'
          },
          {
            type: 'box',
            timeOffset: 8,
            x: 350,
            y: 140,
            width: 180,
            height: 120,
            stroke: '#a78bfa',
            fill: 'rgba(167, 139, 250, 0.12)',
            label: 'Core Engine'
          },
          {
            type: 'arrow',
            timeOffset: 11,
            fromX: 530,
            fromY: 200,
            toX: 630,
            toY: 200,
            label: 'Result',
            color: '#34d399'
          },
          {
            type: 'circle',
            timeOffset: 14,
            x: 680,
            y: 200,
            radius: 50,
            stroke: '#34d399',
            fill: 'rgba(52, 211, 153, 0.15)',
            label: 'State'
          },
          { type: 'badge', timeOffset: 17, text: 'Deterministic Flow', bgColor: 'rgba(52, 211, 153, 0.2)', textColor: '#34d399', x: 80, y: 340 }
        ]
      },
      {
        id: 3,
        title: `Practical Examples & Trace`,
        duration: 25,
        narration: `To see this in action, observe how an example query executes. Notice how edge cases are safeguarded and how computational efficiency is maintained throughout.`,
        keyConcept: `Tracing an operational flow through concrete test values.`,
        actions: [
          { type: 'title', timeOffset: 0, text: `${clean}: Concrete Trace`, fontSize: 24, color: '#34d399', y: 40 },
          {
            type: 'array',
            timeOffset: 2,
            x: 100,
            y: 150,
            arrayValues: [10, 25, 42, 68, 91],
            activeIndices: [1, 2, 3],
            pointers: [
              { index: 1, label: 'Active', color: '#38bdf8', position: 'top' },
              { index: 3, label: 'Target', color: '#34d399', position: 'bottom' }
            ]
          },
          { type: 'text', timeOffset: 7, text: 'Time Complexity: Optimal average case execution', fontSize: 15, color: '#38bdf8', x: 100, y: 280, bold: true },
          { type: 'text', timeOffset: 10, text: 'Space Complexity: Constant memory overhead', fontSize: 15, color: '#94a3b8', x: 100, y: 310 },
          { type: 'badge', timeOffset: 13, text: 'Verified Output', bgColor: 'rgba(52, 211, 153, 0.2)', textColor: '#34d399', x: 100, y: 350 }
        ]
      },
      {
        id: 4,
        title: `Summary & Key Takeaways`,
        duration: 25,
        narration: `In conclusion, mastering ${clean} gives you a powerful framework. Remember the core principles, understand the trade-offs, and apply this pattern whenever designing scalable systems.`,
        keyConcept: `Synthesis of takeaways, best practices, and next steps.`,
        actions: [
          { type: 'title', timeOffset: 0, text: `${clean}: Key Takeaways`, fontSize: 24, color: '#f59e0b', y: 40 },
          { type: 'text', timeOffset: 2, text: '✓ 1. Understand fundamental structural requirements', fontSize: 16, color: '#f8fafc', x: 80, y: 130 },
          { type: 'text', timeOffset: 5, text: '✓ 2. Ensure clear boundary checks and input validation', fontSize: 16, color: '#f8fafc', x: 80, y: 175 },
          { type: 'text', timeOffset: 8, text: '✓ 3. Maximize efficiency while preventing bottlenecks', fontSize: 16, color: '#f8fafc', x: 80, y: 220 },
          {
            type: 'box',
            timeOffset: 12,
            x: 80,
            y: 270,
            width: 640,
            height: 90,
            stroke: '#f59e0b',
            fill: 'rgba(245, 158, 11, 0.1)',
            label: 'Ready for Practice'
          },
          { type: 'text', timeOffset: 15, text: 'Ask your tutor any follow-up questions in the chat studio!', fontSize: 14, color: '#fbbf24', x: 140, y: 325, bold: true }
        ]
      }
    ],
    suggestedQuestions: [
      `What are the most common misconceptions about ${clean}?`,
      `How does ${clean} compare to alternative approaches in production?`,
      `Can you explain the edge case handling in ${clean}?`
    ]
  };
}

/**
 * Fast Scene 1 Generator Prompt to start playback in < 2 seconds
 */
const SCENE_1_PROMPT = `You are an elite Khan Academy-style AI Whiteboard Tutor.
The user wants to learn: "__TOPIC__".
Generate ONLY Scene 1 (the introductory hook and setup diagram) and overall lesson meta so the student can start learning instantly.
Return ONLY valid JSON matching this schema:
{
  "title": "Compelling Lesson Title",
  "overview": "1-2 sentence overview of what the learner will master.",
  "scene": {
    "id": 1,
    "title": "Scene 1 Title",
    "narration": "Friendly spoken voice script (30-45 words) introducing the topic.",
    "duration": 22,
    "keyConcept": "One sentence summary of this first scene",
    "actions": [
      { "type": "title", "timeOffset": 0, "text": "Topic Title", "fontSize": 24, "color": "#38bdf8", "y": 40 },
      { "type": "text", "timeOffset": 1, "text": "Overview bullet", "fontSize": 15, "color": "#94a3b8", "x": 80, "y": 100 },
      { "type": "box", "timeOffset": 3, "x": 80, "y": 140, "width": 240, "height": 120, "stroke": "#38bdf8", "fill": "rgba(56, 189, 248, 0.12)", "label": "Concept Box" },
      { "type": "arrow", "timeOffset": 6, "fromX": 320, "fromY": 200, "toX": 460, "toY": 200, "label": "Transforms into", "color": "#818cf8" },
      { "type": "circle", "timeOffset": 9, "x": 540, "y": 200, "radius": 45, "stroke": "#818cf8", "fill": "rgba(129, 140, 248, 0.15)", "label": "Result" },
      { "type": "badge", "timeOffset": 12, "text": "Key Insight", "bgColor": "rgba(56, 189, 248, 0.2)", "textColor": "#38bdf8", "x": 80, "y": 300 }
    ]
  }
}`;

/**
 * Subsequent Scenes Generator Prompt
 */
const REMAINING_SCENES_PROMPT = `You are an elite Khan Academy-style AI Whiteboard Tutor.
The user is learning: "__TOPIC__".
Scene 1 has already been taught. Now generate the remaining 3 scenes (Scene 2: Core Mechanism, Scene 3: Step-by-Step Demonstration/Example, Scene 4: Summary & Takeaway) plus 3 suggested follow-up questions.
Canvas coordinate system: 800 width by 450 height. Safe Y: 40 to 390.
Return ONLY valid JSON matching this schema:
{
  "scenes": [
    {
      "id": 2,
      "title": "Scene 2 Heading",
      "narration": "Friendly conversational spoken narration (35-50 words)...",
      "duration": 24,
      "keyConcept": "Core mechanism summary",
      "actions": [ ... ]
    },
    {
      "id": 3,
      "title": "Scene 3 Heading",
      "narration": "Demonstration or trace narration (35-50 words)...",
      "duration": 25,
      "keyConcept": "Visual demonstration summary",
      "actions": [ ... ]
    },
    {
      "id": 4,
      "title": "Scene 4 Heading",
      "narration": "Conclusion & recap narration (30-40 words)...",
      "duration": 20,
      "keyConcept": "Summary takeaways",
      "actions": [ ... ]
    }
  ],
  "suggestedQuestions": [
    "Follow-up question 1?",
    "Follow-up question 2?",
    "Follow-up question 3?"
  ]
}`;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const topic = searchParams.get('topic') || '';

  if (!topic.trim()) {
    return new Response(JSON.stringify({ error: 'Topic is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const cleanTopic = topic.trim();
  const lowerTopic = cleanTopic.toLowerCase();

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (event: string, data: unknown) => {
        try {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        } catch {
          // Stream might be closed by client
        }
      };

      // 1. Instant check for curated flagship lessons
      const matchedKey = Object.keys(SAMPLE_LESSONS).find(
        (key) =>
          lowerTopic.includes(key) ||
          (key === 'neural-networks' && lowerTopic.includes('neural')) ||
          (key === 'tcp-handshake' && (lowerTopic.includes('tcp') || lowerTopic.includes('handshake'))) ||
          (key === 'pythagorean-theorem' && lowerTopic.includes('pythagor')) ||
          (key === 'binary-search' && lowerTopic.includes('binary')) ||
          (key === 'photosynthesis' && lowerTopic.includes('photo')) ||
          (key === 'typescript' && lowerTopic.includes('typescript'))
      );

      if (matchedKey && SAMPLE_LESSONS[matchedKey]) {
        const flagship = SAMPLE_LESSONS[matchedKey];
        // Send meta
        sendEvent('meta', {
          id: flagship.id,
          topic: flagship.topic,
          title: flagship.title,
          overview: flagship.overview,
          totalDuration: flagship.totalDuration,
          source: 'curated-flagship'
        });

        // Stream each scene with tiny interval
        for (const scene of flagship.scenes) {
          sendEvent('scene', scene);
        }

        // Send done event with questions
        sendEvent('done', {
          suggestedQuestions: flagship.suggestedQuestions
        });

        controller.close();
        return;
      }

      // 2. Real-Time Generation via Gemini
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        // Stream algorithmic lesson
        const fallback = createAlgorithmicLesson(cleanTopic);
        sendEvent('meta', {
          id: fallback.id,
          topic: fallback.topic,
          title: fallback.title,
          overview: fallback.overview,
          totalDuration: fallback.totalDuration,
          source: 'algorithmic-instant'
        });

        for (const scene of fallback.scenes) {
          sendEvent('scene', scene);
        }

        sendEvent('done', { suggestedQuestions: fallback.suggestedQuestions });
        controller.close();
        return;
      }

      try {
        // Step A: Fast call for Scene 1 (returns in ~1.5s)
        let scene1Data: { title?: string; overview?: string; scene?: LessonScene } | null = null;
        let modelUsed = '';

        for (const model of CANDIDATE_MODELS) {
          try {
            const prompt = SCENE_1_PROMPT.replace('__TOPIC__', cleanTopic);
            const resp = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [{ role: 'user', parts: [{ text: prompt }] }],
                  generationConfig: {
                    temperature: 0.3,
                    responseMimeType: 'application/json'
                  }
                })
              }
            );

            if (resp.ok) {
              const json: GeminiApiResponse = await resp.json();
              const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
              if (rawText) {
                scene1Data = JSON.parse(rawText);
                modelUsed = model;
                break;
              }
            }
          } catch {
            // Continue to next model
          }
        }

        if (!scene1Data || !scene1Data.scene) {
          // If Gemini fails, gracefully stream algorithmic lesson
          const fallback = createAlgorithmicLesson(cleanTopic);
          sendEvent('meta', {
            id: fallback.id,
            topic: fallback.topic,
            title: fallback.title,
            overview: fallback.overview,
            totalDuration: fallback.totalDuration,
            source: 'fallback'
          });
          for (const s of fallback.scenes) {
            sendEvent('scene', s);
          }
          sendEvent('done', { suggestedQuestions: fallback.suggestedQuestions });
          controller.close();
          return;
        }

        // Emit Scene 1 immediately!
        sendEvent('meta', {
          id: `live-${Date.now()}`,
          topic: cleanTopic,
          title: scene1Data.title || `${cleanTopic}: Visual Whiteboard`,
          overview: scene1Data.overview || `Interactive whiteboard lesson on ${cleanTopic}.`,
          totalDuration: 95,
          source: `live-${modelUsed}`
        });

        sendEvent('scene', scene1Data.scene);

        // Step B: Now fetch remaining scenes in background and stream them as they arrive
        let remainingData: { scenes?: LessonScene[]; suggestedQuestions?: string[] } | null = null;

        for (const model of CANDIDATE_MODELS) {
          try {
            const prompt = REMAINING_SCENES_PROMPT.replace('__TOPIC__', cleanTopic);
            const resp = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [{ role: 'user', parts: [{ text: prompt }] }],
                  generationConfig: {
                    temperature: 0.35,
                    responseMimeType: 'application/json'
                  }
                })
              }
            );

            if (resp.ok) {
              const json: GeminiApiResponse = await resp.json();
              const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
              if (rawText) {
                remainingData = JSON.parse(rawText);
                break;
              }
            }
          } catch {
            // Continue
          }
        }

        if (remainingData?.scenes && remainingData.scenes.length > 0) {
          for (const sc of remainingData.scenes) {
            sendEvent('scene', sc);
          }
          sendEvent('done', {
            suggestedQuestions: remainingData.suggestedQuestions || [
              `What is the main advantage of ${cleanTopic}?`,
              `How does this behave under edge conditions?`,
              `Can you explain the trade-offs of this approach?`
            ]
          });
        } else {
          // Fallback remaining scenes
          const fallback = createAlgorithmicLesson(cleanTopic);
          for (let i = 1; i < fallback.scenes.length; i++) {
            sendEvent('scene', fallback.scenes[i]);
          }
          sendEvent('done', { suggestedQuestions: fallback.suggestedQuestions });
        }
      } catch (err) {
        console.error('SSE Stream Error:', err);
        const fallback = createAlgorithmicLesson(cleanTopic);
        for (const s of fallback.scenes) {
          sendEvent('scene', s);
        }
        sendEvent('done', { suggestedQuestions: fallback.suggestedQuestions });
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive'
    }
  });
}
