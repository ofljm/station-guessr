import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Api } from '../api/Api';

type LoginFormProps = {
    onLogin: (token: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
    const [username, setUsername] = useState<string>('');
    const [error, setError] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

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

    function getRandomName(): string {
        const randomIndex = Math.floor(Math.random() * placeholderNames.length);
        return placeholderNames[randomIndex];
    }

    function handleChangePlayerName(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        error && setError('');
        return setUsername(e.target.value);
    }

    async function handleLogin(event: React.FormEvent): Promise<void> {
        event.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await Api.login(username);
            onLogin(response.token);
        } catch (error: unknown) {
            console.error(error);
            setError(`Login failed: ${error}`);
        }
        setIsLoading(false);
    }

    return (
        <Box component='form' onSubmit={handleLogin} display={'flex'} alignItems={'flex-end'} gap={1}>
            <TextField
                variant="standard"
                label="Dein Name"
                placeholder={getRandomName()}
                value={username}
                onChange={(e) => handleChangePlayerName(e)}
            />
            <Button type="submit" variant="contained" color="primary" sx={{ minWidth: 120 }} disabled={isLoading || !username}>
                {isLoading ? <CircularProgress sx={{ marginLeft: 1 }} size={24} /> : 'Mitmachen'}
            </Button>

            {error && (
                <Typography color="error" variant="body2">
                    {error}
                </Typography>
            )}
        </Box>
    );

};

export default LoginForm;