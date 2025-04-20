// components/SaveConfirmation.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import { SaveConfirmationProps } from '../types';

const confirmationVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0,
    y: -20,
    transition: { duration: 0.2 }
  }
};

const SaveConfirmation: React.FC<SaveConfirmationProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg flex items-center z-50"
      variants={confirmationVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <FiCheck className="mr-2" />
      Facture d&apos;acompte enregistrée avec succès
    </motion.div>
  );
};

export default SaveConfirmation;