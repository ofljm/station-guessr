import { randomUUID } from 'crypto';
import { Request, Response, Router } from 'express';
import { Player } from './domain/Player';
import { LoginResponse } from './domain/Responses';
import PlayerStore from './storage/PlayerStore';

const router = Router();

type LoginRequest = {
    playerName: string;
}

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

    playerStore.addPlayer({ name: playerName });

    res.status(200).json({ message: 'Login successful' });
});

router.get('/players', (req: Request, res: Response<Player[]>) => {
    res.status(200).json(PlayerStore.getInstance().getPlayers());
});

export default router;