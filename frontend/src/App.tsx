import { useEffect, useState } from 'react';
import { getUsers, login } from './Api';
import './App.css';
import { User } from './domain/User';

function App() {
  const [uuid, setUuid] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = () => {
    getUsers()
      .then((response) => response.json())
      .then((data) => {
        setUsers(data as unknown as User[]);
      })
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
      const response = await login(uuid);
      console.log('Login successful:', response);
      fetchUsers(); // Fetch users after successful login
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
        {users.map((user) => (
          <li key={user.uuid}>{user.uuid}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
