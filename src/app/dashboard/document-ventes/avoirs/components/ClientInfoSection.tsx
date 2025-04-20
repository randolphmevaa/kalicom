// components/ClientInfoSection.tsx
import React from 'react';
import { FiSearch, FiLink } from 'react-icons/fi';
import { FaEuroSign } from 'react-icons/fa';
import { ClientInfoSectionProps } from '../types';

const ClientInfoSection: React.FC<ClientInfoSectionProps> = ({
  formData,
  handleInputChange,
  // clients,
  clientSearch,
  setClientSearch,
  showClientDropdown,
  setShowClientDropdown,
  selectClient,
  filteredClients,
  moyensPaiement,
  refundReasons,
  setShowInvoiceModal
}) => {
  return (
    <div className="bg-gray-50 p-6 rounded-xl mb-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Numéro d&apos;avoir</label>
            <input
              type="text"
              name="numero"
              value={formData.numero}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all text-gray-800"
              placeholder="AV-2025-XXX"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Facture liée</label>
            <div className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={formData.factureLiee}
                  readOnly
                  onClick={() => setShowInvoiceModal(true)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all pr-10 text-gray-800 cursor-pointer"
                  placeholder="Sélectionner une facture..."
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <FiLink className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Motif de l&apos;avoir</label>
            <select
              name="motif"
              value={formData.motif}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all text-gray-800"
            >
              {refundReasons.map((reason, index) => (
                <option key={index} value={reason}>{reason}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Code tiers</label>
            <div className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={clientSearch}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setClientSearch(e.target.value);
                    setShowClientDropdown(true);
                  }}
                  onFocus={() => setShowClientDropdown(true)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all pr-10 text-gray-800"
                  placeholder="Rechercher un client..."
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <FiSearch className="text-gray-400" />
                </div>
              </div>

              {showClientDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg max-h-60 overflow-auto border border-gray-200">
                  {filteredClients.length > 0 ? (
                    filteredClients.map(client => (
                      <div
                        key={client.id}
                        className="p-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                        onClick={() => selectClient(client)}
                      >
                        <div>
                          <div className="font-medium">{client.name}</div>
                          <div className="text-xs text-gray-500">{client.id}</div>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          client.type === 'client' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {client.type === 'client' ? 'Client' : 'Prospect'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-gray-500">
                      Aucun résultat trouvé
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Middle Column */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all text-gray-800"
              placeholder="Nom"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all text-gray-800"
              placeholder="Prénom"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <input
              type="text"
              name="adresse"
              value={formData.adresse}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all text-gray-800"
              placeholder="Adresse"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
              <input
                type="text"
                name="codePostal"
                value={formData.codePostal}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all text-gray-800"
                placeholder="Code postal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
              <input
                type="text"
                name="ville"
                value={formData.ville}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all text-gray-800"
                placeholder="Ville"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Etat</label>
              <select
                name="etat"
                value={formData.etat}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all text-gray-800"
              >
                <option value="En attente">En attente</option>
                <option value="Validé">Validé</option>
                <option value="Remboursé">Remboursé</option>
                <option value="Annulé">Annulé</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all text-gray-800"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de remboursement</label>
              <input
                type="date"
                name="dateReglement"
                value={formData.dateReglement}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all text-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mode de remboursement</label>
              <select
                name="modeReglement"
                value={formData.modeReglement}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all text-gray-800"
              >
                {moyensPaiement.map((moyen, index) => (
                  <option key={index} value={moyen}>{moyen}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mode de calcul</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="modeCalcul"
                value="HT"
                checked={formData.modeCalcul === 'HT'}
                onChange={handleInputChange}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">HT</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="modeCalcul"
                value="TTC"
                checked={formData.modeCalcul === 'TTC'}
                onChange={handleInputChange}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">TTC</span>
            </label>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Montant à rembourser</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEuroSign className="text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.montantHT}
              readOnly
              className="w-full p-2.5 pl-10 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 font-medium"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientInfoSection;