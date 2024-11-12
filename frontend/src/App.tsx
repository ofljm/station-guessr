import { useEffect, useState } from 'react';
import { getUsers, login } from './Api';
import './App.css';

function App() {
  const [uuid, setUuid] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers()
    .then((response) => response.json).then((data) => {
      setUsers(data);
    });
  });

  const handleLogin = async () => {
    try {
      const response = await login(uuid);
      console.log('Login successful:', response);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <>
      <p>Login here, totally not sketchy</p>
      <input
        type="text"
        value={uuid}
        onChange={(e) => setUuid(e.target.value)}
        placeholder="Enter UUID"
      />
      <button onClick={handleLogin}>Login</button>
      <ul>
        {}
      </ul>
    </>
  );
}

export default App;
