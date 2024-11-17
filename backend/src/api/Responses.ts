import { GuessResult } from "../stations/guessChecker"

type Message = {
    message: string
}

export type LoginResponse = Message & {
    token?: string
}

export type GuessResponse = Message & {
    result?: GuessResult
    correctlyGuessedStationNames?: string[]
}

export type PlayerStats = {
    name: string,
    correctGuesses: number
}

export type PlayerData = Message & {
    name?: string,
    correctlyGuessedStationNames?: string[]
}

export type GameSessionResponse = Message & {
    sessionToken?: string
    startTime?: number
    duration?: number
}