const apiUrl = import.meta.env.VITE_SERVICE_URL;

export function login(uuid: string) {	
    return fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uuid }),
    });
}

export function getUsers() {
    return fetch(`${apiUrl}/users`);
}