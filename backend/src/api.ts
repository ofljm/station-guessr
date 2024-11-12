import { Router, Request, Response } from 'express';
import { LoginResponse } from './domain/Responses';
import { Player } from './domain/Player';

const router = Router();

const loggedInPlayers: Player[]= []

router.post('/login', (req: Request, res: Response<LoginResponse>) => {
    const { playerName, uuid } = req.body;

    if (!uuid) {
        res.status(400).json({ message: 'UUID is required' });
        return;
    }

    if(!playerName) {
        res.status(400).json({ message: 'Player name is required' });
        return;
    }

    // Check if the user is already logged in
    const userExists = loggedInPlayers.some(user => user.uuid === uuid);

    if (!userExists) {
        // Add the user to the logged-in users array
        loggedInPlayers.push({ name: playerName, uuid });
    }

    res.status(200).json({ message: 'Login successful' });
});

router.get('/players', (req: Request, res: Response) => {
    res.status(200).json(loggedInPlayers);
});

export default router;