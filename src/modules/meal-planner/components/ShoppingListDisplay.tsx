import React from 'react';
import { Download } from 'lucide-react';

interface ShoppingListDisplayProps {
  shoppingList: string;
  generatingList: boolean;
  onDownload: () => void;
}

export const ShoppingListDisplay: React.FC<ShoppingListDisplayProps> = ({
  shoppingList,
  generatingList,
  onDownload,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 lg:col-span-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">🛒</span>
          Lista della spesa
        </h2>
        {shoppingList && !generatingList && (
          <button
            onClick={onDownload}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            Scarica tutto
          </button>
        )}
      </div>
      
      <div className="bg-gray-50 rounded-xl p-6 min-h-[500px] max-h-[700px] overflow-y-auto">
        {!shoppingList && !generatingList && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <span className="text-6xl mb-4 opacity-20">🛒</span>
            <p className="text-center">La lista della spesa apparirà qui automaticamente</p>
          </div>
        )}
        
        {generatingList && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-500 mb-4"></div>
            <p className="text-gray-600">Sto preparando la tua lista della spesa...</p>
          </div>
        )}
        
        {shoppingList && !generatingList && (
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
              {shoppingList}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

