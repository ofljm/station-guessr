import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import GameView from './GameView';
import LoginView from './LoginView';
import SpectatorView from './SpectatorView';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const handleLogin = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/game" /> : <LoginView onLogin={handleLogin} />} />
        <Route path="/game" element={token ? <GameView token={token} /> : <Navigate to="/" />} />
        <Route path="/spectator" element={<SpectatorView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
