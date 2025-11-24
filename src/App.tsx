import React from 'react';
import { MealPlannerModule } from './modules/meal-planner/MealPlannerModule';
import { ApiKeySettings } from './components/ApiKeySettings';

function App() {
  return (
    <>
      <MealPlannerModule />
      <ApiKeySettings />
    </>
  );
}

export default App;

