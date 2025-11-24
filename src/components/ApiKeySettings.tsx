import React, { useState, useEffect } from 'react';
import { Settings, Key, Check, X } from 'lucide-react';
import { deepseekClient } from '@shared/api/deepseekClient';

interface ApiKeySettingsProps {
  onApiKeySet?: () => void;
}

export const ApiKeySettings: React.FC<ApiKeySettingsProps> = ({ onApiKeySet }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const existingKey = deepseekClient.getApiKey();
    if (existingKey) {
      setApiKey(existingKey);
    }
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) {
      setError('Inserisci una API key valida');
      return;
    }

    try {
      deepseekClient.setApiKey(apiKey.trim());
      setSaved(true);
      setError('');
      onApiKeySet?.();
      
      setTimeout(() => {
        setSaved(false);
        setIsOpen(false);
      }, 2000);
    } catch (err) {
      setError('Errore nel salvataggio della chiave API');
    }
  };

  const handleRemove = () => {
    deepseekClient.setApiKey('');
    setApiKey('');
    setSaved(false);
    setError('');
    // Notifica il componente padre che l'API key è stata rimossa
    if (onApiKeySet) {
      // Forza il reload della pagina per tornare alla schermata di configurazione
      window.location.reload();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors z-50"
        title="Impostazioni API Key"
      >
        <Settings className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-2 mb-4">
              <Key className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-semibold text-gray-800">Configura API Key</h2>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Inserisci la tua API key di DeepSeek per utilizzare il servizio.
              Puoi ottenerla su{' '}
              <a
                href="https://platform.deepseek.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 hover:underline"
              >
                platform.deepseek.com
              </a>
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key DeepSeek
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setError('');
                    setSaved(false);
                  }}
                  placeholder="sk-..."
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-400 focus:outline-none"
                />
                {error && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <X className="w-4 h-4" />
                    {error}
                  </p>
                )}
                {saved && (
                  <p className="text-green-500 text-sm mt-1 flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    API Key salvata con successo!
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                >
                  Salva
                </button>
                {deepseekClient.getApiKey() && (
                  <button
                    onClick={handleRemove}
                    className="px-4 py-2 border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Rimuovi
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setError('');
                    setSaved(false);
                  }}
                  className="px-4 py-2 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Chiudi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

