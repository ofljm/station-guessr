import axios from "axios";
import { Player } from "./domain/Player";

const apiUrl = import.meta.env.VITE_SERVICE_URL;

type LoginResponse = {
    message: string;
    uuid: string;
}

export async function login(playerName: string, uuid: string): Promise<LoginResponse> {
    const response = await axios.post<LoginResponse>(`${apiUrl}/login`, { playerName, uuid });
    return response.data;
}
export async function getPlayers(): Promise<Player[]> {
    const response = await axios.get<Player[]>(`${apiUrl}/players`);
    return response.data;
}