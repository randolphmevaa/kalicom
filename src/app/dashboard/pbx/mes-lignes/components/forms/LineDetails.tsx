// app/dashboard/pbx/mes-lignes/components/forms/LineDetails.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiChevronDown } from 'react-icons/fi';
import { LineType } from '../../models/types';
import Breadcrumbs from '../Breadcrumbs';

interface LineDetailsProps {
  line: LineType;
  onClose: () => void;
}

const LineDetails: React.FC<LineDetailsProps> = ({ line, onClose }) => {
  const [formData, setFormData] = useState({ ...line });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Ligne mise à jour avec succès!');
    onClose();
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-gray-700 pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 pb-12"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header with breadcrumbs */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <button onClick={onClose} className="flex items-center text-[#004AC8] hover:text-[#1B0353] transition-colors">
              <FiArrowLeft className="mr-2" />
              Retour
            </button>
          </div>
          <Breadcrumbs items={['PBX', 'Mes lignes', `Extension ${formData.extension}`]} />
        </div>
        
        {/* Line Details Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200"
        >
          <h2 className="text-2xl font-bold text-[#1B0353] mb-6">Détails de la ligne</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Extension (read-only)</label>
                <input
                  type="text"
                  name="extension"
                  value={formData.extension}
                  readOnly
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-xl"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigner à un utilisateur</label>
                <div className="relative">
                  <select
                    name="user"
                    value={formData.user}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                  >
                    <option value="Thomas Martin">Thomas Martin</option>
                    <option value="Sophie Dubois">Sophie Dubois</option>
                    <option value="Pierre Leroy">Pierre Leroy</option>
                    <option value="Marie Petit">Marie Petit</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Numéro sortant</label>
                <div className="relative">
                  <select
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                  >
                    <option value="+33 1 23 45 67 89">+33 1 23 45 67 89</option>
                    <option value="+33 1 98 76 54 32">+33 1 98 76 54 32</option>
                    <option value="+33 1 11 22 33 44">+33 1 11 22 33 44</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du numéro</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notification d&apos;appel manqué</label>
                <div className="relative">
                  <select
                    name="missedCallNotification"
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="none">Aucune</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Numéros</label>
                <div className="relative">
                  <select
                    name="displayNumber"
                    value={formData.displayNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                  >
                    <option value="+33 1 23 45 67 89">+33 1 23 45 67 89</option>
                    <option value="+33 1 98 76 54 32">+33 1 98 76 54 32</option>
                    <option value="+33 1 11 22 33 44">+33 1 11 22 33 44</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Musique d&apos;attente</label>
                <div className="relative">
                  <select
                    name="holdMusic"
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                  >
                    <option value="default">Musique par défaut</option>
                    <option value="classical">Classique</option>
                    <option value="jazz">Jazz</option>
                    <option value="none">Aucune</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setFormData({ ...line })}
                className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Réinitialiser
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#004AC8] text-white rounded-xl hover:bg-[#003DA8] transition-colors"
              >
                Mettre à jour
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LineDetails;
