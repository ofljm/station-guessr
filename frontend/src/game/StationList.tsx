import { List, ListItem, ListItemText } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { CorrectGuess } from '../domain/PlayerSession';
import './StationList.css';

interface CorrectStationGuessesProps {
    correctGuesses: CorrectGuess[];
}

const CorrectStationGuesses: React.FC<CorrectStationGuessesProps> = ({ correctGuesses }) => {
    const [highlightedStation, setHighlightedStation] = useState<string | null>(null);

    useEffect(() => {
        if(!correctGuesses || correctGuesses.length <= 0) {
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
            <List>
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
        </>
    );
};

export default CorrectStationGuesses;