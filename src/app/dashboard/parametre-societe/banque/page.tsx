'use client';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FiDollarSign, 
  FiEdit,
  FiTrash2,
  FiPlus,
  FiDownload,
  FiPrinter,
  FiSearch,
  FiX,
  FiCheck,
  FiInfo,
  FiCreditCard,
  FiHome,
  FiUser,
  FiPhone,
  FiMail,
  FiGlobe
} from 'react-icons/fi';

// Define types for bank data
interface BankType {
  id: string;
  code: string;
  name: string;
  accountNumber: string;
  isDefault: boolean;
  
  // Address fields
  addressName: string;
  address1: string;
  address2: string;
  address3: string;
  address4: string;
  postalCode: string;
  city: string;
  department: string;
  country: string;
  website: string;
  
  // Contact fields
  contactTitle: string;
  contactRole: string;
  contactLastName: string;
  contactFirstName: string;
  contactPhone: string;
  contactMobile: string;
  contactFax: string;
  contactService: string;
  contactEmail: string;
  
  // Banking details
  rib: string;
  iban: string;
  bic: string;
}

// Sample banks data
const initialBanks: BankType[] = [
  {
    id: '1',
    code: 'BNP',
    name: 'BNP Paribas',
    accountNumber: '512000',
    isDefault: true,
    
    addressName: 'BNP Paribas - Agence Centrale',
    address1: '16 Boulevard des Italiens',
    address2: '',
    address3: '',
    address4: '',
    postalCode: '75009',
    city: 'Paris',
    department: 'Paris',
    country: 'France',
    website: 'www.bnpparibas.fr',
    
    contactTitle: 'M',
    contactRole: 'Conseiller bancaire',
    contactLastName: 'Dupont',
    contactFirstName: 'Jean',
    contactPhone: '01 42 98 12 34',
    contactMobile: '06 12 34 56 78',
    contactFax: '01 42 98 12 35',
    contactService: 'Entreprises',
    contactEmail: 'jean.dupont@bnpparibas.fr',
    
    rib: '30004 00001 00012345678 36',
    iban: 'FR76 3000 4000 0100 0123 4567 836',
    bic: 'BNPAFRPP'
  },
  {
    id: '2',
    code: 'SG',
    name: 'Société Générale',
    accountNumber: '512100',
    isDefault: false,
    
    addressName: 'Société Générale - Agence Entreprises',
    address1: '29 Boulevard Haussmann',
    address2: '',
    address3: '',
    address4: '',
    postalCode: '75009',
    city: 'Paris',
    department: 'Paris',
    country: 'France',
    website: 'www.societegenerale.fr',
    
    contactTitle: 'Mme',
    contactRole: 'Directrice de compte',
    contactLastName: 'Martin',
    contactFirstName: 'Sophie',
    contactPhone: '01 53 43 40 00',
    contactMobile: '06 23 45 67 89',
    contactFax: '01 53 43 40 01',
    contactService: 'Service Entreprises',
    contactEmail: 'sophie.martin@socgen.fr',
    
    rib: '30003 00033 00020123456 72',
    iban: 'FR76 3000 3000 3300 0201 2345 672',
    bic: 'SOGEFRPP'
  },
  {
    id: '3',
    code: 'CA',
    name: 'Crédit Agricole',
    accountNumber: '512200',
    isDefault: false,
    
    addressName: 'Crédit Agricole IDF',
    address1: '26 Quai de la Rapée',
    address2: '',
    address3: '',
    address4: '',
    postalCode: '75012',
    city: 'Paris',
    department: 'Paris',
    country: 'France',
    website: 'www.ca-paris.fr',
    
    contactTitle: 'M',
    contactRole: 'Responsable PME',
    contactLastName: 'Dubois',
    contactFirstName: 'Pierre',
    contactPhone: '01 44 73 22 22',
    contactMobile: '06 34 56 78 90',
    contactFax: '01 44 73 22 23',
    contactService: 'Service Professionnels',
    contactEmail: 'pierre.dubois@ca-paris.fr',
    
    rib: '30006 00001 00012345678 41',
    iban: 'FR76 3000 6000 0100 0123 4567 841',
    bic: 'AGRIFRPP'
  }
];

