import { anthropicClient } from '@shared/api/deepseekClient';
import { MealPlannerFormData } from '@shared/types';
import { AppError } from '@shared/errors/AppError';
import { handleError } from '@shared/utils/errorHandler';

export class MealPlanService {
  async generateMealPlan(formData: MealPlannerFormData): Promise<string> {
    try {
      const weeks = formData.mealType === 'singolo' 
        ? 1/7 
        : parseInt(formData.duration) / 7;
      
      const totalBudget = formData.mealType === 'singolo' 
        ? Math.round(formData.weeklyBudget / 7 / 3) 
        : Math.round(formData.weeklyBudget * weeks);

      const activeSpecialMenus = Object.keys(formData.specialMenus)
        .filter(key => formData.specialMenus[key as keyof typeof formData.specialMenus])
        .map(key => {
          const names: Record<string, string> = {
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

      const prompt = this.buildMealPlanPrompt(formData, mealTypeText, totalBudget, activeSpecialMenus);

      return await anthropicClient.generateMessage(prompt, 'claude-sonnet-4-20250514', 4000);
    } catch (error) {
      const errorMessage = handleError(error);
      throw new AppError(
        `Errore nella generazione del menù: ${errorMessage}`,
        'MEAL_PLAN_ERROR'
      );
    }
  }

  async generateShoppingList(
    menuText: string,
    formData: MealPlannerFormData,
    totalBudget: number
  ): Promise<string> {
    try {
      const prompt = this.buildShoppingListPrompt(menuText, formData, totalBudget);
      return await anthropicClient.generateMessage(prompt, 'claude-sonnet-4-20250514', 3000);
    } catch (error) {
      const errorMessage = handleError(error);
      throw new AppError(
        `Errore nella generazione della lista della spesa: ${errorMessage}`,
        'SHOPPING_LIST_ERROR'
      );
    }
  }

  private buildMealPlanPrompt(
    formData: MealPlannerFormData,
    mealTypeText: string,
    totalBudget: number,
    activeSpecialMenus: string[]
  ): string {
    return `Crea un menù dettagliato per ${mealTypeText} con queste caratteristiche:

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

---
`}

Rendi il menù attraente, bilanciato e realizzabile. Aggiungi emoji appropriate per rendere la lettura piacevole.`;
  }

  private buildShoppingListPrompt(
    menuText: string,
    formData: MealPlannerFormData,
    totalBudget: number
  ): string {
    return `Basandoti su questo menù:

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
  }
}

export const mealPlanService = new MealPlanService();

