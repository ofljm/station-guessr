import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Api } from '../api/Api';

type LoginFormProps = {
    onLogin: (token: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
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
        <Box component='form' onSubmit={handleLogin} display={'flex'} alignItems={'flex-end'} gap={1}>
            <TextField
                variant="standard"
                label="Dein Name"
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
                Mitmachen
            </Button>
        </Box>
    );
};

export default LoginForm;