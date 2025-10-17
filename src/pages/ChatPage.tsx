// src/pages/ChatPage.tsx

import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function ChatPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white py-5 px-10 shadow-md flex justify-between items-center">
        <h1 className="m-0 text-2xl text-gray-800 font-bold">ChatApp</h1>
        <div className="flex items-center gap-5">
          <span className="text-sm text-gray-600">Welcome, {user?.username}!</span>
          <button 
            onClick={handleLogout} 
            className="py-2 px-4 text-sm text-white bg-red-600 border-none rounded cursor-pointer hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto my-16 p-10 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-3xl text-gray-800 mb-5">Chat Interface Coming Soon...</h2>
        <p className="text-base text-gray-600 mb-10">
          You're successfully logged in! The chat interface will be built next.
        </p>
        <div className="text-left p-5 bg-gray-50 rounded text-sm space-y-2">
          <p><strong>User ID:</strong> {user?.id}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Username:</strong> {user?.username}</p>
        </div>
      </div>
    </div>
  );
}