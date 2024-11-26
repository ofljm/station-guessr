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

const sanitizedStationNames: Record<string, string[]> = {};

export function checkGuess(guess: string, session: GameSession): GuessOutcome {
    if (isRecordEmpty(sanitizedStationNames)) {
        Stations.stations.forEach((station) => {
            sanitizedStationNames[station.id] = station.guessableNames.map((name) => sanitize(name));
        });
    }

    const sanitizedGuess = sanitize(guess);
    const maybeFoundStation = Stations.stations.find((station) => sanitizedStationNames[station.id].includes(sanitizedGuess));
    if (!maybeFoundStation) {
        return { result: 'incorrect' };
    }
    if (session.correctlyGuessedStationIds.includes(maybeFoundStation.id)) {
        return { result: 'alreadyGuessed' };
    }
    return { result: 'correct', station: maybeFoundStation };
}

function isRecordEmpty(record: Record<string | number | symbol, unknown>): boolean {
    return Object.keys(record).length === 0;
}

function sanitize(input: string): string {
    return input
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-ZäÄöÖüÜ]/g, "");
}