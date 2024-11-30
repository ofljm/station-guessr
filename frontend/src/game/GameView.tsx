import React, { useState } from 'react';
import { GameSession } from '../domain/PlayerSession';
import GuessingView from './GuessingView';
import WaitingView from './WaitingView';
import GameOverView from './GameOverView';
import { Api } from '../api/Api';
import { Typography } from '@mui/material';

type GameViewProps = {
    token: string
    gameSession?: GameSession
}

const GameView: React.FC<GameViewProps> = ({ token, gameSession }) => {
    const [updatedGameSession, setUpdatedGameSession] = useState<GameSession | undefined>(gameSession);
    const [isGameOver, setIsGameOver] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    function startNewGame() {
        console.log("Starting new game");
        Api.startGame(token)
            .then(response => setUpdatedGameSession({
                duration: response.duration,
                startTime: response.startTime,
                correctlyGuessedStationNames: []
            }))
            .then(() => setIsGameOver(false))
            .catch(error => setError(error));
    }

    return (
        <>
            {error && <Typography >{error}</Typography>}
            {isGameOver && updatedGameSession
                ? <GameOverView gameSession={updatedGameSession} onRestart={startNewGame} />
                : updatedGameSession
                    ? <GuessingView gameSession={updatedGameSession} token={token} onGameOver={() => setIsGameOver(true)} />
                    : <WaitingView onGameStart={startNewGame} />}
        </>
    );
};

export default GameView;