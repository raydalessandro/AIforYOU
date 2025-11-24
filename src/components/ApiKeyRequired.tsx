import React, { useState } from 'react';
import { Key, Check, X, ChefHat, Sparkles } from 'lucide-react';
import { anthropicClient } from '@shared/api/deepseekClient';

interface ApiKeyRequiredProps {
  onApiKeySet: () => void;
}

export const ApiKeyRequired: React.FC<ApiKeyRequiredProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!apiKey.trim()) {
      setError('Inserisci una API key valida');
      return;
    }

    try {
      anthropicClient.setApiKey(apiKey.trim());
      setSaved(true);
      setError('');
      
      setTimeout(() => {
        onApiKeySet();
      }, 1500);
    } catch (err) {
      setError('Errore nel salvataggio della chiave API');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ChefHat className="w-12 h-12 text-orange-600" />
            <h1 className="text-4xl font-bold text-gray-800">MenuAI</h1>
          </div>
          <p className="text-gray-600 text-lg mb-2">Crea il tuo menù personalizzato con l'intelligenza artificiale</p>
          <div className="flex items-center justify-center gap-2 text-orange-500">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium">Powered by Anthropic Claude</span>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Key className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-semibold text-gray-800">Configura API Key</h2>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Per utilizzare MenuAI, è necessaria un'API key di Anthropic. Puoi ottenerla gratuitamente su{' '}
              <a
                href="https://console.anthropic.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 hover:underline font-medium"
              >
                console.anthropic.com
              </a>
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key Anthropic
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setError('');
                    setSaved(false);
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="sk-ant-..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-400 focus:outline-none text-sm"
                  autoFocus
                />
                {error && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <X className="w-4 h-4" />
                    {error}
                  </p>
                )}
                {saved && (
                  <p className="text-green-500 text-sm mt-2 flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    API Key salvata con successo! Accesso in corso...
                  </p>
                )}
              </div>

              <button
                onClick={handleSave}
                disabled={saved || !apiKey.trim()}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
              >
                {saved ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Accesso in corso...</span>
                  </>
                ) : (
                  <>
                    <Key className="w-5 h-5" />
                    <span>Salva e Continua</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-xs text-gray-500 text-center">
              La tua API key viene salvata localmente nel browser e non viene condivisa con nessuno.
              <br />
              Puoi modificarla o rimuoverla in qualsiasi momento dalle impostazioni.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

