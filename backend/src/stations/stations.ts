import { Station } from "./station";

export namespace Stations {

    export const stations: Station[] = [
        {
            id: "1",
            displayName: "Frankfurt Hauptbahnhof",
            guessableNames: ["Frankfurt Hauptbahnhof", "Frankfurt Hbf", "Frankfurt Main Hbf"],
        }
    ]
    
    export function getStationById(id: string): Station | undefined {
        return stations.find(station => station.id === id);
    }

    export function getStationsByIds(ids: string[]): Station[] {
        return stations.filter(station => ids.includes(station.id));
    }

    export function getStationNames(ids: string[]): string[] {
        return getStationsByIds(ids).map(station => station.displayName);
    }

    export function getStationByGuessableName(name: string): Station | undefined {
        return stations.find(station => station.guessableNames.includes(name));
    }
}
