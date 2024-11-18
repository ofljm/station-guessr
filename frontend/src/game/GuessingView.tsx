import React, { useEffect, useState } from 'react';
import { GameSession } from './GameSession';
import { Api } from '../api/Api';

type GuessingViewProps = {
    session: GameSession
    token: string
}

const GuessingView: React.FC<GuessingViewProps> = ({ session, token }) => {
    const [timeRemaining, setTimeRemaining] = useState<number>(session.duration);
    const [correctlyGuessedStationNames, setCorrectlyGuessedStations] = useState<string[]>([]);
    const [currentGuess, setCurrentGuess] = useState<string | undefined>();
    const [guessResult, setGuessResult] = useState<string | undefined>();

    useEffect(() => {
        setCorrectlyGuessedStations(session.correctlyGuessedStationNames);

        const timer = setInterval(() => {
            const elapsed = (Date.now() - session.startTime) / 1000;
            const timeRemaining = Math.max(0, session.duration - elapsed);

            setTimeRemaining(timeRemaining);

            if (timeRemaining <= 0) {
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    async function handleGuess() {
        if (!currentGuess) {
            return;
        }

        Api.submitGuess(token, currentGuess)
            .then(response => {
                setGuessResult(response.result);
                setCorrectlyGuessedStations(response.correctlyGuessedStationNames || []);
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

export default GuessingView;