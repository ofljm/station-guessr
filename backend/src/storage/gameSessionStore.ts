
export type GameSession = {
    startTime: number  // Unix timestamp (milliseconds)
    duration: number   // seconds
    correctlyGuessedStationIds: string[]
}

export class GameSessionStore {
    private static instance: GameSessionStore;
    private gameSessions: Map<string, GameSession>; // key: token

    private constructor() {
        this.gameSessions = new Map();
    }

    public static getInstance(): GameSessionStore {
        if (!GameSessionStore.instance) {
            GameSessionStore.instance = new GameSessionStore();
        }
        return GameSessionStore.instance;
    }

    public startGame(playerToken: string, duration: number): void {
        this.gameSessions.set(playerToken, {
            startTime: Date.now(),
            duration,
            correctlyGuessedStationIds: []
        });
    }

    public getActiveSession(token: string): GameSession | undefined {
        const session = this.gameSessions.get(token);
        if (!session) {
            return;
        }
        if (session.startTime + session.duration * 1000 < Date.now()) {
            return;
        }
        return session;
    }

    public updateSession(token: string, session: GameSession): void {
        this.gameSessions.set(token, session);
    }

    public getTokens(): string[] {
        return Array.from(this.gameSessions.keys());
    }

}