import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Api } from './api/Api';
import { PlayerSession } from './domain/PlayerSession';
import GameView from './game/GameView';
import Header from './Header';
import { LocalStorage } from './LocalStorage';
import LoginView from './LoginView';
import SpectatorView from './spectator/SpectatorView';

const App: React.FC = () => {
  const [playerSession, setPlayerSession] = useState<PlayerSession | null>(null);
  const [token, setToken] = useState<string | null>(LocalStorage.getToken());

  const handleLogin = (newPlayerToken: string) => {
    LocalStorage.setToken(newPlayerToken);
    setToken(newPlayerToken);
    getSession(newPlayerToken);
  };

  useEffect(() => {
    const storedPlayerToken = LocalStorage.getToken();
    if (!storedPlayerToken) {
      return console.log('No stored player token found, showing login view.');
    }
    getSession(storedPlayerToken);
  }, []);

  function getSession(playerToken: string) {
    Api.getPlayerSession(playerToken)
      .then(playerSession => setPlayerSession(playerSession))
      .catch(() => {
        console.log('No player session found, removing token from local storage.');
        LocalStorage.clearToken();
        setToken(null);
      });
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={playerSession ? <GameView token={token!} gameSession={playerSession.gameSession} /> : <LoginView onLogin={handleLogin} />} />
        <Route path="/spectator" element={<SpectatorView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
