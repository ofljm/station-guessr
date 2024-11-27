import { Box, Button, Input } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Api } from '../api/Api';
import { GameSession } from '../domain/PlayerSession';

type GuessingViewProps = {
    gameSession: GameSession
    token: string
}

const GuessingView: React.FC<GuessingViewProps> = ({ gameSession, token }) => {
    const [timeRemaining, setTimeRemaining] = useState<number>(gameSession.duration);
    const [correctlyGuessedStationNames, setCorrectlyGuessedStationNames] = useState<string[]>(gameSession.correctlyGuessedStationNames);
    const [currentGuess, setCurrentGuess] = useState<string | undefined>();
    const [guessResult, setGuessResult] = useState<string | undefined>();
    const [typingTimeout, setTypingTimeout] = useState<number | undefined>();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

    useEffect(() => {
        console.log(typingTimeout);
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        setTypingTimeout(setTimeout(() => {
            handleGuess();
        }, 300));

        return () => clearTimeout(typingTimeout);
    }, [currentGuess]);

    function tickTime(gameSession: GameSession, setTimeRemaining: React.Dispatch<React.SetStateAction<number>>) {
        const elapsed = (Date.now() - gameSession.startTime) / 1000;
        const timeRemaining = Math.max(0, gameSession.duration - elapsed);
        setTimeRemaining(Math.ceil(timeRemaining));
    }

    async function handleGuess() {
        if (isSubmitting) {
            return;
        }

        if (!currentGuess) {
            return;
        }

        setIsSubmitting(true);

        Api.submitGuess(token, currentGuess)
            .then(response => {
                setGuessResult(response.result);
                setCorrectlyGuessedStationNames(response.correctlyGuessedStationNames || []);
            })
            .catch(error => {
                setGuessResult('There was some technical error while submitting the guess. Please try again or contact support.');
                console.error('Guess failed:', error);
            })
            .finally(() => setIsSubmitting(false));
    }

    return (
        <>
            <p>Time remaining: {timeRemaining}</p>
            <Box onSubmit={handleGuess}>
                <Input
                    type="text"
                    placeholder="Your guess"
                    sx={{ mr: 1 }}
                    onChange={(e) => setCurrentGuess(e.target.value)}
                />
                <Button disabled={timeRemaining <= 0 || isSubmitting} onClick={handleGuess} variant="contained" size="medium">
                    {'Raten'}
                </Button>
                {guessResult && <p style={{ color: "blue" }}>{guessResult}</p>}
                <ul>
                    {correctlyGuessedStationNames.map((station) => (
                        <li key={station}>{station}</li>
                    ))}
                </ul>
            </Box >
        </>
    );
};

export default GuessingView;