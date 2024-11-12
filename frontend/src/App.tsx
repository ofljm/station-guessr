import { useEffect, useState } from 'react';
import { getPlayers, login } from './Api';
import './App.css';
import { Player } from './domain/Player';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [username, setUsername] = useState<string>('');
  const [players, setUsers] = useState<Player[]>([]);

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
      const uuid = uuidv4();
      const response = await login(username, uuid);
      console.log('Login successful:', response);
      fetchUsers();
    } catch (error) {
      console.error('Login failed:', error);
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
      <ul>
        {players.map((player) => (
          <li key={player.uuid}>{player.name}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
