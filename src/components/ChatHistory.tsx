import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import ChatMessage from './ChatMessage';

interface ChatHistoryProps {
  messages: Message[];
  isTyping: boolean;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, isTyping }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex-grow overflow-y-auto py-6">
      {messages.length === 1 ? (
        <div className="text-center text-gray-500 mt-8">
          <div className="bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">👋</span>
          </div>
          <h3 className="font-medium text-lg mb-2">Welcome to Campus Assistant!</h3>
          <p className="max-w-md mx-auto">
            I'm here to help with your questions about courses, faculty, exams, and policies. 
            What can I help you with today?
          </p>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isTyping && (
            <div className="flex gap-3 p-4 bg-white border border-gray-100 shadow-sm rounded-lg mb-4 mx-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 text-primary-700">
                  <div className="h-5 w-5 bg-primary-200 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="flex-grow">
                <div className="font-medium mb-1">Campus Assistant</div>
                <div className="text-gray-500">
                  <span className="typing-animation">Typing</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatHistory;