import { Box, Grid2, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { CorrectGuess } from '../domain/PlayerSession';
import './CorrectStationGuesses.css';

interface CorrectStationGuessesProps {
    correctGuesses: CorrectGuess[];
    highlightNew: boolean;
}

const CorrectStationGuesses: React.FC<CorrectStationGuessesProps> = ({ correctGuesses, highlightNew }) => {
    const [highlightedStation, setHighlightedStation] = useState<string | null>(null);

    useEffect(() => {
        if (!highlightNew || !correctGuesses || correctGuesses.length <= 0) {
            return;
        }

        setHighlightedStation(correctGuesses[0].stationName ?? '');
        const timer = setTimeout(() => {
            setHighlightedStation(null);
        }, 1000);
        return () => clearTimeout(timer);
    }, [correctGuesses]);

    return (
        <>
            {correctGuesses.length > 0 && <Grid2 container spacing={1}>
                {correctGuesses
                    .sort((guessA, guessB) => guessB.timestamp - guessA.timestamp)
                    .map(guess => guess.stationName)
                    .map((station, index) => (
                        <Typography
                            key={index}
                            fontWeight={'bold'}
                            sx={{ border: 1, borderRadius: 1, padding: 1, borderBlock: '', background: 'azure'}}
                            variant='body1'
                            boxShadow={1}
                            className={station === highlightedStation ? 'highlight' : ''}
                        >
                            {station}
                        </Typography>
                    ))}
            </Grid2>
            }
        </>
    );
};

export default CorrectStationGuesses;