import React, { memo } from 'react';

interface TabNavigationProps {
  activeTab: 'details' | 'echeance';
  onTabChange: (tab: 'details' | 'echeance') => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex border-b mb-6">
      <button
        className={`px-6 py-3 font-medium transition-colors ${
          activeTab === 'details' ? 
          'border-b-2 border-[#1B0353] text-[#1B0353]' : 
          'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => onTabChange('details')}
      >
        Détails
      </button>
      <button
        className={`px-6 py-3 font-medium transition-colors ${
          activeTab === 'echeance' ? 
          'border-b-2 border-[#1B0353] text-[#1B0353]' : 
          'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => onTabChange('echeance')}
      >
        Échéance
      </button>
    </div>
  );
};

export default memo(TabNavigation);