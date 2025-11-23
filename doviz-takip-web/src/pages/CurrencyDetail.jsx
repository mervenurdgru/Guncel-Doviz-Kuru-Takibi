import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCurrencyHistory } from '../services/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CurrencyDetail = () => {
  const { code } = useParams(); // URL'den kodu al (Örn: USD)
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCurrencyHistory(code);
        setHistoryData(res.data);
      } catch (error) {
        console.error("Veri hatası:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [code]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#111827', 
      color: 'white', 
      padding: '40px',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      {/* Geri Dön Butonu */}
      <button 
        onClick={() => navigate('/home')} 
        style={{ 
          marginBottom: '20px', 
          padding: '10px 20px', 
          backgroundColor: '#374151', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px', 
          cursor: 'pointer' 
        }}
      >
        ← Geri Dön
      </button>

      <h1 style={{ color: '#60a5fa', fontSize: '3rem', marginBottom: '10px' }}>{code}</h1>
      <p style={{ color: '#9ca3af', marginBottom: '40px' }}>Detaylı Geçmiş Analizi</p>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <div style={{ 
          backgroundColor: '#1f2937', 
          padding: '30px', 
          borderRadius: '20px', 
          border: '1px solid #374151',
          boxShadow: '0 10px 50px rgba(0,0,0,0.5)'
        }}>
          <h3 style={{ marginBottom: '20px' }}>Haftalık Değişim Grafiği</h3>
          
          <div style={{ width: '100%', height: '500px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis domain={['dataMin', 'dataMax']} stroke="#9ca3af" tickFormatter={(val) => val.toFixed(2)} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #4b5563' }} />
                <Area type="monotone" dataKey="price" stroke="#8884d8" fillOpacity={1} fill="url(#colorPrice)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencyDetail;