import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import { Message } from '../types';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 p-4 rounded-lg ${
        isBot ? 'bg-white border border-gray-100 shadow-sm' : 'bg-primary-50'
      } mb-4`}
    >
      <div className="flex-shrink-0">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
          isBot ? 'bg-primary-100 text-primary-700' : 'bg-primary-600 text-white'
        }`}>
          {isBot ? <Bot size={20} /> : <User size={20} />}
        </div>
      </div>
      <div className="flex-grow">
        <div className="font-medium mb-1">
          {isBot ? 'Campus Assistant' : 'You'}
        </div>
        <div className="text-gray-700 prose prose-sm max-w-none">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;