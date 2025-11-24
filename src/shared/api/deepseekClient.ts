import { AppError } from '../errors/AppError';
import { storage } from '../storage/localStorage';

interface DeepSeekMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  error?: {
    message: string;
    type: string;
  };
}

export class DeepSeekClient {
  private apiKey: string | null;

  constructor() {
    this.apiKey = storage.getApiKey();
  }

  setApiKey(key: string): void {
    this.apiKey = key;
    storage.setApiKey(key);
  }

  getApiKey(): string | null {
    return this.apiKey;
  }

  async generateMessage(
    prompt: string,
    model: string = 'deepseek-chat',
    maxTokens: number = 4000
  ): Promise<string> {
    if (!this.apiKey) {
      throw new AppError(
        'API key non configurata. Inserisci la tua API key di DeepSeek nelle impostazioni.',
        'MISSING_API_KEY',
        401
      );
    }

    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'user' as const, content: prompt }
          ],
          max_tokens: maxTokens,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new AppError(
          errorData.error?.message || `Errore API: ${response.statusText}`,
          'API_ERROR',
          response.status
        );
      }

      const data: DeepSeekResponse = await response.json();
      
      if (data.error) {
        throw new AppError(data.error.message, 'API_ERROR');
      }

      if (!data.choices || data.choices.length === 0 || !data.choices[0].message?.content) {
        throw new AppError('Nessuna risposta ricevuta dall\'API', 'EMPTY_RESPONSE');
      }

      return data.choices[0].message.content;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Errore nella comunicazione con l'API: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`,
        'NETWORK_ERROR'
      );
    }
  }
}

export const deepseekClient = new DeepSeekClient();
