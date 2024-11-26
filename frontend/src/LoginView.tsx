import React, { useState } from 'react';
import { Api } from './api/Api';
import { TextField, Button, Typography, Container, Box } from '@mui/material';

interface LoginViewProps {
  onLogin: (token: string) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [username, setUsername] = useState<string>('');
  const [error, setError] = useState<string | undefined>();

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
        <TextField
          fullWidth
          label="Your Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          variant="outlined"
          margin="normal"
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