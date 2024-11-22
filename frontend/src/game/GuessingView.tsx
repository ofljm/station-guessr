import React, { useEffect, useState } from 'react';
import { Api } from '../api/Api';
import { GameSession } from '../domain/PlayerSession';

type GuessingViewProps = {
    gameSession: GameSession
    token: string
}

// TODO: After game start, theres some bullshit error idk fix it pls
const GuessingView: React.FC<GuessingViewProps> = ({ gameSession, token }) => {
    const [timeRemaining, setTimeRemaining] = useState<number>(gameSession.duration);
    const [correctlyGuessedStationNames, setCorrectlyGuessedStationNames] = useState<string[]>(gameSession.correctlyGuessedStationNames);
    const [currentGuess, setCurrentGuess] = useState<string | undefined>();
    const [guessResult, setGuessResult] = useState<string | undefined>();

    useEffect(() => {
        tickTime(gameSession, setTimeRemaining);
        const timer = setInterval(() => {
            tickTime(gameSession, setTimeRemaining);
        }, 250);
        if (timeRemaining <= 0) {
            clearInterval(timer);
        }

        return () => clearInterval(timer);
    }, []);

    function tickTime(gameSession: GameSession, setTimeRemaining: React.Dispatch<React.SetStateAction<number>>) {
        const elapsed = (Date.now() - gameSession.startTime) / 1000;
        const timeRemaining = Math.max(0, gameSession.duration - elapsed);
        setTimeRemaining(Math.floor(timeRemaining));
    }

    async function handleGuess() {
        if (!currentGuess) {
            return;
        }

        Api.submitGuess(token, currentGuess)
            .then(response => {
                setGuessResult(response.result);
                setCorrectlyGuessedStationNames(response.correctlyGuessedStationNames || []);
            })
            .catch(error => {
                setGuessResult('Guess failed');
                console.error('Guess failed:', error);
            });
    }

    return (
        <>
            <p>Time remaining: {timeRemaining}</p>
            <input
                type="text"
                placeholder="Your guess"
                onChange={(e) => setCurrentGuess(e.target.value)}
            />
            <button disabled={timeRemaining <= 0} onClick={handleGuess}>Guess</button>
            {guessResult && <p style={{ color: "blue" }}>{guessResult}</p>}
            <ul>
                {correctlyGuessedStationNames.map((station) => (
                    <li key={station}>{station}</li>
                ))}
            </ul>
        </>
    );
};

export default GuessingView;