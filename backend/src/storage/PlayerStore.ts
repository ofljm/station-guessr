import { randomUUID } from "crypto";
import { Player } from "./Player";

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

    public getPlayer(id: string): Player | undefined {
        return this.players.get(id);
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