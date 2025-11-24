import React, { useState, useEffect } from 'react';
import { BookOpen, Heart, Trash2, Download, Search, X, Star, Calendar, Users, Euro } from 'lucide-react';
import { SavedMealPlan } from '@shared/types';
import { savedMenusStorage } from '@shared/storage/savedMenusStorage';

export const SavedMenusModule: React.FC = () => {
  const [menus, setMenus] = useState<SavedMealPlan[]>([]);
  const [filteredMenus, setFilteredMenus] = useState<SavedMealPlan[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<SavedMealPlan | null>(null);

  useEffect(() => {
    loadMenus();
  }, []);

  useEffect(() => {
    filterMenus();
  }, [menus, searchQuery, showFavoritesOnly]);

  const loadMenus = () => {
    const saved = savedMenusStorage.getAll();
    // Ordina: preferiti prima, poi per data (più recenti prima)
    const sorted = saved.sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return b.createdAt - a.createdAt;
    });
    setMenus(sorted);
  };

  const filterMenus = () => {
    let filtered = [...menus];

    if (showFavoritesOnly) {
      filtered = filtered.filter(m => m.isFavorite);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(m => 
        m.title.toLowerCase().includes(query) ||
        m.mealPlan.toLowerCase().includes(query) ||
        m.formData.cuisine.toLowerCase().includes(query) ||
        m.formData.season.toLowerCase().includes(query)
      );
    }

    setFilteredMenus(filtered);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Sei sicuro di voler eliminare questo menu?')) {
      savedMenusStorage.delete(id);
      loadMenus();
      if (selectedMenu?.id === id) {
        setSelectedMenu(null);
      }
    }
  };

  const handleToggleFavorite = (id: string) => {
    savedMenusStorage.toggleFavorite(id);
    loadMenus();
    if (selectedMenu?.id === id) {
      const updated = savedMenusStorage.getById(id);
      if (updated) setSelectedMenu(updated);
    }
  };

  const handleDownload = (menu: SavedMealPlan) => {
    const fullContent = `${menu.mealPlan}\n\n${'='.repeat(50)}\n\n${menu.shoppingList}`;
    const element = document.createElement('a');
    const file = new Blob([fullContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `menu-${menu.title.replace(/\s+/g, '-')}-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-10 h-10 text-orange-600" />
            <h1 className="text-4xl font-bold text-gray-800">Menu Salvati</h1>
          </div>
          <p className="text-gray-600 text-lg">Gestisci i tuoi menu personalizzati</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cerca menu per titolo, cucina, stagione..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
                showFavoritesOnly
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Star className={`w-5 h-5 ${showFavoritesOnly ? 'fill-current' : ''}`} />
              <span>Solo Preferiti</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Menu List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {filteredMenus.length} {filteredMenus.length === 1 ? 'menu' : 'menu'}
                </h2>
              </div>
              
              {filteredMenus.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium mb-2">Nessun menu trovato</p>
                  <p className="text-sm">
                    {menus.length === 0 
                      ? 'I menu che crei verranno salvati qui'
                      : 'Prova a modificare i filtri di ricerca'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                  {filteredMenus.map((menu) => (
                    <div
                      key={menu.id}
                      onClick={() => setSelectedMenu(menu)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedMenu?.id === menu.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-800 flex-1 line-clamp-2">
                          {menu.title}
                        </h3>
                        {menu.isFavorite && (
                          <Star className="w-5 h-5 text-orange-500 fill-current flex-shrink-0 ml-2" />
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-2 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {menu.formData.numPeople}
                        </span>
                        <span className="flex items-center gap-1">
                          <Euro className="w-3 h-3" />
                          €{menu.formData.weeklyBudget}/sett
                        </span>
                        <span>{menu.formData.cuisine}</span>
                        <span>{menu.formData.season}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {formatDate(menu.createdAt)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Menu Detail */}
          <div className="lg:col-span-2">
            {selectedMenu ? (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-gray-800">{selectedMenu.title}</h2>
                      {selectedMenu.isFavorite && (
                        <Star className="w-6 h-6 text-orange-500 fill-current" />
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {selectedMenu.formData.numPeople} persone
                      </span>
                      <span className="flex items-center gap-1">
                        <Euro className="w-4 h-4" />
                        Budget: €{selectedMenu.formData.weeklyBudget}/settimana
                      </span>
                      <span>{selectedMenu.formData.cuisine}</span>
                      <span>{selectedMenu.formData.season}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(selectedMenu.createdAt)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleFavorite(selectedMenu.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        selectedMenu.isFavorite
                          ? 'bg-orange-100 text-orange-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={selectedMenu.isFavorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
                    >
                      <Heart className={`w-5 h-5 ${selectedMenu.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleDownload(selectedMenu)}
                      className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                      title="Scarica menu"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(selectedMenu.id)}
                      className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                      title="Elimina menu"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Utensils className="w-5 h-5 text-orange-500" />
                      Menù
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed text-sm">
                        {selectedMenu.mealPlan}
                      </pre>
                    </div>
                  </div>

                  {selectedMenu.shoppingList && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <span className="text-xl">🛒</span>
                        Lista della Spesa
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                        <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed text-sm">
                          {selectedMenu.shoppingList}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <BookOpen className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium text-gray-600 mb-2">Seleziona un menu</p>
                <p className="text-sm text-gray-500">Scegli un menu dalla lista per visualizzarlo</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

