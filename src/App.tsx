import React, { useState, useEffect } from 'react';
import { MealPlannerModule } from './modules/meal-planner/MealPlannerModule';
import { SavedMenusModule } from './modules/saved-menus/SavedMenusModule';
import { ApiKeySettings } from './components/ApiKeySettings';
import { ApiKeyRequired } from './components/ApiKeyRequired';
import { Header, Page } from './components/Header';
import { deepseekClient } from './shared/api/deepseekClient';

function App() {
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('home');

  useEffect(() => {
    // Controlla se l'API key è presente al caricamento
    const checkApiKey = () => {
      const apiKey = deepseekClient.getApiKey();
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

  // Se c'è API key, mostra l'app con navigazione
  return (
    <>
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      {currentPage === 'home' ? (
        <MealPlannerModule />
      ) : (
        <SavedMenusModule />
      )}
      <ApiKeySettings onApiKeySet={handleApiKeySet} />
    </>
  );
}

export default App;

