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