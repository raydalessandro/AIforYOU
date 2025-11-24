import React, { useState } from 'react';
import { ChefHat, Save } from 'lucide-react';
import { MealPlannerForm } from './components/MealPlannerForm';
import { MealPlanDisplay } from './components/MealPlanDisplay';
import { ShoppingListDisplay } from './components/ShoppingListDisplay';
import { mealPlanService } from './services/mealPlanService';
import { MealPlannerFormData, SavedMealPlan } from '@shared/types';
import { handleError } from '@shared/utils/errorHandler';
import { savedMenusStorage } from '@shared/storage/savedMenusStorage';

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

  const saveMealPlan = () => {
    if (!mealPlan) return;

    const title = `Menu ${formData.mealType === 'singolo' ? 'Singolo' : formData.duration + ' giorni'} - ${formData.cuisine} ${formData.season}`;
    
    const savedMenu: SavedMealPlan = {
      id: `menu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      mealPlan,
      shoppingList: shoppingList || '',
      formData: { ...formData },
      createdAt: Date.now(),
      isFavorite: false,
      preview: mealPlan.substring(0, 200) + '...'
    };

    savedMenusStorage.save(savedMenu);
    
    // Mostra notifica
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2';
    notification.innerHTML = '<span>✓ Menu salvato con successo!</span>';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transition = 'opacity 0.3s';
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 pt-4">
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

          <div className="lg:col-span-1">
            <MealPlanDisplay
              mealPlan={mealPlan}
              loading={loading}
            />
            {mealPlan && !loading && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={saveMealPlan}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl"
                >
                  <Save className="w-5 h-5" />
                  Salva Menu
                </button>
              </div>
            )}
          </div>

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

