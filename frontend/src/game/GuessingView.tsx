import { Box, Button, Input, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Api } from '../api/Api';
import { CorrectGuess, GameSession } from '../domain/PlayerSession';
import CorrectStationGuesses from './CorrectStationGuesses';

type GuessingViewProps = {
    gameSession: GameSession
    token: string
    onGameOver: (correctGuesses: CorrectGuess[]) => void
}

const GuessingView: React.FC<GuessingViewProps> = ({ gameSession, token, onGameOver }) => {
    const [timeRemaining, setTimeRemaining] = useState<number>(gameSession.duration);
    const [correctGuesses, setCorrectlyGuessedStationNames] = useState<CorrectGuess[] | undefined>(gameSession.correctGuesses);
    const [currentGuess, setCurrentGuess] = useState<string>('');
    const [guessResult, setGuessResult] = useState<string>('');
    const [typingTimeout, setTypingTimeout] = useState<number | undefined>();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        tickTime(gameSession, setTimeRemaining);
        const timer = setInterval(() => {
            tickTime(gameSession, setTimeRemaining);
        }, 250);
        if (timeRemaining <= 0) {
            clearInterval(timer);
            onGameOver(correctGuesses || []);
        }

        return () => clearInterval(timer);
    }, [timeRemaining]);

    useEffect(() => {
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        setTypingTimeout(setTimeout(() => {
            handleGuess();
        }, 230));

        return () => clearTimeout(typingTimeout);
    }, [currentGuess]);

    function tickTime(gameSession: GameSession, setTimeRemaining: React.Dispatch<React.SetStateAction<number>>) {
        const elapsed = (Date.now() - gameSession.startTime) / 1000;
        const timeRemaining = Math.max(0, gameSession.duration - elapsed);
        setTimeRemaining(Math.ceil(timeRemaining));
    }

    async function handleGuess() {
        if (!currentGuess) {
            return;
        }

        setIsSubmitting(true);

        Api.submitGuess(token, currentGuess)
            .then(response => {
                const result = response.result;
                setGuessResult(result);
                if (result === 'correct') {
                    setCurrentGuess('');
                    setCorrectlyGuessedStationNames(response.correctGuesses || []);
                }
            })
            .catch(error => {
                setGuessResult('There was some technical error while submitting the guess. Please try again or contact support.');
                console.error('Guess failed:', error);
            })
            .finally(() => setIsSubmitting(false));
    }

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setCurrentGuess(event.target.value);
        setGuessResult('');
    }

    return (
        <>
            <Typography variant='h6' sx={{mb: 2}}>Übrige Zeit: {timeRemaining} Sekunden</Typography>
            <Box onSubmit={handleGuess}>
                <Input
                    type="text"
                    value={currentGuess}
                    placeholder="Haltestelle"
                    sx={{ mr: 1 }}
                    onChange={handleInputChange}
                />
                <Button disabled={timeRemaining <= 0 || isSubmitting} onClick={handleGuess} variant="contained" size="medium">
                    {'Raten'}
                </Button>
                {guessResult && <p style={{ color: "blue" }}>{guessResult}</p>}
                <CorrectStationGuesses correctGuesses={correctGuesses ?? []} highlightNew={true} />
            </Box>
        </>
    );
};

export default GuessingView;