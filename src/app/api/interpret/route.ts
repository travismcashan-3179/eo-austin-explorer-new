import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function getOpenAISummary(profile: Record<string, unknown>, quiz: Record<string, unknown>) {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not set');
  }

  // Compose a prompt for the AI
  const prompt = `You are an EO Member Engagement Guide. Given the following member profile and quiz answers, recommend the top 10 EO opportunities (from the provided list) that would be most valuable for this member. Structure your response as follows:

[Introduction paragraph]

Top 5 Recommendations:
1. [Recommendation 1]
2. [Recommendation 2]
3. [Recommendation 3]
4. [Recommendation 4]
5. [Recommendation 5]

Additional Opportunities:
6. [Additional Option 1]
7. [Additional Option 2]
8. [Additional Option 3]
9. [Additional Option 4]
10. [Additional Option 5]

Summary:
[Conclusion paragraph]

In the introduction paragraph, speak directly to the member (use "you" and "your"), but do not include a greeting such as "Hi [name],".

Be specific and reference the features by name. Use the EO features list below for your recommendations. Do not include any other sections or text outside this structure.

Profile: ${JSON.stringify(profile, null, 2)}
Quiz: ${JSON.stringify(quiz, null, 2)}

EO Features (summary): Forum, Forum Training, Forum Workshops, EO Communities, MyEO Groups, MyEO Events, Chapter Events, Regional Events, EO Universities, EO Explorations, New Member Event Voucher, EO Learning Platform, Powerhouse Speaker Series, Jumpstart Series, Nano Learning, EO Podcasts, Global Speakers Academy, EO @ Harvard, EO @ Wharton, EO @ Oxford, EO/LBS Growth Forum, EO@INSEAD, Entrepreneurial Masters Program, Path of Leadership, Global Leadership Conference, Global Leadership Academy, Forum Moderator Summit, EO Ignite, EO Bold.

Only use company revenue to recommend features where eligibility or value depends on revenue, such as EO Ignite (for members with revenue below $1M) and EO Bold (for members with $10M+ in revenue or a recent $10M+ exit). Otherwise, do not use revenue to influence recommendations.

Respond in the requested format only.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are an expert EO Member Engagement Guide.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 600,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error('OpenAI API error: ' + (await response.text()));
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'No summary generated.';
}

export async function POST(req: NextRequest) {
  try {
    const { profile, quiz } = await req.json() as { profile: Record<string, unknown>, quiz: Record<string, unknown> };
    const summary = await getOpenAISummary(profile, quiz);
    return NextResponse.json({ summary });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 