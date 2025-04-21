'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX, FiFileText, FiDownload, FiPrinter } from 'react-icons/fi';
import { CreditNoteTemplate } from '../page';

// Notification Toast Component
interface NotificationToastProps {
  notification: { message: string; visible: boolean };
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ notification }) => {
  return (
    <AnimatePresence>
      {notification.visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-24 right-4 z-50 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center"
        >
          <FiCheck className="mr-2" />
          {notification.message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Delete Confirmation Modal Component
interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  templateName?: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  templateName
}) => {
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: 'spring', damping: 25, stiffness: 500 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer le modèle &quot;<span className="font-medium">{templateName}</span>&quot; ? 
              Cette action est irréversible.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
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
      )}
    </AnimatePresence>
  );
};

// Expanded Preview Modal Component
interface ExpandedPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template?: CreditNoteTemplate;
  onDownload: () => void;
  onPrint: () => void;
}

export const ExpandedPreviewModal: React.FC<ExpandedPreviewModalProps> = ({
  isOpen,
  onClose,
  template,
  onDownload,
  onPrint
}) => {
  if (!template) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-xl max-w-4xl w-full h-[90vh] flex flex-col"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <FiFileText className="mr-2 text-[#6C5DD3]" />
                {template.name}
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={onDownload}
                  className="px-3 py-2 rounded-lg bg-[#6C5DD3]/10 text-[#6C5DD3] hover:bg-[#6C5DD3]/20 transition flex items-center"
                >
                  <FiDownload className="mr-2" />
                  Télécharger
                </button>
                <button
                  onClick={onPrint}
                  className="px-3 py-2 rounded-lg bg-[#6C5DD3] text-white hover:bg-[#5C4DC3] transition flex items-center"
                >
                  <FiPrinter className="mr-2" />
                  Imprimer
                </button>
                <button 
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-800 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex-grow overflow-auto p-6 bg-gray-100 flex items-center justify-center">
              {/* This would be replaced with a proper PDF viewer in a real app */}
              <div className="w-[650px] bg-white shadow-xl rounded-lg overflow-hidden">
                {/* PDF Content */}
                <iframe 
                  src={template.pdfUrl || '/avoir-specimen.pdf'}
                  className="w-full h-[800px]"
                  title={`Aperçu de ${template.name}`}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};