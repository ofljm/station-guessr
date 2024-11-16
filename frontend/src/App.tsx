import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginView from './LoginView';
import SpectatorView from './SpectatorView';
import GameView from './GameView';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginView />} />
        <Route path="/spectator" element={<SpectatorView />} />
        <Route path="/game" element={<GameView token={'123'} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
