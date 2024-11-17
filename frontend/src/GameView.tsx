import axios, { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { Api } from './Api';
import { Player } from './domain/Player';
import { LocalStorage } from './LocalStorage';

type GameViewProps = {
    player: Player
}

type GameSession = {
    started: boolean
    startTime: number
    duration: number
    timeRemaining: number
}

const GameView: React.FC<GameViewProps> = ({ player }) => {
    const [gameState, setGameState] = useState<GameSession | undefined>();
    const [currentGuess, setCurrentGuess] = useState<string | undefined>();
    const [correctlyGuessedStationNames, setCorrectlyGuessedStations] = useState<string[]>([]);
    const [guessResult, setGuessResult] = useState<string | undefined>();
    const [error, setError] = useState<string | undefined>();

    useEffect(() => {
        const sessionToken = LocalStorage.getSessionToken();
        if (!sessionToken) {
            return;
        }

        Api.getGameSession(sessionToken)
            .then(response => setGameState({
                duration: response.duration,
                startTime: response.startTime,
                started: true,
                timeRemaining: response.duration
            }))
            .catch(error => console.error('Failed to get game session:', error));

        setCorrectlyGuessedStations(player.correctlyGuessedStationNames);

        if (gameState) {
            const timer = setInterval(() => {
                const elapsed = (Date.now() - gameState.startTime) / 1000;
                const remaining = Math.max(0, gameState.duration - elapsed);

                setGameState(prev => ({
                    ...prev!,
                    timeRemaining: remaining
                }));

                if (remaining <= 0) {
                    clearInterval(timer);
                    setGameState({ started: false, startTime: 0, duration: 0, timeRemaining: 0 });
                }
            }, 1000);
            return () => clearInterval(timer);
        }
    }, []);

    async function handleGuess() {
        setError('');
        if (!currentGuess) {
            setError('Guess missing');
            return;
        }

        try {
            const response = await Api.submitGuess(localStorage.getItem('token')!, localStorage.getItem('sessionToken')!, currentGuess);
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

    async function startGame() {
        const response = await Api.startGame(localStorage.getItem('token')!);
        localStorage.setItem('sessionToken', response.sessionToken);

        setGameState({
            started: true,
            startTime: response.startTime,
            duration: response.duration,
            timeRemaining: response.duration
        });
    }

    return (
        <>
            {gameState?.started ?
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
                </> :
                <button onClick={startGame}>Start</button>}
        </>
    );
};

export default GameView;