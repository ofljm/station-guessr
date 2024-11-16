import axios, { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { Api } from './Api';
import { Player } from './domain/Player';

interface GameViewProps {
    player: Player;
}

const GameView: React.FC<GameViewProps> = ({ player }) => {
    const [currentGuess, setCurrentGuess] = useState<string | undefined>();
    const [correctlyGuessedStationNames, setCorrectlyGuessedStations] = useState<string[]>([]);
    const [guessResult, setGuessResult] = useState<string | undefined>();
    const [error, setError] = useState<string | undefined>();

    useEffect(() => {
        setCorrectlyGuessedStations(player.correctlyGuessedStationNames);
    }, []);

    async function handleGuess() {
        setError('');
        if (!currentGuess) {
            setError('Guess missing');
            return;
        }

        try {
            const response = await Api.submitGuess(localStorage.getItem('token')!, currentGuess);
            setGuessResult(response.result);
            setCorrectlyGuessedStations(response.correctlyGuessedStationNames || []);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<{ message: string; }>;
                console.error('Guess failed:', axiosError);
                setError(axiosError.response?.data?.message);
            }
        }
    }

    return (
        <>
            <p style={{ color: "red" }}>{error}</p>
            <p>Your guess here</p>
            <input
                type="text"
                placeholder="Your guess"
                onChange={(e) => setCurrentGuess(e.target.value)}
            />
            <button onClick={handleGuess}>Guess</button>
            {guessResult && <p style={{ color: "blue" }}>{guessResult}</p>}
            <ul>
                {correctlyGuessedStationNames.map((station) => (
                    <li key={station}>{station}</li>
                ))}
            </ul>
        </>
    );
};

export default GameView;