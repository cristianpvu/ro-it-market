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
  console.log('📋 [VERCEL PROXY] Body:', JSON.stringify(req.body));

  try {
    const response = await fetch(insUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': 'Mozilla/5.0'
      },
      body: JSON.stringify(req.body)
    });

    console.log('📊 [VERCEL PROXY] Response status:', response.status);
    console.log('📊 [VERCEL PROXY] Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [VERCEL PROXY] INS API error:', errorText);
      return res.status(response.status).json({
        error: 'Eroare de la API-ul INS',
        status: response.status,
        details: errorText
      });
    }

    // INS TEMPO returnează text/CSV, nu JSON
    const data = await response.text();

    console.log('✅ [VERCEL PROXY] Success, data length:', data.length);
    // Returnează ca string pentru a fi procesat de client
    return res.status(200).send(data);
  } catch (error: any) {
    console.error('❌ [VERCEL PROXY] Error:', error.message);
    console.error('❌ [VERCEL PROXY] Stack:', error.stack);
    return res.status(500).json({
      error: 'Eroare la obținerea datelor de la INS',
      details: error.message
    });
  }
}
