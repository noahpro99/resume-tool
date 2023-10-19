// Login.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AuthService } from '../api';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    AuthService.postLogin({
      email: email,
      password: password
    }).then((response) => {
      login(response);
      navigate('/dashboard');
    }
    ).catch((error) => {
      console.log(error);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border border-gray-400 rounded-lg px-4 py-2 mb-4 w-80"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border border-gray-400 rounded-lg px-4 py-2 mb-4 w-80"
      />
      <button onClick={handleLogin} className="bg-blue-500 text-white rounded-lg px-4 py-2">
        Login
      </button>
      {/* signup link */}
      <a href="/signup">Signup</a>
    </div>
  );
};

export default Login;
