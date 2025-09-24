import React from 'react';
import { TRAIT_CATEGORIES } from '../types';

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  selections: Record<string, string>;
}

const categoryDisplayNames: Record<string, string> = {
  '00background': 'Background',
  '01body': 'Body',
  '02face': 'Face',
  '03hair': 'Hair',
  '03body hoodie': 'Hoodie',
  '04mouth': 'Mouth',
  '05eye': 'Eyes',
  '06accessory': 'Accessory',
  '07facemask': 'Face Mask'
};

const categoryIcons: Record<string, string> = {
  '00background': '🎨',
  '01body': '👗',
  '02face': '😊',
  '03hair': '💇‍♀️',
  '03body hoodie': '🧥',
  '04mouth': '💋',
  '05eye': '👁️',
  '06accessory': '💎',
  '07facemask': '😷'
};

const CategoryTabs: React.FC<CategoryTabsProps> = ({ activeCategory, onCategoryChange, selections }) => {
  return (
    <div className="space-y-3">
      <div className="mb-6">
        <h3 className="font-luxury text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>🎨</span>
          Categories
        </h3>
      </div>

      {/* Mobile: Horizontal scroll, Desktop: Vertical list */}
      <div className="lg:space-y-2 lg:block flex lg:flex-col gap-3 lg:gap-0 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0">
        {TRAIT_CATEGORIES.map((category) => {
          const hasSelection = selections[category];
          const isActive = activeCategory === category;

          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`group relative w-full lg:w-full min-w-max px-4 py-3 font-elegant font-medium rounded-xl transition-all duration-300 transform hover:scale-105 text-left ${
                isActive
                  ? 'bg-white/95 text-rose-600 shadow-luxury backdrop-blur-xl border border-white/50'
                  : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/20 hover:border-white/40'
              } ${hasSelection ? 'ring-2 ring-rose-400/50' : ''}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{categoryIcons[category]}</span>
                <span className="text-sm flex-1">{categoryDisplayNames[category]}</span>
                {hasSelection && (
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>

              {/* Hover shimmer effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryTabs;