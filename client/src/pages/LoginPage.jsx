import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const { data } = await login({ email, password });
      localStorage.setItem('token', data.token);
      navigate('/admin'); // Redirect to admin page on success
    } catch (err) {
      setError('Invalid email or password.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center">
      <div className="p-8 bg-gray-900 rounded-lg shadow-xl w-full max-w-sm">
        <h1 className="text-2xl font-bold text-white text-center mb-6">Admin Login</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-accent"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-400 mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-accent"
              required
            />
          </div>
          <button type="submit" className="w-full bg-accent text-black font-bold py-2 px-4 rounded hover:bg-cyan-300">
            Login
          </button>
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;