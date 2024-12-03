import { GameSession } from "../storage/playerSessionStore";
import { Station } from "./station";
import { Stations } from "./stations";

export type GuessResult = 'correct' | 'incorrect' | 'alreadyGuessed';

export interface CorrectGuessOutcome {
    result: 'correct';
    station: Station;
    timestamp: number;
}

export interface IncorrectGuessOutcome {
    result: 'incorrect';
}

export interface AlreadyGuessedOutcome {
    result: 'alreadyGuessed';
}

export type GuessOutcome = CorrectGuessOutcome | IncorrectGuessOutcome | AlreadyGuessedOutcome;

const sanitizedStationNames: Record<string, string[]> = {};

export function checkGuess(guess: string, correctlyGuessedStationIds: string[]): GuessOutcome {
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
    if (correctlyGuessedStationIds.includes(maybeFoundStation.id)) {
        return { result: 'alreadyGuessed' };
    }
    return { result: 'correct', station: maybeFoundStation, timestamp: Date.now() };
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