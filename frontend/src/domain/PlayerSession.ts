export type PlayerSession = {
    player: Player,
    gameSession?: GameSession
}

export type Player = {
    name: string
}

export type CorrectGuess = {
    stationName: string
    timestamp: number
}

export type GameSession = {
    startTime: number  // Unix timestamp (milliseconds)
    duration: number   // seconds
    correctGuesses?: CorrectGuess[]
}
