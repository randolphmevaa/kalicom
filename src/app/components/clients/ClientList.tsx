'use client';

// ClientList.tsx
import React, { memo } from 'react';
import { Client } from './types';
import { getStatusBadgeColor, getStatusColor, getTagColor, getInitials } from './utils';
import { FiCheckSquare, FiSquare, FiPhone, FiMail, FiSend, FiEdit, FiArrowRight } from 'react-icons/fi';

interface ClientListProps {
  clients: Client[];
  selectedClients: number[];
  handleSelectClient: (clientId: number, event?: React.MouseEvent) => void;
  handleSelectAll: () => void;
  selectAll: boolean;
  openQuickView: (client: Client) => void;
  handleOpenSendModal: (client: Client, event?: React.MouseEvent) => void;
}

const ClientList: React.FC<ClientListProps> = memo(({
  clients,
  selectedClients,
  handleSelectClient,
  handleSelectAll,
  selectAll,
  openQuickView,
  handleOpenSendModal
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="w-10 px-4 py-3 text-left">
                <button onClick={handleSelectAll} className="focus:outline-none">
                  {selectAll ? (
                    <FiCheckSquare className="text-indigo-600" />
                  ) : (
                    <FiSquare className="text-gray-400" />
                  )}
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Nom complet
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Entreprise
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Contact
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Localisation
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Statut
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Tags
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Dernier contact
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Valeur
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {clients.map((client, index) => (
              <tr
                key={client.id}
                className={`hover:bg-gray-50 cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                onClick={() => openQuickView(client)}
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <button
                    className="focus:outline-none"
                    onClick={(e) => handleSelectClient(client.id, e)}
                  >
                    {selectedClients.includes(client.id) ? (
                      <FiCheckSquare className="text-indigo-600" />
                    ) : (
                      <FiSquare className="text-gray-400" />
                    )}
                  </button>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3"
                      style={{ background: "linear-gradient(45deg, #4BB2F6, #004AC8)" }}
                    >
                      {getInitials(client.prenom, client.nom)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {client.prenom} {client.nom}
                      </div>
                      <div className="text-xs text-gray-500">
                        Source: {client.source}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {client.entreprise}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-indigo-600">
                    <a href={`mailto:${client.email}`} onClick={(e) => e.stopPropagation()}>
                      {client.email}
                    </a>
                  </div>
                  <div className="text-sm text-gray-500">
                    <a 
                      href={`tel:${client.telephone.replace(/\s/g, '')}`} 
                      className="hover:text-[#004AC8]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {client.telephone}
                    </a>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="max-w-xs truncate" title={`${client.adresse}, ${client.ville}, ${client.pays}`}>
                    {client.ville}, {client.pays}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(client.statut)}`}>
                    {client.statut}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {client.tags.map((tag, tagIndex) => (
                      <span 
                        key={tagIndex} 
                        className="px-2 py-1 text-xs rounded-full text-white" 
                        style={{ backgroundColor: getTagColor(tag) }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <div 
                      className="w-2 h-2 rounded-full mr-2" 
                      style={{ backgroundColor: getStatusColor(client.dernierContact) }}
                    />
                    {client.dernierContact}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {client.valeurTotale}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-1">
                    <button 
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `tel:${client.telephone.replace(/\s/g, '')}`;
                      }}
                    >
                      <FiPhone size={16} />
                    </button>
                    <button 
                      className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `mailto:${client.email}`;
                      }}
                    >
                      <FiMail size={16} />
                    </button>
                    <button 
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                      onClick={(e) => handleOpenSendModal(client, e)}
                    >
                      <FiSend size={16} />
                    </button>
                    <button 
                      className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`Modifier les informations de ${client.prenom}`);
                      }}
                    >
                      <FiEdit size={16} />
                    </button>
                    <button 
                      className="p-1 text-blue-700 hover:bg-blue-50 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        openQuickView(client);
                      }}
                    >
                      <FiArrowRight size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

// Add this line to fix the error
ClientList.displayName = 'ClientList';

export default ClientList;