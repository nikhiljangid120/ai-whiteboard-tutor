import { NextRequest, NextResponse } from 'next/server';
import { Lesson } from '@/types/lesson';
import { SAMPLE_LESSONS } from '@/lib/sampleLessons';

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

const SYSTEM_PROMPT = `You are an elite, Khan Academy-style AI Whiteboard Tutor.
Your job is to teach the user's requested topic by creating a 2-minute interactive whiteboard lesson.

CRITICAL REQUIREMENTS:
1. Break the lesson into 4 to 6 logical sequential scenes (total duration ~90 to 120 seconds).
2. For each scene:
   - Provide clear, friendly, conversational spoken narration (approx 30-50 words per scene).
   - Provide structured visual whiteboard actions that draw diagrams, text, boxes, arrows, badges, equations, or arrays.
   - Whiteboard actions MUST have a 'timeOffset' (in seconds from 0 to the scene duration) so that items appear step-by-step as the tutor speaks, NOT all at once!
3. Canvas coordinate system is 800 width by 450 height (16:9 ratio).
   - Keep coordinates safe: X between 40 and 760, Y between 40 and 400.
4. Use visual variety:
   - 'title': scene header at y=40
   - 'text': explanations, bullet points, labels
   - 'box': concepts, containers, nodes (x, y, width, height, stroke, fill, label)
   - 'circle': cycles, nodes, states (x, y, radius, stroke, fill, label)
   - 'arrow': flow of logic or steps (fromX, fromY, toX, toY, label, color)
   - 'equation': math or science formulas (text, subtext, x, y)
   - 'array': computer science data or items (arrayValues, activeIndices, pointers, x, y)
   - 'badge': highlight pills (text, bgColor, textColor, x, y)
   - 'highlight': bounding border highlight (x, y, width, height, color)
   - 'icon': 'check' | 'cross' | 'bulb' | 'sparkle' | 'question' | 'sun' (x, y, color)

OUTPUT FORMAT:
Return pure, valid JSON with this exact structure:
{
  "id": "lesson-unique-slug",
  "topic": "topic name",
  "title": "Compelling Lesson Title",
  "overview": "Brief 1-2 sentence summary of what learner will master.",
  "totalDuration": 110,
  "scenes": [
    {
      "id": 1,
      "title": "Scene Heading",
      "narration": "What the tutor says out loud in this scene...",
      "duration": 20,
      "keyConcept": "One-line takeaway",
      "actions": [
        {
          "type": "title",
          "timeOffset": 0,
          "text": "Header Text",
          "fontSize": 24,
          "color": "#2563eb",
          "y": 40
        },
        {
          "type": "box",
          "timeOffset": 3,
          "x": 80,
          "y": 100,
          "width": 200,
          "height": 100,
          "stroke": "#3b82f6",
          "fill": "#eff6ff",
          "label": "Concept Box"
        }
      ]
    }
  ],
  "suggestedQuestions": [
    "Question 1?",
    "Question 2?",
    "Question 3?"
  ]
}`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic } = body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const cleanTopic = topic.trim();
    const lowerTopic = cleanTopic.toLowerCase();

    // Check if the user is asking for one of our preset flagship topics
    if (lowerTopic.includes('binary search')) {
      return NextResponse.json({ lesson: SAMPLE_LESSONS['binary-search'], source: 'curated' });
    }
    if (lowerTopic.includes('photosynthesis')) {
      return NextResponse.json({ lesson: SAMPLE_LESSONS['photosynthesis'], source: 'curated' });
    }
    if (lowerTopic.includes('pythagor')) {
      return NextResponse.json({ lesson: SAMPLE_LESSONS['pythagorean-theorem'], source: 'curated' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      console.warn('GEMINI_API_KEY is not configured, returning curated fallback');
      const fallback = SAMPLE_LESSONS['binary-search'];
      return NextResponse.json({
        lesson: { ...fallback, topic: cleanTopic, title: `${cleanTopic} (Demo Mode)` },
        source: 'fallback',
        warning: 'Live Gemini key not detected. Using structured fallback.'
      });
    }

    // Resilient Multi-Model Request with Automatic Failover
    const CANDIDATE_MODELS = [
      'gemini-3.6-flash',
      'gemini-3.1-flash-lite',
      'gemini-3.5-flash-lite',
      'gemini-flash-lite-latest'
    ];

    let geminiData: GeminiApiResponse | null = null;
    let successfulModel = '';

    for (const model of CANDIDATE_MODELS) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: `${SYSTEM_PROMPT}\n\nGenerate an interactive whiteboard lesson for this topic: "${cleanTopic}"`
                    }
                  ]
                }
              ],
              generationConfig: {
                temperature: 0.4,
                responseMimeType: 'application/json'
              }
            })
          }
        );

        if (response.ok) {
          geminiData = await response.json();
          successfulModel = model;
          break;
        } else {
          const errText = await response.text();
          console.warn(`Model ${model} returned status ${response.status}:`, errText);
        }
      } catch (callErr) {
        console.warn(`Call failed for model ${model}:`, callErr);
      }
    }

    if (!geminiData) {
      // Graceful fallback to rich curriculum
      const fallback = SAMPLE_LESSONS['binary-search'];
      return NextResponse.json({
        lesson: {
          ...fallback,
          topic: cleanTopic,
          title: `Understanding ${cleanTopic}`,
          overview: `An interactive whiteboard exploration of ${cleanTopic}.`
        },
        source: 'fallback',
        warning: 'High API traffic encountered. Loaded structured educational framework.'
      });
    }

    const rawContent = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawContent) {
      throw new Error('Empty response from Gemini API');
    }

    const parsedLesson: Lesson = JSON.parse(rawContent);

    // Compute total duration if missing
    if (!parsedLesson.totalDuration && parsedLesson.scenes) {
      parsedLesson.totalDuration = parsedLesson.scenes.reduce(
        (acc, s) => acc + (s.duration || 20),
        0
      );
    }

    return NextResponse.json({
      lesson: parsedLesson,
      source: 'gemini',
      modelUsed: successfulModel
    });
  } catch (error: unknown) {
    console.error('Lesson generation error:', error);
    const fallback = SAMPLE_LESSONS['binary-search'];
    return NextResponse.json({
      lesson: fallback,
      source: 'fallback',
      warning: 'Server error encountered. Delivered backup lesson.'
    });
  }
}
