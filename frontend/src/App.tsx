import { Box, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Api } from './api/Api';
import './App.css';
import { PlayerSession } from './domain/PlayerSession';
import GameView from './game/GameView';
import { LocalStorage } from './LocalStorage';
import LoginView from './LoginView';
import SpectatorView from './spectator/SpectatorView';

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
      })
      .catch(() => {
        console.log('No player session found, removing token from local storage.');
        LocalStorage.clearToken();
        setToken(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          isLoading ?
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="90vh"
            >
              <CircularProgress />
            </Box> :
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
