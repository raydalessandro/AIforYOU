import React from 'react';
import { Utensils, ChefHat } from 'lucide-react';

interface MealPlanDisplayProps {
  mealPlan: string;
  loading: boolean;
}

export const MealPlanDisplay: React.FC<MealPlanDisplayProps> = ({
  mealPlan,
  loading,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 lg:col-span-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <Utensils className="w-6 h-6 text-orange-500" />
          Il tuo menù
        </h2>
      </div>
      
      <div className="bg-gray-50 rounded-xl p-6 min-h-[500px] max-h-[700px] overflow-y-auto">
        {!mealPlan && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <ChefHat className="w-20 h-20 mb-4 opacity-20" />
            <p className="text-center">Il tuo menù personalizzato apparirà qui</p>
          </div>
        )}
        
        {loading && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mb-4"></div>
            <p className="text-gray-600">Sto preparando il tuo menù perfetto...</p>
          </div>
        )}
        
        {mealPlan && !loading && (
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
              {mealPlan}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

