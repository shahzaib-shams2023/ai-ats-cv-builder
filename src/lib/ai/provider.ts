export interface LLMConfig {
  provider?: 'gemini' | 'openai' | 'anthropic' | 'custom' | 'auto';
  apiKey?: string;
  model?: string;
  baseUrl?: string;
}

export interface CompletionRequest {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  responseFormat?: 'json' | 'text';
}

/**
 * Gets the active LLM configuration from environment variables or custom overrides
 */
export function getLLMConfig(override?: Partial<LLMConfig>): LLMConfig {
  const geminiKey = override?.apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const openaiKey = override?.apiKey || process.env.OPENAI_API_KEY;
  const anthropicKey = override?.apiKey || process.env.ANTHROPIC_API_KEY;

  if (override?.provider && override.provider !== 'auto') {
    return {
      provider: override.provider,
      apiKey: override.apiKey,
      model: override.model,
      baseUrl: override.baseUrl
    };
  }

  if (geminiKey) {
    return {
      provider: 'gemini',
      apiKey: geminiKey,
      model: override?.model || 'gemini-1.5-flash'
    };
  }

  if (openaiKey) {
    return {
      provider: 'openai',
      apiKey: openaiKey,
      model: override?.model || 'gpt-4o-mini'
    };
  }

  if (anthropicKey) {
    return {
      provider: 'anthropic',
      apiKey: anthropicKey,
      model: override?.model || 'claude-3-5-haiku-20241022'
    };
  }

  return {
    provider: 'auto',
    model: 'built-in-nlp'
  };
}

/**
 * Call the configured LLM or return null if using built-in NLP heuristics
 */
export async function callLLM(
  req: CompletionRequest,
  configOverride?: Partial<LLMConfig>
): Promise<string | null> {
  const config = getLLMConfig(configOverride);

  // If no external provider configured, return null to use built-in NLP heuristic engine
  if (!config.apiKey || config.provider === 'auto') {
    return null;
  }

  try {
    if (config.provider === 'gemini') {
      const model = config.model || 'gemini-1.5-flash';
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.apiKey}`;
      
      const contents = [
        {
          role: 'user',
          parts: [
            { text: `${req.systemPrompt}\n\n${req.userPrompt}` }
          ]
        }
      ];

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: req.temperature ?? 0.2,
            responseMimeType: req.responseFormat === 'json' ? 'application/json' : 'text/plain'
          }
        })
      });

      if (!res.ok) {
        console.warn(`Gemini API returned ${res.status}: ${await res.text()}`);
        return null;
      }

      const data = await res.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
    }

    if (config.provider === 'openai' || config.provider === 'custom') {
      const baseUrl = config.baseUrl || 'https://api.openai.com/v1';
      const model = config.model || 'gpt-4o-mini';

      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: req.systemPrompt },
            { role: 'user', content: req.userPrompt }
          ],
          temperature: req.temperature ?? 0.2,
          response_format: req.responseFormat === 'json' ? { type: 'json_object' } : undefined
        })
      });

      if (!res.ok) {
        console.warn(`OpenAI API returned ${res.status}: ${await res.text()}`);
        return null;
      }

      const data = await res.json();
      return data?.choices?.[0]?.message?.content || null;
    }

    if (config.provider === 'anthropic') {
      const model = config.model || 'claude-3-5-haiku-20241022';
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model,
          system: req.systemPrompt,
          messages: [{ role: 'user', content: req.userPrompt }],
          max_tokens: 4096,
          temperature: req.temperature ?? 0.2
        })
      });

      if (!res.ok) {
        console.warn(`Anthropic API returned ${res.status}: ${await res.text()}`);
        return null;
      }

      const data = await res.json();
      return data?.content?.[0]?.text || null;
    }
  } catch (err) {
    console.warn('LLM call failed, falling back to built-in NLP engine:', err);
  }

  return null;
}

