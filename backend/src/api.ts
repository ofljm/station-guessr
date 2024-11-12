import { Router, Request, Response } from 'express';

const router = Router();

const loggedInUsers: { uuid: string }[] = []

router.post('/login', (req: Request, res: Response) => {
    const { uuid } = req.body;

    if (!uuid) {
        res.status(400).json({ error: 'UUID is required' });
        return;
    }

    // Check if the user is already logged in
    const userExists = loggedInUsers.some(user => user.uuid === uuid);

    if (!userExists) {
        // Add the user to the logged-in users array
        loggedInUsers.push({ uuid });
    }

    res.status(200).json({ message: 'Login successful', uuid });
});

router.get('/users', (req: Request, res: Response) => {
    console.log(loggedInUsers);
    res.status(200).json(loggedInUsers);
});

export default router;