import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';
import './Register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      alert("Kayıt başarılı! Giriş yapabilirsiniz.");
      navigate('/login');
    } catch (error) {
      console.error("Kayıt hatası:", error);
      alert("Kayıt başarısız. Kullanıcı adı veya email alınmış olabilir.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Kayıt Ol</h2>
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Kullanıcı Adı</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          
          {}
          <div className="form-group">
            <label>E-Posta</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Şifre</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="register-btn">Kayıt Ol</button>
        </form>
        <p className="login-redirect">
          Zaten hesabın var mı? <Link to="/login">Giriş Yap</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;