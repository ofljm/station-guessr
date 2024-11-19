import axios from "axios";
import { PlayerSession } from "../domain/PlayerSession";
import { PlayerStats } from "../domain/PlayerStats";
import { handleApiError } from "./ApiErrorHandler";

type RegisterResponse = {
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

    export async function login(playerName: string): Promise<RegisterResponse> {
        const response = await apiClient.post<RegisterResponse>('/register', { playerName });
        return response.data;
    }

    export async function getPlayers(): Promise<PlayerStats[]> {
        const response = await apiClient.get<PlayerStats[]>('/player/all');
        console.log('Get players response', response.data);
        return response.data;
    }

    export async function submitGuess(token: string, station: string): Promise<GuessResponse> {
        const response = await apiClient.post<GuessResponse>('/guess',
            { station },
            { headers: { token } });
        return response.data;
    }

    export async function startGame(token: string): Promise<GameStartResponse> {
        const response = await apiClient.post(
            '/start',
            {},
            { headers: { token } }
        );
        return response.data;
    }

    export async function getPlayerSession(token: string): Promise<PlayerSession> {
        const response = await apiClient.get('/player', {
            headers: { token: token }
        });
        return response.data;
    }

}
