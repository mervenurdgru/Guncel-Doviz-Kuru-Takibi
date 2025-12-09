import { useEffect, useState } from 'react';
import { getLatestRates, getFavorites, addFavorite, removeFavorite, getWeeklyHistory } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
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
    if (!token) { navigate('/login'); return; }

    try {
      const ratesRes = await getLatestRates().catch(() => ({ data: [] }));
      const favRes = await getFavorites().catch(() => ({ data: [] })); 
      setRates(ratesRes.data || []);
      setFavorites(favRes.data || []);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleAddFavorite = async (code, e) => {
    e.stopPropagation(); 
    try { 
        await addFavorite(code); 
        loadData(); 
    } catch (error) { alert("Zaten favorilerde olabilir."); }
  };

  const handleRemoveFavorite = async (code) => {
    if(!window.confirm("Favorilerden silinsin mi?")) return;
    try { 
        await removeFavorite(code); 
        setFavorites(favorites.filter(fav => fav !== code)); 
    } catch (e) {}
  };

  const handleCardClick = async (rate) => {
    setSelectedCurrency(rate);
    setHistoryData([]); 
    try {
      const res = await getWeeklyHistory(rate.code);
      setHistoryData(res.data);
      setTimeout(() => { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }, 100);
    } catch (error) { console.error("Veri yok:", error); }
  };

  const handleLogout = () => { localStorage.removeItem('userToken'); navigate('/login'); };

  if (loading) return <div className="loading-container">Yükleniyor...</div>;

  return (
    <div className="home-container">
      <div className="header">
        <h1>Döviz Takip Paneli</h1>
        <div className="header-buttons">
            {}
            <button 
                onClick={() => navigate('/wallet')} 
                className="wallet-btn" 
                style={{
                    backgroundColor: '#fbbf24', 
                    color:'#111', 
                    marginRight:'10px', 
                    padding:'8px 15px', 
                    border:'none', 
                    borderRadius:'5px', 
                    cursor:'pointer', 
                    fontWeight:'bold'
                }}
            >
                💰 Cüzdanım
            </button>
            <button onClick={handleLogout} className="logout-btn">Çıkış Yap</button>
        </div>
      </div>

      {}
      <div className="favorites-section">
        <h3>⭐ Favorilerim</h3>
        {favorites.length === 0 ? <p>Favori listeniz boş.</p> : (
          <ul className="favorites-list">
            {favorites.map((code, index) => (
              <li key={index} className="favorite-item" onClick={() => navigate(`/details/${code}`)} style={{cursor:'pointer'}}>
                {code} <span className="remove-fav-icon" onClick={(e) => {e.stopPropagation(); handleRemoveFavorite(code);}}>❌</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {}
      <div className="rates-grid">
        {rates.map((rate) => (
          <div key={rate.code} className="rate-card" onClick={() => handleCardClick(rate)}>
            <h4 className="rate-code">{rate.code}</h4>
            <p className="rate-name">{rate.name}</p>
            
            <div style={{display:'flex', justifyContent:'space-between', background:'#111827', padding:'10px', borderRadius:'8px', marginBottom:'10px'}}>
               <span style={{color:'#34d399', fontWeight:'bold'}}>{rate.forexBuying} ₺</span>
               <span style={{color:'#f87171', fontWeight:'bold'}}>{rate.forexSelling} ₺</span>
            </div>

            {}
            <div style={{marginTop:'5px'}}>
                <button 
                    onClick={(e) => handleAddFavorite(rate.code, e)} 
                    className="add-fav-btn"
                    style={{width:'100%', backgroundColor:'#374151'}}
                >
                    ⭐ Favorile
                </button>
            </div>
          </div>
        ))}
      </div>

      {}
      {selectedCurrency && (
        <div className="chart-section" style={{ marginTop: '50px', padding: '20px', backgroundColor: '#1f2937', borderRadius: '15px', overflowX: 'auto' }}>
          <h2 style={{ color: '#60a5fa' }}>{selectedCurrency.code} - Haftalık Grafik</h2>
          {historyData.length > 0 ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <LineChart width={600} height={300} data={historyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="date" stroke="#fff" />
                <YAxis domain={['auto', 'auto']} stroke="#fff" />
                <Tooltip contentStyle={{ backgroundColor: '#333' }} />
                <Line type="monotone" dataKey="price" stroke="#34d399" strokeWidth={3} />
              </LineChart>
            </div>
          ) : <p>Yükleniyor...</p>}
        </div>
      )}
    </div>
  );
};
export default Home;