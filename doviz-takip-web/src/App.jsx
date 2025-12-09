import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import CurrencyDetail from './pages/CurrencyDetail'; 
import Wallet from './pages/Wallet'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/wallet" element={<Wallet />} /> {}
        <Route path="/details/:code" element={<CurrencyDetail />} /> 
      </Routes>
    </Router>
  );
}

export default App;