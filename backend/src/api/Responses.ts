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
    numberOfCorrectGuesses: number
}

export type PlayerData = Message & {
    name?: string,
    correctlyGuessedStationNames?: string[]
}

export type GameStartResponse = Message & {
    startTime?: number
    duration?: number
}

export type GameSessionResponse = Message & {
    startTime?: number
    duration?: number
    correctlyGuessedStationNames?: string[]
}