export default function Banque() {
  // State for banks data
  const [banks, setBanks] = useState<BankType[]>(initialBanks);
  
  // State for search query
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // State for selected bank
  const [selectedBank, setSelectedBank] = useState<BankType | null>(null);
  
  // State for modal visibility
  const [showModal, setShowModal] = useState<boolean>(false);
  
  // State for modal active tab
  const [activeTab, setActiveTab] = useState<'address' | 'banking'>('address');
  
  // State for tracking whether we're adding a new bank or editing existing
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  
  // Create a ref for the print content
  const printContentRef = useRef<HTMLDivElement>(null);
  
  // Filter banks based on search query
  const filteredBanks = banks.filter(bank => 
    bank.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bank.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bank.accountNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle opening the bank modal for editing
  const handleEditBank = (bank: BankType) => {
    setSelectedBank({...bank});
    setIsAddingNew(false);
    setShowModal(true);
    setActiveTab('address');
  };
  
  // Handle adding a new bank
  const handleAddBank = () => {
    const newBank: BankType = {
      id: (banks.length + 1).toString(),
      code: '',
      name: '',
      accountNumber: '',
      isDefault: false,
      
      addressName: '',
      address1: '',
      address2: '',
      address3: '',
      address4: '',
      postalCode: '',
      city: '',
      department: '',
      country: 'France',
      website: '',
      
      contactTitle: '',
      contactRole: '',
      contactLastName: '',
      contactFirstName: '',
      contactPhone: '',
      contactMobile: '',
      contactFax: '',
      contactService: '',
      contactEmail: '',
      
      rib: '',
      iban: '',
      bic: ''
    };
    
    setSelectedBank(newBank);
    setIsAddingNew(true);
    setShowModal(true);
    setActiveTab('address');
  };
  
  // Handle closing the bank modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBank(null);
  };
  
  // Handle saving bank changes
  const handleSaveBank = () => {
    if (!selectedBank) return;
    
    if (isAddingNew) {
      // Add new bank
      setBanks([...banks, selectedBank]);
    } else {
      // Update existing bank
      setBanks(banks.map(bank => 
        bank.id === selectedBank.id ? selectedBank : bank
      ));
      
      // If this bank is set as default, ensure other banks are not default
      if (selectedBank.isDefault) {
        setBanks(banks.map(bank => 
          bank.id !== selectedBank.id ? {...bank, isDefault: false} : bank
        ));
      }
    }
    
    setShowModal(false);
    setSelectedBank(null);
  };
  
  // Handle deleting a bank
  const handleDeleteBank = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette banque?')) {
      setBanks(banks.filter(bank => bank.id !== id));
    }
  };
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!selectedBank) return;
    
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setSelectedBank({
      ...selectedBank,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // If setting this bank as default, ensure it's the only default
    if (name === 'isDefault' && checked) {
      setBanks(banks.map(bank => 
        bank.id !== selectedBank.id ? {...bank, isDefault: false} : bank
      ));
    }
  };
  
  // Handle print
  const handlePrint = () => {
    window.print();
  };
  
  // Handle export
  const handleExport = () => {
    // Create a CSV string
    const headers = ['Code', 'Nom', 'Compte comptable', 'Banque par défaut'];
    const csvContent = 
      headers.join(',') + '\n' + 
      banks.map(bank => 
        `"${bank.code}","${bank.name}","${bank.accountNumber}","${bank.isDefault ? 'Oui' : 'Non'}"`
      ).join('\n');
    
    // Create a downloadable link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'banques.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Animation variants for header
  const headerVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen bg-gray-50"
    >
      <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8 pb-16">
        {/* New Header with gradient styling */}
        <motion.div
          variants={headerVariants}
          initial="initial"
          animate="animate"
          className="relative mb-8 overflow-hidden backdrop-blur-sm bg-white/80 rounded-3xl shadow-2xl border border-gray-100"
        >
          {/* Background gradient with pattern */}
          <div 
            className="absolute inset-0 opacity-5 mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '30px 30px'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-white/70 to-indigo-400/10 rounded-3xl pointer-events-none" />

          {/* Blurred circles for decoration */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative p-8 z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
              <div className="max-w-2xl">
                {/* Title with decorative elements */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <FiDollarSign className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-800 to-indigo-500">
                    Banque
                  </h1>
                </div>
                
                <p className="text-base text-gray-600 leading-relaxed">
                  Gérez les comptes bancaires de votre entreprise. Ajoutez, modifiez ou supprimez vos informations bancaires.
                </p>
              </div>
            </div>
            
            {/* Quick tip */}
            <div className="mt-6 flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl text-sm">
              <FiInfo className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-amber-700">Astuce :</span>{' '}
                <span className="text-amber-700">
                  Cliquez sur une banque pour la modifier ou sur &quot;Ajouter&quot; pour créer une nouvelle banque. Pensez à toujours avoir une banque définie par défaut.
                </span>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg mr-4">
                <FiCreditCard className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Liste des banques</h2>
            </div>
            <p className="text-gray-500 text-sm mt-2 ml-11">
              Gérez les informations bancaires de votre entreprise
            </p>
          </div>
          
          {/* Search and Actions */}
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher une banque..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleExport}
                  className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
                >
                  <FiDownload className="w-4 h-4" />
                  <span className="hidden sm:inline">Exporter</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
                >
                  <FiPrinter className="w-4 h-4" />
                  <span className="hidden sm:inline">Imprimer</span>
                </button>
                <button
                  onClick={handleAddBank}
                  className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  <FiPlus className="w-4 h-4" />
                  <span>Ajouter</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Bank List Table */}
          <div ref={printContentRef} className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Compte comptable
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Par défaut
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBanks.map((bank) => (
                  <tr key={bank.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleEditBank(bank)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {bank.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bank.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bank.accountNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bank.isDefault ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <FiCheck className="w-3 h-3 mr-1" />
                          Oui
                        </span>
                      ) : (
                        <span className="text-gray-400">Non</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditBank(bank);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBank(bank.id);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredBanks.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                      Aucune banque trouvée. Cliquez sur &quot;Ajouter&quot; pour créer une nouvelle banque.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Info Box */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center">
              <FiInfo className="w-5 h-5 text-indigo-500 mr-2" />
              <span className="text-sm text-gray-600">
                Pour ajouter une nouvelle banque, cliquez sur le bouton &quot;Ajouter&quot;. Pour modifier une banque existante, cliquez sur la ligne correspondante.
              </span>
            </div>
          </div>
        </div>
        
        {/* Bank Modal */}
        {showModal && selectedBank && (
          <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
              
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                <div className="absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <span className="sr-only">Fermer</span>
                    <FiX className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  {/* Modal Header */}
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      {isAddingNew ? 'Ajouter une banque' : 'Modifier une banque'}
                    </h3>
                  </div>
                  
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Code
                      </label>
                      <input
                        type="text"
                        name="code"
                        value={selectedBank.code}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={selectedBank.name}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
                      />
                    </div>
                    
                    <div className="flex items-end pb-2">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          name="isDefault"
                          checked={selectedBank.isDefault}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Banque par défaut</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Tabs */}
                  <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                      <button
                        className={`${
                          activeTab === 'address'
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        onClick={() => setActiveTab('address')}
                      >
                        Adresse
                      </button>
                      <button
                        className={`${
                          activeTab === 'banking'
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        onClick={() => setActiveTab('banking')}
                      >
                        Coordonnées bancaires
                      </button>
                    </nav>
                  </div>
                  
                  {/* Tab Content */}
                  <div className="mt-4">
                    {/* Address Tab */}
                    {activeTab === 'address' && (
                      <div className="space-y-6">
                        {/* Adresse Section */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                            <FiHome className="w-4 h-4 mr-2" />
                            Adresse
                          </h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nom
                              </label>
                              <input
                                type="text"
                                name="addressName"
                                value={selectedBank.addressName}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
                              />
                            </div>
                            
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Adresse
                              </label>
                              <input
                                type="text"
                                name="address1"
                                value={selectedBank.address1}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
                              />
                            </div>
                            
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Adresse (suite)
                              </label>
                              <input
                                type="text"
                                name="address2"
                                value={selectedBank.address2}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
                              />
                            </div>
                            
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Adresse (suite)
                              </label>
                              <input
                                type="text"
                                name="address3"
                                value={selectedBank.address3}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
                              />
                            </div>
                            
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Adresse (fin)
                              </label>
                              <input
                                type="text"
                                name="address4"
                                value={selectedBank.address4}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Code postal
                              </label>
                              <input
                                type="text"
                                name="postalCode"
                                value={selectedBank.postalCode}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ville
                              </label>
                              <input
                                type="text"
                                name="city"
                                value={selectedBank.city}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Département
                              </label>
                              <input
                                type="text"
                                name="department"
                                value={selectedBank.department}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Pays
                              </label>
                              <input
                                type="text"
                                name="country"
                                value={selectedBank.country}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
                              />
                            </div>
                            
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Site web
                              </label>
                              <div className="flex">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                  <FiGlobe className="h-4 w-4" />
                                </span>
                                <input
                                  type="text"
                                  name="website"
                                  value={selectedBank.website}
                                  onChange={handleInputChange}
                                  className="flex-1 p-2 border border-gray-300 rounded-r-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
                                  placeholder="www.example.com"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Contact Section */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                            <FiUser className="w-4 h-4 mr-2" />
                            Contact
                          </h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Civilité
                              </label>
                              <select
                                name="contactTitle"
                                value={selectedBank.contactTitle}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
                              >
                                <option value="">Sélectionner</option>
                                <option value="M">Monsieur</option>
                                <option value="Mme">Madame</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Fonction
                              </label>
                              <input
                                type="text"
                                name="contactRole"
                                value={selectedBank.contactRole}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
                              />
                            </div>
                            
                            <div className="md:col-span-1"></div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nom
                              </label>
                              <input
                                type="text"
                                name="contactLastName"
                                value={selectedBank.contactLastName}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Prénom
                              </label>
                              <input
                                type="text"
                                name="contactFirstName"
                                value={selectedBank.contactFirstName}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Service/Bureau
                              </label>
                              <input
                                type="text"
                                name="contactService"
                                value={selectedBank.contactService}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Téléphone fixe
                              </label>
                              <div className="flex">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                  <FiPhone className="h-4 w-4" />
                                </span>
                                <input
                                  type="text"
                                  name="contactPhone"
                                  value={selectedBank.contactPhone}
                                  onChange={handleInputChange}
                                  className="flex-1 p-2 border border-gray-300 rounded-r-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Téléphone portable
                              </label>
                              <div className="flex">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                  <FiPhone className="h-4 w-4" />
                                </span>
                                <input
                                  type="text"
                                  name="contactMobile"
                                  value={selectedBank.contactMobile}
                                  onChange={handleInputChange}
                                  className="flex-1 p-2 border border-gray-300 rounded-r-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Fax
                              </label>
                              <div className="flex">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                  <FiPhone className="h-4 w-4" />
                                </span>
                                <input
                                  type="text"
                                  name="contactFax"
                                  value={selectedBank.contactFax}
                                  onChange={handleInputChange}
                                  className="flex-1 p-2 border border-gray-300 rounded-r-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
                                />
                              </div>
                            </div>
                            
                            <div className="md:col-span-3">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                              </label>
                              <div className="flex">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                  <FiMail className="h-4 w-4" />
                                </span>
                                <input
                                  type="email"
                                  name="contactEmail"
                                  value={selectedBank.contactEmail}
                                  onChange={handleInputChange}
                                  className="flex-1 p-2 border border-gray-300 rounded-r-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Banking Tab */}
                    {activeTab === 'banking' && (
                      <div className="space-y-6">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                            <FiCreditCard className="w-4 h-4 mr-2" />
                            Coordonnées bancaires
                          </h4>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                RIB / BBAN (Relevé d&apos;Identité Bancaire)
                              </label>
                              <input
                                type="text"
                                name="rib"
                                value={selectedBank.rib}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
                                placeholder="Ex: 30004 00001 00012345678 36"
                              />
                              <p className="mt-1 text-xs text-gray-500">
                                Format: Code banque + Code guichet + Numéro de compte + Clé RIB
                              </p>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                IBAN (International Bank Account Number)
                              </label>
                              <input
                                type="text"
                                name="iban"
                                value={selectedBank.iban}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
                                placeholder="Ex: FR76 3000 4000 0100 0123 4567 836"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                BIC (Bank Identifier Code) / SWIFT
                              </label>
                              <input
                                type="text"
                                name="bic"
                                value={selectedBank.bic}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
                                placeholder="Ex: BNPAFRPP"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Compte comptable
                              </label>
                              <input
                                type="text"
                                name="accountNumber"
                                value={selectedBank.accountNumber}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
                                placeholder="Ex: 512000"
                              />
                              <p className="mt-1 text-xs text-gray-500">
                                Numéro de compte comptable de la banque dans votre plan comptable (ex: 512, 514...)
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={handleSaveBank}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {isAddingNew ? 'Ajouter' : 'Enregistrer'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}