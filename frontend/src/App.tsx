import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import GameView from './GameView';
import LoginView from './LoginView';
import SpectatorView from './SpectatorView';
import { Player } from './domain/Player';
import { Api } from './Api';

function App() {
  const [player, setPlayer] = useState<Player | undefined>();

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
      <Routes>
        <Route path="/" element={player ? <Navigate to="/game" /> : <LoginView onLogin={handleLogin} />} />
        <Route path="/game" element={player ? <GameView player={player} /> : <Navigate to="/" />} />
        <Route path="/spectator" element={<SpectatorView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
