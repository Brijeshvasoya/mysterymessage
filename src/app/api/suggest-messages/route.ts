import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      max_tokens: 400,
      stream: true,
      messages: [{ role: 'user', content: prompt }],
    });

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const text = chunk.choices[0]?.delta?.content;
          
          if (text) {
            controller.enqueue(new TextEncoder().encode(text));
          }
        }
        controller.close();
      }
    });

    return new NextResponse(stream);

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('An error occurred:', error.message);
      return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    } else {
      console.error('An unknown error occurred:', error);
      return new NextResponse(JSON.stringify({ error: 'An unknown error occurred' }), { status: 500 });
    }
  }
}

