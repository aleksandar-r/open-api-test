import { enqueueSnackbar } from 'notistack';
import * as React from 'react';
import { OpenAI } from 'openai';
import * as Common from '../../common';

export function useOpenAIDraft() {
  const [loading, setLoading] = React.useState(false);

  const client = React.useMemo(() => {
    return new OpenAI({
      apiKey: Common.OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });
  }, []);
  const chat = async (
    messages: { role: 'system' | 'user'; content: string }[]
  ): Promise<string | null> => {
    setLoading(true);

    try {
      const res = await client.chat.completions.create({
        model: 'gpt-3.5-turbo-0125',
        messages,
        stream: false
      });

      return res.choices[0].message?.content ?? '';
    } catch (err: unknown) {
      enqueueSnackbar(
        err instanceof Error ? err?.message : 'Unknown error occurred.',
        {
          variant: 'error'
        }
      );
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

  return { generate, summarize, loading };
}
