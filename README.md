# Lifeboard

Aplicación React + Supabase para implementar herramientas de Design Your Life.

## Setup

1. Copiar `.env.example` a `.env` y completar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
2. Ejecutar el SQL de `supabase/schema.sql` en tu proyecto de Supabase.
3. Instalar dependencias:

```bash
npm install
```

4. Correr en desarrollo:

```bash
npm run dev
```
%. Extructura del proyecto:

.
├── .env.example
├── .gitignore
├── README.md
├── index.html
├── package.json
├── postcss.config.js
├── src
│   ├── App.tsx
│   ├── components
│   │   ├── Dashboard.tsx
│   │   ├── FailureReframe.tsx
│   │   ├── GoodTimeJournal.tsx
│   │   ├── Habits.tsx
│   │   ├── Login.tsx
│   │   ├── Odyssey.tsx
│   │   ├── Prototypes.tsx
│   │   └── WeeklyReview.tsx
│   ├── index.css
│   ├── main.tsx
│   └── supabaseClient.ts
├── supabase
│   └── schema.sql
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
