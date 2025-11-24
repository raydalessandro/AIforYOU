import { AppError } from '../errors/AppError';
import { storage } from '../storage/localStorage';

interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AnthropicResponse {
  content: Array<{ text: string }>;
  error?: {
    message: string;
    type: string;
  };
}

export class AnthropicClient {
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
    model: string = 'claude-sonnet-4-20250514',
    maxTokens: number = 4000
  ): Promise<string> {
    if (!this.apiKey) {
      throw new AppError(
        'API key non configurata. Inserisci la tua API key di Anthropic nelle impostazioni.',
        'MISSING_API_KEY',
        401
      );
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          max_tokens: maxTokens,
          messages: [
            { role: 'user' as const, content: prompt }
          ],
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

      const data: AnthropicResponse = await response.json();
      
      if (data.error) {
        throw new AppError(data.error.message, 'API_ERROR');
      }

      if (!data.content || data.content.length === 0) {
        throw new AppError('Nessuna risposta ricevuta dall\'API', 'EMPTY_RESPONSE');
      }

      return data.content[0].text;
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

export const anthropicClient = new AnthropicClient();

