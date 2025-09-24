import React from 'react';
import type { Component } from '../types';

interface ComponentGridProps {
  components: Component[];
  selectedId?: string;
  onSelect: (component: Component | null) => void;
}

const rarityStyles: Record<string, string> = {
  extraordinary: 'bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-100 border-yellow-300/50 shadow-yellow-200/50',
  super_rare: 'bg-gradient-to-br from-red-100 via-rose-50 to-pink-100 border-red-300/50 shadow-red-200/50',
  rare: 'bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 border-blue-300/50 shadow-blue-200/50',
  original: 'bg-gradient-to-br from-gray-100 via-slate-50 to-gray-100 border-gray-300/50 shadow-gray-200/50'
};

const rarityColors: Record<string, string> = {
  extraordinary: 'text-yellow-600',
  super_rare: 'text-red-600',
  rare: 'text-blue-600',
  original: 'text-gray-600'
};

const rarityLabels: Record<string, string> = {
  extraordinary: 'EXTRAORDINARY ✨',
  super_rare: 'SUPER RARE 💎',
  rare: 'RARE 🌟',
  original: 'ORIGINAL 🤍'
};

const rarityEmojis: Record<string, string> = {
  extraordinary: '✨',
  super_rare: '💎',
  rare: '🌟',
  original: '🤍'
};

const ComponentGrid: React.FC<ComponentGridProps> = ({ components, selectedId, onSelect }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {/* Skip/None option */}
      <div
        onClick={() => onSelect(null)}
        className={`group relative p-4 rounded-3xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 ${
          selectedId === undefined
            ? 'ring-4 ring-rose-400/60 bg-gradient-to-br from-white to-rose-50 shadow-luxury'
            : 'bg-white/95 hover:bg-white hover:shadow-elegant border border-gray-200/50'
        }`}
      >
        <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center mb-4 border border-gray-200/30">
          <span className="text-4xl">🚫</span>
        </div>

        {/* Hover shimmer effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
        </div>
      </div>

      {/* Component options */}
      {components.map((component) => (
        <div
          key={component.id}
          onClick={() => onSelect(component)}
          className={`group relative p-4 rounded-3xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 ${
            selectedId === component.id
              ? 'ring-4 ring-rose-400/60 shadow-luxury'
              : 'hover:shadow-elegant border border-white/30'
          } ${rarityStyles[component.rarity]}`}
        >
          <div className="aspect-square bg-gradient-to-br from-white/90 via-white/80 to-white/70 backdrop-blur-sm rounded-2xl overflow-hidden mb-4 flex items-center justify-center border-2 border-white/60 shadow-elegant relative">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-rose-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <img
              src={component.path}
              alt={component.name}
              className="w-full h-full object-contain transition-all duration-300 group-hover:scale-110 relative z-10"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<div class="text-gray-400 text-xs font-elegant">Preview unavailable</div>';
                }
              }}
            />
          </div>


          {/* Selection indicator */}
          {selectedId === component.id && (
            <div className="absolute -top-2 -right-2">
              <div className="bg-gradient-to-r from-rose-400 to-pink-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse-soft">
                SELECTED
              </div>
            </div>
          )}

          {/* Hover shimmer effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/15 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ComponentGrid;