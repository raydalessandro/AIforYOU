export interface Person {
  age: number;
  gender: 'M' | 'F';
}

export interface SpecialMenus {
  alchemico: boolean;
  bambini: boolean;
  sportivo: boolean;
  detox: boolean;
}

export interface MealPlannerFormData {
  numPeople: number;
  people: Person[];
  duration: string;
  mealType: 'completo' | 'singolo';
  season: string;
  region: string;
  cuisine: string;
  mixCuisines: boolean;
  secondaryCuisine: string;
  weeklyBudget: number;
  cookingTime: 'veloce' | 'medio' | 'elaborato';
  difficulty: 'facile' | 'media' | 'avanzata';
  specialMenus: SpecialMenus;
  notes: string;
}

export interface SavedMealPlan {
  id: string;
  title: string;
  mealPlan: string;
  shoppingList: string;
  formData: MealPlannerFormData;
  createdAt: number;
  isFavorite: boolean;
  preview?: string; // Anteprima del menu (prime 200 caratteri)
}
