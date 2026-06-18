const LLM_ENDPOINT = process.env.LLM_ENDPOINT || 'https://openrouter.ai/api/v1';
const LLM_MODEL = process.env.LLM_MODEL || 'openai/gpt-oss-120b';
const LLM_API_KEY = process.env.LLM_API_KEY || process.env.OPENROUTER_API_KEY || '';

const LANGUAGE_MAP: Record<string, string> = {
  malay: 'Bahasa Melayu',
  english: 'English',
  tamil: 'Tamil',
  mandarin: 'Mandarin',
  other: 'Bahasa Melayu',
};

export async function translateResponseText(text: string, rawLanguage: string): Promise<string> {
  const target = LANGUAGE_MAP[rawLanguage] || 'Bahasa Melayu';

  const response = await fetch(`${LLM_ENDPOINT}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${LLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: LLM_MODEL,
      messages: [
        {
          role: 'system',
          content: `Translate the following text to ${target}. If it is already in ${target}, return it exactly as-is. Output ONLY the translated text, no explanation, no quotes, no formatting.`,
        },
        { role: 'user', content: text },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`LLM translation API error ${response.status}: ${errorText}`);
  }

  const data = await response.json() as { choices: Array<{ message: { content: string } }> };
  const content = data.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new Error('LLM returned empty translation');
  }

  return content;
}
