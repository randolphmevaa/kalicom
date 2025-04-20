// components/modals/ProjectSelectionModal.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiX, FiSearch } from 'react-icons/fi';
import { ProjectSelectionModalProps } from '../../types';

const ProjectSelectionModal: React.FC<ProjectSelectionModalProps> = ({
  isOpen,
  onClose,
  projectSearch,
  setProjectSearch,
  filteredProjects,
  selectProject
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <motion.div
        className="relative bg-white rounded-xl shadow-xl w-full max-w-lg m-4 z-10"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium">
            Sélectionner un projet
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <FiX />
          </button>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all pl-10 text-gray-800"
                placeholder="Rechercher un projet..."
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <FiSearch className="text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="overflow-y-auto max-h-80">
            <div className="space-y-2">
              {filteredProjects.map(project => (
                <div 
                  key={project.id} 
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => selectProject(project)}
                >
                  <div className="flex justify-between">
                    <div className="font-medium text-gray-900">{project.titre}</div>
                    <div className="text-sm font-bold">{parseFloat(project.montant).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</div>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-indigo-600">{project.id}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">{project.client}</span>
                    </div>
                    <span className="text-xs text-gray-500">Échéance: {project.echeance}</span>
                  </div>
                </div>
              ))}
              
              {filteredProjects.length === 0 && (
                <div className="p-4 text-center text-gray-500 border border-dashed border-gray-300 rounded-lg">
                  Aucun projet trouvé
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end p-4 border-t">
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all"
            >
              Annuler
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectSelectionModal;