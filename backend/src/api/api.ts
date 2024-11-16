import { Request, Response, Router } from 'express';
import PlayerStore from '../storage/PlayerStore';
import { PlayerData } from './PlayerData';
import { GuessResponse, LoginResponse } from './Responses';
import { GuessRequest, LoginRequest } from './Requests';
import { checkGuess, CorrectGuess } from '../stations/guessChecker';
import { Stations } from '../stations/stations';
import { Player } from '../storage/Player';

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

router.post('/guess', (req: Request<GuessRequest>, res: Response<GuessResponse>): void => {
    const { playerToken, station } = req.body;

    if (!playerToken || !station) {
        res.status(400).json({ message: 'Player token and guess are required'});
        return;
    }

    const playerStore = PlayerStore.getInstance();
    const player = playerStore.getPlayer(playerToken);

    if (!player) {
        res.status(400).json({ message: 'Player not found. Wrong token?'});
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

router.get('/players', (req: Request, res: Response<PlayerData[]>): void => {
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
    const json = {
        message: 'Guess request successful',
        result: checkGuessOutcome.result,
        correctlyGuessedStationNames
    };
    console.log('Sending json:', json);
    res.status(200).json(json);
}

export default router;

