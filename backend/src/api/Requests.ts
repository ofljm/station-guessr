export type LoginRequest = {
    playerName: string;
}

export type GuessRequest = {
    station: string
    sessionToken: string
    playerToken: string
}