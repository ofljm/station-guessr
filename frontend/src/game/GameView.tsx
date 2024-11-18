import React, { useEffect, useState } from 'react';
import WaitingView from './WaitingView';
import { LocalStorage } from '../LocalStorage';
import GuessingView from './GuessingView';
import { GameSession } from './GameSession';
import { Api } from '../api/Api';

type GameViewProps = {
    token: string
}

const GameView: React.FC<GameViewProps> = ({ token }) => {
    const [gameSession, setGameSession] = useState<GameSession | undefined>();

    useEffect(() => {
        const sessionToken = LocalStorage.getToken();
        if (!sessionToken) {
            return;
        }

        Api.getGameSession(sessionToken)
            .then(response => setGameSession(
                {
                    startTime: response.startTime,
                    duration: response.duration,
                    correctlyGuessedStationNames: response.correctlyGuessedStationNames
                }))
            .catch(error => {
                console.error('Failed to get game session:', error);
                LocalStorage.clearToken();
            });
    }, []);

    return (
        <>
            {gameSession ?
                <GuessingView session={gameSession} token={token} /> :
                <WaitingView token={token} onGameStart={setGameSession} />}
        </>
    );
};

export default GameView;