import { expect, test } from '@jest/globals';
import { checkGuess, CorrectGuess, GuessOutcome } from '../../src/stations/guessChecker';
import { GameSession } from '../../src/storage/playerSessionStore';

const positiveTests = [
  { guess: 'Langen', expectedStationDisplayName: 'Langen (Hess)' }, // Normal case, single word
  { guess: 'Offenbach Hauptbahnhof', expectedStationDisplayName: 'Offenbach (Main) Hauptbahnhof' }, // Normal case, 2 words
  { guess: 'Offenbach Hbf', expectedStationDisplayName: 'Offenbach (Main) Hauptbahnhof' }, // Normal case, alternate name
  { guess: 'Offenbach-Bieber', expectedStationDisplayName: 'Offenbach-Bieber' }, // Normal case, hyphen
  { guess: 'Bad Vilbel Süd', expectedStationDisplayName: 'Bad Vilbel Süd' }, // Normal case, umlaut
  { guess: 'nieder wollstadt', expectedStationDisplayName: 'Nieder Wollstadt' }, // Case-insensitive
  { guess: 'Niederroden', expectedStationDisplayName: 'Rodgau-Nieder Roden' }, // Missing-space-insensitive
  { guess: 'Rodgau Hainhausen', expectedStationDisplayName: 'Rodgau-Hainhausen' }, // Missing-hyphen-insensitive
  { guess: 'Rüsselsheim-Opelwerk', expectedStationDisplayName: 'Rüsselsheim Opelwerk' }, // Extra-hyphen-insensitive
  { guess: '     Wiesbaden     Hauptbahnhof   ', expectedStationDisplayName: 'Wiesbaden Hauptbahnhof' }, // Boomer-spaces-insensitive
  { guess: 'Frankfurt!"§$%&/()=?[]{}-.,_:;Stadion', expectedStationDisplayName: 'Frankfurt am Main Stadion' }, // Hooligan-insensitive
  { guess: 'Frankfurt😁Süd', expectedStationDisplayName: 'Frankfurt (Main) Süd' }, // Emoji-insensitive
];

test.each(positiveTests)(
  'Guess $guess is expected to be correct and $expectedDisplayName.',
  ({ guess, expectedStationDisplayName }) => {
    const session: GameSession = { correctlyGuessedStationIds: [], startTime: 0, duration: 0 };
    const outcome: GuessOutcome = checkGuess(guess, session);
    expect(outcome.result).toBe('correct');
    const correctResult = outcome as CorrectGuess;
    expect(correctResult.station.displayName).toBe(expectedStationDisplayName);
  }
);

const negativeTests = [
  { guess: 'Rdermark' }, // Cannot omit umlaut
  { guess: 'Rodermark' }, // Cannot replace umlaut with non-umlaut
];

test.each(negativeTests)(
  'Guess $guess is expected to be incorrect.',
  ({ guess }) => {
    const session: GameSession = { correctlyGuessedStationIds: [], startTime: 0, duration: 0 };
    const outcome: GuessOutcome = checkGuess(guess, session);
    expect(outcome.result).toBe('incorrect');
  }
);
