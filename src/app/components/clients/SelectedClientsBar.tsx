'use client';

// SelectedClientsBar.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiTag, FiSend, FiTrash2 } from 'react-icons/fi';

interface SelectedClientsBarProps {
  selectedCount: number;
}

const SelectedClientsBar: React.FC<SelectedClientsBarProps> = ({ selectedCount }) => {
  if (selectedCount === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex flex-col sm:flex-row justify-between gap-3 items-center mb-6"
    >
      <div className="text-indigo-800 font-medium">
        <span className="font-bold">{selectedCount}</span> client(s) sélectionné(s)
      </div>
      <div className="flex flex-wrap gap-2">
        <button className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-1 shadow-sm">
          <FiMail />
          <span>Email</span>
        </button>
        <button className="px-3 py-1.5 text-xs bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition flex items-center gap-1 shadow-sm">
          <FiTag />
          <span>Assigner tag</span>
        </button>
        <button className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-1 shadow-sm">
          <FiSend />
          <span>Envoyer document</span>
        </button>
        <button className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-1 shadow-sm">
          <FiTrash2 />
          <span>Supprimer</span>
        </button>
      </div>
    </motion.div>
  );
};

export default SelectedClientsBar;