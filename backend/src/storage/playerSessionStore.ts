import { randomUUID } from "crypto";

export type Player = {
    name: string
}

export type CorrectlyGuessedStation = {
    id: string,
    timestamp: number // Unix timestamp (milliseconds)
}

export type GameSession = {
    startTime: number  // Unix timestamp (milliseconds)
    duration: number   // seconds
    correctlyGuessedStations: CorrectlyGuessedStation[]
}

export type PlayerSession = {
    player: Player,
    gameSession?: GameSession
}

class PlayerSessionStore {
    private static instance: PlayerSessionStore;
    private playerSessions: Map<string, PlayerSession>; // key: token

    private constructor() {
        this.playerSessions = new Map();
    }

    public static getInstance(): PlayerSessionStore {
        if (!PlayerSessionStore.instance) {
            PlayerSessionStore.instance = new PlayerSessionStore();
        }
        return PlayerSessionStore.instance;
    }

    public register(name: string): string {
        const token = randomUUID();
        this.playerSessions.set(token, {
            player: {
                name
            }
        });
        return token;
    }

    public getActiveSession(token: string): GameSession | undefined {
        const playerSession = this.playerSessions.get(token);
        if (!playerSession) {
            return;
        }
        const gameSession = playerSession.gameSession;
        if (!gameSession) {
            return;
        }
        if (gameSession.startTime + gameSession.duration * 1000 < Date.now()) {
            return;
        }
        return gameSession;
    }

    public getPlayerSessions(): PlayerSession[] {
        console.log('PlayerSessionStore.getPlayerSessions', this.playerSessions);
        return Array.from(this.playerSessions.values());
    }

    public getPlayerSession(token: string): PlayerSession | undefined {
        return this.playerSessions.get(token);
    }

    public playerWithNameExists(name: string): boolean {
        return !!Array.from(this.playerSessions.values())
            .map(playerSession => playerSession.player)
            .map(player => player.name)
            .find(playerName => playerName === name);
    }

    public startGame(token: string, duration: number): GameSession | undefined {
        const playerSession = this.playerSessions.get(token);
        if (!playerSession) {
            this.playerSessions
            return;
        }

        const newGameSession: GameSession = {
            startTime: Date.now(),
            duration,
            correctlyGuessedStations: []
        };
        playerSession.gameSession = newGameSession;

        return newGameSession;
    }

    public updateSession(token: string, session: GameSession): void {
        const playerSession = this.playerSessions.get(token);
        if (!playerSession) {
            return;
        }
        playerSession.gameSession = session;
    }

}

export default PlayerSessionStore;