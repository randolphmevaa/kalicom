import React, { ChangeEvent, memo } from 'react';
import { FiSearch, FiPlus } from 'react-icons/fi';
import { Client } from '../types/creditNote';

interface ClientSelectionProps {
  clientSearch: string;
  showClientDropdown: boolean;
  filteredClients: Client[];
  onSearchChange: (value: string) => void;
  onFocus: () => void;
  onSelectClient: (client: Client) => void;
  onAddClient?: (type: 'client' | 'prospect') => void;
  accentColor?: 'red' | 'indigo';  // Support both invoice and credit note styles
}

const ClientSelection: React.FC<ClientSelectionProps> = ({
  clientSearch,
  showClientDropdown,
  filteredClients,
  onSearchChange,
  onFocus,
  onSelectClient,
  onAddClient,
  accentColor = 'indigo'
}) => {
  // Dynamic focus ring styles based on accent color
  const focusRingClass = accentColor === 'red' 
    ? 'focus:ring-red-100 focus:border-red-300' 
    : 'focus:ring-indigo-100 focus:border-indigo-500';
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Code tiers</label>
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={clientSearch}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
            onFocus={onFocus}
            className={`w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 ${focusRingClass} transition-all pr-10 text-gray-800`}
            placeholder="Rechercher un client..."
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <FiSearch className="text-gray-400" />
          </div>
        </div>

        {showClientDropdown && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg max-h-60 overflow-auto border border-gray-200">
            {onAddClient && (
              <div className="p-2 border-b">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onAddClient('client')}
                    className="flex items-center text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                  >
                    <FiPlus className="mr-1" />
                    Client
                  </button>
                  <button
                    onClick={() => onAddClient('prospect')}
                    className="flex items-center text-xs px-2 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                  >
                    <FiPlus className="mr-1" />
                    Prospect
                  </button>
                </div>
              </div>
            )}
            
            {filteredClients.length > 0 ? (
              filteredClients.map(client => (
                <div
                  key={client.id}
                  className="p-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                  onClick={() => onSelectClient(client)}
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
  );
};

export default memo(ClientSelection);