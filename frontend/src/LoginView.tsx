import { Box, Button, Container, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import GameDescription from './components/GameDescription';
import GameLogo from './components/GameLogo';

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