import React, { useState } from 'react';
import { Utensils, Users, Calendar, MapPin, Sparkles, ChefHat, Download } from 'lucide-react';

const MealPlannerApp = () => {
  const [formData, setFormData] = useState({
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
  });
  
  const [mealPlan, setMealPlan] = useState('');
  const [shoppingList, setShoppingList] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatingList, setGeneratingList] = useState(false);

  const seasons = ['primavera', 'estate', 'autunno', 'inverno'];
  const regions = ['Nord Italia', 'Centro Italia', 'Sud Italia', 'Isole'];
  const cuisines = ['mediterraneo', 'nord Italia', 'egiziano', 'greco', 'marocchino', 'libanese', 'turco', 'spagnolo'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSpecialMenuToggle = (menuType) => {
    setFormData(prev => ({
      ...prev,
      specialMenus: {
        ...prev.specialMenus,
        [menuType]: !prev.specialMenus[menuType]
      }
    }));
  };

  const updateNumPeople = (num) => {
    const currentPeople = formData.people;
    const newPeople = [];
    
    for (let i = 0; i < num; i++) {
      if (currentPeople[i]) {
        newPeople.push(currentPeople[i]);
      } else {
        newPeople.push({ age: 30, gender: 'M' });
      }
    }
    
    setFormData(prev => ({
      ...prev,
      numPeople: num,
      people: newPeople
    }));
  };

  const updatePerson = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      people: prev.people.map((person, i) => 
        i === index ? { ...person, [field]: value } : person
      )
    }));
  };

  const generateMealPlan = async () => {
    setLoading(true);
    setMealPlan('');
    setShoppingList('');
    
    const weeks = formData.mealType === 'singolo' ? 1/7 : parseInt(formData.duration) / 7;
    const totalBudget = formData.mealType === 'singolo' 
      ? Math.round(formData.weeklyBudget / 7 / 3) 
      : Math.round(formData.weeklyBudget * weeks);
    
    const activeSpecialMenus = Object.keys(formData.specialMenus)
      .filter(key => formData.specialMenus[key])
      .map(key => {
        const names = {
          alchemico: 'Menù Alchemico (considera principi di alchimia, dottrina delle segnature, equilibrio dei 3 principi)',
          bambini: 'Menù per Bambini (ricette semplici, colorate, nutrienti e appetitose)',
          sportivo: 'Menù Sportivo (alto contenuto proteico, energia per performance)',
          detox: 'Menù Detox (depurativo, leggero, rigenerante)'
        };
        return names[key];
      });

    const mealTypeText = formData.mealType === 'singolo' 
      ? 'un singolo pasto (pranzo o cena a scelta)'
      : `${formData.duration} giorni completi (colazione, pranzo, cena)`;
    
    try {
      const prompt = `Crea un menù dettagliato per ${mealTypeText} con queste caratteristiche:

PERSONE:
- Numero: ${formData.numPeople}
${formData.people.map((p, i) => `- Persona ${i + 1}: ${p.age} anni, sesso ${p.gender}`).join('\n')}

CONTESTO:
- Stagione: ${formData.season}
- Zona geografica: ${formData.region}
- Cucina principale: ${formData.cuisine}
${formData.mixCuisines ? `- Cucina secondaria da mixare: ${formData.secondaryCuisine}` : ''}

BUDGET:
${formData.mealType === 'singolo' 
  ? `- Budget per questo pasto: circa €${totalBudget}`
  : `- Budget settimanale: €${formData.weeklyBudget}
- Budget totale periodo: €${totalBudget}`}
- Ottimizza il menù per rispettare questo budget

REQUISITI CUCINA:
- Tempo medio disponibile: ${formData.cookingTime === 'veloce' ? '15-20 minuti' : formData.cookingTime === 'medio' ? '30-45 minuti' : '60+ minuti'}
- Difficoltà ricette: ${formData.difficulty}

${activeSpecialMenus.length > 0 ? `MENÙ SPECIALI DA CONSIDERARE:
${activeSpecialMenus.map(menu => `- ${menu}`).join('\n')}` : ''}

${formData.notes ? `NOTE IMPORTANTI E RICHIESTE PARTICOLARI:
${formData.notes}` : ''}

RICHIESTE:
1. ${formData.mealType === 'singolo' ? 'Crea UN SOLO PASTO completo e bilanciato' : 'Crea un menù per colazione, pranzo, cena per ogni giorno'}
2. Usa ingredienti di stagione (${formData.season})
3. Adatta le porzioni per ${formData.numPeople} persone
4. Considera le caratteristiche nutrizionali per le età indicate
5. Includi varietà e equilibrio nutrizionale
6. RISPETTA IL BUDGET indicato scegliendo ingredienti appropriati
7. Rispetta i tempi di preparazione (${formData.cookingTime}) e difficoltà (${formData.difficulty})
${formData.mixCuisines ? `8. Mixa creativamente elementi di cucina ${formData.cuisine} e ${formData.secondaryCuisine}` : ''}
${formData.notes ? '9. RISPETTA TUTTE LE NOTE E RICHIESTE PARTICOLARI indicate sopra' : ''}

FORMATO RISPOSTA:
${formData.mealType === 'singolo' ? `
🍽️ MENÙ SINGOLO PASTO

[Descrizione del pasto]

🥗 PIATTO PRINCIPALE
- Ricetta dettagliata

🥬 CONTORNO
- Ricetta

🍰 DESSERT (opzionale)
- Ricetta

⏱️ Tempo preparazione totale
📊 Difficoltà
💰 Costo stimato

📝 Note e variazioni
` : `Per ogni giorno usa questo formato:

🌅 GIORNO X - [Nome evocativo del giorno]

🍳 COLAZIONE
- Piatto principale
- Accompagnamenti
- Bevanda

🍽️ PRANZO
- Primo/Piatto principale
- Contorno
- Frutta/Dessert

🌙 CENA
- Piatto principale
- Contorno
- Eventuale dessert

📝 Note: [Consigli di preparazione o variazioni]

---`}

Rendi il menù attraente, bilanciato e realizzabile. Aggiungi emoji appropriate per rendere la lettura piacevole.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          messages: [
            { role: "user", content: prompt }
          ]
        })
      });

      const data = await response.json();
      const generatedMenu = data.content[0].text;
      setMealPlan(generatedMenu);
      
      if (formData.mealType !== 'singolo') {
        await generateShoppingList(generatedMenu, totalBudget);
      } else {
        setShoppingList('ℹ️ La lista della spesa è disponibile solo per menù di più giorni.');
      }
      
    } catch (error) {
      setMealPlan("Si è verificato un errore nella generazione del menù. Riprova.");
      console.error("Errore:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateShoppingList = async (menuText, totalBudget) => {
    setGeneratingList(true);
    
    try {
      const prompt = `Basandoti su questo menù:

${menuText}

INFORMAZIONI:
- Periodo: ${formData.duration} giorni
- Numero persone: ${formData.numPeople}
- Budget totale: €${totalBudget}
- Zona: ${formData.region}
- Stagione: ${formData.season}

Crea una LISTA DELLA SPESA DETTAGLIATA con:

1. Tutti gli ingredienti necessari
2. Quantità precise per ${formData.numPeople} persone per ${formData.duration} giorni
3. Prezzo stimato per prodotto (prezzi realistici italiani, considera supermercati medi)
4. Totale per categoria
5. TOTALE COMPLESSIVO

FORMATO RICHIESTO:

🛒 LISTA DELLA SPESA - ${formData.duration} GIORNI
Budget disponibile: €${totalBudget}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🥖 PANE E CEREALI
• [Prodotto] - [quantità] - €[prezzo]
• [Prodotto] - [quantità] - €[prezzo]
SUBTOTALE: €[totale]

🥩 CARNE E PESCE
• [Prodotto] - [quantità] - €[prezzo]
SUBTOTALE: €[totale]

🥛 LATTICINI E UOVA
• [Prodotto] - [quantità] - €[prezzo]
SUBTOTALE: €[totale]

🥕 FRUTTA E VERDURA
• [Prodotto] - [quantità] - €[prezzo]
SUBTOTALE: €[totale]

🫘 LEGUMI E CONSERVE
• [Prodotto] - [quantità] - €[prezzo]
SUBTOTALE: €[totale]

🧂 SPEZIE E CONDIMENTI
• [Prodotto] - [quantità] - €[prezzo]
SUBTOTALE: €[totale]

🥤 BEVANDE
• [Prodotto] - [quantità] - €[prezzo]
SUBTOTALE: €[totale]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 TOTALE COMPLESSIVO: €[totale]
📊 Budget rimanente: €[differenza]

💡 CONSIGLI:
- Dove conviene comprare cosa
- Cosa comprare fresco e quando
- Possibili sostituzioni per risparmiare

IMPORTANTE: 
- Prezzi realistici per l'Italia
- Rispetta il budget di €${totalBudget}
- Quantità precise e pratiche`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 3000,
          messages: [
            { role: "user", content: prompt }
          ]
        })
      });

      const data = await response.json();
      setShoppingList(data.content[0].text);
      
    } catch (error) {
      setShoppingList("Errore nella generazione della lista della spesa. Riprova.");
      console.error("Errore:", error);
    } finally {
      setGeneratingList(false);
    }
  };

  const downloadMealPlan = () => {
    const fullContent = `${mealPlan}\n\n${'='.repeat(50)}\n\n${shoppingList}`;
    const element = document.createElement("a");
    const file = new Blob([fullContent], {type: 'text/plain'});
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
                rows="4"
              />
            </div>

            <button
              onClick={generateMealPlan}
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

          <div className="bg-white rounded-2xl shadow-xl p-6 lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <span className="text-2xl">🛒</span>
                Lista della spesa
              </h2>
              {shoppingList && !generatingList && (
                <button
                  onClick={downloadMealPlan}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Scarica tutto
                </button>
              )}
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 min-h-[500px] max-h-[700px] overflow-y-auto">
              {!shoppingList && !generatingList && !loading && (
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
        </div>

        <div className="text-center mt-8 pb-8 text-gray-500 text-sm">
          <p>✨ Menù generati con intelligenza artificiale • Personalizzati per te</p>
        </div>
      </div>
    </div>
  );
};

export default MealPlannerApp;
