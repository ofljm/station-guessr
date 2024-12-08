import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Api } from './api/Api';
import { PlayerSession } from './domain/PlayerSession';
import GameView from './game/GameView';
import './App.css';
import { LocalStorage } from './LocalStorage';
import LoginView from './LoginView';
import SpectatorView from './spectator/SpectatorView';
import { CircularProgress } from '@mui/material';

const App: React.FC = () => {
  const [playerSession, setPlayerSession] = useState<PlayerSession | null>(null);
  const [token, setToken] = useState<string | null>(LocalStorage.getToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedPlayerToken = LocalStorage.getToken();
    if (!storedPlayerToken) {
      setIsLoading(false);
      return console.log('No stored player token found, showing login view.');
    }
    getSession(storedPlayerToken);


  }, []);

  function handleLogin(newPlayerToken: string) {
    LocalStorage.setToken(newPlayerToken);
    setToken(newPlayerToken);
    getSession(newPlayerToken);
  }

  function getSession(playerToken: string) {
    Api.getPlayerSession(playerToken)
      .then(playerSession => {
        setPlayerSession(playerSession);
        setIsLoading(false);
      })
      .catch(() => {
        console.log('No player session found, removing token from local storage.');
        LocalStorage.clearToken();
        setToken(null);
        setIsLoading(false);
      });
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          isLoading ?
            <CircularProgress /> :
            playerSession ?
              <GameView token={token!} gameSession={playerSession.gameSession} /> :
              <LoginView onLogin={handleLogin} />}
        />
        <Route path="/spectator" element={<SpectatorView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
