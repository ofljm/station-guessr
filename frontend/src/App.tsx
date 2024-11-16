import { useEffect, useState } from 'react';
import { getPlayers, submitGuess, login } from './Api';
import './App.css';
import { Player } from './domain/Player';
import axios, { AxiosError } from 'axios';

function App() {
  const [username, setUsername] = useState<string>('');
  const [token, setToken] = useState<string | undefined>();
  const [currentGuess, setCurrentGuess] = useState<string | undefined>();
  const [players, setUsers] = useState<Player[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [correctlyGuessedStations, setCorrectlyGuessedStations] = useState<string[]>([]);

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

  async function handleLogin() {
    setError("");
    try {
      const response = await login(username);
      console.log('Login successful:', response.message);
      setToken(response.token);
      fetchUsers();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string; }>;
        console.error('Login failed:', axiosError);
        setError(axiosError.response?.data?.message);
      }
    }
  }

  async function handleGuess() {
    setError("");
    if (!token || !currentGuess) {
      setError('Token or guess missing');
      return;
    }

    try {
      const response = await submitGuess(token!, currentGuess!);
      if (response.result === 'correct') {
        setCorrectlyGuessedStations(response.correctlyGuessedStationNames!)
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string; }>;
        console.error('Guess failed:', axiosError);
        setError(axiosError.response?.data?.message);

  }
  return (
    <>
      <p style={{ "color": "red" }}>{error}</p>
      <p>Login here, totally not sketchy</p>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Your Name"
      />
      <button onClick={handleLogin}>Login</button>
      <ul>
        {players.map((player) => (
          <li key={player.name}>{player.name}</li>
        ))}
      </ul>
      <p>Your guess here</p>
      <input
        type="text"
        placeholder="Your guess"
        onChange={(e) => setCurrentGuess(e.target.value)}
      />
      <button onClick={handleGuess}>Guess</button>
      <ul>
        {correctlyGuessedStations.map((station) => (
          <li key={station}>{station}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
