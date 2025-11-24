const API_KEY_STORAGE_KEY = 'deepseek_api_key';

export const storage = {
  getApiKey(): string | null {
    try {
      return localStorage.getItem(API_KEY_STORAGE_KEY);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },

  setApiKey(key: string): void {
    try {
      localStorage.setItem(API_KEY_STORAGE_KEY, key);
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },

  removeApiKey(): void {
    try {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
};

