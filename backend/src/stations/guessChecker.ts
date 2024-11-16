import { Player } from "../storage/Player";
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

export function checkGuess(guess: string, player: Player): GuessOutcome {
    const maybeCorrectStation = Stations.getStationByGuessableName(guess);

    if (!maybeCorrectStation) {
        return { result: 'incorrect' };
    }
    if (player.correctlyGuessedStationIds.includes(maybeCorrectStation.id)) {
        return { result: 'alreadyGuessed' };
    }
    return {result: 'correct', station: maybeCorrectStation};
}