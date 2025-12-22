// Vercel Serverless Function - Proxy pentru INS TEMPO API
// GET /api/matrix/[matrixCode] - metadata
// POST /api/matrix/[matrixCode] - date

import type { VercelRequest, VercelResponse } from '@vercel/node';

const INS_BASE_URL = 'http://statistici.insse.ro:8077/tempo-ins';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { matrixCode } = req.query;
  const insUrl = `${INS_BASE_URL}/matrix/${matrixCode}`;

  console.log(`📡 [VERCEL PROXY] ${req.method} ${insUrl}`);
  if (req.method === 'POST') {
    console.log('📋 [VERCEL PROXY] Body:', JSON.stringify(req.body));
  }

  try {
    const fetchOptions: RequestInit = {
      method: req.method,
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': 'Mozilla/5.0',
        ...(req.method === 'POST' ? { 'Content-Type': 'application/json' } : {})
      },
      ...(req.method === 'POST' ? { body: JSON.stringify(req.body) } : {})
    };

    const response = await fetch(insUrl, fetchOptions);
    
    console.log('📊 [VERCEL PROXY] Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [VERCEL PROXY] INS API error:', errorText);
      return res.status(response.status).json({
        error: 'Eroare de la API-ul INS',
        status: response.status,
        details: errorText
      });
    }
    
    // Verifică content-type pentru a decide cum să parsăm
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType?.includes('application/json')) {
      data = await response.json();
      console.log('✅ [VERCEL PROXY] Success (JSON)');
      return res.status(200).json(data);
    } else {
      // INS returnează text/CSV pentru unele endpoints
      data = await response.text();
      console.log('✅ [VERCEL PROXY] Success (Text/CSV), length:', data.length);
      return res.status(200).send(data);
    }
  } catch (error: any) {
    console.error('❌ [VERCEL PROXY] Error:', error.message);
    console.error('❌ [VERCEL PROXY] Stack:', error.stack);
    return res.status(500).json({
      error: 'Eroare la obținerea datelor de la INS',
      details: error.message
    });
  }
}
