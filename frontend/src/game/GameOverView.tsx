import { Button } from '@mui/material';
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
            <h2>Zeit abgelaufen!</h2>
            <p>Du hast {correctGuesses.length} Haltestellen korrekt erraten 🎉</p>
            <CorrectStationGuesses correctGuesses={correctGuesses} highlightNew={false}/>
            <Button onClick={onRestart} variant='contained'>Nochmal spielen</Button>
        </>
    );
};

export default GameOverView;