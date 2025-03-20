'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiPercent, 
  FiEdit,
  FiSave,
  FiX,
  FiPlus,
  FiTrash2,
  FiInfo,
  // FiEye,
  FiSearch,
  FiFilter,
  FiCheck,
  FiChevronDown,
  FiSettings,
  FiAlertCircle,
  // FiDollarSign
} from 'react-icons/fi';

// Define types for tax data
interface TaxType {
  id: string;
  name: string;
  rate: number;
  description: string;
  type: 'percentage' | 'fixed';
  category: 'standard' | 'reduced' | 'special' | 'custom';
  isActive: boolean;
  appliesTo: string[];
  createdAt: string;
  updatedAt: string;
}

export default function Taxes() {
  // State for edit mode
  const [editMode, setEditMode] = useState<boolean>(false);
  
  // State for managing tax editing
  const [editingTax, setEditingTax] = useState<TaxType | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showFilterOptions, setShowFilterOptions] = useState<boolean>(false);
  
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'percentage' | 'fixed'>('all');
  
  // Sample tax data
  const [taxes, setTaxes] = useState<TaxType[]>([
    {
      id: 'tax-1',
      name: 'TVA Standard',
      rate: 20,
      description: 'Taux normal de TVA applicable à la majorité des biens et services',
      type: 'percentage',
      category: 'standard',
      isActive: true,
      appliesTo: ['Produits', 'Services'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: 'tax-2',
      name: 'TVA Intermédiaire',
      rate: 10,
      description: 'Taux intermédiaire applicable à la restauration, transport, etc.',
      type: 'percentage',
      category: 'reduced',
      isActive: true,
      appliesTo: ['Restauration', 'Transport'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: 'tax-3',
      name: 'TVA Réduite',
      rate: 5.5,
      description: 'Taux réduit applicable aux produits de première nécessité',
      type: 'percentage',
      category: 'reduced',
      isActive: true,
      appliesTo: ['Alimentation', 'Livres'],
      createdAt: '2024-01-15',
      updatedAt: '2024-02-10'
    },
    {
      id: 'tax-4',
      name: 'TVA Super Réduite',
      rate: 2.1,
      description: 'Taux particulier applicable à certains médicaments et presse',
      type: 'percentage',
      category: 'special',
      isActive: true,
      appliesTo: ['Médicaments', 'Presse'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: 'tax-5',
      name: 'Éco-contribution',
      rate: 0.5,
      description: 'Taxe environnementale sur certains produits électroniques',
      type: 'percentage',
      category: 'custom',
      isActive: true,
      appliesTo: ['Électronique'],
      createdAt: '2024-02-01',
      updatedAt: '2024-02-01'
    },
    {
      id: 'tax-6',
      name: 'Taxe de séjour',
      rate: 1.5,
      description: 'Taxe fixe par nuitée dans les établissements touristiques',
      type: 'fixed',
      category: 'custom',
      isActive: false,
      appliesTo: ['Hôtellerie'],
      createdAt: '2024-02-15',
      updatedAt: '2024-02-15'
    }
  ]);
  
  // Toggle edit mode
  const toggleEditMode = (): void => {
    setEditMode(!editMode);
    // Reset editing state when exiting edit mode
    if (editMode) {
      setEditingTax(null);
      setShowAddForm(false);
    }
  };
  
  // Filter taxes based on search and filters
  const filteredTaxes = taxes.filter(tax => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      tax.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tax.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Active status filter
    const matchesActive = 
      activeFilter === 'all' || 
      (activeFilter === 'active' && tax.isActive) || 
      (activeFilter === 'inactive' && !tax.isActive);
    
    // Type filter
    const matchesType = 
      typeFilter === 'all' || 
      typeFilter === tax.type;
    
    return matchesSearch && matchesActive && matchesType;
  });
  
  // Start editing a tax
  const handleEdit = (tax: TaxType): void => {
    setEditingTax({...tax});
    setShowAddForm(false);
  };
  
  // Start adding a new tax
  const handleAddNew = (): void => {
    setEditingTax(null);
    setShowAddForm(true);
  };
  
  // Cancel editing/adding
  const handleCancelEdit = (): void => {
    setEditingTax(null);
    setShowAddForm(false);
  };
  
  // Save edited tax
  const handleSaveTax = (): void => {
    if (editingTax) {
      setTaxes(taxes.map(tax => 
        tax.id === editingTax.id ? editingTax : tax
      ));
      setEditingTax(null);
    }
  };
  
  // Add new tax
  const handleAddTax = (newTax: Partial<TaxType>): void => {
    const now = new Date().toISOString().split('T')[0];
    
    const tax: TaxType = {
      id: `tax-${taxes.length + 1}`,
      name: newTax.name || 'Nouvelle taxe',
      rate: newTax.rate || 0,
      description: newTax.description || '',
      type: newTax.type || 'percentage',
      category: newTax.category || 'custom',
      isActive: newTax.isActive || true,
      appliesTo: newTax.appliesTo || [],
      createdAt: now,
      updatedAt: now
    };
    
    setTaxes([...taxes, tax]);
    setShowAddForm(false);
  };
  
  // Delete tax
  const handleDeleteTax = (id: string): void => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette taxe?')) {
      setTaxes(taxes.filter(tax => tax.id !== id));
    }
  };
  
  // Toggle tax active status
  const handleToggleActive = (id: string): void => {
    setTaxes(taxes.map(tax => 
      tax.id === id ? {...tax, isActive: !tax.isActive} : tax
    ));
  };
  
  // Handle input changes for editing tax
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    if (!editingTax) return;
    
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setEditingTax({
      ...editingTax,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseFloat(value) : value,
      updatedAt: new Date().toISOString().split('T')[0]
    });
  };
  
  // New tax form state
  const [newTax, setNewTax] = useState<Partial<TaxType>>({
    name: '',
    rate: 0,
    description: '',
    type: 'percentage',
    category: 'custom',
    isActive: true,
    appliesTo: []
  });
  
  // Handle input changes for new tax
  const handleNewTaxChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setNewTax({
      ...newTax,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseFloat(value) : value
    });
  };
  
  // Handle adding new applies to category
  const handleAddAppliesTo = (category: string): void => {
    if (editingTax) {
      if (!editingTax.appliesTo.includes(category)) {
        setEditingTax({
          ...editingTax,
          appliesTo: [...editingTax.appliesTo, category]
        });
      }
    } else {
      if (newTax.appliesTo && !newTax.appliesTo.includes(category)) {
        setNewTax({
          ...newTax,
          appliesTo: [...(newTax.appliesTo || []), category]
        });
      }
    }
  };
  
  // Handle removing applies to category
  const handleRemoveAppliesTo = (category: string): void => {
    if (editingTax) {
      setEditingTax({
        ...editingTax,
        appliesTo: editingTax.appliesTo.filter(c => c !== category)
      });
    } else {
      setNewTax({
        ...newTax,
        appliesTo: (newTax.appliesTo || []).filter(c => c !== category)
      });
    }
  };
  
  // Get appropriate badge color for tax category
  const getCategoryBadgeColor = (category: string): string => {
    switch (category) {
      case 'standard':
        return 'bg-blue-100 text-blue-800';
      case 'reduced':
        return 'bg-green-100 text-green-800';
      case 'special':
        return 'bg-purple-100 text-purple-800';
      case 'custom':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Format tax rate
  const formatTaxRate = (tax: TaxType): string => {
    return tax.type === 'percentage' 
      ? `${tax.rate}%` 
      : `${tax.rate}€`;
  };
  
  // Input field styling - black text as requested
  const getInputClass = (): string => {
    return `w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black`;
  };
  
  // Select field styling - black text as requested
  const getSelectClass = (): string => {
    return `w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black`;
  };
  
  // Textarea field styling - black text as requested
  const getTextareaClass = (): string => {
    return `w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black resize-none`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen bg-gray-50"
    >
      <div className="max-w-6xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8 pb-16">
        {/* Header */}
        <div className="flex justify-between items-center p-6 bg-white rounded-2xl shadow-xl">
          <div>
            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-3xl font-bold text-indigo-700 drop-shadow-md"
            >
              Taxes
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">
              Gérez les taxes et taux de TVA appliqués à vos produits et services
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {!editMode ? (
              <button 
                onClick={toggleEditMode}
                className="p-2 bg-indigo-100 rounded-lg hover:bg-indigo-200 transition-colors duration-200"
              >
                <FiEdit className="w-6 h-6 text-indigo-700" />
              </button>
            ) : (
              <div className="p-2 bg-amber-100 rounded-lg">
                <FiEdit className="w-6 h-6 text-indigo-700" />
              </div>
            )}
            <div className="p-2 bg-indigo-100 rounded-lg">
              <FiPercent className="w-6 h-6 text-indigo-700" />
            </div>
          </div>
        </div>

        {/* Edit Mode Banner */}
        {editMode && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg text-amber-800 flex justify-between items-center"
          >
            <div className="flex items-center">
              <FiInfo className="h-5 w-5 mr-2" />
              <span>Mode édition activé. Vous pouvez modifier les taxes et taux de TVA.</span>
            </div>
          </motion.div>
        )}
        
        {/* Tax Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-2">
              <div className="p-2 bg-blue-50 rounded-lg mr-3">
                <FiPercent className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-800">TVA Standard</h3>
            </div>
            <div className="text-3xl font-bold text-indigo-700">20%</div>
            <div className="text-sm text-gray-500 mt-1">Taux normal applicable par défaut</div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-2">
              <div className="p-2 bg-green-50 rounded-lg mr-3">
                <FiPercent className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-800">TVA Réduite</h3>
            </div>
            <div className="text-3xl font-bold text-indigo-700">5.5% - 10%</div>
            <div className="text-sm text-gray-500 mt-1">Taux réduits pour certains produits</div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-2">
              <div className="p-2 bg-indigo-50 rounded-lg mr-3">
                <FiSettings className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-800">Taxes actives</h3>
            </div>
            <div className="text-3xl font-bold text-indigo-700">
              {taxes.filter(tax => tax.isActive).length} / {taxes.length}
            </div>
            <div className="text-sm text-gray-500 mt-1">Taxes configurées et actives</div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg mr-4">
                <FiPercent className="w-5 h-5 text-indigo-700" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Liste des taxes</h2>
            </div>
            <p className="text-gray-500 text-sm mt-2 ml-11">
              Consultez et gérez toutes les taxes configurées pour votre entreprise
            </p>
          </div>
          
          {/* Search and Filters */}
          <div className="p-6 bg-gray-50 border-b border-gray-100">
            <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
              <div className="w-full md:w-64 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher une taxe..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-indigo-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex space-x-2">
                <div className="relative">
                  <button
                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-indigo-700"
                    onClick={() => setShowFilterOptions(!showFilterOptions)}
                  >
                    <FiFilter className="w-4 h-4" />
                    <span>Filtres</span>
                    <FiChevronDown className="w-4 h-4" />
                  </button>
                  
                  {showFilterOptions && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-xl z-10 border border-gray-200">
                      <div className="p-4">
                        <h3 className="font-medium text-gray-700 mb-2">Statut</h3>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="activeFilter"
                              checked={activeFilter === 'all'}
                              onChange={() => setActiveFilter('all')}
                              className="text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                            />
                            <span className="text-sm text-gray-700">Toutes</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="activeFilter"
                              checked={activeFilter === 'active'}
                              onChange={() => setActiveFilter('active')}
                              className="text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                            />
                            <span className="text-sm text-gray-700">Actives</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="activeFilter"
                              checked={activeFilter === 'inactive'}
                              onChange={() => setActiveFilter('inactive')}
                              className="text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                            />
                            <span className="text-sm text-gray-700">Inactives</span>
                          </label>
                        </div>
                        
                        <h3 className="font-medium text-gray-700 mt-4 mb-2">Type</h3>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="typeFilter"
                              checked={typeFilter === 'all'}
                              onChange={() => setTypeFilter('all')}
                              className="text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                            />
                            <span className="text-sm text-gray-700">Tous</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="typeFilter"
                              checked={typeFilter === 'percentage'}
                              onChange={() => setTypeFilter('percentage')}
                              className="text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                            />
                            <span className="text-sm text-gray-700">Pourcentage</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="typeFilter"
                              checked={typeFilter === 'fixed'}
                              onChange={() => setTypeFilter('fixed')}
                              className="text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                            />
                            <span className="text-sm text-gray-700">Montant fixe</span>
                          </label>
                        </div>
                      </div>
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
                        <button
                          className="px-4 py-2 text-sm text-indigo-600 hover:text-indigo-800"
                          onClick={() => {
                            setActiveFilter('all');
                            setTypeFilter('all');
                          }}
                        >
                          Réinitialiser
                        </button>
                        <button
                          className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                          onClick={() => setShowFilterOptions(false)}
                        >
                          Fermer
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                {editMode && (
                  <button
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    onClick={handleAddNew}
                    disabled={showAddForm}
                  >
                    <FiPlus className="w-4 h-4" />
                    <span>Ajouter une taxe</span>
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Add/Edit Form */}
          {(editingTax || showAddForm) && editMode && (
            <div className="p-6 border-b border-gray-200 bg-indigo-50">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                {editingTax ? 'Modifier la taxe' : 'Ajouter une nouvelle taxe'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de la taxe
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editingTax ? editingTax.name : newTax.name}
                    onChange={editingTax ? handleEditChange : handleNewTaxChange}
                    className={getInputClass()}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Taux
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      name="rate"
                      value={editingTax ? editingTax.rate : newTax.rate}
                      onChange={editingTax ? handleEditChange : handleNewTaxChange}
                      step="0.01"
                      min="0"
                      className={`${getInputClass()} rounded-r-none`}
                      required
                    />
                    <div className="px-4 py-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg flex items-center">
                      {editingTax ? 
                        (editingTax.type === 'percentage' ? '%' : '€') : 
                        (newTax.type === 'percentage' ? '%' : '€')}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    name="type"
                    value={editingTax ? editingTax.type : newTax.type}
                    onChange={editingTax ? handleEditChange : handleNewTaxChange}
                    className={getSelectClass()}
                  >
                    <option value="percentage">Pourcentage</option>
                    <option value="fixed">Montant fixe</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie
                  </label>
                  <select
                    name="category"
                    value={editingTax ? editingTax.category : newTax.category}
                    onChange={editingTax ? handleEditChange : handleNewTaxChange}
                    className={getSelectClass()}
                  >
                    <option value="standard">Standard</option>
                    <option value="reduced">Réduite</option>
                    <option value="special">Spéciale</option>
                    <option value="custom">Personnalisée</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={editingTax ? editingTax.description : newTax.description}
                    onChange={editingTax ? handleEditChange : handleNewTaxChange}
                    className={getTextareaClass()}
                    rows={3}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={editingTax ? editingTax.isActive : newTax.isActive}
                      onChange={editingTax ? handleEditChange : handleNewTaxChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Taxe active</span>
                  </label>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    S&apos;applique à
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(editingTax ? editingTax.appliesTo : newTax.appliesTo || []).map(category => (
                      <div key={category} className="bg-gray-100 px-3 py-1 rounded-full flex items-center text-sm">
                        <span className="text-gray-800">{category}</span>
                        <button
                          type="button"
                          className="ml-2 text-gray-500 hover:text-red-500"
                          onClick={() => handleRemoveAppliesTo(category)}
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <select
                      className={`${getSelectClass()} max-w-xs`}
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAddAppliesTo(e.target.value);
                          e.target.value = '';
                        }
                      }}
                    >
                      <option value="">Ajouter une catégorie...</option>
                      <option value="Produits">Produits</option>
                      <option value="Services">Services</option>
                      <option value="Alimentation">Alimentation</option>
                      <option value="Livres">Livres</option>
                      <option value="Restauration">Restauration</option>
                      <option value="Transport">Transport</option>
                      <option value="Médicaments">Médicaments</option>
                      <option value="Presse">Presse</option>
                      <option value="Électronique">Électronique</option>
                      <option value="Hôtellerie">Hôtellerie</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center space-x-2"
                >
                  <FiX className="w-5 h-5" />
                  <span>Annuler</span>
                </button>
                
                <button
                  type="button"
                  onClick={editingTax ? handleSaveTax : () => handleAddTax(newTax)}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center space-x-2"
                >
                  <FiSave className="w-5 h-5" />
                  <span>{editingTax ? 'Enregistrer' : 'Ajouter'}</span>
                </button>
              </div>
            </div>
          )}
          
          {/* Tax Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taux</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  {editMode && (
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTaxes.length > 0 ? (
                  filteredTaxes.map(tax => (
                    <tr key={tax.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-indigo-700">
                        <div className="font-medium">{tax.name}</div>
                        <div className="text-xs text-gray-500">
                          {tax.type === 'percentage' ? 'Pourcentage' : 'Montant fixe'}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-lg font-bold text-black">{formatTaxRate(tax)}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-black max-w-sm truncate">
                          {tax.description}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          <span className="inline-flex items-center">
                            <FiInfo className="mr-1 w-3 h-3" />
                            S&apos;applique à: {tax.appliesTo.join(', ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadgeColor(tax.category)}`}>
                          {tax.category === 'standard' && 'Standard'}
                          {tax.category === 'reduced' && 'Réduite'}
                          {tax.category === 'special' && 'Spéciale'}
                          {tax.category === 'custom' && 'Personnalisée'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tax.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {tax.isActive ? (
                            <>
                              <FiCheck className="mr-1 w-3 h-3" />
                              Actif
                            </>
                          ) : (
                            <>
                              <FiX className="mr-1 w-3 h-3" />
                              Inactif
                            </>
                          )}
                        </span>
                      </td>
                      {editMode && (
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button 
                              onClick={() => handleToggleActive(tax.id)}
                              className={`p-1.5 ${tax.isActive ? 'text-green-600 hover:text-green-800' : 'text-red-600 hover:text-red-800'} rounded hover:bg-gray-100`}
                              title={tax.isActive ? 'Désactiver' : 'Activer'}
                            >
                              {tax.isActive ? <FiX className="w-4 h-4" /> : <FiCheck className="w-4 h-4" />}
                            </button>
                            <button 
                              onClick={() => handleEdit(tax)}
                              className="p-1.5 text-blue-600 hover:text-blue-800 rounded hover:bg-gray-100"
                              title="Modifier"
                            >
                              <FiEdit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteTax(tax.id)}
                              className="p-1.5 text-red-600 hover:text-red-800 rounded hover:bg-gray-100"
                              title="Supprimer"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={editMode ? 6 : 5} className="px-4 py-8 text-center text-gray-500">
                      <FiAlertCircle className="w-6 h-6 mx-auto mb-2" />
                      <div>Aucune taxe trouvée</div>
                      <div className="text-sm">Essayez de modifier vos filtres ou créez une nouvelle taxe</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Info Box */}
          <div className="p-6 border-t border-gray-200">
            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="flex items-start">
                <div className="p-1.5 bg-blue-100 rounded-lg mr-3 mt-0.5">
                  <FiInfo className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-blue-800 mb-1">
                    À propos des taxes
                  </h3>
                  <p className="text-xs text-blue-700">
                    La configuration correcte des taxes est essentielle pour la facturation. En France, 
                    les taux de TVA standards sont de 20% (taux normal), 10% (taux intermédiaire), 
                    5,5% (taux réduit) et 2,1% (taux particulier). 
                    Assurez-vous de configurer les taux appropriés pour vos produits et services 
                    conformément à la législation en vigueur.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
