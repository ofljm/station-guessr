import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSpectatorClick = () => {
    navigate('/spectator');
  };

  const handleGameClick = () => {
    navigate('/game');
  };

  return (
    <header style={{ 
      position: 'absolute', 
      top: 0, 
      right: 0, 
      padding: '10px' 
    }}>
      {location.pathname === '/spectator' ? (
        <button onClick={handleGameClick}>Game View</button>
      ) : (
        <button onClick={handleSpectatorClick}>Spectator View</button>
      )}
    </header>
  );
};

export default Header;