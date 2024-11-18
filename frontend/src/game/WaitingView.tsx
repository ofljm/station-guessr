import React from 'react';
import { GameSession } from './GameSession';
import { Api } from '../api/Api';

interface WaitingViewProps {
    token: string
    onGameStart: (gameSession: GameSession) => void
}

const WaitingView: React.FC<WaitingViewProps> = ({ token: playerToken, onGameStart }) => {

    const [error, setError] = React.useState<string>('');

    async function startGame() {
        Api.startGame(playerToken)
            .then(response => onGameStart({
                duration: response.duration,
                startTime: response.startTime,
                correctlyGuessedStationNames: []
            }))
            .catch(error => setError(error));
    }

    return (
        <>
            {error && <span>{error}</span>}
            <button onClick={startGame}>Start</button>
        </>
    );
};

export default WaitingView;