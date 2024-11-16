import { Request, Response, Router } from 'express';
import PlayerStore from '../storage/PlayerStore';
import { PlayerData } from './PlayerData';
import { GuessResponse, LoginResponse } from './Responses';
import { GuessRequest, LoginRequest } from './Requests';
import { checkGuess, CorrectGuess } from '../stations/guessChecker';
import { Stations } from '../stations/stations';
import { Player } from '../storage/Player';

const router = Router();

router.post('/login', (req: Request<LoginRequest>, res: Response<LoginResponse>) => {
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

router.post('/guess', (req: Request<GuessRequest>, res: Response<GuessResponse>) => {
    const { playerToken, station } = req.body;

    if (!playerToken || !station) {
        res.status(400).json({ message: 'Player token and guess are required', result: 'invalid', correctlyGuessedStationNames: [] });
        return;
    }

    const playerStore = PlayerStore.getInstance();
    const player = playerStore.getPlayers().find(player => player.name === playerToken);

    if (!player) {
        res.status(400).json({ message: 'Player not found. Wrong token?', result: 'invalid', correctlyGuessedStationNames: [] });
        return;
    }

    const checkGuessOutcome = checkGuess(station, player);
    if (checkGuessOutcome.result === 'correct') {
        handleCorrectGuess(player, checkGuessOutcome, playerStore, playerToken, res);
    };

    res.status(200).json({
        message: 'Guess request successful but the guess itself was not.',
        result: checkGuessOutcome.result,
        correctlyGuessedStationNames: Stations.getStationNames(player.correctlyGuessedStationIds)
    });
});

router.get('/players', (req: Request, res: Response<PlayerData[]>) => {
    const playerData = PlayerStore.getInstance()
        .getPlayers()
        .map(player => ({
            name: player.name,
            correctGuesses: 0
        }));
    res.status(200).json(playerData);
});

function handleCorrectGuess(player: Player, checkGuessOutcome: CorrectGuess, playerStore: PlayerStore, playerToken: any, res: Response<GuessResponse, Record<string, any>>) {
    player.correctlyGuessedStationIds.push(checkGuessOutcome.station.id);
    playerStore.updatePlayer(playerToken, player);

    const correctlyGuessedStationNames = Stations.getStationNames(player.correctlyGuessedStationIds);
    res.status(200).json({
        message: 'Guess request successful',
        result: checkGuessOutcome.result,
        correctlyGuessedStationNames
    });
}

export default router;

