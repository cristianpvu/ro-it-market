// Proxy Server pentru API-ul INS TEMPO
// Rezolvă problema CORS făcând request-uri server-side
import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = 3001;
const INS_BASE_URL = 'http://statistici.insse.ro:8077/tempo-ins';

app.use(cors());
app.use(express.json());

// Proxy pentru metadata matrice
app.get('/api/matrix/:matrixCode', async (req, res) => {
  const { matrixCode } = req.params;
  const insUrl = `${INS_BASE_URL}/matrix/${matrixCode}`;
  
  console.log(`📡 [PROXY] GET ${insUrl}`);
  
  try {
    const response = await axios.get(insUrl, {
      timeout: 15000,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });
    
    console.log('✅ [PROXY] Metadata primită de la INS');
    res.json(response.data);
  } catch (error) {
    console.error('❌ [PROXY] Eroare:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Eroare la obținerea datelor de la INS',
      details: error.message 
    });
  }
});

// Proxy pentru date matrice - POST către /matrix/:matrixCode
app.post('/api/matrix/:matrixCode', async (req, res) => {
  const { matrixCode } = req.params;
  const insUrl = `${INS_BASE_URL}/matrix/${matrixCode}`;
  
  console.log(`📡 [PROXY] POST ${insUrl}`);
  console.log('📋 [PROXY] Payload:', JSON.stringify(req.body, null, 2));
  
  try {
    const response = await axios.post(insUrl, req.body, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });
    
    console.log('✅ [PROXY] Date primite de la INS TEMPO');
    console.log('📊 [PROXY] Status:', response.status);
    console.log('🔍 [PROXY] Type of response.data:', typeof response.data);
    console.log('🔍 [PROXY] Response.data length:', JSON.stringify(response.data).length);
    res.json(response.data);
  } catch (error) {
    console.error('❌ [PROXY] Eroare:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    res.status(error.response?.status || 500).json({ 
      error: 'Eroare la obținerea datelor de la INS',
      details: error.message,
      responseData: error.response?.data
    });
  }
});

// Proxy pentru date - endpoint PIVOT (legacy)
app.post('/api/pivot', async (req, res) => {
  const insUrl = `${INS_BASE_URL}/pivot/`;
  
  console.log(`📡 [PROXY] POST ${insUrl}`);
  console.log('📋 [PROXY] Payload:', JSON.stringify(req.body, null, 2));
  
  try {
    const response = await axios.post(insUrl, req.body, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });
    
    console.log('✅ [PROXY] Date primite de la INS TEMPO');
    console.log('� [PROXY] Status:', response.status);
    console.log('🔍 [PROXY] Type of response.data:', typeof response.data);
    console.log('🔍 [PROXY] Response.data length:', JSON.stringify(response.data).length);
    console.log('🔍 [PROXY] Full response.data:', JSON.stringify(response.data, null, 2));
    res.json(response.data);
  } catch (error) {
    console.error('❌ [PROXY] Eroare:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    res.status(error.response?.status || 500).json({ 
      error: 'Eroare la obținerea datelor de la INS',
      details: error.message,
      responseData: error.response?.data
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Proxy server running', target: INS_BASE_URL });
});

app.listen(PORT, () => {
  console.log('\n🚀 ============================================');
  console.log(`   Proxy Server PORNIT pe http://localhost:${PORT}`);
  console.log('   📡 Redirecționează către:', INS_BASE_URL);
  console.log('   🔓 CORS bypass activat');
  console.log('   ✅ Gata de request-uri!');
  console.log('============================================\n');
});
