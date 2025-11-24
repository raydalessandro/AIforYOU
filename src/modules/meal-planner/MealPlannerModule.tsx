import React, { useState } from 'react';
import { ChefHat } from 'lucide-react';
import { MealPlannerForm } from './components/MealPlannerForm';
import { MealPlanDisplay } from './components/MealPlanDisplay';
import { ShoppingListDisplay } from './components/ShoppingListDisplay';
import { mealPlanService } from './services/mealPlanService';
import { MealPlannerFormData } from '@shared/types';
import { handleError } from '@shared/utils/errorHandler';

const initialFormData: MealPlannerFormData = {
  numPeople: 2,
  people: [
    { age: 30, gender: 'M' },
    { age: 28, gender: 'F' }
  ],
  duration: '7',
  mealType: 'completo',
  season: 'primavera',
  region: 'mediterraneo',
  cuisine: 'mediterraneo',
  mixCuisines: false,
  secondaryCuisine: '',
  weeklyBudget: 100,
  cookingTime: 'medio',
  difficulty: 'facile',
  specialMenus: {
    alchemico: false,
    bambini: false,
    sportivo: false,
    detox: false
  },
  notes: ''
};

export const MealPlannerModule: React.FC = () => {
  const [formData, setFormData] = useState<MealPlannerFormData>(initialFormData);
  const [mealPlan, setMealPlan] = useState<string>('');
  const [shoppingList, setShoppingList] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [generatingList, setGeneratingList] = useState<boolean>(false);

  const generateMealPlan = async () => {
    setLoading(true);
    setMealPlan('');
    setShoppingList('');

    try {
      const generatedMenu = await mealPlanService.generateMealPlan(formData);
      setMealPlan(generatedMenu);

      if (formData.mealType !== 'singolo') {
        await generateShoppingList(generatedMenu);
      } else {
        setShoppingList('ℹ️ La lista della spesa è disponibile solo per menù di più giorni.');
      }
    } catch (error) {
      const errorMessage = handleError(error);
      setMealPlan(`Si è verificato un errore nella generazione del menù: ${errorMessage}`);
      console.error('Errore:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateShoppingList = async (menuText: string) => {
    setGeneratingList(true);

    try {
      const weeks = parseInt(formData.duration) / 7;
      const totalBudget = Math.round(formData.weeklyBudget * weeks);
      
      const list = await mealPlanService.generateShoppingList(menuText, formData, totalBudget);
      setShoppingList(list);
    } catch (error) {
      const errorMessage = handleError(error);
      setShoppingList(`Errore nella generazione della lista della spesa: ${errorMessage}`);
      console.error('Errore:', error);
    } finally {
      setGeneratingList(false);
    }
  };

  const downloadMealPlan = () => {
    const fullContent = `${mealPlan}\n\n${'='.repeat(50)}\n\n${shoppingList}`;
    const element = document.createElement('a');
    const file = new Blob([fullContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `menu-e-spesa-${formData.duration}giorni-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ChefHat className="w-12 h-12 text-orange-600" />
            <h1 className="text-4xl font-bold text-gray-800">MenuAI</h1>
          </div>
          <p className="text-gray-600 text-lg">Crea il tuo menù personalizzato con l'intelligenza artificiale</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <MealPlannerForm
            formData={formData}
            onFormDataChange={setFormData}
            onGenerate={generateMealPlan}
            loading={loading}
          />

          <MealPlanDisplay
            mealPlan={mealPlan}
            loading={loading}
          />

          <ShoppingListDisplay
            shoppingList={shoppingList}
            generatingList={generatingList}
            onDownload={downloadMealPlan}
          />
        </div>

        <div className="text-center mt-8 pb-8 text-gray-500 text-sm">
          <p>✨ Menù generati con intelligenza artificiale • Personalizzati per te</p>
        </div>
      </div>
    </div>
  );
};

