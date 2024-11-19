import React, { useState } from 'react';
import { GameSession } from '../domain/PlayerSession';
import GuessingView from './GuessingView';
import WaitingView from './WaitingView';

type GameViewProps = {
    token: string
    gameSession?: GameSession
}

const GameView: React.FC<GameViewProps> = ({ token, gameSession }) => {
    const [updatedGameSession, setUpdatedGameSession] = useState<GameSession | undefined>(gameSession);

    return (
        <>
            {updatedGameSession
                ? <GuessingView gameSession={updatedGameSession} token={token} />
                : <WaitingView token={token} onGameStart={setUpdatedGameSession} />}
        </>
    );
};

export default GameView;