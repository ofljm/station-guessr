import { Box, Button, List, ListItem, Typography } from '@mui/material';
import React from 'react';
import { CorrectGuess } from '../domain/PlayerSession';
import CorrectStationGuesses from './CorrectStationGuesses';

type GameOverViewProps = {
    correctGuesses: CorrectGuess[]
    onRestart: () => void
}

const GameOverView: React.FC<GameOverViewProps> = ({ correctGuesses, onRestart }) => {
    return (
        <>
            <Typography textAlign={'center'} variant={'h4'}>Zeit abgelaufen!</Typography>
            <List>
                <ListItem>
                    <Typography variant='body2'>Du hast {correctGuesses.length} Haltestellen korrekt erraten 🎉</Typography>
                </ListItem>
                <ListItem>
                    <CorrectStationGuesses correctGuesses={correctGuesses} highlightNew={false} />
                </ListItem>
                <ListItem>
                    <Button onClick={onRestart} variant='contained'>Nochmal spielen</Button>
                </ListItem>
            </List>
        </>
    );
};

export default GameOverView;