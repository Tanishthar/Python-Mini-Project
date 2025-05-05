import { Category, QuickQuestion } from '../types';

export const categories: Category[] = [
  {
    id: 'courses',
    name: 'Courses',
    description: 'Information about course schedules, syllabi, and requirements',
    icon: 'BookOpen'
  },
  {
    id: 'faculty',
    name: 'Faculty',
    description: 'Faculty information, office hours, and contact details',
    icon: 'Users'
  },
  {
    id: 'exams',
    name: 'Exams',
    description: 'Exam schedules, locations, and policies',
    icon: 'FileText'
  },
  {
    id: 'policies',
    name: 'Policies',
    description: 'Department and university policies',
    icon: 'BookMarked'
  }
];

export const quickQuestions: QuickQuestion[] = [
  {
    id: 'q1',
    categoryId: 'courses',
    question: 'What is the vision of the Computer Engineering department?'
  },
  {
    id: 'q2',
    categoryId: 'courses',
    question: 'What are the mission objectives of Information Technology?'
  },
  {
    id: 'q3',
    categoryId: 'courses',
    question: "What programming languages are taught?"
  },
  {
    id: 'q4',
    categoryId: 'faculty',
    question: "Name an Assistant Professor with more than 10 years of experience."
  },
  {
    id: 'q5',
    categoryId: 'faculty',
    question: "Which faculty has 20+ years of experience?"
  },
  {
    id: 'q6',
    categoryId: 'exams',
    question: 'When are final exams this semester?'
  },
  {
    id: 'q7',
    categoryId: 'exams',
    question: 'What is the makeup exam policy?'
  },
  {
    id: 'q8',
    categoryId: 'policies',
    question: 'What is the attendance policy?'
  },
  {
    id: 'q9',
    categoryId: 'policies',
    question: 'What are the exam policies?'
  }
];