import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import GameView from './GameView';
import LoginView from './LoginView';
import SpectatorView from './SpectatorView';
import Header from './Header';
import { Player } from './domain/Player';
import { Api } from './Api';

const App: React.FC = () => {
  const [player, setPlayer] = useState<Player | null>(null);

  const handleLogin = (newToken: string) => {
    localStorage.setItem('token', newToken);
    getPlayer(newToken);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    console.log('storedToken', storedToken);
    if (storedToken) {
      getPlayer(storedToken);
    }
  }, []);

  function getPlayer(token: string) {
    Api.getPlayer(token)
      .then(setPlayer)
      .catch(() => {
        localStorage.removeItem('token');
      });
  }

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={player ? <Navigate to="/game" /> : <LoginView onLogin={handleLogin} />} />
        <Route path="/game" element={player ? <GameView player={player} /> : <Navigate to="/" />} />
        <Route path="/spectator" element={<SpectatorView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
