import axios from "axios";
import { Player } from "./domain/Player";
import { PlayerStats } from "./domain/PlayerStats";

const apiUrl = import.meta.env.VITE_SERVICE_URL;

type LoginResponse = {
    message: string;
    token: string;
}

type GuessRequest = {
    station: string
    sessionToken: string
    playerToken: string
}

export type GuessResult = 'correct' | 'incorrect' | 'alreadyGuessed' | 'invalid';

type GuessResponse = {
    message: string
    result?: GuessResult
    correctlyGuessedStationNames?: string[]
}

export type GameSessionResponse = {
    message: string
    sessionToken: string
    startTime: number
    duration: number
}


export namespace Api {
    export async function login(playerName: string): Promise<LoginResponse> {
        const response = await axios.post<LoginResponse>(`${apiUrl}/login`, { playerName });
        return response.data;
    }

    export async function getPlayer(playerToken: string): Promise<Player> {
        const response = await axios.get<Player>(`${apiUrl}/player`, { headers: { 'player-token': playerToken } });
        return response.data;
    }

    export async function getPlayers(): Promise<PlayerStats[]> {
        const response = await axios.get<PlayerStats[]>(`${apiUrl}/players`);
        return response.data;
    }

    export async function submitGuess(playerToken: string, sessionToken: string, station: string): Promise<GuessResponse> {
        const response = await axios.post(`${apiUrl}/game/guess`,
            { playerToken, sessionToken, station });
        return response.data;
    }

    export async function startGame(token: string): Promise<GameSessionResponse> {
        const response = await axios.post(
            `${apiUrl}/game/start`,
            {},
            { headers: { token } }
        );
        return response.data;
    }

    export async function getGameSession(sessionToken: string): Promise<GameSessionResponse> {
        const response = await axios.get(`${apiUrl}/game/status`, { headers: { 'session-token': sessionToken } });
        return response.data;
    }
}
