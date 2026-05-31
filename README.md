# Escáner de Cuotas · Value Picks

App web (una sola página estática) que escanea cuotas de The Odds API, construye
un consenso de mercado libre de margen (de-vig) y detecta value picks (EV+).
Toda la lógica de cálculo corre en el navegador con JavaScript puro. **No usa
Claude ni ninguna IA.**

## Modo de funcionamiento
**Directo**: la app te pide tu API key de The Odds API en cada ejecución (pensado
para una key que va rotando). El navegador llama directamente a `the-odds-api.com`
(esa API permite CORS, así que no hace falta backend). La key se usa solo en tu
navegador; no se guarda en ningún servidor.

## Estructura
```
escaner-cuotas/
└─ index.html     # toda la app (UI + lógica)
```

## Desplegar en Vercel (gratis)
Es solo HTML estático, sin variables de entorno ni funciones:
1. `vercel`  →  `vercel --prod`   (o importa el repo en vercel.com → Deploy)
2. Abre `https://TU-APP.vercel.app/`, pega tu API key y pulsa **Comenzar escaneo**.

## Uso local
Abre `index.html` con doble clic, pega tu API key y escanea. Funciona igual que en la web.

## Parámetros ajustables en la UI
- UMBRAL_EV, Tope EV (anti-error de línea), Prob. mínima, Kelly, bankroll.
- Regiones (eu/uk/us…), mercados (h2h/spreads/totals), Pinnacle ×2, solo-hoy.
- Máx. llamadas /odds (control de consumo de cuota).

Al terminar muestra los picks (ordenados por probabilidad), el motivo de cada
nivel de confianza, y los créditos consumidos / restantes de tu cuota.
