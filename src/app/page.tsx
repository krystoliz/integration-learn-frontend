// frontend/src/app/page.tsx
'use client'; // This directive indicates a Client Component

import { useEffect, useState } from 'react';
import { User } from '../types/user';

export default function Home() {
  const [message, setMessage] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${BACKEND_URL}/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMessage(data.msg);
      } catch (err: any) {
        setError(`Failed to fetch message: ${err.message}`);
        setMessage('Failed to load message from backend.');
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${BACKEND_URL}/api/users`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: User[] = await response.json();
        setUsers(data);
      } catch (err: any) {
        setError(`Failed to fetch users: ${err.message}`);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
    fetchUsers();
  }, [BACKEND_URL]); // Dependency array to re-run effect if backend URL changes

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Frontend App</h1>

      {loading && <p className="text-lg text-blue-600">Loading data from backend...</p>}
      {error && <p className="text-lg text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Backend Message:</h2>
          <p className="text-xl text-green-700 font-medium">{message}</p>

          <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">Dummy Users from Backend:</h2>
          {users.length > 0 ? (
            <ul className="list-disc list-inside text-gray-600">
              {users.map((user) => (
                <li key={user.id} className="mb-2">
                  <span className="font-semibold">{user.displayName}</span> ({user.username})
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No users found.</p>
          )}
        </div>
      )}
    </div>
  );
}