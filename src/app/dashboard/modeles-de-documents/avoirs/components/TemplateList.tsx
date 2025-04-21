'use client';

import { motion } from 'framer-motion';
import { FiStar, FiEyeOff, FiChevronRight, FiCalendar, FiSearch, FiEye, FiInfo } from 'react-icons/fi';
import { CreditNoteTemplate } from '../page';

interface TemplateListProps {
  templates: CreditNoteTemplate[];
  selectedTemplate: string | null;
  setSelectedTemplate: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showHiddenTemplates: boolean;
  setShowHiddenTemplates: (show: boolean) => void;
  totalTemplates: number;
}

export const TemplateList: React.FC<TemplateListProps> = ({
  templates,
  selectedTemplate,
  setSelectedTemplate,
  searchQuery,
  setSearchQuery,
  showHiddenTemplates,
  setShowHiddenTemplates,
  totalTemplates
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { 
      opacity: 1, 
      x: 0,
      transition: { ease: 'easeOut', duration: 0.3 }
    },
    hover: { 
      x: 5,
      transition: { ease: 'easeOut', duration: 0.2 }
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
      {/* Search & Filter Section */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher un modèle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 pl-10 pr-4 text-gray-700 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/50 focus:border-transparent"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <FiSearch className="w-4 h-4" />
          </span>
        </div>
      </div>
      
      {/* Template List */}
      <div className="max-h-[calc(100vh-380px)] overflow-y-auto p-4">
        <motion.div
          variants={containerVariants}
          className="space-y-3"
        >
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              variants={listItemVariants}
              whileHover="hover"
              animate="show"
              initial="hidden"
              custom={index}
              onClick={() => setSelectedTemplate(template.id)}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedTemplate === template.id 
                  ? 'bg-[#6C5DD3]/10 border-l-4 border-[#6C5DD3]' 
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`font-medium ${selectedTemplate === template.id ? 'text-[#6C5DD3]' : 'text-gray-800'}`}>
                      {template.name}
                    </h3>
                    {template.isDefault && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-xs">
                        <FiStar className="w-3 h-3 mr-1" />
                        Défaut
                      </span>
                    )}
                    {template.isHidden && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-xs">
                        <FiEyeOff className="w-3 h-3 mr-1" />
                        Masqué
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {template.description}
                  </p>
                  <div className="mt-2 text-xs text-gray-500 flex items-center">
                    <FiCalendar className="w-3 h-3 mr-1" />
                    Modifié le {template.lastModified}
                  </div>
                </div>
                <div className="text-gray-400">
                  <FiChevronRight className={`w-5 h-5 transition-transform ${selectedTemplate === template.id ? 'transform rotate-90 text-[#6C5DD3]' : ''}`} />
                </div>
              </div>
            </motion.div>
          ))}
          
          {templates.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              <FiInfo className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Aucun modèle trouvé</p>
              <p className="text-sm">Essayez de modifier vos critères de recherche</p>
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex justify-between">
          <button 
            onClick={() => setShowHiddenTemplates(!showHiddenTemplates)}
            className="text-sm text-gray-600 flex items-center hover:text-[#6C5DD3]"
          >
            {showHiddenTemplates ? (
              <>
                <FiEye className="w-4 h-4 mr-1" />
                Masquer les modèles cachés
              </>
            ) : (
              <>
                <FiEyeOff className="w-4 h-4 mr-1" />
                Afficher tous les modèles
              </>
            )}
          </button>
          <div className="text-sm text-gray-500">
            {templates.length} sur {totalTemplates} modèles
          </div>
        </div>
      </div>
    </div>
  );
};