import { SavedMealPlan } from '../types';

const SAVED_MENUS_STORAGE_KEY = 'saved_meal_plans';

export const savedMenusStorage = {
  getAll(): SavedMealPlan[] {
    try {
      const data = localStorage.getItem(SAVED_MENUS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading saved menus:', error);
      return [];
    }
  },

  save(mealPlan: SavedMealPlan): void {
    try {
      const menus = this.getAll();
      menus.unshift(mealPlan); // Aggiungi in cima
      localStorage.setItem(SAVED_MENUS_STORAGE_KEY, JSON.stringify(menus));
    } catch (error) {
      console.error('Error saving menu:', error);
    }
  },

  delete(id: string): void {
    try {
      const menus = this.getAll();
      const filtered = menus.filter(m => m.id !== id);
      localStorage.setItem(SAVED_MENUS_STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting menu:', error);
    }
  },

  toggleFavorite(id: string): void {
    try {
      const menus = this.getAll();
      const updated = menus.map(m => 
        m.id === id ? { ...m, isFavorite: !m.isFavorite } : m
      );
      localStorage.setItem(SAVED_MENUS_STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  },

  getById(id: string): SavedMealPlan | null {
    try {
      const menus = this.getAll();
      return menus.find(m => m.id === id) || null;
    } catch (error) {
      console.error('Error getting menu by id:', error);
      return null;
    }
  },

  clear(): void {
    try {
      localStorage.removeItem(SAVED_MENUS_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing menus:', error);
    }
  },
};

