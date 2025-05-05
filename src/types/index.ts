export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface QuickQuestion {
  id: string;
  categoryId: string;
  question: string;
}