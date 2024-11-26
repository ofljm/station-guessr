import React, { useState } from 'react';
import { Api } from './api/Api';
import { TextField, Button, Typography, Container, Box, Input } from '@mui/material';

interface LoginViewProps {
  onLogin: (token: string) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [username, setUsername] = useState<string>('');
  const [error, setError] = useState<string | undefined>();
  const placeholderNames: string[] = [
    "Anna Müller",
    "Jonas Schneider",
    "Laura Fischer",
    "Lukas Weber",
    "Sophie Bauer",
    "Leon Wagner",
    "Mia Schulz",
    "Paul Becker",
    "Emma Hoffmann",
    "Max Richter"
  ];

  function getRandomName() {
    const randomIndex = Math.floor(Math.random() * placeholderNames.length);
    return placeholderNames[randomIndex];
  }

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    try {
      const response = await Api.login(username);
      onLogin(response.token);
    } catch (error: unknown) {
      console.error(error);
      setError(`Login failed: ${error}`);
    }
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Wie gut kennst du die Haltestellen Frankfurts?
      </Typography>
      <Typography variant="body2" gutterBottom>
        Gleich hast du 5 Minuten Zeit, so viele Frankfurter S-Bahn Haltestellen wie möglich zu erraten.
      </Typography>
      <Box component="form" onSubmit={handleLogin} sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Wie heißt du?
        </Typography>
        <Input
          sx={{ mb: 1 }}
          fullWidth
          placeholder={getRandomName()}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        <Button type="submit" variant="contained" color="primary">
          <Typography variant="button" fontWeight="bold">
            Mitmachen
          </Typography>
        </Button>
      </Box>
    </Container>
  );
};

export default LoginView;