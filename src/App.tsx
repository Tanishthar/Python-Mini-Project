import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import ChatHeader from './components/ChatHeader';
import ChatHistory from './components/ChatHistory';
import ChatInput from './components/ChatInput';
import QuickQuestions from './components/QuickQuestions';
import { Message } from './types';
import { getChatResponse } from './utils/chatApi';
import { v4 as uuidv4 } from './utils/uuid';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: uuidv4(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await getChatResponse(content);
      
      const botMessage: Message = {
        id: uuidv4(),
        content: response,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: uuidv4(),
        content: "Sorry, I'm having trouble connecting right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSelectQuestion = (question: string) => {
    handleSendMessage(question);
  };

  useEffect(() => {
    if (messages.length === 0) {
      const initialMessage: Message = {
        id: uuidv4(),
        content: "Hi there! I'm your Campus Assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages([initialMessage]);
    }
  }, [messages.length]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ChatHeader />
      
      <main className="flex-grow flex flex-col max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex-grow flex flex-col">
          <ChatHistory messages={messages} isTyping={isTyping} />
          
          <div className="py-4">
            {messages.length === 1 && !isTyping && (
              <QuickQuestions onSelectQuestion={handleSelectQuestion} />
            )}
            
            <ChatInput onSendMessage={handleSendMessage} isLoading={isTyping} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;