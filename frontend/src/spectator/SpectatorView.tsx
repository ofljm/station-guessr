import { Box, Container, Stack, Typography } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import React, { useEffect, useState } from 'react';
import { Api } from '../api/Api';
import { PlayerStats } from '../domain/PlayerStats';

const SpectatorView: React.FC = () => {
    const [players, setUsers] = useState<PlayerStats[]>([]);

    const fetchUsers = () => {
        Api.getPlayers()
            .then((response) => setUsers(response))
            .catch((error) => {
                console.error('Failed to fetch users:', error);
            });
    };

    useEffect(() => {
        fetchUsers();

        const intervalId = setInterval(() => {
            fetchUsers();
        }, 5000); // Fetch every 5 seconds

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);

    return (
        <Container>
            <Typography variant="h4" marginBottom={2}>Aktueller Stand</Typography>
            {players.map((player) => (
                <Box marginBottom={2} key={player.name}>
                    <Typography variant="body1">{player.name}</Typography>
                    <Stack>
                        <LinearProgress variant="determinate" value={(player.numberOfCorrectGuesses ?? 0) / 113 * 100} />
                        <Typography>{player.numberOfCorrectGuesses ?? 0}</Typography>
                    </Stack>
                </Box>
            ))}
        </Container>
    );
};

export default SpectatorView;