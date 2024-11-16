import React, { useState } from 'react';
import { submitGuess } from './Api';
import axios, { AxiosError } from 'axios';

interface GameViewProps {
    token: string;
}

const GameView: React.FC<GameViewProps> = ({ token }) => {
    const [currentGuess, setCurrentGuess] = useState<string | undefined>();
    const [correctlyGuessedStations, setCorrectlyGuessedStations] = useState<string[]>([]);
    const [guessResult, setGuessResult] = useState<string | undefined>();
    const [error, setError] = useState<string | undefined>();

    async function handleGuess() {
        setError('');
        if (!currentGuess) {
            setError('Guess missing');
            return;
        }

        try {
            const response = await submitGuess(token, currentGuess);
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
                {correctlyGuessedStations.map((station) => (
                    <li key={station}>{station}</li>
                ))}
            </ul>
        </>
    );
};

export default GameView;