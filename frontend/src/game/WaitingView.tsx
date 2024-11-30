import React from 'react';
import { Api } from '../api/Api';
import { GameSession } from '../domain/PlayerSession';

interface WaitingViewProps {
    token: string
    onGameStart: (gameSession: GameSession) => void
}

const WaitingView: React.FC<WaitingViewProps> = ({ token: playerToken, onGameStart }) => {

    const [error, setError] = React.useState<Error | null>();

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
            {error && <span>{error.message}</span>}
            <button onClick={startGame}>Start</button>
        </>
    );
};

export default WaitingView;