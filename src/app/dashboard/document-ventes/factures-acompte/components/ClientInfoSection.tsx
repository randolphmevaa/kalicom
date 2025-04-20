// components/ClientInfoSection.tsx
import React from 'react';
import { FiSearch, FiPlus } from 'react-icons/fi';
import { ClientInfoSectionProps } from '../types';

const ClientInfoSection: React.FC<ClientInfoSectionProps> = ({
  formData,
  handleInputChange,
//   clients,
  clientSearch,
  setClientSearch,
  showClientDropdown,
  setShowClientDropdown,
  selectClient,
  handleAddClient,
  filteredClients,
  moyensPaiement
}) => {
  return (
    <div className="bg-gray-50 p-6 rounded-xl mb-6 shadow-sm">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Informations client</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Numéro</label>
            <input
              type="text"
              name="numero"
              value={formData.numero}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
              placeholder="FA-2025-XXX"
            />
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
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all pr-10 text-gray-800"
                  placeholder="Rechercher un client..."
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <FiSearch className="text-gray-400" />
                </div>
              </div>

              {showClientDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg max-h-60 overflow-auto border border-gray-200">
                  <div className="p-2 border-b">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAddClient('client')}
                        className="flex items-center text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                      >
                        <FiPlus className="mr-1" />
                        Client
                      </button>
                      <button
                        onClick={() => handleAddClient('prospect')}
                        className="flex items-center text-xs px-2 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                      >
                        <FiPlus className="mr-1" />
                        Prospect
                      </button>
                    </div>
                  </div>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Civilité</label>
              <select
                name="civilite"
                value={formData.civilite}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
              >
                <option value="">Sélectionner</option>
                <option value="M.">M.</option>
                <option value="Mme">Mme</option>
                <option value="Dr">Dr</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">État</label>
              <select
                name="etat"
                value={formData.etat}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
              >
                <option value="En attente">En attente</option>
                <option value="Payée">Payée</option>
                <option value="En retard">En retard</option>
                <option value="Annulée">Annulée</option>
              </select>
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
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
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
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
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
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
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
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
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
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
                placeholder="Ville"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date d&apos;échéance</label>
              <input
                type="date"
                name="dateEcheance"
                value={formData.dateEcheance}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mode de règlement</label>
            <select
              name="modeReglement"
              value={formData.modeReglement}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
            >
              {moyensPaiement.map((moyen, index) => (
                <option key={index} value={moyen}>{moyen}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientInfoSection;