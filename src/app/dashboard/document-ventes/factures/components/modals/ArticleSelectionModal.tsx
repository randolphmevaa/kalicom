import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiSearch } from 'react-icons/fi';
import { Article, articlesCommuns } from '../../types';

interface ArticleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArticle: (article: Article) => void;
}

const ArticleSelectionModal: React.FC<ArticleSelectionModalProps> = ({ isOpen, onClose, onSelectArticle }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Filter articles based on search term
  const filteredArticles = articlesCommuns.filter(article => 
    article.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.code.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
            Sélectionner un article
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
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <FiSearch className="text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="overflow-y-auto max-h-80">
            <div className="space-y-2">
              {filteredArticles.length > 0 ? (
                filteredArticles.map(article => (
                  <div 
                    key={article.code} 
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      onSelectArticle(article);
                      onClose();
                    }}
                  >
                    <div className="flex justify-between">
                      <div className="font-medium">{article.desc}</div>
                      <div className="text-sm font-bold">{article.prix} €</div>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-xs text-gray-500">{article.code}</div>
                      <div className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                        {article.unite} | TVA: {article.tva}%
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-gray-500">
                  Aucun article trouvé
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t text-center text-gray-500 text-sm">
            <p>Sélectionnez un article prédéfini ou saisissez les informations manuellement</p>
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
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 text-white rounded-lg shadow-sm hover:shadow-md transition-all"
              style={{ backgroundColor: '#1B0353' }}
              onClick={onClose}
            >
              Créer nouvel article
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default memo(ArticleSelectionModal);