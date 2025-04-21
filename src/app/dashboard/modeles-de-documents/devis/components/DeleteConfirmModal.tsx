import React from 'react';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { QuoteTemplate } from '../types';
import { modalVariants } from '../animations';

interface DeleteConfirmModalProps {
  template: QuoteTemplate | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  template,
  onConfirm,
  onCancel
}) => {
  if (!template) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Supprimer le modèle</h3>
          <button 
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-800"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">
          Êtes-vous sûr de vouloir supprimer le modèle &quot;<span className="font-medium">{template.name}</span>&quot; ? 
          Cette action est irréversible.
        </p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
          >
            Supprimer
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DeleteConfirmModal;