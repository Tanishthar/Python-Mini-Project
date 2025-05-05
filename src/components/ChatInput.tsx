import React, { useState, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4 rounded-b-lg shadow-sm">
      <div className="flex items-end gap-2">
        <textarea 
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500 outline-none resize-none min-h-[48px] max-h-[120px]"
          placeholder="Type your question here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={isLoading}
        />
        <button 
          className={`p-3 rounded-full ${
            message.trim() && !isLoading
              ? 'bg-primary-600 hover:bg-primary-700 text-white'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          } transition-colors`}
          onClick={handleSubmit}
          disabled={!message.trim() || isLoading}
        >
          <Send size={20} />
        </button>
      </div>
      <div className="text-xs text-gray-500 mt-2">
        Press Enter to send, Shift+Enter for a new line
      </div>
    </div>
  );
};

export default ChatInput;