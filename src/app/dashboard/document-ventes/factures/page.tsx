'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiFileText, 
  FiSearch, 
  FiFilter, 
  FiPlus, 
  FiMoreVertical, 
  FiEdit,
  FiTrash2,
  FiEye,
  FiDownload,
  FiSend,
  FiDollarSign,
  FiClock,
  FiUser,
  FiCalendar,
  FiRefreshCw,
  FiPrinter,
  FiCheck,
  // FiX,
  FiInfo
} from 'react-icons/fi';

export default function Factures() {
  // State for filters and search
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Tous');
  const [selectedPeriod, setSelectedPeriod] = useState('Tous');
  const [selectedClient, setSelectedClient] = useState('Tous');
  
  // State for selected invoices (for bulk actions)
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Sample invoice data
  const invoices = [
    {
      id: 'FACT-2025-001',
      date: '05/03/2025',
      client: 'Acme Corp',
      montant: '15 600,00 €',
      statut: 'Payée',
      echeance: '05/04/2025',
      dateReglement: '02/04/2025',
      modeReglement: 'Virement',
      creePar: 'Jean Martin',
      typeFacture: 'Standard',
      notes: 'Paiement reçu avant échéance'
    },
    {
      id: 'FACT-2025-002',
      date: '28/02/2025',
      client: 'Nexus Tech',
      montant: '2 990,00 €',
      statut: 'En attente',
      echeance: '30/03/2025',
      dateReglement: null,
      modeReglement: null,
      creePar: 'Sophie Leclerc',
      typeFacture: 'Standard',
      notes: 'Relance envoyée le 20/03/2025'
    },
    {
      id: 'FACT-2025-003',
      date: '25/02/2025',
      client: 'Zenith SA',
      montant: '4 990,00 €',
      statut: 'En retard',
      echeance: '25/03/2025',
      dateReglement: null,
      modeReglement: null,
      creePar: 'Thomas Bernard',
      typeFacture: 'Standard',
      notes: 'Client à contacter pour paiement'
    },
    {
      id: 'FACT-2025-004',
      date: '20/02/2025',
      client: 'Global Industries',
      montant: '3 500,00 €',
      statut: 'Payée',
      echeance: '20/03/2025',
      dateReglement: '15/03/2025',
      modeReglement: 'Carte bancaire',
      creePar: 'Marie Dupont',
      typeFacture: 'Standard',
      notes: 'Paiement reçu en avance'
    },
    {
      id: 'FACT-2025-005',
      date: '15/02/2025',
      client: 'Tech Innovate',
      montant: '12 750,00 €',
      statut: 'Partiellement payée',
      echeance: '15/03/2025',
      dateReglement: '15/03/2025',
      modeReglement: 'Chèque',
      creePar: 'Jean Martin',
      typeFacture: 'Échelonnée',
      notes: 'Premier versement de 6 000 € reçu'
    },
    {
      id: 'FACT-2025-006',
      date: '10/02/2025',
      client: 'Solutions Pro',
      montant: '8 400,00 €',
      statut: 'Payée',
      echeance: '10/03/2025',
      dateReglement: '08/03/2025',
      modeReglement: 'Virement',
      creePar: 'Sophie Leclerc',
      typeFacture: 'Standard',
      notes: ''
    },
    {
      id: 'FACT-2025-007',
      date: '05/02/2025',
      client: 'Groupe Média',
      montant: '1 750,00 €',
      statut: 'Annulée',
      echeance: '05/03/2025',
      dateReglement: null,
      modeReglement: null,
      creePar: 'Thomas Bernard',
      typeFacture: 'Standard',
      notes: 'Annulée à la demande du client'
    },
    {
      id: 'FACT-2025-008',
      date: '01/02/2025',
      client: 'Data Services',
      montant: '5 300,00 €',
      statut: 'Payée',
      echeance: '01/03/2025',
      dateReglement: '28/02/2025',
      modeReglement: 'Virement',
      creePar: 'Marie Dupont',
      typeFacture: 'Standard',
      notes: ''
    },
    {
      id: 'FACT-2025-009',
      date: '28/01/2025',
      client: 'ConsultCorp',
      montant: '9 800,00 €',
      statut: 'En attente',
      echeance: '28/02/2025',
      dateReglement: null,
      modeReglement: null,
      creePar: 'Jean Martin',
      typeFacture: 'Standard',
      notes: 'Client a demandé une extension de délai'
    },
    {
      id: 'FACT-2025-010',
      date: '15/01/2025',
      client: 'Systèmes Avancés',
      montant: '7 450,00 €',
      statut: 'En retard',
      echeance: '15/02/2025',
      dateReglement: null,
      modeReglement: null,
      creePar: 'Sophie Leclerc',
      typeFacture: 'Standard',
      notes: 'Plusieurs relances effectuées'
    }
  ];

  // Filter options
  const statusOptions = ['Tous', 'Payée', 'En attente', 'En retard', 'Partiellement payée', 'Annulée'];
  const periodOptions = ['Tous', 'Ce mois', 'Mois dernier', 'Ce trimestre', 'Cette année'];
  const clientOptions = ['Tous', 'Acme Corp', 'Nexus Tech', 'Zenith SA', 'Global Industries', 'Tech Innovate', 'Solutions Pro', 'Groupe Média', 'Data Services', 'ConsultCorp', 'Systèmes Avancés'];

  // Statistics
  const statistics = [
    { title: "Total facturé", value: "72 530,00 €", icon: <FiDollarSign className="text-green-500" /> },
    { title: "En attente", value: "12 790,00 €", icon: <FiClock className="text-amber-500" /> },
    { title: "En retard", value: "12 440,00 €", icon: <FiInfo className="text-red-500" /> },
    { title: "Payées", value: "47 300,00 €", icon: <FiCheck className="text-blue-500" /> }
  ];

  // Handler for toggling all checkboxes
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedInvoices(filteredInvoices.map(invoice => invoice.id));
    } else {
      setSelectedInvoices([]);
    }
  };

  // Handler for toggling individual checkboxes
  const handleSelectInvoice = (invoiceId: string) => {
    if (selectedInvoices.includes(invoiceId)) {
      setSelectedInvoices(selectedInvoices.filter(id => id !== invoiceId));
      setSelectAll(false);
    } else {
      setSelectedInvoices([...selectedInvoices, invoiceId]);
    }
  };

  // Filter invoices based on search and filter criteria
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      searchTerm === '' || 
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.montant.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'Tous' || invoice.statut === selectedStatus;
    
    const matchesClient = selectedClient === 'Tous' || invoice.client === selectedClient;
    
    // For period filter we would need actual date logic, 
    // this is simplified for the example
    const matchesPeriod = selectedPeriod === 'Tous' || true;
    
    return matchesSearch && matchesStatus && matchesClient && matchesPeriod;
  });

  // Reset filters
  const resetFilters = () => {
    setSelectedStatus('Tous');
    setSelectedPeriod('Tous');
    setSelectedClient('Tous');
    setSearchTerm('');
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string): string => {
    switch(status) {
      case 'Payée':
        return 'bg-green-100 text-green-800';
      case 'En attente':
        return 'bg-amber-100 text-amber-800';
      case 'En retard':
        return 'bg-red-100 text-red-800';
      case 'Partiellement payée':
        return 'bg-blue-100 text-blue-800';
      case 'Annulée':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-purple-100 text-purple-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center p-6 bg-white rounded-2xl shadow-xl">
          <div>
            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-3xl font-bold text-indigo-700 drop-shadow-md"
            >
              Factures
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">
              Gérez vos factures et suivez leur état de paiement
            </p>
          </div>
          <div className="p-2 bg-indigo-100 rounded-lg">
            <FiFileText className="w-6 h-6 text-indigo-600" />
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {statistics.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-lg flex flex-col">
              <div className="flex items-center mb-2">
                <div className="p-2 bg-indigo-50 rounded-lg mr-3">
                  {stat.icon}
                </div>
                <span className="text-sm font-medium text-gray-500">{stat.title}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Actions & Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            {/* Search */}
            <div className="w-full md:w-72 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher une facture..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                <FiPlus />
                <span>Créer une facture</span>
              </button>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
              >
                <FiFilter />
                <span>{showFilters ? 'Masquer filtres' : 'Afficher filtres'}</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition">
                <FiRefreshCw />
                <span className="hidden md:inline">Actualiser</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition">
                <FiDownload />
                <span className="hidden md:inline">Exporter</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-4 p-4 border-t overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Statut
                  </label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    {statusOptions.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Période
                  </label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                  >
                    {periodOptions.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client
                  </label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                  >
                    {clientOptions.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-4">
                <button 
                  onClick={resetFilters}
                  className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
                >
                  Réinitialiser
                </button>
                <button 
                  className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  Appliquer les filtres
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Bulk Actions (visible when invoices are selected) */}
        {selectedInvoices.length > 0 && (
          <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex justify-between items-center">
            <div className="text-indigo-800">
              <span className="font-medium">{selectedInvoices.length}</span> facture(s) sélectionnée(s)
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center space-x-1">
                <FiSend />
                <span>Envoyer par email</span>
              </button>
              <button className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 transition flex items-center space-x-1">
                <FiPrinter />
                <span>Imprimer</span>
              </button>
              <button className="px-3 py-1.5 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center space-x-1">
                <FiTrash2 />
                <span>Supprimer</span>
              </button>
            </div>
          </div>
        )}

        {/* Invoices Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        checked={selectAll}
                        onChange={handleSelectAll}
                      />
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    N° facture
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Échéance
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={selectedInvoices.includes(invoice.id)}
                          onChange={() => handleSelectInvoice(invoice.id)}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-indigo-600">
                        {invoice.id}
                      </div>
                      <div className="text-xs text-gray-500">
                        <span className="flex items-center">
                          <FiUser className="mr-1" size={12} />
                          {invoice.creePar}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.date}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.client}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.montant}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(invoice.statut)}`}>
                        {invoice.statut}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="flex items-center">
                        <FiCalendar className="mr-1" size={12} />
                        {invoice.echeance}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="p-1 text-indigo-600 hover:text-indigo-900" title="Voir">
                          <FiEye size={18} />
                        </button>
                        <button className="p-1 text-blue-600 hover:text-blue-900" title="Modifier">
                          <FiEdit size={18} />
                        </button>
                        <button className="p-1 text-green-600 hover:text-green-900" title="Télécharger">
                          <FiDownload size={18} />
                        </button>
                        <div className="relative">
                          <button className="p-1 text-gray-600 hover:text-gray-900" title="Plus d'options">
                            <FiMoreVertical size={18} />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Empty state */}
          {filteredInvoices.length === 0 && (
            <div className="text-center py-12">
              <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune facture trouvée</h3>
              <p className="mt-1 text-sm text-gray-500">
                Aucune facture ne correspond à vos critères de recherche.
              </p>
              <div className="mt-6">
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FiRefreshCw className="-ml-1 mr-2 h-5 w-5" />
                  Réinitialiser les filtres
                </button>
              </div>
            </div>
          )}

          {/* Pagination */}
          <nav className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6" aria-label="Pagination">
            <div className="hidden sm:block">
              <p className="text-sm text-gray-700">
                Affichage de <span className="font-medium">1</span> à <span className="font-medium">{filteredInvoices.length}</span> sur <span className="font-medium">{invoices.length}</span> factures
              </p>
            </div>
            <div className="flex-1 flex justify-between sm:justify-end">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Précédent
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Suivant
              </button>
            </div>
          </nav>
        </div>
      </div>
    </motion.div>
  );
}
