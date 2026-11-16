import { NextRequest, NextResponse } from 'next/server';

const QA_SYSTEM_PROMPT = `You are a supportive, knowledgeable AI Whiteboard Tutor answering a student's follow-up question.
The student has just watched an interactive whiteboard lesson.

Guidelines:
1. Provide a direct, crystal-clear explanation (2-4 paragraphs max).
2. Use simple real-world analogies where helpful.
3. If referring to a step or visual diagram from the lesson, mention it clearly (e.g., "Just like we saw in Step 2 on the board...").
4. Keep the tone encouraging, curious, and pedagogical.`;

export async function POST(req: NextRequest) {
  try {
    const { topic, lessonTitle, question, chatHistory } = await req.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      // Mock pedagogical response if no key
      return NextResponse.json({
        answer: `Great question about ${topic || 'this topic'}! In our lesson on "${lessonTitle || 'the concept'}", we explored how the core principles fit together step-by-step. Keep in mind that when applying this in practice, checking boundary conditions and edge cases is key!`
      });
    }

    const conversationContext = Array.isArray(chatHistory)
      ? chatHistory
          .slice(-4)
          .map((m: { sender: string; text: string }) => `${m.sender === 'user' ? 'Student' : 'Tutor'}: ${m.text}`)
          .join('\n')
      : '';

    const promptText = `${QA_SYSTEM_PROMPT}

Lesson Topic: ${topic || 'General Topic'}
Lesson Title: ${lessonTitle || 'Interactive Demonstration'}
${conversationContext ? `Recent Conversation:\n${conversationContext}\n` : ''}
Student's New Question: ${question}

Provide your tutor answer now:`;

    const CANDIDATE_MODELS = [
      'gemini-3.1-flash-lite',
      'gemini-3.5-flash-lite',
      'gemini-flash-lite-latest'
    ];

    let answer = '';

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
                  parts: [{ text: promptText }]
                }
              ],
              generationConfig: {
                temperature: 0.5,
                maxOutputTokens: 500
              }
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          answer = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (answer) break;
        }
      } catch (e) {
        console.warn(`QA error on model ${model}:`, e);
      }
    }

    if (!answer) {
      answer = `That is an insightful question about ${topic || 'this concept'}! A key takeaway from the whiteboard demonstration is that breaking problems down step-by-step makes even complex systems intuitive.`;
    }

    return NextResponse.json({ answer });
  } catch (err) {
    console.error('QA Error:', err);
    return NextResponse.json({
      answer: 'Thank you for asking! The fundamental concept here is to observe how inputs transform systematically through each stage of the demonstration.'
    });
  }
}
