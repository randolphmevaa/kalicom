// components/ProjectSection.tsx
import React from 'react';
import { FiLink, FiPercent } from 'react-icons/fi';
import { FaEuroSign } from 'react-icons/fa';
import { ProjectSectionProps } from '../types';
import { depositPercentages } from '../data/sampleData';

const ProjectSection: React.FC<ProjectSectionProps> = ({
  formData,
  handleInputChange,
  handleTogglePaymentType,
  setShowProjectModal,
  applyPresetPercentage
}) => {
  return (
    <div className="bg-gray-50 p-6 rounded-xl mb-6 shadow-sm">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Projet lié</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sélectionner un projet</label>
          <div className="relative">
            <div className="relative">
              <input
                type="text"
                value={formData.projetLie}
                readOnly
                onClick={() => setShowProjectModal(true)}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all pr-10 text-gray-800 cursor-pointer"
                placeholder="Sélectionner un projet..."
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <FiLink className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Référence</label>
          <input
            type="text"
            name="reference"
            value={formData.reference}
            onChange={handleInputChange}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
            placeholder="Référence de l'acompte"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Montant total du projet</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEuroSign className="text-gray-400" />
            </div>
            <input
              type="text"
              name="montantTotal"
              value={formData.montantTotal}
              onChange={handleInputChange}
              className="w-full p-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">Type de paiement</label>
            <div className="flex text-xs space-x-2">
              <button 
                className={`px-2 py-1 rounded transition ${formData.typePaiement === 'pourcentage' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => handleTogglePaymentType('pourcentage')}
              >
                Pourcentage
              </button>
              <button 
                className={`px-2 py-1 rounded transition ${formData.typePaiement === 'montant' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => handleTogglePaymentType('montant')}
              >
                Montant fixe
              </button>
            </div>
          </div>

          {formData.typePaiement === 'pourcentage' ? (
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPercent className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="pourcentageAcompte"
                  value={formData.pourcentageAcompte}
                  onChange={handleInputChange}
                  className="w-full p-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
                  placeholder="30"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {depositPercentages.map((p, index) => (
                  <button 
                    key={index}
                    onClick={() => applyPresetPercentage(p)}
                    className="text-xs px-2 py-1 bg-indigo-50 text-indigo-600 rounded border border-indigo-100 hover:bg-indigo-100 transition"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEuroSign className="text-gray-400" />
              </div>
              <input
                type="text"
                name="montantAcompte"
                value={formData.montantAcompte}
                onChange={handleInputChange}
                className="w-full p-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
                placeholder="0.00"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Montant d&apos;acompte</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEuroSign className="text-gray-400" />
            </div>
            <input
              type="text"
              readOnly
              value={formData.montantAcompte}
              className="w-full p-2.5 pl-10 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 font-medium"
            />
          </div>
        </div>
      </div>

      <div className="p-4 mt-4 border border-indigo-100 bg-indigo-50 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <span className="text-xs text-gray-500">Montant total</span>
          <p className="text-sm font-bold text-gray-900">{parseFloat(formData.montantTotal).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</p>
        </div>
        <div>
          <span className="text-xs text-gray-500">Acompte</span>
          <p className="text-sm font-bold text-indigo-600">{parseFloat(formData.montantAcompte).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</p>
        </div>
        <div>
          <span className="text-xs text-gray-500">Pourcentage</span>
          <p className="text-sm font-bold text-gray-900">{formData.pourcentageAcompte}%</p>
        </div>
        <div>
          <span className="text-xs text-gray-500">Solde prévu</span>
          <p className="text-sm font-bold text-gray-900">{(parseFloat(formData.montantTotal) - parseFloat(formData.montantAcompte)).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectSection;