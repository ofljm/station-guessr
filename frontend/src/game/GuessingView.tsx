import { Box, Button, CircularProgress, Input, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Api, GuessResult } from '../api/Api';
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
    const [message, setMessage] = useState<string>('');
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

        // articifially delay the submission to prevent spamming
        await new Promise(resolve => setTimeout(resolve, 500));
        
        Api.submitGuess(token, currentGuess)
            .then(response => {
                const result = response.result;
                if (result === 'correct') {
                    setCurrentGuess('');
                    setCorrectlyGuessedStationNames(response.correctGuesses || []);
                };
                setMessage(createResultMessage(result, currentGuess));
            })
            .catch(error => {
                setMessage('Da gabs einen technischen Fehler, versuchs nochmal oder kontaktiere den Support.');
                console.error('Guess failed:', error);
            })
            .finally(() => setIsSubmitting(false));
    }

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setCurrentGuess(event.target.value);
        setMessage('');
    }

    function createResultMessage(guessResult: GuessResult, guess: string): string {
        if (guessResult === 'incorrect') {
            return `${guess} ist nicht korrekt`
        }
        if (guessResult === 'correct') {
            return `Du hast ${guess} erraten`
        }
        if (guessResult === 'alreadyGuessed') {
            return `Du hast ${guess} bereits erraten`
        }
        return '';
    }


    return (
        <>
            <Typography variant='h6' align='center' sx={{ mb: 2 }}>Übrige Zeit: {timeRemaining} Sekunden</Typography>
            <Box onSubmit={handleGuess}>
                <Stack direction='row' spacing={2} alignItems='center' sx={{ marginBottom: 2 }}>
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
                    {isSubmitting && <CircularProgress size={28}/>}
                </Stack>
                <Box component="section" sx={{height: '40px' }}>
                    {message && <Typography>{message}</Typography>}
                </Box>
                <CorrectStationGuesses correctGuesses={correctGuesses ?? []} highlightNew={true} />
            </Box>
        </>
    );
};

export default GuessingView;