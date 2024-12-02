import { List, ListItem, ListItemText } from '@mui/material';
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
            {correctGuesses.length > 0 && <List>
                {correctGuesses
                    .sort((guessA, guessB) => guessB.timestamp - guessA.timestamp)
                    .map(guess => guess.stationName)
                    .map((station, index) => (
                        <ListItem
                            key={index}
                            className={station === highlightedStation ? 'highlight' : ''}
                        >
                            <ListItemText primary={station} />
                        </ListItem>
                    ))}
            </List>
            }
        </>
    );
};

export default CorrectStationGuesses;