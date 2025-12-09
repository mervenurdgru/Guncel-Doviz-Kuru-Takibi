import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMonthlyHistory } from '../services/api'; 
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CurrencyDetail = () => {
  const { code } = useParams(); 
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMonthlyHistory(code);
        setHistoryData(res.data.reverse());  
      } catch (error) { console.error("Hata:", error); } finally { setLoading(false); }
    };
    fetchData();
  }, [code]);

  return (
    <div style={{ minHeight:'100vh', background:'#111827', color:'white', padding:'40px', fontFamily:'Segoe UI' }}>
      <button onClick={() => navigate('/home')} style={{marginBottom:'20px', padding:'10px', background:'#374151', color:'white', border:'none', borderRadius:'5px', cursor:'pointer'}}>← Geri</button>
      <h1 style={{color:'#60a5fa'}}>{code} - 30 Günlük Analiz</h1>

      {loading ? <p>Yükleniyor...</p> : (
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'30px'}}>
          <div style={{background:'#1f2937', padding:'20px', borderRadius:'20px'}}>
             <h3>Grafik</h3>
             <div style={{width:'100%', height:'400px'}}>
                <ResponsiveContainer>
                  <AreaChart data={[...historyData].reverse()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9ca3af" />
                    <YAxis domain={['auto', 'auto']} stroke="#9ca3af" width={40} />
                    <Tooltip contentStyle={{background:'#111827'}} />
                    <Area type="monotone" dataKey="price" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>
          <div style={{background:'#1f2937', padding:'20px', borderRadius:'20px', maxHeight:'500px', overflowY:'auto'}}>
             <h3>Liste</h3>
             <table style={{width:'100%'}}>
               <thead><tr><th style={{textAlign:'left'}}>Tarih</th><th style={{textAlign:'right'}}>Fiyat</th></tr></thead>
               <tbody>
                 {historyData.map((item, i) => (
                   <tr key={i} style={{borderBottom:'1px solid #374151'}}>
                     <td style={{padding:'10px'}}>{item.date}</td>
                     <td style={{padding:'10px', textAlign:'right', color:'#34d399'}}>{item.price} ₺</td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>
      )}
    </div>
  );
};
export default CurrencyDetail;