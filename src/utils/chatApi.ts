import { getGeminiResponse } from './gemini';
import mockResponses from '../data/mockResponses';

const USE_GEMINI = import.meta.env.VITE_USE_GEMINI === 'true';

// Simulate API response delay
const simulateApiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getChatResponse = async (message: string): Promise<string> => {
  if (USE_GEMINI) {
    return await getGeminiResponse(message);
  }
  
  // Simulate network delay
  await simulateApiDelay(1000);
  
  // Normalize the input message
  const normalizedMessage = message.toLowerCase().trim();
  
  // First try exact matches (case insensitive)
  for (const [question, answer] of Object.entries(mockResponses)) {
    const normalizedQuestion = question.toLowerCase()
      .replace(/^\d+\.\s*/, '') // Remove numbering
      .trim();
      
    if (normalizedMessage === normalizedQuestion) {
      return answer;
    }
  }
  
  // If no exact match, try partial matches
  for (const [question, answer] of Object.entries(mockResponses)) {
    const normalizedQuestion = question.toLowerCase()
      .replace(/^\d+\.\s*/, '') // Remove numbering
      .trim();
      
    if (normalizedMessage.includes(normalizedQuestion) || 
        normalizedQuestion.includes(normalizedMessage)) {
      return answer;
    }
  }
  
  // If still no match, try keyword matching
  const keywords = normalizedMessage.split(' ').filter(word => word.length > 3);
  
  for (const [question, answer] of Object.entries(mockResponses)) {
    const normalizedQuestion = question.toLowerCase()
      .replace(/^\d+\.\s*/, '')
      .trim();
      
    const hasMatchingKeywords = keywords.some(keyword => 
      normalizedQuestion.includes(keyword)
    );
    
    if (hasMatchingKeywords) {
      return answer;
    }
  }
  
  // Default response if no match is found
  return "I apologize, but I don't have specific information about that. Could you please rephrase your question? I can help you with information about the Computer Engineering department, courses, faculty, and policies.";
};