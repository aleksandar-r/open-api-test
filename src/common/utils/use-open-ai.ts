import * as React from 'react';
import { OpenAI } from 'openai';
import * as Common from '../../common';

export function useOpenAIDraft() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<null | string>(null);

  const client = React.useMemo(() => {
    return new OpenAI({
      apiKey: Common.OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });
  }, []);
  console.log(Common.OPENAI_API_KEY);
  const chat = async (
    messages: { role: 'system' | 'user'; content: string }[]
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const res = await client.chat.completions.create({
        model: 'gpt-3.5-turbo-0125',
        messages,
        stream: false
      });

      return res.choices[0].message?.content ?? '';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: unknown) {
      setError(err instanceof Error ? err?.message : 'Unknown error occurred.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generate = async (prompt: string) =>
    await chat([
      {
        role: 'system',
        content: 'You are a helpful assistant that writes report descriptions.'
      },
      { role: 'user', content: prompt }
    ]);

  const summarize = async (text: string) =>
    await chat([
      {
        role: 'system',
        content:
          'You summarize detailed business reports into concise overviews.'
      },
      { role: 'user', content: `Summarize this report:\n\n${text}` }
    ]);

  return { generate, summarize, loading, error };
}
