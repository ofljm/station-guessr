import React, { useEffect, useState } from 'react';
import { PlayerStats } from '../domain/PlayerStats';
import { Api } from '../api/Api';

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
        <>
            <ul>
                {players.map((player) => (
                    <li key={player.name}>{player.name}: {player.correctGuesses}</li>
                ))}
            </ul>
        </>
    );
};

export default SpectatorView;