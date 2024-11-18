import axios from "axios";
import { handleApiError } from "./ApiErrorHandler";
import { Player } from "../domain/Player";
import { PlayerStats } from "../domain/PlayerStats";

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

export type GameStartResponse = {
    message: string
    startTime: number
    duration: number
}

export type GameSessionResponse = {
    message: string
    startTime: number
    duration: number
    correctlyGuessedStationNames: string[]
}

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_SERVICE_URL,
});

apiClient.interceptors.response.use(
    response => response,
    error => {
        const errorMessage = handleApiError(error);
        return Promise.reject(new Error(errorMessage));
    }
);

export namespace Api {

    export async function login(playerName: string): Promise<LoginResponse> {
        const response = await apiClient.post<LoginResponse>('/login', { playerName });
        return response.data;
    }

    // TODO: Remove this, not necessary
    export async function getPlayer(playerToken: string): Promise<Player> {
        const response = await apiClient.get<Player>('/player', { headers: { 'player-token': playerToken } });
        return response.data;
    }

    export async function getPlayers(): Promise<PlayerStats[]> {
        const response = await apiClient.get<PlayerStats[]>('/players');
        return response.data;
    }

    export async function submitGuess(token: string, station: string): Promise<GuessResponse> {
        const response = await apiClient.post('/game/guess',
            { station },
            { headers: { token } });
        return response.data;
    }

    export async function startGame(token: string): Promise<GameStartResponse> {
        const response = await apiClient.post(
            '/game/start',
            {},
            { headers: { token } }
        );
        return response.data;
    }

    export async function getGameSession(token: string): Promise<GameSessionResponse> {
        const response = await apiClient.get('/game/session', {
            headers: { token: token }
        });
        return response.data;
    }
}
