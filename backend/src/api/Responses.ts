import { GuessResult } from "../stations/guessChecker"
import { GameSession, Player } from "../storage/playerSessionStore"

type Message = {
    message: string
}

export type RegisterResponse = Message & {
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

type PlayerResponse = {
    name: string
}

type GameSessionResponse = {
    startTime: number
    duration: number
    correctlyGuessedStationNames: string[]
}

export type PlayerSessionResponse = Message & {
    player?: PlayerResponse
    gameSession?: GameSessionResponse
}
