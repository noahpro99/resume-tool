import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AuthService } from '../api';
import { useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    AuthService.postSignup({
      email: email,
      password: password,
      name: name
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
      <input
        type="name"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border border-gray-400 rounded-lg px-4 py-2 mb-4 w-80"
      />
      <button onClick={handleSignup} className="bg-blue-500 text-white rounded-lg px-4 py-2">
        Signup
      </button>
      {/* a;ready have account, login */}
      <a href="/login">Login</a>

    </div>
  );
};

export default Signup;
