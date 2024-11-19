import { GameSession } from "../storage/playerSessionStore";
import { Station } from "./station";
import { Stations } from "./stations";

export type GuessResult = 'correct' | 'incorrect' | 'alreadyGuessed';

export interface CorrectGuess {
    result: 'correct';
    station: Station;
}

export interface IncorrectGuess {
    result: 'incorrect';
}

export interface AlreadyGuessed {
    result: 'alreadyGuessed';
}

export type GuessOutcome = CorrectGuess | IncorrectGuess | AlreadyGuessed;

export function checkGuess(guess: string, session: GameSession): GuessOutcome {
    const stationGuessed = Stations.getStationByGuessableName(guess);

    if (!stationGuessed) {
        return { result: 'incorrect' };
    }
    if (session.correctlyGuessedStationIds.includes(stationGuessed.id)) {
        return { result: 'alreadyGuessed' };
    }
    return {result: 'correct', station: stationGuessed};
}