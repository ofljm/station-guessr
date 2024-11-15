import { useEffect, useState } from 'react';
import { getPlayers, login } from './Api';
import './App.css';
import { Player } from './domain/Player';
import axios, { AxiosError } from 'axios';

function App() {
  const [username, setUsername] = useState<string>('');
  const [players, setUsers] = useState<Player[]>([]);
  const [error, setError] = useState<string | undefined>();

  const fetchUsers = () => {
    getPlayers()
      .then((response) => setUsers(response))
      .catch((error) => {
        console.error('Failed to fetch users:', error);
      });
  };

  useEffect(() => {
    fetchUsers();

    const intervalId = setInterval(() => {
      fetchUsers();
    }, 5000); // Fetch every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const handleLogin = async () => {
    try {
      const response = await login(username);
      console.log('Login successful:', response);
      fetchUsers();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{message: string}>; 
        console.error('Login failed:', axiosError);
        setError(axiosError.response?.data?.message);
      }
    }
  };

  return (
    <>
      <p>Login here, totally not sketchy</p>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Your Name"
      />
      <button onClick={handleLogin}>Login</button>
      <p style={{ "color": "red" }}>{error}</p>
      <ul>
        {players.map((player) => (
          <li key={player.name}>{player.name}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
