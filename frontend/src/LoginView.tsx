import React, { useState } from 'react';
import { login } from './Api';
import axios, { AxiosError } from 'axios';

const LoginView: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [token, setToken] = useState<string | undefined>();
    const [error, setError] = useState<string | undefined>();

    async function handleLogin() {
        setError("");
        try {
          const response = await login(username);
          console.log('Login successful:', response.message);
          setToken(response.token);
          console.log('Received token:', response.token);
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<{ message: string; }>;
            console.error('Login failed:', axiosError);
            setError(axiosError.response?.data?.message);
          }
        }
      }

    return (
        <>
            <p style={{ color: "red" }}>{error}</p>
            <p>Enter your name here</p>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your Name"
            />
            <button onClick={handleLogin}>Login</button>
        </>
    );
};

export default LoginView;