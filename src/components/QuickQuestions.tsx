import React, { useState } from 'react';
import { BookOpen, Users, FileText, BookMarked } from 'lucide-react';
import { categories, quickQuestions } from '../data/quickQuestions';
import { motion } from 'framer-motion';

interface QuickQuestionsProps {
  onSelectQuestion: (question: string) => void;
}

const iconComponents = {
  'BookOpen': BookOpen,
  'Users': Users,
  'FileText': FileText,
  'BookMarked': BookMarked
};

const QuickQuestions: React.FC<QuickQuestionsProps> = ({ onSelectQuestion }) => {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);

  const filteredQuestions = quickQuestions.filter(
    (question) => question.categoryId === activeCategory
  );

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">Frequently Asked Questions</h3>
      
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
        {categories.map((category) => {
          const IconComponent = iconComponents[category.icon as keyof typeof iconComponents];
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap ${
                activeCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <IconComponent size={16} />
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>
      
      <div className="grid gap-2">
        {filteredQuestions.map((question) => (
          <motion.button
            key={question.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => onSelectQuestion(question.question)}
          >
            {question.question}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default QuickQuestions;