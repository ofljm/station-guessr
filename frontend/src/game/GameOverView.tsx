import React from 'react';
import { GameSession } from '../domain/PlayerSession';

type GameOverViewProps = {
    gameSession: GameSession
}

const GameOverView: React.FC<GameOverViewProps> = ({ gameSession }) => {
    return (
        <div>
            <h2>Zeit abgelaufen!</h2>
            <p>Du hast {gameSession.correctlyGuessedStationNames.length} Haltestellen korrekt erraten!</p>
            <ul>
                {gameSession.correctlyGuessedStationNames.map((station) => (
                    <li key={station}>{station}</li>
                ))}
            </ul>
        </div>
    );
};

export default GameOverView;