import { Request, Response, Router } from 'express';
import { checkGuess } from '../stations/guessChecker';
import { Stations } from '../stations/stations';
import PlayerSessionStore, { CorrectlyGuessedStation, GameSession, PlayerSession } from '../storage/playerSessionStore';
import { GuessRequest, LoginRequest } from './Requests';
import { CorrectGuess, GameStartResponse, GuessResponse, PlayerSessionResponse, PlayerStats, RegisterResponse } from './Responses';

const router = Router();

router.post('/register', (req: Request<LoginRequest>, res: Response<RegisterResponse>): void => {
    const { playerName } = req.body;

    if (!playerName) {
        res.status(400).json({ message: 'Player name is required' });
        return;
    }

    const playerStore = PlayerSessionStore.getInstance();

    if (playerStore.playerWithNameExists(playerName)) {
        res.status(400).json({ message: 'Player name already exists' });
        return;
    }

    const token = playerStore.register(playerName);
    res.status(200).json({ message: 'Login successful', token });
});

router.post('/guess', (req: Request<GuessRequest>, res: Response<GuessResponse>): void => {
    const { station } = req.body;
    const token = req.headers['token'] as string;

    if (!token || !station) {
        res.status(400).json({ message: 'Token and guess are required' });
        return;
    }

    const playerSessionStore = PlayerSessionStore.getInstance();

    const gameSession: GameSession | undefined = playerSessionStore
        .getActiveSession(token);

    if (!gameSession) {
        res.status(400).json({ message: 'Session not found. Wrong token or session not started or Session ended.' });
        return;
    }

    const checkGuessOutcome = checkGuess(station, gameSession!.correctlyGuessedStations.map(station => station.id));
    if (checkGuessOutcome.result === 'correct') {
        const correctlyGuessedStations = gameSession.correctlyGuessedStations;
        correctlyGuessedStations.push({ id: checkGuessOutcome.station.id, timestamp: checkGuessOutcome.timestamp });
        playerSessionStore.updateSession(token, gameSession);

        const correctGuesses: CorrectGuess[] = correctlyGuessedStations.map(station => {
            return {
                stationName: Stations.getStationName(station.id),
                timestamp: station.timestamp
            };
        });

        res.status(200).json({
            message: 'Guess request successful',
            result: checkGuessOutcome.result,
            correctGuesses
        });
        return;
    };

    res.status(200).json({
        message: 'Guess request successful but the guess itself was not.',
        result: checkGuessOutcome.result,
    });
});

router.get('/player/all', (req: Request, res: Response<PlayerStats[]>): void => {
    const spectatorData = (PlayerSessionStore.getInstance())
        .getPlayerSessions()
        .map(playerSession => ({
            name: playerSession.player.name,
            numberOfCorrectGuesses: playerSession.gameSession
                ? playerSession.gameSession.correctlyGuessedStations?.length
                : 0
        }))

    res.status(200).json(spectatorData);
});

router.get('/player', (req: Request, res: Response<PlayerSessionResponse>): void => {
    const token = req.headers['token'] as string | undefined;

    if (!token) {
        res.status(400).json({ message: 'Player token is required' });
        return;
    }

    const playerSession: PlayerSession | undefined = PlayerSessionStore.getInstance()
        .getPlayerSession(token!);

    if (!playerSession) {
        res.status(400).json({ message: 'Player session not found. Wrong token?' });
        return;
    }

    const gameSession: GameSession | undefined = playerSession.gameSession;

    res.status(200).json({
        message: '',
        player: playerSession.player,
        gameSession: gameSession && {
            startTime: gameSession.startTime,
            duration: gameSession.duration,
            correctGuesses: mapCorrectGuesses(gameSession.correctlyGuessedStations)
        }
    });
});

router.post('/start', (req: Request, res: Response<GameStartResponse>): void => {
    const token = req.headers['token'] as string;
    const durationInSeconds = 600;

    const session = PlayerSessionStore.getInstance()
        .startGame(token, durationInSeconds);

    if (!session) {
        res.status(400).json({ message: 'Player session not found. Wrong token?' });
        return;
    }

    res.status(200).json({
        message: 'Game session started',
        startTime: Date.now(),
        duration: durationInSeconds
    });
});

function mapCorrectGuesses(stations: CorrectlyGuessedStation[]) {
    return stations.map(station => {
        return {
            stationName: Stations.getStationName(station.id),
            timestamp: station.timestamp
        };
    });
}

export default router;

