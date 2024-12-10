import { Container } from '@mui/material';
import React from 'react';
import GameDescription from './components/GameDescription';
import GameLogo from './components/GameLogo';
import LoginForm from './components/LoginForm';

interface LoginViewProps {
  onLogin: (token: string) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  
  return (
    <Container>
      <GameLogo />
      <GameDescription />
      <LoginForm onLogin={onLogin}/>
    </Container>
  );
};

export default LoginView;