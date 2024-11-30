import React from 'react';
import { GameSession } from '../domain/PlayerSession';

interface AfterGameViewProps {
    gameSession: GameSession;
}

const GameFinishedView: React.FC<AfterGameViewProps> = ({ gameSession }) => {
    return (
        <div>
            <h1>Spiel beendet!</h1>
            <p>Du hast {gameSession.correctlyGuessedStationNames.length} Haltestellen erraten!</p>
            <ul>
                {gameSession.correctlyGuessedStationNames
                    .map((stationName, index) => <li key={index}>{stationName}</li>)}
            </ul>
        </div>
    );
};

export default GameFinishedView;