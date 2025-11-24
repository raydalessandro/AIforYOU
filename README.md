# 🍽️ MenuAI - Meal Planner con Intelligenza Artificiale

**MenuAI** è un'applicazione web moderna e intuitiva che utilizza l'intelligenza artificiale (Claude di Anthropic) per generare menù personalizzati e liste della spesa ottimizzate. L'app è stata completamente refactorizzata con TypeScript, architettura modulare e best practices.

🌐 **Live Demo**: [a-ifor-you.vercel.app](https://a-ifor-you.vercel.app)

## ✨ Funzionalità

### 🎯 Personalizzazione Avanzata
- **Gestione Persone**: Configura numero, età e sesso per ogni persona
- **Budget Flessibile**: Imposta budget settimanale da €30 a €500
- **Tipi di Menù**: 
  - Menù completo (colazione, pranzo, cena)
  - Singolo pasto (pranzo o cena)
- **Durata Personalizzabile**: 7, 14 o 30 giorni

### 🌍 Contesto Geografico e Stagionale
- **Stagioni**: Primavera, Estate, Autunno, Inverno
- **Zone Geografiche**: Nord Italia, Centro Italia, Sud Italia, Isole
- **Cucine**: Mediterraneo, Nord Italia, Egiziano, Greco, Marocchino, Libanese, Turco, Spagnolo
- **Mix di Cucine**: Combina due cucine diverse per varietà

### ⚙️ Requisiti Culinari
- **Tempo di Preparazione**: Veloce (15-20 min), Medio (30-45 min), Elaborato (60+ min)
- **Difficoltà**: Facile, Media, Avanzata

### 🎨 Menù Speciali
- **🔮 Menù Alchemico**: Equilibrio energetico basato su principi di alchimia e dottrina delle segnature
- **👶 Menù per Bambini**: Ricette semplici, colorate, nutrienti e appetitose
- **💪 Menù Sportivo**: Alto contenuto proteico, ottimizzato per performance
- **🌿 Menù Detox**: Depurativo, leggero e rigenerante

### 📝 Note e Richieste Personalizzate
- Supporto per allergie e intolleranze
- Preferenze alimentari (vegano, senza glutine, etc.)
- Richieste particolari per ogni pasto

### 🛒 Lista della Spesa Intelligente
- Lista dettagliata con quantità precise
- Prezzi stimati realistici per il mercato italiano
- Organizzazione per categorie
- Calcolo del totale e budget rimanente
- Consigli per acquisti ottimizzati
- Download in formato testo

## 🛠️ Tecnologie

- **Frontend Framework**: React 18.2
- **Linguaggio**: TypeScript 5.0
- **Build Tool**: Vite 4.4
- **Styling**: Tailwind CSS 3.3
- **Icons**: Lucide React
- **AI Provider**: Anthropic Claude (Sonnet 4)
- **Deployment**: Vercel

## 📦 Installazione

### Prerequisiti
- Node.js 18+ e npm
- API Key di Anthropic ([ottienila qui](https://console.anthropic.com/))

### Setup Locale

1. **Clona il repository**
   ```bash
   git clone https://github.com/raydalessandro/AIforYOU.git
   cd AIforYOU
   ```

2. **Installa le dipendenze**
   ```bash
   npm install
   ```

3. **Avvia il server di sviluppo**
   ```bash
   npm run dev
   ```

4. **Configura l'API Key**
   - Apri l'app nel browser (solitamente `http://localhost:5173`)
   - Clicca sul pulsante delle impostazioni in basso a destra
   - Inserisci la tua API Key di Anthropic
   - Salva

### Accesso da Rete Locale

L'app è configurata per essere accessibile da altri dispositivi sulla stessa rete WiFi:

1. Avvia il server con `npm run dev`
2. Trova l'IP locale del tuo PC (es. `192.168.1.5`)
3. Accedi da telefono/tablet: `http://[IP_DEL_PC]:5173`

## 🏗️ Build per Produzione

```bash
npm run build
```

I file compilati saranno nella cartella `dist/`.

## 📁 Struttura del Progetto

```
AIforYOU/
├── src/
│   ├── components/          # Componenti condivisi
│   │   └── ApiKeySettings.tsx
│   ├── modules/            # Moduli dell'applicazione
│   │   └── meal-planner/
│   │       ├── components/ # Componenti del meal planner
│   │       │   ├── MealPlannerForm.tsx
│   │       │   ├── MealPlanDisplay.tsx
│   │       │   └── ShoppingListDisplay.tsx
│   │       ├── services/  # Servizi business logic
│   │       │   └── mealPlanService.ts
│   │       ├── types.ts    # Tipi specifici del modulo
│   │       └── MealPlannerModule.tsx
│   ├── shared/             # Codice condiviso
│   │   ├── api/           # Client API
│   │   │   └── deepseekClient.ts (Anthropic Client)
│   │   ├── errors/       # Gestione errori
│   │   │   └── AppError.ts
│   │   ├── storage/      # Utilities storage
│   │   │   └── localStorage.ts
│   │   ├── types/         # Tipi condivisi
│   │   │   └── index.ts
│   │   └── utils/        # Utilities
│   │       └── errorHandler.ts
│   ├── App.tsx           # Componente principale
│   ├── main.tsx          # Entry point
│   └── index.css         # Stili globali
├── docs/                 # Documentazione
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🎨 Architettura

L'applicazione segue un'architettura modulare e scalabile:

- **Modularità**: Ogni feature è un modulo indipendente
- **Separation of Concerns**: Business logic separata dai componenti UI
- **Type Safety**: TypeScript per type checking completo
- **Error Handling**: Gestione centralizzata degli errori
- **Storage**: Astrazione per localStorage
- **API Client**: Client riutilizzabile per chiamate API

## 🔧 Configurazione

### Variabili d'Ambiente (Opzionale)

Puoi configurare l'API Key anche tramite variabili d'ambiente, ma attualmente l'app usa localStorage per la configurazione tramite UI.

### Vite Configuration

Il file `vite.config.ts` include:
- Alias TypeScript (`@shared`, `@modules`, `@`)
- Server configurato per accesso da rete locale (`host: '0.0.0.0'`)

## 📖 Utilizzo

1. **Configura l'API Key** (prima volta)
   - Clicca sul pulsante impostazioni
   - Inserisci la tua API Key di Anthropic

2. **Personalizza il Menù**
   - Seleziona numero di persone e caratteristiche
   - Imposta budget e durata
   - Scegli stagione, zona e tipo di cucina
   - Aggiungi menù speciali se necessario
   - Inserisci note particolari (allergie, preferenze)

3. **Genera il Menù**
   - Clicca su "Genera Menù"
   - Attendi la generazione (può richiedere alcuni secondi)

4. **Visualizza e Scarica**
   - Il menù apparirà nel pannello centrale
   - La lista della spesa (per menù completi) apparirà nel pannello destro
   - Clicca "Scarica tutto" per salvare menù e lista in un file di testo

## 🤝 Contribuire

I contributi sono benvenuti! Per contribuire:

1. Fai un fork del repository
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Committa le modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Pusha sul branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

Vedi [docs/ADDING_MODULES.md](docs/ADDING_MODULES.md) per informazioni su come aggiungere nuovi moduli.

## 📝 Licenza

Questo progetto è rilasciato sotto licenza MIT. Vedi [LICENSE](LICENSE) per dettagli.

## 🙏 Ringraziamenti

- [Anthropic](https://www.anthropic.com/) per l'API Claude
- [Vercel](https://vercel.com/) per l'hosting
- [Lucide](https://lucide.dev/) per le icone
- [Tailwind CSS](https://tailwindcss.com/) per lo styling

## 📧 Contatti

- **Repository**: [https://github.com/raydalessandro/AIforYOU](https://github.com/raydalessandro/AIforYOU)
- **Live Demo**: [https://a-ifor-you.vercel.app](https://a-ifor-you.vercel.app)

---

⭐ Se ti piace questo progetto, considera di lasciare una stella su GitHub!
