import React from 'react';
import { Utensils, Users, Calendar, MapPin, Sparkles, ChefHat } from 'lucide-react';
import { MealPlannerFormData, Person } from '@shared/types';

interface MealPlannerFormProps {
  formData: MealPlannerFormData;
  onFormDataChange: (data: MealPlannerFormData) => void;
  onGenerate: () => void;
  loading: boolean;
}

const seasons = ['primavera', 'estate', 'autunno', 'inverno'];
const regions = ['Nord Italia', 'Centro Italia', 'Sud Italia', 'Isole'];
const cuisines = ['mediterraneo', 'nord Italia', 'egiziano', 'greco', 'marocchino', 'libanese', 'turco', 'spagnolo'];

export const MealPlannerForm: React.FC<MealPlannerFormProps> = ({
  formData,
  onFormDataChange,
  onGenerate,
  loading,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    onFormDataChange({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSpecialMenuToggle = (menuType: keyof typeof formData.specialMenus) => {
    onFormDataChange({
      ...formData,
      specialMenus: {
        ...formData.specialMenus,
        [menuType]: !formData.specialMenus[menuType],
      },
    });
  };

  const updateNumPeople = (num: number) => {
    const currentPeople = formData.people;
    const newPeople: Person[] = [];
    
    for (let i = 0; i < num; i++) {
      if (currentPeople[i]) {
        newPeople.push(currentPeople[i]);
      } else {
        newPeople.push({ age: 30, gender: 'M' });
      }
    }
    
    onFormDataChange({
      ...formData,
      numPeople: num,
      people: newPeople,
    });
  };

  const updatePerson = (index: number, field: keyof Person, value: string | number) => {
    onFormDataChange({
      ...formData,
      people: formData.people.map((person, i) => 
        i === index ? { ...person, [field]: value } : person
      ),
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6 lg:col-span-1">
      <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-orange-500" />
        Personalizza il tuo menù
      </h2>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <Users className="w-5 h-5" />
          <span>Persone</span>
        </div>
        
        <div className="space-y-4 pl-7">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Numero di persone</label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.numPeople}
              onChange={(e) => updateNumPeople(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="text-center mt-1">
              <span className="inline-block bg-orange-100 text-orange-700 px-4 py-1 rounded-full font-semibold">
                {formData.numPeople} {formData.numPeople === 1 ? 'persona' : 'persone'}
              </span>
            </div>
          </div>
          
          <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
            {formData.people.map((person, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                <div className="text-sm font-semibold text-gray-700 mb-3">
                  Persona {index + 1}
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Età</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={person.age}
                      onChange={(e) => updatePerson(index, 'age', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                    <div className="text-center mt-1">
                      <span className="text-sm font-semibold text-orange-600">
                        {person.age} anni
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Sesso</label>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => updatePerson(index, 'gender', 'M')}
                        className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all ${
                          person.gender === 'M'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        M
                      </button>
                      <button
                        onClick={() => updatePerson(index, 'gender', 'F')}
                        className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all ${
                          person.gender === 'F'
                            ? 'bg-pink-500 text-white'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        F
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <span className="text-xl">💰</span>
          <span>Budget</span>
        </div>
        <div className="pl-7">
          <label className="block text-sm text-gray-600 mb-2">Budget settimanale</label>
          <input
            type="range"
            name="weeklyBudget"
            min="30"
            max="500"
            step="10"
            value={formData.weeklyBudget}
            onChange={handleChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">€30/sett</span>
            <span className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full font-semibold">
              €{formData.weeklyBudget}/settimana
            </span>
            <span className="text-sm text-gray-500">€500/sett</span>
          </div>
          <div className="text-center mt-2 text-sm text-gray-600">
            Budget totale periodo: <span className="font-semibold text-green-600">
              €{Math.round(formData.weeklyBudget * (parseInt(formData.duration) / 7))}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <Calendar className="w-5 h-5" />
          <span>Tipo di menù</span>
        </div>
        <select
          name="mealType"
          value={formData.mealType}
          onChange={handleChange}
          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-400 focus:outline-none"
        >
          <option value="completo">Menù completo (colazione, pranzo, cena)</option>
          <option value="singolo">Singolo pasto (pranzo o cena)</option>
        </select>
      </div>

      {formData.mealType === 'completo' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-700 font-medium">
            <span>⏰</span>
            <span>Durata menù</span>
          </div>
          <select
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-400 focus:outline-none"
          >
            <option value="7">1 settimana (7 giorni)</option>
            <option value="14">2 settimane (14 giorni)</option>
            <option value="30">1 mese (30 giorni)</option>
          </select>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <label className="block text-gray-700 font-medium">Stagione</label>
          <select
            name="season"
            value={formData.season}
            onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-400 focus:outline-none"
          >
            {seasons.map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-700" />
            <label className="block text-gray-700 font-medium">Zona</label>
          </div>
          <select
            name="region"
            value={formData.region}
            onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-400 focus:outline-none"
          >
            {regions.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-700 font-medium">
            <span>⏱️</span>
            <span>Tempo cucina</span>
          </div>
          <select
            name="cookingTime"
            value={formData.cookingTime}
            onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-400 focus:outline-none"
          >
            <option value="veloce">Veloce (15-20 min)</option>
            <option value="medio">Medio (30-45 min)</option>
            <option value="elaborato">Elaborato (60+ min)</option>
          </select>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-700 font-medium">
            <span>📊</span>
            <span>Difficoltà</span>
          </div>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-400 focus:outline-none"
          >
            <option value="facile">Facile</option>
            <option value="media">Media</option>
            <option value="avanzata">Avanzata</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <Utensils className="w-5 h-5" />
          <span>Tipo di cucina</span>
        </div>
        <select
          name="cuisine"
          value={formData.cuisine}
          onChange={handleChange}
          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-400 focus:outline-none"
        >
          {cuisines.map(c => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>

        <div className="flex items-center gap-2 mt-3">
          <input
            type="checkbox"
            name="mixCuisines"
            checked={formData.mixCuisines}
            onChange={handleChange}
            className="w-4 h-4 text-orange-500"
          />
          <label className="text-sm text-gray-600">Mixa con un'altra cucina</label>
        </div>

        {formData.mixCuisines && (
          <select
            name="secondaryCuisine"
            value={formData.secondaryCuisine}
            onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-400 focus:outline-none mt-2"
          >
            <option value="">Seleziona seconda cucina</option>
            {cuisines.filter(c => c !== formData.cuisine).map(c => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <span>✨</span>
          <span>Menù Speciali</span>
        </div>
        <div className="pl-7 space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.specialMenus.alchemico}
              onChange={() => handleSpecialMenuToggle('alchemico')}
              className="w-4 h-4 text-purple-500"
            />
            <label className="text-sm text-gray-600">🔮 Menù Alchemico (equilibrio energetico, segnature)</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.specialMenus.bambini}
              onChange={() => handleSpecialMenuToggle('bambini')}
              className="w-4 h-4 text-pink-500"
            />
            <label className="text-sm text-gray-600">👶 Menù per Bambini (colorato, nutriente, divertente)</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.specialMenus.sportivo}
              onChange={() => handleSpecialMenuToggle('sportivo')}
              className="w-4 h-4 text-blue-500"
            />
            <label className="text-sm text-gray-600">💪 Menù Sportivo (alto proteico, energia)</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.specialMenus.detox}
              onChange={() => handleSpecialMenuToggle('detox')}
              className="w-4 h-4 text-green-500"
            />
            <label className="text-sm text-gray-600">🌿 Menù Detox (depurativo, leggero)</label>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <span>📝</span>
          <span>Note e Richieste</span>
        </div>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Inserisci allergie, intolleranze o richieste particolari...&#10;Es: intolleranza al lattosio, senza glutine, preferenza per piatti vegani la sera, etc."
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-400 focus:outline-none resize-none text-sm"
          rows={4}
        />
      </div>

      <button
        onClick={onGenerate}
        disabled={loading}
        className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Sto creando il tuo menù...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            <span>Genera Menù</span>
          </>
        )}
      </button>
    </div>
  );
};

