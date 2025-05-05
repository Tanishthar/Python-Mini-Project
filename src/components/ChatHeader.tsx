import React from 'react';
import { Bot, Home } from 'lucide-react';

const ChatHeader: React.FC = () => {
  const handleHomeClick = () => {
    window.location.href = '/';
  };

  return (
    <header className="bg-primary-600 text-white py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Bot size={24} />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Campus Assistant</h1>
            <p className="text-sm text-primary-100">Your academic help desk</p>
          </div>
        </div>
        <button 
          onClick={handleHomeClick}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors rounded-full px-4 py-2"
        >
          <Home size={20} />
          <span>Home</span>
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;