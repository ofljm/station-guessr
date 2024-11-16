import axios from "axios";
import { Player } from "./domain/Player";

const apiUrl = import.meta.env.VITE_SERVICE_URL;

type LoginResponse = {
    message: string;
    token: string;
}

export type GuessResult = 'correct' | 'incorrect' | 'alreadyGuessed' | 'invalid';

type GuessResponse = {
    message: string
    result?: GuessResult
    correctlyGuessedStationNames?: string[]
}

export namespace Api {
    export async function login(playerName: string): Promise<LoginResponse> {
        const response = await axios.post<LoginResponse>(`${apiUrl}/login`, { playerName });
        return response.data;
    }

    export async function getPlayer(token: string): Promise<Player> {
        const response = await axios.get<Player>(`${apiUrl}/player`, { headers: { token } });
        return response.data;
    }

    export async function getPlayers(): Promise<Player[]> {
        const response = await axios.get<Player[]>(`${apiUrl}/players`);
        return response.data;
    }

    export async function submitGuess(playerToken: string, station: string): Promise<GuessResponse> {
        const response = await axios.post(`${apiUrl}/guess`, { playerToken, station });
        return response.data;
    }
}
