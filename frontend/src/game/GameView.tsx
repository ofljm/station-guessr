import { Typography } from '@mui/material';
import React, { useState } from 'react';
import { Api } from '../api/Api';
import { CorrectGuess, GameSession } from '../domain/PlayerSession';
import GameOverView from './GameOverView';
import GuessingView from './GuessingView';
import WaitingView from './WaitingView';

type GameViewProps = {
    token: string
    gameSession?: GameSession
}

const GameView: React.FC<GameViewProps> = ({ token, gameSession }) => {
    const [updatedGameSession, setUpdatedGameSession] = useState<GameSession | undefined>(gameSession);
    const [isGameOver, setIsGameOver] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    function startNewGame() {
        Api.startGame(token)
            .then(response => setUpdatedGameSession({
                duration: response.duration,
                startTime: response.startTime,
                correctGuesses: []
            }))
            .then(() => setIsGameOver(false))
            .catch(error => setError(error));
    }

    function handleGameOver(correctGuesses: CorrectGuess[]) {
        setIsGameOver(true);
        setUpdatedGameSession({ ...updatedGameSession!, correctGuesses: correctGuesses });
    }

    return (
        <>
            {error && <Typography >{error}</Typography>}
            {!updatedGameSession && <WaitingView onGameStart={startNewGame} />}
            {updatedGameSession && !isGameOver && <GuessingView gameSession={updatedGameSession} token={token} onGameOver={handleGameOver} />}
            {isGameOver && <GameOverView correctGuesses={updatedGameSession?.correctGuesses || []} onRestart={startNewGame} />}
        </>
    );
};

export default GameView;