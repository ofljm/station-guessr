import React from 'react';
import { GameSession } from '../domain/PlayerSession';
import { Button } from '@mui/material';

type GameOverViewProps = {
    gameSession: GameSession
    onRestart: () => void
}

const GameOverView: React.FC<GameOverViewProps> = ({ gameSession, onRestart }) => {
    return (
        <div>
            <h2>Zeit abgelaufen!</h2>
            <p>Du hast {gameSession.correctlyGuessedStationNames.length} Haltestellen korrekt erraten 🎉</p>
            <ul>
                {gameSession.correctlyGuessedStationNames.map((station) => (
                    <li key={station}>{station}</li>
                ))}
            </ul>
            <Button onClick={onRestart} variant='contained'>Nochmal spielen</Button>
        </div>
    );
};

export default GameOverView;