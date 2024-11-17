export namespace LocalStorage {
    enum Keys {
        sessionToken = 'sessionToken',
        playerToken = 'playerToken'
    }

    export function getSessionToken(): string | null {
        return localStorage.getItem(Keys.sessionToken);
    }

    export function setSessionToken(token: string): void {
        localStorage.setItem(Keys.sessionToken, token);
    }

    export function getPlayerToken(): string | null {
        return localStorage.getItem(Keys.playerToken);
    }

    export function setPlayerToken(token: string): void {
        localStorage.setItem(Keys.playerToken, token);
    }
}