// ============================================================
//  /api/odds/[...path]  ·  Vercel Serverless Function (Node)
//  Proxy a The Odds API que OCULTA la key (variable de entorno
//  ODDS_API_KEY en Vercel). El navegador llama aquí sin la key.
//  No usa Claude ni ninguna IA: solo añade la key y reenvía.
//
//  Ejemplos de ruta:
//    /api/odds/sports/
//    /api/odds/sports/baseball_mlb/odds?regions=eu,uk&markets=h2h,spreads,totals
// ============================================================

export default async function handler(req, res) {
  // CORS (innecesario en mismo-origen, pero no estorba si sirves el HTML aparte)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "content-type, x-app-token");
  res.setHeader("Access-Control-Expose-Headers", "x-requests-remaining, x-requests-used, x-requests-last");
  if (req.method === "OPTIONS") return res.status(204).end();

  const key = process.env.ODDS_API_KEY;
  if (!key) return res.status(500).json({ message: "ODDS_API_KEY no configurada en Vercel (Settings → Environment Variables)" });

  // Protección opcional contra abuso de tu cuota:
  // si defines APP_TOKEN en Vercel, el navegador debe mandar el header x-app-token igual.
  const appToken = process.env.APP_TOKEN;
  if (appToken && req.headers["x-app-token"] !== appToken) {
    return res.status(401).json({ message: "No autorizado (x-app-token inválido)" });
  }

  // Reconstruir la ruta upstream a partir del catch-all [...path]
  const seg = req.query.path;
  const path = Array.isArray(seg) ? seg.join("/") : (seg || "");

  const url = new URL("https://api.the-odds-api.com/v4/" + path);
  for (const [k, v] of Object.entries(req.query)) {
    if (k === "path" || k === "apiKey" || k === "") continue; // ignora la key del cliente
    url.searchParams.set(k, Array.isArray(v) ? v.join(",") : String(v));
  }
  url.searchParams.set("apiKey", key);

  let r;
  try {
    r = await fetch(url);
  } catch (e) {
    return res.status(502).json({ message: "Error al contactar The Odds API: " + String(e) });
  }

  const body = await r.text();
  for (const h of ["x-requests-remaining", "x-requests-used", "x-requests-last"]) {
    const val = r.headers.get(h);
    if (val) res.setHeader(h, val);
  }
  res.setHeader("Content-Type", "application/json");
  return res.status(r.status).send(body);
}
