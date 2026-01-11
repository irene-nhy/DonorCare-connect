
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { InquiryCategory } from '../types';

interface CategoryCardProps {
  category: InquiryCategory;
  onClick: (cat: InquiryCategory) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  return (
    <button
      onClick={() => onClick(category)}
      className="group flex flex-col text-left p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-soft-coral/50"
    >
      <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all duration-300">
        {category.emoji}
      </div>
      <h3 className="text-lg font-semibold text-charcoal mb-2 flex items-center justify-between w-full">
        {category.label}
        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-soft-coral transform group-hover:translate-x-1 transition-all" />
      </h3>
      <p className="text-sm text-gray-500 leading-relaxed">
        {category.description}
      </p>
    </button>
  );
};

export default CategoryCard;
