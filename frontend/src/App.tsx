import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import GameView from './game/GameView';
import Header from './Header';
import { LocalStorage } from './LocalStorage';
import LoginView from './LoginView';
import SpectatorView from './spectator/SpectatorView';
import { Api } from './api/Api';

// TODO: Remove getting player logic
const App: React.FC = () => {
  const [playerToken, setPlayerToken] = useState<string | null>(null);

  const handleLogin = (newPlayerToken: string) => {
    localStorage.setItem('token', newPlayerToken);
    getPlayer(newPlayerToken);
  };

  useEffect(() => {
    const storedPlayerToken = LocalStorage.getToken();
    console.log('storedToken', storedPlayerToken);
    if (storedPlayerToken) {
      getPlayer(storedPlayerToken);
    }
  }, []);

  function getPlayer(playerToken: string) {
    Api.getPlayer(playerToken)
      .then(_ => setPlayerToken(playerToken))
      .catch(() => {
        localStorage.removeItem('token');
      });
  }

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={playerToken ? <Navigate to="/game" /> : <LoginView onLogin={handleLogin} />} />
        <Route path="/game" element={playerToken ? <GameView token={playerToken} /> : <Navigate to="/" />} />
        <Route path="/spectator" element={<SpectatorView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
