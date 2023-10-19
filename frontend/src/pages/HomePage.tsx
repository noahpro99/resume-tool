import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center relative overflow-hidden sm:py-12">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-white mb-6">Welcome to Chatbot</h1>
        <p className="text-lg text-gray-300 mb-8">Experience the next generation of conversational AI. Engage with our smart
          chatbot and see the difference.</p>

        <div className="relative inline-block group">
          <div
            className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200">
          </div>
          <Link to="/dashboard" className=" relative px-8 py-4 bg-white text-purple-600 text-lg font-semibold rounded-lg leading-none flex
                items-center justify-center transition duration-200 group-hover:text-slate-800">
            Get Started →
          </Link>
        </div>

      </div>
    </div>
  );
}
