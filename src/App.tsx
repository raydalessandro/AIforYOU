import React, { useState, useEffect } from 'react';
import { MealPlannerModule } from './modules/meal-planner/MealPlannerModule';
import { ApiKeySettings } from './components/ApiKeySettings';
import { ApiKeyRequired } from './components/ApiKeyRequired';
import { anthropicClient } from './shared/api/deepseekClient';

function App() {
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);

  useEffect(() => {
    // Controlla se l'API key è presente al caricamento
    const checkApiKey = () => {
      const apiKey = anthropicClient.getApiKey();
      setHasApiKey(!!apiKey);
    };

    checkApiKey();
  }, []);

  const handleApiKeySet = () => {
    setHasApiKey(true);
  };

  // Mostra loading mentre controlla l'API key
  if (hasApiKey === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500"></div>
      </div>
    );
  }

  // Se non c'è API key, mostra la schermata di configurazione
  if (!hasApiKey) {
    return <ApiKeyRequired onApiKeySet={handleApiKeySet} />;
  }

  // Se c'è API key, mostra il meal planner
  return (
    <>
      <MealPlannerModule />
      <ApiKeySettings onApiKeySet={handleApiKeySet} />
    </>
  );
}

export default App;

