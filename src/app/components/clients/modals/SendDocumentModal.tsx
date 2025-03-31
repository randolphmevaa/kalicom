'use client';

// SendDocumentModal.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { Client, DocumentOption } from '../types';

interface SendDocumentModalProps {
  isOpen: boolean;
  client: Client | null;
  documentOptions: DocumentOption[];
  onClose: () => void;
  onSendDocument: (documentType: string) => void;
}

const SendDocumentModal: React.FC<SendDocumentModalProps> = ({
  isOpen,
  client,
  documentOptions,
  onClose,
  onSendDocument
}) => {
  if (!isOpen || !client) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", duration: 0.3 }}
        className="fixed inset-0 z-50 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl mx-auto overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">
                Envoyer au client: {client.prenom} {client.nom}
              </h3>
              <button 
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-full p-1 transition"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Sélectionnez le type de document à envoyer à {client.prenom} {client.nom}
              </p>
              
              <div className="grid gap-3">
                {documentOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => onSendDocument(option.title)}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition group"
                  >
                    <div className="p-3 rounded-lg bg-gray-100 group-hover:bg-white">
                      {option.icon}
                    </div>
                    <div className="ml-4 text-left">
                      <h4 className="font-medium text-gray-900">{option.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 flex justify-end">
              <button 
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SendDocumentModal;
