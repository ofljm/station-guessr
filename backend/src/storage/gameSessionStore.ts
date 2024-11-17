import { randomUUID } from "crypto"

export type GameSession = {
    playerToken: string
    startTime: number  // Unix timestamp
    duration: number   // seconds
    isActive: boolean
}

export class GameSessionStore {
    private static instance: GameSessionStore;
    private gameSessions: Map<string, GameSession>; // key: sessionToken

    private constructor() {
        this.gameSessions = new Map();
    }

    public static getInstance(): GameSessionStore {
        if (!GameSessionStore.instance) {
            GameSessionStore.instance = new GameSessionStore();
        }
        return GameSessionStore.instance;
    }

    public startGame(playerToken: string, duration: number): string {
        const sessionToken = randomUUID();
        this.gameSessions.set(sessionToken, {
            playerToken,
            startTime: Date.now(),
            duration,
            isActive: true
        });
        return sessionToken;
    }

    public getSession(sessionToken: string): GameSession | undefined {
        if(this.validate(sessionToken)) {
            return this.gameSessions.get(sessionToken);
        } 
    }

    public validate(sessionToken: string): boolean {
        const session = this.gameSessions.get(sessionToken);
        if (!session?.isActive) {
            return false;
        }
        if (session.startTime + session.duration * 1000 < Date.now()) {
            session.isActive = false;
            return false;
        }
        return true;
    }
}