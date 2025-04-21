import { motion } from 'framer-motion';
import { FiFileText, FiDownload, FiPrinter, FiX } from 'react-icons/fi';
import { DepositCreditNoteTemplate } from '../../types/templates';

interface ExpandedPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: DepositCreditNoteTemplate | undefined;
  onDownload: () => void;
  onPrint: () => void;
}

export default function ExpandedPreviewModal({
  isOpen,
  onClose,
  template,
  onDownload,
  onPrint
}: ExpandedPreviewModalProps) {
  if (!isOpen || !template) return null;

  return (
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
            <FiFileText className="mr-2 text-[#E05D5D]" />
            {template.name}
          </h3>
          <div className="flex gap-3">
            <button
              onClick={onDownload}
              className="px-3 py-2 rounded-lg bg-[#E05D5D]/10 text-[#E05D5D] hover:bg-[#E05D5D]/20 transition flex items-center"
            >
              <FiDownload className="mr-2" />
              Télécharger
            </button>
            <button
              onClick={onPrint}
              className="px-3 py-2 rounded-lg bg-[#E05D5D] text-white hover:bg-[#D04D4D] transition flex items-center"
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
              src={template.pdfUrl || '/avoir-acompte-specimen.pdf'}
              className="w-full h-[800px]"
              title={`Aperçu de ${template.name}`}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}