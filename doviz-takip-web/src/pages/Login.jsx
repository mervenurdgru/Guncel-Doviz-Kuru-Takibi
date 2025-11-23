// src/pages/Login.jsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import './Login.css'; // Eğer css dosyan varsa

const Login = () => {
  const [identifier, setIdentifier] = useState(''); // Kullanıcı Adı VEYA Email
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Backend'e 'username' parametresi olarak gönderiyoruz
      const res = await loginUser(identifier, password);
      
      // Gelen Token'ı kaydediyoruz
      localStorage.setItem('userToken', res.data.token);
      
      alert("Giriş başarılı!");
      navigate('/home');
    } catch (error) {
      console.error("Giriş hatası", error);
      alert("Giriş başarısız! Kullanıcı adı veya şifre hatalı.");
    }
  };

  return (
    <div className="login-container" style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', backgroundColor:'#111827' }}>
      <div className="login-card" style={{ backgroundColor:'#1f2937', padding:'40px', borderRadius:'10px', color:'white', width:'350px', textAlign:'center' }}>
        <h2 style={{ marginBottom:'20px', color:'#60a5fa' }}>Giriş Yap</h2>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom:'15px', textAlign:'left' }}>
            <label style={{ display:'block', marginBottom:'5px', color:'#9ca3af' }}>Kullanıcı Adı veya E-Posta</label>
            <input 
              type="text" 
              value={identifier} 
              onChange={(e) => setIdentifier(e.target.value)} 
              required 
              style={{ width:'100%', padding:'10px', borderRadius:'5px', border:'1px solid #4b5563', backgroundColor:'#374151', color:'white' }}
            />
          </div>
          <div style={{ marginBottom:'20px', textAlign:'left' }}>
            <label style={{ display:'block', marginBottom:'5px', color:'#9ca3af' }}>Şifre</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{ width:'100%', padding:'10px', borderRadius:'5px', border:'1px solid #4b5563', backgroundColor:'#374151', color:'white' }}
            />
          </div>
          <button type="submit" style={{ width:'100%', padding:'12px', backgroundColor:'#2563eb', color:'white', border:'none', borderRadius:'5px', cursor:'pointer', fontWeight:'bold' }}>Giriş Yap</button>
        </form>
        <p style={{ marginTop:'15px', fontSize:'14px', color:'#9ca3af' }}>
          Hesabın yok mu? <Link to="/register" style={{ color:'#60a5fa', textDecoration:'none' }}>Kayıt Ol</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;