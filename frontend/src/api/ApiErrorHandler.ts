import axios from 'axios';

export function handleApiError(error: unknown): string {
    if (axios.isAxiosError(error)) {
        if (error.response) {
            return `Error: ${error.response.status} - ${error.response.data.message || error.response.statusText}`;
        } else if (error.request) {
            // Request was made but no response received
        }
        return `Error: ${error.message}`;
    }
    return `Error: ${error}`;
}