import React, { useEffect, useState } from 'react'
import Login from './Login'
import { useAuth } from '../context/AuthContext';
import { AuthService, OpenAPI } from '../api';
import { Link, useNavigate } from 'react-router-dom';


const Dashboard = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Header */}
      <header className="bg-blue-600 p-4 text-white">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <div className="relative group">
            <div className="rounded-full bg-blue-500 p-2">
              <i className="fa fa-user"></i> {/* This is a placeholder icon. You might want to replace this with an SVG or another icon of your preference */}
            </div>
            <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-lg p-2 hidden group-hover:block">
              <Link to="/profile" className="block p-2 hover:bg-blue-100">Profile</Link>
              <button onClick={() => {
                // Implement your sign-out logic here
                navigate('/');
              }}
                className="block w-full text-left p-2 hover:bg-blue-100">Sign Out</button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4">
        <div className="max-w-7xl mx-auto flex gap-4 justify-center items-start">

          {/* Create CV Card */}
          <div className="flex flex-col items-center justify-center p-6 bg-blue-100 rounded-lg shadow-lg transition transform hover:scale-105">
            <div className="bg-blue-500 p-4 rounded-full mb-4 transition-shadow hover:shadow-xl">
              <i className="fa fa-file-text text-white text-2xl"></i> {/* Replace this icon as per your preference */}
            </div>
            <Link to="/create-cv" className="text-blue-700 text-lg font-semibold hover:underline">Create CV</Link>
          </div>

          {/* Generate Questions Card */}
          <div className="flex flex-col items-center justify-center p-6 bg-blue-100 rounded-lg shadow-lg transition transform hover:scale-105">
            <div className="bg-blue-500 p-4 rounded-full mb-4 transition-shadow hover:shadow-xl">
              <i className="fa fa-question text-white text-2xl"></i> {/* Replace this icon as per your preference */}
            </div>
            <Link to="/generate-questions" className="text-blue-700 text-lg font-semibold hover:underline">Generate Questions</Link>
          </div>

        </div>
      </main>

    </div>
  );
}

export default Dashboard;