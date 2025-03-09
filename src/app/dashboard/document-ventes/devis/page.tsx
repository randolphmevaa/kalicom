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
  FiCheck,
  FiX
} from 'react-icons/fi';

// Define possible tabs
type ActiveTab = 'devis' | 'devises' | 'taxes' | 'societes' | 'produits';

// Define interfaces for each data type
interface Devis {
  description: string;
  societe: string;
  adresse: string;
  ville: string;
  codePostal: string;
  pays: string;
  telephone: string;
  email: string;
  actif?: boolean;
  pourcentage: string;
  code: string;
  symbole: string;
  nom: string;
  id: number;
  creePar: string;
  sujet: string;
  prospect: string;
  prix: string;
  statut: string;
  creeLe: string;
}

interface Devise {
  id: number;
  nom: string;
  code: string;
  symbole: string;
}

interface Taxe {
  id: number;
  nom: string;
  pourcentage: string;
}

interface Societe {
  id: number;
  nom: string;
  adresse: string;
  ville: string;
  codePostal: string;
  pays: string;
  telephone: string;
  email: string;
  actif: boolean;
}

interface Produit {
  id: number;
  nom: string;
  code: string;
  description: string;
  actif: boolean;
  societe: string;
  prix: string;
}

export default function Devis() {
  // State for tabs and filters
  const [activeTab, setActiveTab] = useState<ActiveTab>('devis');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample data for all tabs
  const devisData: Devis[] = [
    {
      id: 1,
      creePar: 'Jean Martin',
      sujet: 'Mise en place CRM Pro',
      prospect: 'Acme Corp',
      prix: '15 600,00 €',
      statut: 'En attente',
      creeLe: '02/03/2025',
      description: '',
      societe: '',
      adresse: '',
      ville: '',
      codePostal: '',
      pays: '',
      telephone: '',
      email: '',
      actif: undefined,
      pourcentage: '',
      code: '',
      symbole: '',
      nom: ''
    },
    {
      id: 2,
      creePar: 'Sophie Leclerc',
      sujet: 'Module Facturation',
      prospect: 'Nexus Tech',
      prix: '2 990,00 €',
      statut: 'Accepté',
      creeLe: '28/02/2025',
      description: '',
      societe: '',
      adresse: '',
      ville: '',
      codePostal: '',
      pays: '',
      telephone: '',
      email: '',
      actif: undefined,
      pourcentage: '',
      code: '',
      symbole: '',
      nom: ''
    },
    {
      id: 3,
      creePar: 'Thomas Bernard',
      sujet: 'Support Premium Annuel',
      prospect: 'Zenith SA',
      prix: '4 990,00 €',
      statut: 'En attente',
      creeLe: '25/02/2025',
      description: '',
      societe: '',
      adresse: '',
      ville: '',
      codePostal: '',
      pays: '',
      telephone: '',
      email: '',
      actif: undefined,
      pourcentage: '',
      code: '',
      symbole: '',
      nom: ''
    },
    {
      id: 4,
      creePar: 'Marie Dupont',
      sujet: 'Formation Utilisateurs',
      prospect: 'Global Industries',
      prix: '3 500,00 €',
      statut: 'Accepté',
      creeLe: '20/02/2025',
      description: '',
      societe: '',
      adresse: '',
      ville: '',
      codePostal: '',
      pays: '',
      telephone: '',
      email: '',
      actif: undefined,
      pourcentage: '',
      code: '',
      symbole: '',
      nom: ''
    },
    {
      id: 5,
      creePar: 'Jean Martin',
      sujet: 'Pack Démarrage Complet',
      prospect: 'Tech Innovate',
      prix: '12 750,00 €',
      statut: 'Refusé',
      creeLe: '15/02/2025',
      description: '',
      societe: '',
      adresse: '',
      ville: '',
      codePostal: '',
      pays: '',
      telephone: '',
      email: '',
      actif: undefined,
      pourcentage: '',
      code: '',
      symbole: '',
      nom: ''
    },
  ];

  const devisesData: Devise[] = [
    {
      id: 1,
      nom: 'Euro',
      code: 'EUR',
      symbole: '€'
    },
    {
      id: 2,
      nom: 'Dollar américain',
      code: 'USD',
      symbole: '$'
    },
    {
      id: 3,
      nom: 'Livre sterling',
      code: 'GBP',
      symbole: '£'
    },
    {
      id: 4,
      nom: 'Franc suisse',
      code: 'CHF',
      symbole: 'CHF'
    },
    {
      id: 5,
      nom: 'Yen japonais',
      code: 'JPY',
      symbole: '¥'
    },
  ];

  const taxesData: Taxe[] = [
    {
      id: 1,
      nom: 'TVA standard',
      pourcentage: '20%'
    },
    {
      id: 2,
      nom: 'TVA intermédiaire',
      pourcentage: '10%'
    },
    {
      id: 3,
      nom: 'TVA réduite',
      pourcentage: '5.5%'
    },
    {
      id: 4,
      nom: 'TVA super réduite',
      pourcentage: '2.1%'
    },
    {
      id: 5,
      nom: 'Exonération TVA',
      pourcentage: '0%'
    },
  ];

  const societesData: Societe[] = [
    {
      id: 1,
      nom: 'CRM Solutions France',
      adresse: '15 rue de l\'Innovation',
      ville: 'Paris',
      codePostal: '75008',
      pays: 'France',
      telephone: '+33 1 23 45 67 89',
      email: 'contact@crmsolutions.fr',
      actif: true
    },
    {
      id: 2,
      nom: 'CRM Solutions Belgique',
      adresse: '25 Avenue des Affaires',
      ville: 'Bruxelles',
      codePostal: '1000',
      pays: 'Belgique',
      telephone: '+32 2 345 67 89',
      email: 'contact@crmsolutions.be',
      actif: true
    },
    {
      id: 3,
      nom: 'CRM Solutions Suisse',
      adresse: '10 Rue du Commerce',
      ville: 'Genève',
      codePostal: '1204',
      pays: 'Suisse',
      telephone: '+41 22 345 67 89',
      email: 'contact@crmsolutions.ch',
      actif: true
    },
    {
      id: 4,
      nom: 'CRM Solutions Canada',
      adresse: '500 Business Avenue',
      ville: 'Montréal',
      codePostal: 'H3B 2C6',
      pays: 'Canada',
      telephone: '+1 514 345 6789',
      email: 'contact@crmsolutions.ca',
      actif: false
    },
    {
      id: 5,
      nom: 'CRM Solutions UK',
      adresse: '100 Tech Street',
      ville: 'London',
      codePostal: 'EC2R 8AH',
      pays: 'Royaume-Uni',
      telephone: '+44 20 3456 7890',
      email: 'contact@crmsolutions.co.uk',
      actif: true
    },
  ];

  const produitsData: Produit[] = [
    {
      id: 1,
      nom: 'CRM Pro License',
      code: 'CRM-PRO',
      description: 'Licence complète CRM Pro avec tous les modules',
      actif: true,
      societe: 'CRM Solutions France',
      prix: '1 200,00 €'
    },
    {
      id: 2,
      nom: 'Module Facturation',
      code: 'MOD-FACT',
      description: 'Module de facturation automatisée',
      actif: true,
      societe: 'CRM Solutions France',
      prix: '299,00 €'
    },
    {
      id: 3,
      nom: 'Module Marketing',
      code: 'MOD-MKT',
      description: 'Module marketing et gestion de campagnes',
      actif: true,
      societe: 'CRM Solutions France',
      prix: '399,00 €'
    },
    {
      id: 4,
      nom: 'Support Premium',
      code: 'SUP-PREM',
      description: 'Support premium 24/7',
      actif: true,
      societe: 'CRM Solutions France',
      prix: '499,00 €'
    },
    {
      id: 5,
      nom: 'Formation Utilisateur',
      code: 'FORM-USR',
      description: 'Formation utilisateur standard',
      actif: true,
      societe: 'CRM Solutions France',
      prix: '350,00 €'
    },
  ];

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch(status) {
      case 'Accepté':
        return 'bg-green-100 text-green-800';
      case 'En attente':
        return 'bg-amber-100 text-amber-800';
      case 'Refusé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  // Filter data based on search term and active tab
  const getFilteredData = (): Devis[] | Devise[] | Taxe[] | Societe[] | Produit[] => {
    switch(activeTab) {
      case 'devis':
        return devisData.filter(devis => 
          devis.sujet.toLowerCase().includes(searchTerm.toLowerCase()) ||
          devis.prospect.toLowerCase().includes(searchTerm.toLowerCase()) ||
          devis.creePar.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'devises':
        return devisesData.filter(devise => 
          devise.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          devise.code.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'taxes':
        return taxesData.filter(taxe => 
          taxe.nom.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'societes':
        return societesData.filter(societe => 
          societe.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          societe.ville.toLowerCase().includes(searchTerm.toLowerCase()) ||
          societe.pays.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'produits':
        return produitsData.filter(produit => 
          produit.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          produit.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          produit.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      default:
        return [];
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
  };

  // Get appropriate add button text based on active tab
  const getAddButtonText = () => {
    switch(activeTab) {
      case 'devis':
        return 'Ajouter un devis';
      case 'devises':
        return 'Ajouter une devise';
      case 'taxes':
        return 'Ajouter une taxe';
      case 'societes':
        return 'Ajouter une société';
      case 'produits':
        return 'Ajouter un produit';
      default:
        return 'Ajouter';
    }
  };

  const filteredDevis = activeTab === 'devis' ? (getFilteredData() as Devis[]) : [];

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
              Devis
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">
              Gérez vos devis et configurez les paramètres associés
            </p>
          </div>
          <div className="p-2 bg-indigo-100 rounded-lg">
            <FiFileText className="w-6 h-6 text-indigo-600" />
          </div>
        </div>

        {/* Main Action Button */}
        <div className="flex justify-end">
          <button className="flex items-center space-x-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            <FiPlus />
            <span>Ajouter un devis</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex overflow-x-auto border-b">
            <button
              className={`px-4 py-3 text-center font-medium transition whitespace-nowrap ${
                activeTab === 'devis' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('devis')}
            >
              Devis
            </button>
            <button
              className={`px-4 py-3 text-center font-medium transition whitespace-nowrap ${
                activeTab === 'devises' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('devises')}
            >
              Devises
            </button>
            <button
              className={`px-4 py-3 text-center font-medium transition whitespace-nowrap ${
                activeTab === 'taxes' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('taxes')}
            >
              Taxes
            </button>
            <button
              className={`px-4 py-3 text-center font-medium transition whitespace-nowrap ${
                activeTab === 'societes' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('societes')}
            >
              Sociétés
            </button>
            <button
              className={`px-4 py-3 text-center font-medium transition whitespace-nowrap ${
                activeTab === 'produits' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('produits')}
            >
              Produits
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Tab-specific add button and search bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
              <div className="w-full md:w-72 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2 w-full md:w-auto">
                <button className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                  <FiPlus />
                  <span>{getAddButtonText()}</span>
                </button>
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
                >
                  <FiFilter />
                  <span>{showFilters ? 'Masquer filtres' : 'Afficher filtres'}</span>
                </button>
              </div>
            </div>

            {/* Filters (if enabled) */}
            {showFilters && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="mb-6 p-4 border border-gray-200 rounded-lg overflow-hidden"
              >
                <div className="flex flex-wrap gap-4">
                  {/* Tab-specific filters would go here */}
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Filtrer par
                    </label>
                    <select className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500">
                      <option>Tous</option>
                      {activeTab === 'devis' && (
                        <>
                          <option>En attente</option>
                          <option>Accepté</option>
                          <option>Refusé</option>
                        </>
                      )}
                      {activeTab === 'societes' && (
                        <>
                          <option>Actif</option>
                          <option>Inactif</option>
                        </>
                      )}
                      {activeTab === 'produits' && (
                        <>
                          <option>Actif</option>
                          <option>Inactif</option>
                        </>
                      )}
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
                    Appliquer le filtre
                  </button>
                </div>
              </motion.div>
            )}

            {/* Devis Tab Content */}
            {activeTab === 'devis' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Créé par
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sujet
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prospect
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prix
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Créé le
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDevis.map((devis) => (
                      <tr key={devis.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {devis.creePar}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-indigo-600">
                            {devis.sujet}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {devis.prospect}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {devis.prix}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(devis.statut)}`}>
                            {devis.statut}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {devis.creeLe}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button className="p-1 text-indigo-600 hover:text-indigo-900" title="Voir">
                              <FiEye size={18} />
                            </button>
                            <button className="p-1 text-blue-600 hover:text-blue-900" title="Modifier">
                              <FiEdit size={18} />
                            </button>
                            <button className="p-1 text-red-600 hover:text-red-900" title="Supprimer">
                              <FiTrash2 size={18} />
                            </button>
                            <button className="p-1 text-gray-600 hover:text-gray-900" title="Plus d'options">
                              <FiMoreVertical size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Devises Tab Content */}
            {activeTab === 'devises' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Code
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Symbole
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDevis.map((devise) => (
                      <tr key={devise.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {devise.nom}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {devise.code}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {devise.symbole}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button className="p-1 text-blue-600 hover:text-blue-900" title="Modifier">
                              <FiEdit size={18} />
                            </button>
                            <button className="p-1 text-red-600 hover:text-red-900" title="Supprimer">
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Taxes Tab Content */}
            {activeTab === 'taxes' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pourcentage
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDevis.map((taxe) => (
                      <tr key={taxe.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {taxe.nom}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {taxe.pourcentage}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button className="p-1 text-blue-600 hover:text-blue-900" title="Modifier">
                              <FiEdit size={18} />
                            </button>
                            <button className="p-1 text-red-600 hover:text-red-900" title="Supprimer">
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Sociétés Tab Content */}
            {activeTab === 'societes' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Adresse
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ville
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Code postal
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pays
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Numéro de Tél.
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actif
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDevis.map((societe) => (
                      <tr key={societe.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {societe.nom}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {societe.adresse}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {societe.ville}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {societe.codePostal}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {societe.pays}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {societe.telephone}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {societe.email}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          {societe.actif ? (
                            <FiCheck className="inline text-green-600" title="Actif" />
                          ) : (
                            <FiX className="inline text-red-600" title="Inactif" />
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button className="p-1 text-blue-600 hover:text-blue-900" title="Modifier">
                              <FiEdit size={18} />
                            </button>
                            <button className="p-1 text-red-600 hover:text-red-900" title="Supprimer">
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Produits Tab Content */}
            {activeTab === 'produits' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Code
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actif
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Société
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prix
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDevis.map((produit) => (
                      <tr key={produit.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {produit.nom}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {produit.code}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {produit.description}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          {produit.actif ? (
                            <FiCheck className="inline text-green-600" title="Actif" />
                          ) : (
                            <FiX className="inline text-red-600" title="Inactif" />
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {produit.societe}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {produit.prix}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button className="p-1 text-blue-600 hover:text-blue-900" title="Modifier">
                              <FiEdit size={18} />
                            </button>
                            <button className="p-1 text-red-600 hover:text-red-900" title="Supprimer">
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
