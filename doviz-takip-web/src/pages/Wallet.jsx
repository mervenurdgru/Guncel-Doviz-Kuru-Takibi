import { useEffect, useState } from 'react';
import { getWallet, removeFromWallet, addToWallet, getLatestRates } from '../services/api'; 
import { useNavigate } from 'react-router-dom';
import './Home.css'; 

const Wallet = () => {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState([]);
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [transactionType, setTransactionType] = useState('BUY'); 
  const [formData, setFormData] = useState({ code: 'USD', amount: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [walletRes, ratesRes] = await Promise.all([
          getWallet().catch(() => ({ data: [] })), 
          getLatestRates().catch(() => ({ data: [] }))
      ]);
      setWallet(walletRes.data || []);
      setRates(ratesRes.data || []);
    } catch (error) {
      console.error("Veri hatası", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.amount || formData.amount <= 0) return alert("Lütfen geçerli bir miktar girin.");

    let finalAmount = parseFloat(formData.amount);
    if (transactionType === 'SELL') {
        finalAmount = finalAmount * -1;
    }

    try {
      await addToWallet(formData.code, finalAmount);
      
      alert(transactionType === 'BUY' ? "✅ Eklendi!" : "🔻 Satış Yapıldı!");
      
      setShowModal(false);
      setFormData({ code: 'USD', amount: '' }); 
      fetchData(); 
    } catch (error) {
      const errorMessage = error.response?.data || "İşlem başarısız oldu.";
      alert("❌ HATA: " + errorMessage);
    }
  };

  const handleRemove = async (item) => {
    let codeToDelete = typeof item === 'string' ? item : (item.currencyCode || item.CurrencyCode || item.code);
    
    if(!codeToDelete) {
        setWallet(prev => prev.filter(w => w !== item));
        return;
    }
    
    if(!window.confirm(`${codeToDelete} cüzdandan tamamen silinsin mi?`)) return;
    
    try {
      await removeFromWallet(codeToDelete);
      setWallet(prev => prev.filter(w => {
          const wCode = typeof w === 'string' ? w : (w.currencyCode || w.CurrencyCode);
          return wCode !== codeToDelete;
      }));
    } catch (e) { 
        alert("Silindi (Zorla)");
        setWallet(prev => prev.filter(w => (typeof w === 'string' ? w : (w.currencyCode || w.CurrencyCode)) !== codeToDelete));
    }
  };

  const calculateTotalAsset = () => {
    let totalTRY = 0;
    wallet.forEach(item => {
        if (!item) return;
        const code = typeof item === 'string' ? item : (item.currencyCode || item.CurrencyCode);
        const amount = typeof item === 'string' ? 0 : (item.amount || item.Amount || 0);

        const currentRate = rates.find(r => r.code === code);
        if (currentRate && amount) {
            totalTRY += amount * currentRate.forexBuying; 
        }
    });
    return totalTRY.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  if (loading) return <div className="loading-container">Cüzdan Yükleniyor...</div>;

  return (
    <div className="home-container" style={{position:'relative', minHeight:'100vh', paddingBottom:'80px'}}>
      
      {}
      <div className="header" style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <button onClick={() => navigate('/home')} className="wallet-btn" style={{backgroundColor:'#374151', padding:'8px 15px'}}>⬅ Geri</button>
        <h1 style={{fontSize:'24px', margin:0}}>💼 Cüzdanım</h1>
        <div style={{width:'60px'}}></div> 
      </div>

      {}
      <div style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          padding: '25px', borderRadius: '20px', marginTop: '20px',
          textAlign: 'center', boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)'
      }}>
          <h3 style={{color:'#bfdbfe', margin:0, fontSize:'16px'}}>Toplam Varlık</h3>
          <h1 style={{color:'white', margin:'10px 0', fontSize:'36px'}}>₺{calculateTotalAsset()}</h1>
          <span style={{color:'#dbeafe', fontSize:'14px'}}>Güncel kurlar ile hesaplandı</span>
      </div>

      {}
      <div className="favorites-section" style={{marginTop:'30px'}}>
        <h3 style={{marginLeft:'10px', color:'#9ca3af'}}>Varlıklarım</h3>
        
        {wallet.length === 0 ? (
            <div style={{textAlign:'center', padding:'40px', color:'#6b7280'}}>
                <p>Henüz bir varlık eklemediniz.</p>
            </div>
        ) : (
          <div style={{display:'flex', flexDirection:'column', gap:'15px'}}>
            {wallet.map((item, index) => {
              if (!item) return null;
              
              let code = "Bilinmiyor";
              let amount = 0;

              if (typeof item === 'string') {
                  code = item; 
              } else {
                  code = item.currencyCode || item.CurrencyCode || "Bilinmiyor";
                  amount = item.amount || item.Amount || 0;
              }
              
              const rateInfo = rates.find(r => r.code === code);
              const totalValue = rateInfo ? (amount * rateInfo.forexBuying).toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '---';

              return (
                <div key={index} style={{
                    backgroundColor:'#1f2937', padding:'20px', borderRadius:'15px',
                    display:'flex', justifyContent:'space-between', alignItems:'center',
                    boxShadow:'0 4px 6px rgba(0,0,0,0.1)'
                }}>
                    <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                        <div style={{
                            width:'50px', height:'50px', backgroundColor:'#374151', borderRadius:'12px',
                            display:'flex', justifyContent:'center', alignItems:'center', fontWeight:'bold', fontSize:'18px', color: '#fff'
                        }}>
                            {code.substring(0, 3)}
                        </div>
                        <div>
                            <div style={{fontWeight:'bold', fontSize:'18px', color: '#fff'}}>{rateInfo?.name || code}</div>
                            <div style={{color:'#9ca3af', fontSize:'14px'}}>
                                {amount} {code}
                            </div>
                        </div>
                    </div>

                    <div style={{textAlign:'right'}}>
                        <div style={{fontWeight:'bold', color:'#34d399', fontSize:'18px'}}>₺{totalValue}</div>
                        <button 
                            onClick={() => handleRemove(item)}
                            style={{background:'none', border:'none', color:'#ef4444', cursor:'pointer', marginTop:'5px', fontSize:'12px'}}
                        >
                            Sil
                        </button>
                    </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {}
      {showModal && (
        <div style={{
            position:'fixed', top:0, left:0, width:'100%', height:'100%',
            backgroundColor:'rgba(0,0,0,0.8)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:9999
        }} onClick={() => setShowModal(false)}> 
            
            <div style={{
                backgroundColor:'#111827', padding:'25px', borderRadius:'20px', width:'90%', maxWidth:'400px',
                border:'1px solid #374151', boxShadow:'0 20px 25px rgba(0,0,0,0.5)'
            }} onClick={e => e.stopPropagation()}> 
                
                <h2 style={{color:'white', marginBottom:'20px', textAlign:'center'}}>Yeni İşlem</h2>

                {}
                <div style={{display:'flex', backgroundColor:'#1f2937', borderRadius:'10px', padding:'5px', marginBottom:'20px', border:'1px solid #374151'}}>
                    <button 
                        type="button"
                        onClick={() => setTransactionType('BUY')}
                        style={{
                            flex:1, padding:'10px', borderRadius:'8px', border:'none', fontWeight:'bold', cursor:'pointer',
                            backgroundColor: transactionType === 'BUY' ? '#34d399' : 'transparent',
                            color: transactionType === 'BUY' ? '#064e3b' : '#9ca3af',
                            transition: 'all 0.2s'
                        }}
                    >
                        ALIŞ (EKLE)
                    </button>
                    <button 
                        type="button"
                        onClick={() => setTransactionType('SELL')}
                        style={{
                            flex:1, padding:'10px', borderRadius:'8px', border:'none', fontWeight:'bold', cursor:'pointer',
                            backgroundColor: transactionType === 'SELL' ? '#f87171' : 'transparent',
                            color: transactionType === 'SELL' ? '#7f1d1d' : '#9ca3af',
                            transition: 'all 0.2s'
                        }}
                    >
                        SATIŞ (ÇIKAR)
                    </button>
                </div>
                
                <form onSubmit={handleSave}>
                    <div style={{marginBottom:'20px'}}>
                        <label style={{display:'block', color:'#9ca3af', marginBottom:'8px', fontSize:'14px'}}>Para Birimi</label>
                        <select 
                            value={formData.code}
                            onChange={(e) => setFormData({...formData, code: e.target.value})}
                            style={{width:'100%', padding:'15px', borderRadius:'10px', backgroundColor:'#1f2937', color:'white', border:'1px solid #374151', fontSize:'16px'}}
                        >
                            {rates.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
                        </select>
                    </div>

                    <div style={{marginBottom:'25px'}}>
                        <label style={{display:'block', color:'#9ca3af', marginBottom:'8px', fontSize:'14px'}}>Miktar</label>
                        <input 
                            type="number" 
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={(e) => setFormData({...formData, amount: e.target.value})}
                            style={{
                                width:'100%', padding:'15px', borderRadius:'10px', 
                                backgroundColor:'#1f2937', color:'white', border:'1px solid #374151', 
                                fontSize:'24px', fontWeight:'bold'
                            }}
                        />
                    </div>

                    <button type="submit" style={{
                        width:'100%', padding:'15px', 
                        backgroundColor: transactionType === 'BUY' ? '#34d399' : '#f87171', // Buton rengi de değişsin
                        color: transactionType === 'BUY' ? '#064e3b' : '#white', 
                        border:'none', borderRadius:'12px', fontSize:'18px', fontWeight:'bold', cursor:'pointer'
                    }}>
                        {transactionType === 'BUY' ? 'CÜZDANA EKLE' : 'CÜZDANDAN DÜŞ'}
                    </button>
                </form>
            </div>
        </div>
      )}

      <button 
        onClick={() => { setShowModal(true); setTransactionType('BUY'); }}
        style={{
            position:'fixed', bottom:'30px', right:'30px',
            width:'65px', height:'65px', borderRadius:'50%',
            backgroundColor:'#3b82f6', color:'white', fontSize:'32px',
            border:'none', boxShadow:'0 10px 25px rgba(59, 130, 246, 0.6)',
            cursor:'pointer', display:'flex', justifyContent:'center', alignItems:'center', zIndex:100
        }}
      >
        +
      </button>

    </div>
  );
};

export default Wallet;