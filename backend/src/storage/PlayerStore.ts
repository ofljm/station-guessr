import { randomUUID } from "crypto";

export type Player = {
    name: string;
    correctlyGuessedStationIds: string[];
}

class PlayerStore {
    private static instance: PlayerStore;
    private players: Map<string, Player>;

    private constructor() {
        this.players = new Map();
    }

    public static getInstance(): PlayerStore {
        if (!PlayerStore.instance) {
            PlayerStore.instance = new PlayerStore();
        }
        return PlayerStore.instance;
    }

    public register(name: string): string {
        const token = randomUUID();
        this.players.set(token, {
            name,
            correctlyGuessedStationIds: []
        });
        return token;
    }

    public getPlayer(token: string): Player | undefined {
        return this.players.get(token);
    }

    public getPlayers(): Player[] {
        return Array.from(this.players.values());
    }

    public playerExists(name: string): boolean {
        for (const player of this.players.values()) {
            if (player.name === name) {
                return true;
            }
        }
        return false;
    }

    public updatePlayer(token: string, player: Player): void {
        this.players.set(token, player);
    }
}

export default PlayerStore;