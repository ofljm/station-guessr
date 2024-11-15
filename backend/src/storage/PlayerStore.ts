import { randomUUID } from "crypto";
import { Player } from "../domain/Player";

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

    public addPlayer(player: Player): void {
        this.players.set(randomUUID(), player);
    }

    public getPlayer(id: string): any | undefined {
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

}

export default PlayerStore;