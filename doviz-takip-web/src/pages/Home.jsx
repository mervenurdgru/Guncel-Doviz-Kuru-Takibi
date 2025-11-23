import { useEffect, useState } from 'react';
import { getLatestRates, getFavorites, addFavorite, removeFavorite, getCurrencyHistory } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Home.css'; 

const Home = () => {
  const navigate = useNavigate();
  
  const [rates, setRates] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);


  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const ratesRes = await getLatestRates().catch(err => { console.error(err); return { data: [] }; });
      const favRes = await getFavorites().catch(err => { console.error(err); return { data: [] }; });
      
      setRates(ratesRes.data || []);
      setFavorites(favRes.data || []);
    } catch (error) {
      console.error("Genel Veri çekme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFavorite = async (code, e) => {
    e.stopPropagation(); 
    try {
      await addFavorite(code);
      alert(`${code} favorilere eklendi!`);
      loadData(); 
    } catch (error) {
      alert("Hata oluştu veya zaten favorilerde.");
    }
  };

  const handleRemoveFavorite = async (code) => {
    if(!window.confirm(`${code} favorilerden silinsin mi?`)) return;

    try {
      await removeFavorite(code);
      setFavorites(prevFavorites => prevFavorites.filter(fav => fav !== code));
    } catch (error) {
      console.error("Silme hatası:", error);
      alert("Bir hata oluştu, silinemedi.");
    }
  };

  const handleCardClick = async (rate) => {
    setSelectedCurrency(rate);
    setHistoryData([]); 

    try {
      const res = await getCurrencyHistory(rate.code);
      setHistoryData(res.data);

      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
      
    } catch (error) {
      console.error("Geçmiş verisi alınamadı:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  if (loading) return <div className="loading-container">Yükleniyor...</div>;

  return (
    <div className="home-container">
      <div className="header">
        <h1>Döviz Takip Paneli</h1>
        <button onClick={handleLogout} className="logout-btn">Çıkış Yap</button>
      </div>
      
      <div className="favorites-section">
        <h3>⭐ Favorilerim</h3>
        {favorites.length === 0 ? (
          <p>Henüz favoriniz yok.</p>
        ) : (
          <ul className="favorites-list">
            {favorites.map((code, index) => (
              <li 
                key={index} 
                className="favorite-item"
                onClick={() => navigate(`/details/${code}`)}
                style={{ cursor: 'pointer' }} 
              >
                {code}
                <span 
                  className="remove-fav-icon" 
                  onClick={(e) => {
                      e.stopPropagation(); 
                      handleRemoveFavorite(code);
                  }}
                  title="Favorilerden Kaldır"
                >
                  ❌
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3>📈 Güncel Kurlar (TCMB)</h3>
        <p style={{ fontSize: '14px', color: '#aaa', marginBottom: '15px' }}>
           Grafiğini görmek için karta tıkla 👇
        </p>
        <div className="rates-grid">
          {rates.map((rate) => (
            <div 
              key={rate.code} 
              className="rate-card" 
              onClick={() => handleCardClick(rate)} 
            >
              <h4 className="rate-code">{rate.code}</h4>
              <p className="rate-name">{rate.name}</p>
              
              <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  backgroundColor: '#111827', 
                  padding: '10px', 
                  borderRadius: '8px',
                  marginBottom: '15px'
              }}>
                <div style={{ textAlign: 'center', width: '48%' }}>
                    <span style={{ display:'block', fontSize:'12px', color:'#9ca3af', marginBottom:'2px' }}>ALIŞ</span>
                    <span style={{ fontSize:'1.1rem', fontWeight:'bold', color:'#34d399' }}>
                        {rate.forexBuying} ₺
                    </span>
                </div>
                <div style={{ width:'1px', height:'30px', backgroundColor:'#374151' }}></div>

                <div style={{ textAlign: 'center', width: '48%' }}>
                    <span style={{ display:'block', fontSize:'12px', color:'#9ca3af', marginBottom:'2px' }}>SATIŞ</span>
                    <span style={{ fontSize:'1.1rem', fontWeight:'bold', color:'#f87171' }}>
                        {rate.forexSelling} ₺
                    </span>
                </div>
              </div>

              <button 
                onClick={(e) => handleAddFavorite(rate.code, e)} 
                className="add-fav-btn"
              >
                Favoriye Ekle
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedCurrency && (
        <div className="chart-section" style={{ 
            marginTop: '40px', 
            marginBottom: '60px',
            padding: '25px', 
            backgroundColor: '#1f2937', 
            borderRadius: '20px', 
            border: '1px solid #374151',
            boxShadow: '0 10px 40px rgba(0,0,0,0.4)' 
        }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
            <h2 style={{ color: '#60a5fa', margin:0 }}>
              {selectedCurrency.code} <span style={{fontSize:'0.8em', color:'#9ca3af'}}>- Haftalık Analiz</span>
            </h2>
            <div style={{ textAlign:'right' }}>
                <span style={{ fontSize:'24px', fontWeight:'bold', color:'#34d399' }}>
                    {selectedCurrency.forexBuying} ₺
                </span>
            </div>
          </div>
          
          {historyData.length > 0 ? (
            <div style={{ width: '100%', height: '400px' }}>
              <ResponsiveContainer width="100%" height="100%">

                <AreaChart data={historyData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />

                  <XAxis 
                    dataKey={d => d.date || d.Date} 
                    stroke="#9ca3af" 
                    tick={{fontSize: 12}}
                    tickMargin={10}
                  />

                  <YAxis 
                    domain={['dataMin', 'dataMax']} 
                    stroke="#9ca3af" 
                    tick={{fontSize: 12}}
                    tickFormatter={(val) => val.toFixed(2)} 
                    width={60}
                  />
                  
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #4b5563', borderRadius:'8px', color:'#fff' }}
                    itemStyle={{ color: '#60a5fa' }}
                    formatter={(value) => [value + " ₺", "Fiyat"]}
                    labelStyle={{ color: '#9ca3af' }}
                  />

                  <Area 
                    type="monotone" 
                    dataKey={d => d.price || d.Price} 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{height:'300px', display:'flex', alignItems:'center', justifyContent:'center', color:'#6b7280'}}>
                Veri Yükleniyor...
            </div>
          )}
        </div>
      )}
      
    </div> 
  ); 
}; 

export default Home;