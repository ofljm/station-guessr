import { Request, Response, Router } from 'express';
import { checkGuess, CorrectGuess } from '../stations/guessChecker';
import { Stations } from '../stations/stations';
import { GameSessionStore } from '../storage/gameSessionStore';
import PlayerStore, { Player } from '../storage/PlayerStore';
import { GuessRequest, LoginRequest } from './Requests';
import { GameSessionResponse, GameStartResponse, GuessResponse, LoginResponse, PlayerData, PlayerStats } from './Responses';
import { Session } from 'inspector/promises';

const router = Router();

router.post('/login', (req: Request<LoginRequest>, res: Response<LoginResponse>): void => {
    const { playerName } = req.body;

    if (!playerName) {
        res.status(400).json({ message: 'Player name is required' });
        return;
    }

    const playerStore = PlayerStore.getInstance();

    if (playerStore.playerExists(playerName)) {
        res.status(400).json({ message: 'Player name already exists' });
        return;
    }

    const token = playerStore.register(playerName);
    res.status(200).json({ message: 'Login successful', token });
});

router.post('/game/guess', (req: Request<GuessRequest>, res: Response<GuessResponse>): void => {
    const { token, station } = req.body;

    if (!token || !station) {
        res.status(400).json({ message: 'Token and guess are required' });
        return;
    }

    const playerStore = PlayerStore.getInstance();
    const player = playerStore.getPlayer(token);

    if (!player) {
        res.status(400).json({ message: 'Player not found. Wrong token?' });
        return;
    }

    const sessionStore = GameSessionStore.getInstance();

    const session = sessionStore.getActiveSession(token);
    if (!session) {
        res.status(400).json({ message: 'Session token is invalid or game session has ended.' });
        return;
    }

    const checkGuessOutcome = checkGuess(station, session);
    if (checkGuessOutcome.result === 'correct') {
        session.correctlyGuessedStationIds.push(checkGuessOutcome.station.id);
        sessionStore.updateSession(token, session);
        const correctlyGuessedStationNames = Stations.getStationNames(session.correctlyGuessedStationIds);
        res.status(200).json({
            message: 'Guess request successful',
            result: checkGuessOutcome.result,
            correctlyGuessedStationNames
        });
        return;
    };

    res.status(200).json({
        message: 'Guess request successful but the guess itself was not.',
        result: checkGuessOutcome.result,
        correctlyGuessedStationNames: Stations.getStationNames(session.correctlyGuessedStationIds)
    });
});

router.get('/players', (req: Request, res: Response<PlayerStats[]>): void => {
    const sessionStore = GameSessionStore.getInstance();
    const playerStore = PlayerStore.getInstance();

    const spectatorData = sessionStore
        .getTokens()
        .map(token => {
            const player = playerStore.getPlayer(token)
            const session = sessionStore.getActiveSession(token);
            if (!player || !session) {
                return;
            }
            return {
                name: player.name,
                numberOfCorrectGuesses: session.correctlyGuessedStationIds.length
            }
        })
        .filter(playerStats => playerStats !== undefined);

    res.status(200).json(spectatorData);
});

// TODO: Remove this, not necessary
router.get('/player', (req: Request, res: Response<PlayerData>): void => {
    const playerToken = req.headers['player-token'] as string | undefined;

    if (!playerToken) {
        res.status(400).json({ message: 'Player token is required' });
        return;
    }

    const playerStore = PlayerStore.getInstance();
    const maybePlayer: Player | undefined = playerStore.getPlayer(playerToken!);
    if (!maybePlayer) {
        res.status(400).json({ message: 'Player not found. Wrong token?' });
        return;
    }

    res.status(200).json({
        message: '',
        name: maybePlayer.name,
        correctlyGuessedStationNames: Stations.getStationNames([])
    });
});

router.post('/game/start', (req: Request, res: Response<GameStartResponse>): void => {
    const token = req.headers['token'] as string;
    const durationInSeconds = 300;

    const gameSessionStore = GameSessionStore.getInstance();
    gameSessionStore.startGame(token, durationInSeconds);

    res.status(200).json({
        message: 'Game session started',
        startTime: Date.now(),
        duration: durationInSeconds
    });
});

router.get('/game/session', (req: Request, res: Response<GameSessionResponse>): void => {
    const token = req.headers['token'] as string;

    if (!token) {
        res.status(400).json({ message: 'Token is required' });
        return;
    }

    const gameSessionStore = GameSessionStore.getInstance();
    const session = gameSessionStore.getActiveSession(token);

    if (!session) {
        res.status(400).json({ message: 'Game session not found. Either the token is wrong or the game session has ended.' });
        return;
    }

    res.status(200).json({
        message: 'Game session found',
        startTime: session.startTime,
        duration: session.duration
    });
});

export default router;

