'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiBox, 
  FiSearch, 
  FiFilter, 
  FiPlus, 
  // FiMoreVertical, 
  FiEdit,
  FiTrash2,
  FiEye,
  FiDollarSign,
  FiBarChart2,
  FiTag,
  FiPackage,
  FiRefreshCw,
  FiDownload,
  FiGrid,
  FiList,
  FiClock,
  FiCheck,
  FiX
} from 'react-icons/fi';

export default function Produits() {
  // Show success message after actions
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  
  // Function to display a success message that automatically disappears
  const displaySuccessMessage = (message: string): void => {
    setSuccessMessage(message);
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  // State for filters, search, and view
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [selectedStatus, setSelectedStatus] = useState<string>('Tous');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // 'grid' or 'list'
  
  // State for selected products (for bulk actions)
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  // Sample product data
  const products = [
    {
      id: 1,
      nom: 'Pro CRM Suite',
      reference: 'CRM-001',
      description: 'Solution CRM complète pour les entreprises',
      prix: '1 200,00 €',
      prixAchat: '600,00 €',
      categorie: 'Logiciel',
      statut: 'Actif',
      stock: 'Illimité',
      dateCreation: '10/01/2025',
      dateMiseAJour: '01/03/2025',
      image: '/api/placeholder/200/200',
      vendu: 145
    },
    {
      id: 2,
      nom: 'Module Facturation',
      reference: 'MOD-FACT',
      description: 'Module complémentaire de facturation automatisée',
      prix: '299,00 €',
      prixAchat: '150,00 €',
      categorie: 'Module',
      statut: 'Actif',
      stock: 'Illimité',
      dateCreation: '15/01/2025',
      dateMiseAJour: '15/02/2025',
      image: '/api/placeholder/200/200',
      vendu: 98
    },
    {
      id: 3,
      nom: 'Support Premium (1 an)',
      reference: 'SUP-PREM',
      description: 'Service de support prioritaire 24/7',
      prix: '499,00 €',
      prixAchat: '200,00 €',
      categorie: 'Service',
      statut: 'Actif',
      stock: 'Illimité',
      dateCreation: '20/01/2025',
      dateMiseAJour: '20/02/2025',
      image: '/api/placeholder/200/200',
      vendu: 65
    },
    {
      id: 4,
      nom: 'Formation Utilisateur',
      reference: 'FORM-BASE',
      description: 'Formation de base pour les nouveaux utilisateurs',
      prix: '350,00 €',
      prixAchat: '150,00 €',
      categorie: 'Formation',
      statut: 'Actif',
      stock: '25',
      dateCreation: '25/01/2025',
      dateMiseAJour: '15/02/2025',
      image: '/api/placeholder/200/200',
      vendu: 42
    },
    {
      id: 5,
      nom: 'Formation Administrateur',
      reference: 'FORM-ADV',
      description: 'Formation avancée pour les administrateurs système',
      prix: '650,00 €',
      prixAchat: '300,00 €',
      categorie: 'Formation',
      statut: 'Actif',
      stock: '15',
      dateCreation: '25/01/2025',
      dateMiseAJour: '15/02/2025',
      image: '/api/placeholder/200/200',
      vendu: 28
    },
    {
      id: 6,
      nom: 'Module Marketing',
      reference: 'MOD-MKT',
      description: "Module d'automatisation marketing et campagnes",
      prix: '399,00 €',
      prixAchat: '200,00 €',
      categorie: 'Module',
      statut: 'Actif',
      stock: 'Illimité',
      dateCreation: '01/02/2025',
      dateMiseAJour: '01/03/2025',
      image: '/api/placeholder/200/200',
      vendu: 76
    },
    {
      id: 7,
      nom: 'Installation Sur Site',
      reference: 'INST-SITE',
      description: "Service d'installation et configuration sur site client",
      prix: '899,00 €',
      prixAchat: '500,00 €',
      categorie: 'Service',
      statut: 'Actif',
      stock: '10',
      dateCreation: '05/02/2025',
      dateMiseAJour: '05/03/2025',
      image: '/api/placeholder/200/200',
      vendu: 15
    },
    {
      id: 8,
      nom: 'Pack Démarrage',
      reference: 'PACK-START',
      description: 'Pack incluant logiciel, formation et support initial',
      prix: '1 799,00 €',
      prixAchat: '900,00 €',
      categorie: 'Pack',
      statut: 'Actif',
      stock: '50',
      dateCreation: '10/02/2025',
      dateMiseAJour: '10/03/2025',
      image: '/api/placeholder/200/200',
      vendu: 32
    },
    {
      id: 9,
      nom: 'Module Analytics',
      reference: 'MOD-ANALYTICS',
      description: "Module d'analyse et reporting avancé",
      prix: '499,00 €',
      prixAchat: '250,00 €',
      categorie: 'Module',
      statut: 'Nouveau',
      stock: 'Illimité',
      dateCreation: '20/02/2025',
      dateMiseAJour: '20/02/2025',
      image: '/api/placeholder/200/200',
      vendu: 12
    },
    {
      id: 10,
      nom: 'CRM Lite',
      reference: 'CRM-LITE',
      description: 'Version allégée du CRM pour petites entreprises',
      prix: '499,00 €',
      prixAchat: '250,00 €',
      categorie: 'Logiciel',
      statut: 'Actif',
      stock: 'Illimité',
      dateCreation: '25/02/2025',
      dateMiseAJour: '01/03/2025',
      image: '/api/placeholder/200/200',
      vendu: 87
    },
    {
      id: 11,
      nom: 'Module API',
      reference: 'MOD-API',
      description: "Module d'intégration API pour systèmes tiers",
      prix: '599,00 €',
      prixAchat: '300,00 €',
      categorie: 'Module',
      statut: 'Actif',
      stock: 'Illimité',
      dateCreation: '01/03/2025',
      dateMiseAJour: '01/03/2025',
      image: '/api/placeholder/200/200',
      vendu: 23
    },
    {
      id: 12,
      nom: 'Support Basique (1 an)',
      reference: 'SUP-BASIC',
      description: 'Support technique standard par email',
      prix: '199,00 €',
      prixAchat: '100,00 €',
      categorie: 'Service',
      statut: 'Actif',
      stock: 'Illimité',
      dateCreation: '05/03/2025',
      dateMiseAJour: '05/03/2025',
      image: '/api/placeholder/200/200',
      vendu: 103
    }
  ];

  // Filter options
  const categoryOptions = ['Tous', 'Logiciel', 'Module', 'Service', 'Formation', 'Pack'];
  const statusOptions = ['Tous', 'Actif', 'Inactif', 'Nouveau', 'Épuisé'];

  // Handler for toggling all checkboxes
  const handleSelectAll = (): void => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedProducts(filteredProducts.map(product => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  // Handler for toggling individual checkboxes
  const handleSelectProduct = (productId: number): void => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
      setSelectAll(false);
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  // Filter products based on search and filter criteria
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      searchTerm === '' || 
      product.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'Tous' || product.categorie === selectedCategory;
    const matchesStatus = selectedStatus === 'Tous' || product.statut === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Reset filters
  const resetFilters = () => {
    setSelectedCategory('Tous');
    setSelectedStatus('Tous');
    setSearchTerm('');
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string): string => {
    switch(status) {
      case 'Actif':
        return 'bg-green-100 text-green-800';
      case 'Inactif':
        return 'bg-gray-100 text-gray-800';
      case 'Nouveau':
        return 'bg-blue-100 text-blue-800';
      case 'Épuisé':
        return 'bg-red-100 text-red-800';
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
        {/* Success Message Toast */}
        {showSuccessMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-4 z-50 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md flex items-center justify-between"
          >
            <div className="flex items-center">
              <FiCheck className="mr-2" />
              <span>{successMessage}</span>
            </div>
            <button 
              onClick={() => setShowSuccessMessage(false)}
              className="text-green-700 hover:text-green-900"
            >
              <FiX />
            </button>
          </motion.div>
        )}
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 bg-white rounded-2xl shadow-xl">
          <div>
            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-3xl font-bold text-indigo-700 drop-shadow-md"
            >
              Produits
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">
              Gérez votre catalogue de produits et services
            </p>
          </div>
          <div className="p-2 bg-indigo-100 rounded-lg">
            <FiBox className="w-6 h-6 text-indigo-600" />
          </div>
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
                placeholder="Rechercher un produit..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button 
                onClick={() => displaySuccessMessage("Formulaire d'ajout de produit ouvert")}
                className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              >
                <FiPlus />
                <span>Ajouter un produit</span>
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
              
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <FiGrid size={18} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <FiList size={18} />
                </button>
              </div>
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
                    Catégorie
                  </label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categoryOptions.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
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
                    Trier par
                  </label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option>Nom (A-Z)</option>
                    <option>Nom (Z-A)</option>
                    <option>Prix (croissant)</option>
                    <option>Prix (décroissant)</option>
                    <option>Les plus vendus</option>
                    <option>Date de création</option>
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
                  onClick={() => displaySuccessMessage('Filtres appliqués')}
                  className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  Appliquer les filtres
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Bulk Actions (visible when products are selected) */}
        {selectedProducts.length > 0 && (
          <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex justify-between items-center">
            <div className="text-indigo-800">
              <span className="font-medium">{selectedProducts.length}</span> produit(s) sélectionné(s)
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1.5 text-xs bg-amber-600 text-white rounded hover:bg-amber-700 transition flex items-center space-x-1">
                <FiTag />
                <span>Modifier catégorie</span>
              </button>
              <button className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 transition flex items-center space-x-1">
                <FiDollarSign />
                <span>Modifier prix</span>
              </button>
              <button 
                onClick={() => {
                  setSelectedProducts([]);
                  displaySuccessMessage(`${selectedProducts.length} produit(s) supprimé(s) avec succès`);
                }}
                className="px-3 py-1.5 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center space-x-1"
              >
                <FiTrash2 />
                <span>Supprimer</span>
              </button>
            </div>
          </div>
        )}

        {/* Products List/Grid View */}
        {viewMode === 'grid' ? (
          // GRID VIEW
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
                {/* Product Image */}
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.nom} 
                    className="w-full h-48 object-cover" 
                  />
                  <div className="absolute top-0 left-0 p-2">
                    <input
                      type="checkbox"
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                    />
                  </div>
                  <div className="absolute top-0 right-0 p-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(product.statut)}`}>
                      {product.statut}
                    </span>
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="p-4 flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {product.nom}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Réf: {product.reference}
                      </p>
                    </div>
                    <span className="text-lg font-bold text-indigo-700">
                      {product.prix}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="mt-3 flex items-center space-x-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {product.categorie}
                    </span>
                    <span className="text-xs text-gray-500">
                      Stock: {product.stock}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <FiBarChart2 className="mr-1" />
                    <span>{product.vendu} vendus</span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="border-t px-4 py-3 bg-gray-50 flex justify-between">
                  <div className="text-xs text-gray-500 flex items-center">
                    <FiClock className="mr-1" />
                    <span>Mis à jour: {product.dateMiseAJour}</span>
                  </div>
                  <div className="flex space-x-1">
                    <button 
                      className="p-1 text-indigo-600 hover:text-indigo-900 rounded-full hover:bg-indigo-50" 
                      title="Voir"
                    >
                      <FiEye size={16} />
                    </button>
                    <button 
                      className="p-1 text-blue-600 hover:text-blue-900 rounded-full hover:bg-blue-50" 
                      title="Modifier"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button 
                      className="p-1 text-red-600 hover:text-red-900 rounded-full hover:bg-red-50" 
                      title="Supprimer"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // LIST VIEW
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
                    <th 
                      scope="col" 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Produit
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Catégorie
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Prix
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Stock
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Statut
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Ventes
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Mis à jour
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            checked={selectedProducts.includes(product.id)}
                            onChange={() => handleSelectProduct(product.id)}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
                            <FiPackage className="text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.nom}
                            </div>
                            <div className="text-xs text-gray-500">
                              Réf: {product.reference}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {product.categorie}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.prix}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.stock}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(product.statut)}`}>
                          {product.statut}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.vendu}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.dateMiseAJour}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button 
                            className="p-1 text-indigo-600 hover:text-indigo-900" 
                            title="Voir"
                          >
                            <FiEye size={18} />
                          </button>
                          <button 
                            className="p-1 text-blue-600 hover:text-blue-900" 
                            title="Modifier"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button 
                            className="p-1 text-red-600 hover:text-red-900" 
                            title="Supprimer"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty state (List View) */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <FiBox className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun produit trouvé</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Aucun produit ne correspond à vos critères de recherche.
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

            {/* Pagination (List View) */}
            <nav 
              className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6" 
              aria-label="Pagination"
            >
              <div className="hidden sm:block">
                <p className="text-sm text-gray-700">
                  Affichage de <span className="font-medium">1</span> à <span className="font-medium">{filteredProducts.length}</span> sur <span className="font-medium">{products.length}</span> produits
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
        )}

        {/* Empty state (Grid View) */}
        {viewMode === 'grid' && filteredProducts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <FiBox className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun produit trouvé</h3>
            <p className="mt-1 text-sm text-gray-500">
              Aucun produit ne correspond à vos critères de recherche.
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
      </div>
    </motion.div>
  );
}
