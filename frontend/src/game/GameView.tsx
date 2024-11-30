import React, { useState } from 'react';
import { GameSession } from '../domain/PlayerSession';
import GuessingView from './GuessingView';
import WaitingView from './WaitingView';
import GameOverView from './GameOverView';

type GameViewProps = {
    token: string
    gameSession?: GameSession
}

const GameView: React.FC<GameViewProps> = ({ token, gameSession }) => {
    const [updatedGameSession, setUpdatedGameSession] = useState<GameSession | undefined>(gameSession);
    const [isGameOver, setIsGameOver] = useState<boolean>(false);

    return (
        <>
            {isGameOver && updatedGameSession
                ? <GameOverView gameSession={updatedGameSession} />
                : updatedGameSession
                    ? <GuessingView gameSession={updatedGameSession} token={token} onGameOver={() => setIsGameOver(true)} />
                    : <WaitingView token={token} onGameStart={setUpdatedGameSession} />}
        </>
    );
};

export default GameView;