// Vercel Serverless Function - Proxy pentru INS TEMPO API (endpoint PIVOT legacy)
// POST /api/pivot

import type { VercelRequest, VercelResponse } from '@vercel/node';

const INS_BASE_URL = 'http://statistici.insse.ro:8077/tempo-ins';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const insUrl = `${INS_BASE_URL}/pivot/`;

  console.log(`📡 [VERCEL PROXY] POST ${insUrl}`);

  try {
    const response = await fetch(insUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      },
      body: JSON.stringify(req.body)
    });

    // INS TEMPO returnează text/CSV, nu JSON
    const data = await response.text();

    console.log('✅ [VERCEL PROXY] Success');
    // Returnează ca string pentru a fi procesat de client
    return res.status(200).send(data);
  } catch (error: any) {
    console.error('❌ [VERCEL PROXY] Error:', error.message);
    return res.status(500).json({
      error: 'Eroare la obținerea datelor de la INS',
      details: error.message
    });
  }
}
