# Escáner de Cuotas · Value Picks

App web que escanea cuotas de The Odds API, construye un consenso de mercado
libre de margen (de-vig) y detecta value picks (EV+). Frontend estático + una
función serverless que oculta la API key. **No usa Claude ni IA en ejecución.**

## Estructura
```
escaner-cuotas/
├─ index.html              # frontend (toda la lógica de cálculo, JS puro)
└─ api/
   └─ odds/
      └─ [...path].js       # proxy a The Odds API (añade la key secreta)
```

## Desplegar en Vercel (gratis)
1. `vercel`  →  `vercel --prod`   (o importa esta carpeta como repo en vercel.com)
2. En Vercel → Settings → Environment Variables:
   - `ODDS_API_KEY` = tu key de The Odds API
   - (opcional) `APP_TOKEN` = cadena secreta; si la pones, escríbela también en la app.
   - Redeploy para aplicar.
3. Abre `https://TU-APP.vercel.app/`. El campo backend ya viene con `/api/odds`.
   Pulsa **Comenzar escaneo**.

Prueba del backend: `https://TU-APP.vercel.app/api/odds/sports/` debe devolver JSON.

## Uso local (sin backend)
Abre `index.html`, borra el campo "URL backend", pega tu API key y escanea.
