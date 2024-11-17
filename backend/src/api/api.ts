import { Request, Response, Router } from 'express';
import PlayerStore, { Player } from '../storage/PlayerStore';
import { GameSessionResponse, GuessResponse, LoginResponse, PlayerData, PlayerStats } from './Responses';
import { GuessRequest, LoginRequest } from './Requests';
import { checkGuess, CorrectGuess } from '../stations/guessChecker';
import { Stations } from '../stations/stations';
import { GameSessionStore } from '../storage/gameSessionStore';

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
    const { playerToken, sessionToken, station } = req.body;

    if (!playerToken || !station) {
        res.status(400).json({ message: 'Player token and guess are required' });
        return;
    }

    const playerStore = PlayerStore.getInstance();
    const player = playerStore.getPlayer(playerToken);

    if (!player) {
        res.status(400).json({ message: 'Player not found. Wrong token?' });
        return;
    }

    const isValid = GameSessionStore.getInstance().validate(sessionToken);
    if (!isValid) {
        res.status(400).json({ message: 'Session token is invalid or game session has ended.' });
        return;
    }

    const checkGuessOutcome = checkGuess(station, player);
    if (checkGuessOutcome.result === 'correct') {
        handleCorrectGuess(player, checkGuessOutcome, playerStore, playerToken, res);
        return;
    };

    res.status(200).json({
        message: 'Guess request successful but the guess itself was not.',
        result: checkGuessOutcome.result,
        correctlyGuessedStationNames: Stations.getStationNames(player.correctlyGuessedStationIds)
    });
});

router.get('/players', (req: Request, res: Response<PlayerStats[]>): void => {
    const spectatorData = PlayerStore.getInstance()
        .getPlayers()
        .map(player => ({
            name: player.name,
            correctGuesses: player.correctlyGuessedStationIds.length
        }));
    res.status(200).json(spectatorData);
});

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
        correctlyGuessedStationNames: Stations.getStationNames(maybePlayer.correctlyGuessedStationIds)
    });
});

router.post('/game/start', (req: Request, res: Response<GameSessionResponse>): void => {
    const token = req.headers['token'] as string;
    const duration = 300; // 5 minutes

    const gameSessionStore = GameSessionStore.getInstance();
    const sessionToken = gameSessionStore.startGame(token, duration);

    res.status(200).json({
        message: 'Game session started',
        sessionToken,
        startTime: Date.now(),
        duration
    });
});

router.get('/game/status', (req: Request, res: Response<GameSessionResponse>): void => {
    const sessionToken = req.headers['session-token'] as string;

    if (!sessionToken) {
        res.status(400).json({ message: 'Session token is required' });
        return;
    }
    
    const gameSessionStore = GameSessionStore.getInstance();
    const session = gameSessionStore.getSession(sessionToken);

    if (!session) {
        res.status(400).json({ message: 'Session not found. Wrong token?' });
        return;
    }

    res.status(200).json({
        message: 'Session found',
        sessionToken,
        startTime: session.startTime,
        duration: session.duration
    });
});

function handleCorrectGuess(player: Player, checkGuessOutcome: CorrectGuess, playerStore: PlayerStore, playerToken: any, res: Response<GuessResponse, Record<string, any>>) {
        player.correctlyGuessedStationIds.push(checkGuessOutcome.station.id);
        playerStore.updatePlayer(playerToken, player);

        const correctlyGuessedStationNames = Stations.getStationNames(player.correctlyGuessedStationIds);
        const json = {
            message: 'Guess request successful',
            result: checkGuessOutcome.result,
            correctlyGuessedStationNames
        };
        console.log('Sending json:', json);
        res.status(200).json(json);
    }

export default router;

