const LLM_ENDPOINT = process.env.LLM_ENDPOINT || 'https://openrouter.ai/api/v1';
const LLM_MODEL = process.env.LLM_MODEL || 'openai/gpt-oss-120b';
const LLM_API_KEY = process.env.LLM_API_KEY || process.env.OPENROUTER_API_KEY || '';

interface GenerateResponseInput {
  raw_text: string;
  cleaned_summary: string | null;
  raw_language: string;
}

export async function generateResponseText(input: GenerateResponseInput): Promise<string> {
  const languageMap: Record<string, string> = {
    malay: 'Bahasa Melayu',
    english: 'English',
    tamil: 'Tamil',
    mandarin: 'Mandarin',
  };

  const targetLanguage = languageMap[input.raw_language] || 'Bahasa Melayu';

  const systemPrompt = `Anda adalah wakil kerajaan yang membalas maklum balas rakyat. Tulis dalam ${targetLanguage} secara formal, sopan, dan informatif.

Tugas anda:
1. Akui dan hargai maklum balas yang diterima.
2. Berikan maklumat tentang inisiatif, program, atau tindakan kerajaan yang berkaitan dengan isu yang dibangkitkan (jika ada).
3. Gunakan contoh konkrit seperti nama inisiatif, agensi, atau angka jika sesuai.
4. Tutup dengan nada positif dan mengucapkan terima kasih.
5. Jangan gunakan markah atau format HTML. Gunakan teks biasa sahaja.
6. Panjang respons antara 100-200 patah perkataan.`;

  const userPrompt = `Maklum balas rakyat:
${input.raw_text}

Ringkasan isu:
${input.cleaned_summary || input.raw_text}

Sila hasilkan respons yang sesuai.`;

  const response = await fetch(`${LLM_ENDPOINT}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${LLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: LLM_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 800,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`LLM API error ${response.status}: ${errorText}`);
  }

  const data = await response.json() as { choices: Array<{ message: { content: string } }> };
  const content = data.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new Error('LLM returned empty response');
  }

  return content;
}
