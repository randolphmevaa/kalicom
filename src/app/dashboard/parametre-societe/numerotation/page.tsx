'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiHash, 
  FiEdit,
  FiSave,
  FiX,
  FiInfo,
  FiFileText,
  // FiSettings,
  FiBox,
  FiUsers,
  // FiCreditCard,
  FiGrid,
  // FiCheck
} from 'react-icons/fi';

// Interface for form data
interface VenteFormDataType {
  serie: string;
  methodeNumeration: string;
  facturePrefix: string;
  factureNumber: string;
  factureUseCounter: boolean;
  avoirPrefix: string;
  avoirNumber: string;
  avoirUseCounter: boolean;
  factureAcomptePrefix: string;
  factureAcompteNumber: string;
  factureAcompteUseCounter: boolean;
  avoirAcomptePrefix: string;
  avoirAcompteNumber: string;
  avoirAcompteUseCounter: boolean;
  devisPrefix: string;
  devisNumber: string;
  devisUseCounter: boolean;
  afficherOngletFactures: boolean;
}

interface AutreFormDataType {
  // Articles
  articlesMethode: string;
  articlesCode: string;
  articlesLongueur: string;
  
  // Clients
  clientsMethode: string;
  clientsCode: string;
  clientsLongueur: string;
  
  // Other counters
  famillesArticlesCode: string;
  famillesArticlesUseCounter: boolean;
  famillesClientsCode: string;
  famillesClientsUseCounter: boolean;
  ecoContributionCode: string;
  ecoContributionUseCounter: boolean;
  intervenantsCode: string;
  intervenantsUseCounter: boolean;
  referenceReglementCode: string;
  referenceReglementUseCounter: boolean;
}

export default function Numerotation() {
  // State for active tab
  const [activeTab, setActiveTab] = useState<'vente' | 'autre'>('vente');
  
  // State for edit mode
  const [editMode, setEditMode] = useState<boolean>(false);
  
  // State for Vente form data
  const [venteFormData, setVenteFormData] = useState<VenteFormDataType>({
    serie: 'principale',
    methodeNumeration: 'distinctes',
    facturePrefix: 'FACT',
    factureNumber: '00001',
    factureUseCounter: true,
    avoirPrefix: 'AV',
    avoirNumber: '00001',
    avoirUseCounter: true,
    factureAcomptePrefix: 'FA',
    factureAcompteNumber: '00001',
    factureAcompteUseCounter: true,
    avoirAcomptePrefix: 'AA',
    avoirAcompteNumber: '00001',
    avoirAcompteUseCounter: true,
    devisPrefix: 'DEV',
    devisNumber: '00001',
    devisUseCounter: true,
    afficherOngletFactures: true
  });
  
  // State for Autre form data
  const [autreFormData, setAutreFormData] = useState<AutreFormDataType>({
    articlesMethode: 'compteur',
    articlesCode: 'ART',
    articlesLongueur: '5',
    
    clientsMethode: 'compteur',
    clientsCode: 'CLI',
    clientsLongueur: '5',
    
    famillesArticlesCode: 'FAM',
    famillesArticlesUseCounter: true,
    famillesClientsCode: 'FCL',
    famillesClientsUseCounter: true,
    ecoContributionCode: 'ECO',
    ecoContributionUseCounter: true,
    intervenantsCode: 'INT',
    intervenantsUseCounter: true,
    referenceReglementCode: 'REG',
    referenceReglementUseCounter: true
  });
  
  // Options for dropdowns
  const serieOptions = [
    { value: 'principale', label: 'Série principale' },
    { value: 'secondaire', label: 'Série secondaire' },
    { value: 'export', label: 'Export' }
  ];
  
  const methodeNumerationOptions = [
    { value: 'distinctes', label: 'Numérotations distinctes' },
    { value: 'commune', label: 'Numérotation commune' },
    { value: 'personnalisee', label: 'Numérotation personnalisée' }
  ];
  
  const methodeCodificationOptions = [
    { value: 'compteur', label: 'Compteur' },
    { value: 'manuel', label: 'Manuel' },
    { value: 'auto', label: 'Auto-généré' }
  ];
  
  // Toggle edit mode
  const toggleEditMode = (): void => {
    setEditMode(!editMode);
  };
  
  // Handle input changes for Vente form
  const handleVenteInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setVenteFormData({
      ...venteFormData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle input changes for Autre form
  const handleAutreInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setAutreFormData({
      ...autreFormData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Vente Form submitted:', venteFormData);
    console.log('Autre Form submitted:', autreFormData);
    // Show success message and exit edit mode
    alert('Paramètres de numérotation mis à jour avec succès!');
    setEditMode(false);
  };
  
  // Handle form reset
  const handleReset = (): void => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler les modifications?')) {
      // Reset to original data (you would fetch this from your backend in a real app)
      setVenteFormData({
        serie: 'principale',
        methodeNumeration: 'distinctes',
        facturePrefix: 'FACT',
        factureNumber: '00001',
        factureUseCounter: true,
        avoirPrefix: 'AV',
        avoirNumber: '00001',
        avoirUseCounter: true,
        factureAcomptePrefix: 'FA',
        factureAcompteNumber: '00001',
        factureAcompteUseCounter: true,
        avoirAcomptePrefix: 'AA',
        avoirAcompteNumber: '00001',
        avoirAcompteUseCounter: true,
        devisPrefix: 'DEV',
        devisNumber: '00001',
        devisUseCounter: true,
        afficherOngletFactures: true
      });
      
      setAutreFormData({
        articlesMethode: 'compteur',
        articlesCode: 'ART',
        articlesLongueur: '5',
        
        clientsMethode: 'compteur',
        clientsCode: 'CLI',
        clientsLongueur: '5',
        
        famillesArticlesCode: 'FAM',
        famillesArticlesUseCounter: true,
        famillesClientsCode: 'FCL',
        famillesClientsUseCounter: true,
        ecoContributionCode: 'ECO',
        ecoContributionUseCounter: true,
        intervenantsCode: 'INT',
        intervenantsUseCounter: true,
        referenceReglementCode: 'REG',
        referenceReglementUseCounter: true
      });
      
      setEditMode(false);
    }
  };
  
  // Input field styling based on edit mode
  const getInputClass = (): string => {
    return `w-full p-3 border ${editMode ? 'border-gray-300' : 'border-gray-100 bg-gray-50'} rounded-lg ${editMode ? 'focus:ring-2 focus:ring-indigo-500 focus:border-transparent' : ''} text-black`;
  };
  
  // Prefix input field styling
  const getPrefixInputClass = (): string => {
    return `w-24 p-3 border ${editMode ? 'border-gray-300' : 'border-gray-100 bg-gray-50'} rounded-l-lg ${editMode ? 'focus:ring-2 focus:ring-indigo-500 focus:border-transparent' : ''} text-black`;
  };
  
  // Number input field styling
  const getNumberInputClass = (): string => {
    return `w-32 p-3 border-t border-b border-r ${editMode ? 'border-gray-300' : 'border-gray-100 bg-gray-50'} rounded-r-lg ${editMode ? 'focus:ring-2 focus:ring-indigo-500 focus:border-transparent' : ''} text-black`;
  };
  
  // Select field styling based on edit mode
  const getSelectClass = (): string => {
    return `w-full p-3 border ${editMode ? 'border-gray-300' : 'border-gray-100 bg-gray-50'} rounded-lg ${editMode ? 'focus:ring-2 focus:ring-indigo-500 focus:border-transparent' : ''} text-black`;
  };
  
  // Checkbox field styling
  const getCheckboxContainerClass = (): string => {
    return `flex items-center space-x-2 ${!editMode ? 'opacity-75' : ''}`;
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
              Numérotation
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">
              Paramètres de numérotation des documents et compteurs
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {!editMode ? (
              <button 
                onClick={toggleEditMode}
                className="p-2 bg-indigo-100 rounded-lg hover:bg-indigo-200 transition-colors duration-200"
              >
                <FiEdit className="w-6 h-6 text-indigo-600" />
              </button>
            ) : (
              <div className="p-2 bg-amber-100 rounded-lg">
                <FiEdit className="w-6 h-6 text-amber-600" />
              </div>
            )}
            <div className="p-2 bg-indigo-100 rounded-lg">
              <FiHash className="w-6 h-6 text-indigo-600" />
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
              <span>Mode édition activé. Vous pouvez modifier les paramètres de numérotation.</span>
            </div>
          </motion.div>
        )}

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg mr-4">
                <FiHash className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Paramètres de numérotation</h2>
            </div>
            <p className="text-gray-500 text-sm mt-2 ml-11">
              Vous pouvez spécifier le prochain numéro pour chaque type de documents de vente
            </p>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button 
                className={`py-4 px-8 text-sm font-medium transition-colors duration-150 ${
                  activeTab === 'vente' 
                    ? 'text-indigo-700 border-b-2 border-indigo-500' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('vente')}
              >
                Vente
              </button>
              <button 
                className={`py-4 px-8 text-sm font-medium transition-colors duration-150 ${
                  activeTab === 'autre' 
                    ? 'text-indigo-700 border-b-2 border-indigo-500' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('autre')}
              >
                Autre
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* Tab Content */}
            <div className="p-6">
              {/* Vente Tab */}
              {activeTab === 'vente' && (
                <div className="space-y-8">
                  {/* Série Dropdown */}
                  <div className="max-w-md">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Série
                    </label>
                    <select
                      name="serie"
                      value={venteFormData.serie}
                      onChange={handleVenteInputChange}
                      className={getSelectClass()}
                      disabled={!editMode}
                    >
                      {serieOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      Sélectionnez la série pour laquelle vous souhaitez configurer la numérotation
                    </p>
                  </div>
                  
                  {/* Factures/Avoirs/Acomptes Section */}
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                      <FiFileText className="mr-2 text-indigo-600" />
                      Factures/Avoirs/Acomptes
                    </h3>
                    
                    {/* Méthode de numérotation */}
                    <div className="mb-6 max-w-md">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Méthode de numérotation
                      </label>
                      <select
                        name="methodeNumeration"
                        value={venteFormData.methodeNumeration}
                        onChange={handleVenteInputChange}
                        className={getSelectClass()}
                        disabled={!editMode}
                      >
                        {methodeNumerationOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Document Number Groups */}
                    <div className="space-y-6">
                      {/* Facture */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Facture
                        </label>
                        <div className="flex items-center space-x-4">
                          <div className="flex">
                            <input
                              type="text"
                              name="facturePrefix"
                              value={venteFormData.facturePrefix}
                              onChange={handleVenteInputChange}
                              className={getPrefixInputClass()}
                              disabled={!editMode}
                              maxLength={5}
                              placeholder="Préfixe"
                            />
                            <input
                              type="text"
                              name="factureNumber"
                              value={venteFormData.factureNumber}
                              onChange={handleVenteInputChange}
                              className={getNumberInputClass()}
                              disabled={!editMode}
                              placeholder="Numéro"
                            />
                          </div>
                          <div className={getCheckboxContainerClass()}>
                            <input
                              type="checkbox"
                              id="factureUseCounter"
                              name="factureUseCounter"
                              checked={venteFormData.factureUseCounter}
                              onChange={handleVenteInputChange}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              disabled={!editMode}
                            />
                            <label htmlFor="factureUseCounter" className="text-sm text-gray-700">
                              Utiliser le compteur
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      {/* Avoir */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Avoir
                        </label>
                        <div className="flex items-center space-x-4">
                          <div className="flex">
                            <input
                              type="text"
                              name="avoirPrefix"
                              value={venteFormData.avoirPrefix}
                              onChange={handleVenteInputChange}
                              className={getPrefixInputClass()}
                              disabled={!editMode}
                              maxLength={5}
                              placeholder="Préfixe"
                            />
                            <input
                              type="text"
                              name="avoirNumber"
                              value={venteFormData.avoirNumber}
                              onChange={handleVenteInputChange}
                              className={getNumberInputClass()}
                              disabled={!editMode}
                              placeholder="Numéro"
                            />
                          </div>
                          <div className={getCheckboxContainerClass()}>
                            <input
                              type="checkbox"
                              id="avoirUseCounter"
                              name="avoirUseCounter"
                              checked={venteFormData.avoirUseCounter}
                              onChange={handleVenteInputChange}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              disabled={!editMode}
                            />
                            <label htmlFor="avoirUseCounter" className="text-sm text-gray-700">
                              Utiliser le compteur
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      {/* Facture d'acompte */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Facture d&apos;acompte
                        </label>
                        <div className="flex items-center space-x-4">
                          <div className="flex">
                            <input
                              type="text"
                              name="factureAcomptePrefix"
                              value={venteFormData.factureAcomptePrefix}
                              onChange={handleVenteInputChange}
                              className={getPrefixInputClass()}
                              disabled={!editMode}
                              maxLength={5}
                              placeholder="Préfixe"
                            />
                            <input
                              type="text"
                              name="factureAcompteNumber"
                              value={venteFormData.factureAcompteNumber}
                              onChange={handleVenteInputChange}
                              className={getNumberInputClass()}
                              disabled={!editMode}
                              placeholder="Numéro"
                            />
                          </div>
                          <div className={getCheckboxContainerClass()}>
                            <input
                              type="checkbox"
                              id="factureAcompteUseCounter"
                              name="factureAcompteUseCounter"
                              checked={venteFormData.factureAcompteUseCounter}
                              onChange={handleVenteInputChange}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              disabled={!editMode}
                            />
                            <label htmlFor="factureAcompteUseCounter" className="text-sm text-gray-700">
                              Utiliser le compteur
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      {/* Avoir d'acompte */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Avoir d&apos;acompte
                        </label>
                        <div className="flex items-center space-x-4">
                          <div className="flex">
                            <input
                              type="text"
                              name="avoirAcomptePrefix"
                              value={venteFormData.avoirAcomptePrefix}
                              onChange={handleVenteInputChange}
                              className={getPrefixInputClass()}
                              disabled={!editMode}
                              maxLength={5}
                              placeholder="Préfixe"
                            />
                            <input
                              type="text"
                              name="avoirAcompteNumber"
                              value={venteFormData.avoirAcompteNumber}
                              onChange={handleVenteInputChange}
                              className={getNumberInputClass()}
                              disabled={!editMode}
                              placeholder="Numéro"
                            />
                          </div>
                          <div className={getCheckboxContainerClass()}>
                            <input
                              type="checkbox"
                              id="avoirAcompteUseCounter"
                              name="avoirAcompteUseCounter"
                              checked={venteFormData.avoirAcompteUseCounter}
                              onChange={handleVenteInputChange}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              disabled={!editMode}
                            />
                            <label htmlFor="avoirAcompteUseCounter" className="text-sm text-gray-700">
                              Utiliser le compteur
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Devis Section */}
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                      <FiFileText className="mr-2 text-indigo-600" />
                      Devis
                    </h3>
                    
                    {/* Devis */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Devis
                      </label>
                      <div className="flex items-center space-x-4">
                        <div className="flex">
                          <input
                            type="text"
                            name="devisPrefix"
                            value={venteFormData.devisPrefix}
                            onChange={handleVenteInputChange}
                            className={getPrefixInputClass()}
                            disabled={!editMode}
                            maxLength={5}
                            placeholder="Préfixe"
                          />
                          <input
                            type="text"
                            name="devisNumber"
                            value={venteFormData.devisNumber}
                            onChange={handleVenteInputChange}
                            className={getNumberInputClass()}
                            disabled={!editMode}
                            placeholder="Numéro"
                          />
                        </div>
                        <div className={getCheckboxContainerClass()}>
                          <input
                            type="checkbox"
                            id="devisUseCounter"
                            name="devisUseCounter"
                            checked={venteFormData.devisUseCounter}
                            onChange={handleVenteInputChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            disabled={!editMode}
                          />
                          <label htmlFor="devisUseCounter" className="text-sm text-gray-700">
                            Utiliser le compteur
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Display Tab Checkbox */}
                  <div className={getCheckboxContainerClass()}>
                    <input
                      type="checkbox"
                      id="afficherOngletFactures"
                      name="afficherOngletFactures"
                      checked={venteFormData.afficherOngletFactures}
                      onChange={handleVenteInputChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      disabled={!editMode}
                    />
                    <label htmlFor="afficherOngletFactures" className="text-sm text-gray-700">
                      Afficher l&apos;onglet Factures/Avoirs/Acomptes
                    </label>
                  </div>
                </div>
              )}
              
              {/* Autre Tab */}
              {activeTab === 'autre' && (
                <div className="space-y-8">
                  {/* Articles Section */}
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                      <FiBox className="mr-2 text-indigo-600" />
                      Articles
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Méthode de codification */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Méthode de codification
                        </label>
                        <select
                          name="articlesMethode"
                          value={autreFormData.articlesMethode}
                          onChange={handleAutreInputChange}
                          className={getSelectClass()}
                          disabled={!editMode}
                        >
                          {methodeCodificationOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Code */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Code
                        </label>
                        <input
                          type="text"
                          name="articlesCode"
                          value={autreFormData.articlesCode}
                          onChange={handleAutreInputChange}
                          className={getInputClass()}
                          disabled={!editMode}
                          maxLength={5}
                        />
                      </div>
                      
                      {/* Longueur du code */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Longueur du code
                        </label>
                        <input
                          type="number"
                          name="articlesLongueur"
                          value={autreFormData.articlesLongueur}
                          onChange={handleAutreInputChange}
                          className={getInputClass()}
                          disabled={!editMode}
                          min="1"
                          max="10"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Clients Section */}
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                      <FiUsers className="mr-2 text-indigo-600" />
                      Clients
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Méthode de codification */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Méthode de codification
                        </label>
                        <select
                          name="clientsMethode"
                          value={autreFormData.clientsMethode}
                          onChange={handleAutreInputChange}
                          className={getSelectClass()}
                          disabled={!editMode}
                        >
                          {methodeCodificationOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Code */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Code
                        </label>
                        <input
                          type="text"
                          name="clientsCode"
                          value={autreFormData.clientsCode}
                          onChange={handleAutreInputChange}
                          className={getInputClass()}
                          disabled={!editMode}
                          maxLength={5}
                        />
                      </div>
                      
                      {/* Longueur du code */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Longueur du code
                        </label>
                        <input
                          type="number"
                          name="clientsLongueur"
                          value={autreFormData.clientsLongueur}
                          onChange={handleAutreInputChange}
                          className={getInputClass()}
                          disabled={!editMode}
                          min="1"
                          max="10"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Other Counters Section */}
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                      <FiGrid className="mr-2 text-indigo-600" />
                      Autres compteurs
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Familles d'articles */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Familles d&apos;articles
                        </label>
                        <div className="flex items-center space-x-4">
                          <input
                            type="text"
                            name="famillesArticlesCode"
                            value={autreFormData.famillesArticlesCode}
                            onChange={handleAutreInputChange}
                            className={`${getInputClass()} max-w-xs`}
                            disabled={!editMode}
                            maxLength={5}
                          />
                          <div className={getCheckboxContainerClass()}>
                            <input
                              type="checkbox"
                              id="famillesArticlesUseCounter"
                              name="famillesArticlesUseCounter"
                              checked={autreFormData.famillesArticlesUseCounter}
                              onChange={handleAutreInputChange}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              disabled={!editMode}
                            />
                            <label htmlFor="famillesArticlesUseCounter" className="text-sm text-gray-700">
                              Utiliser le compteur
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      {/* Familles clients */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Familles clients
                        </label>
                        <div className="flex items-center space-x-4">
                          <input
                            type="text"
                            name="famillesClientsCode"
                            value={autreFormData.famillesClientsCode}
                            onChange={handleAutreInputChange}
                            className={`${getInputClass()} max-w-xs`}
                            disabled={!editMode}
                            maxLength={5}
                          />
                          <div className={getCheckboxContainerClass()}>
                            <input
                              type="checkbox"
                              id="famillesClientsUseCounter"
                              name="famillesClientsUseCounter"
                              checked={autreFormData.famillesClientsUseCounter}
                              onChange={handleAutreInputChange}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              disabled={!editMode}
                            />
                            <label htmlFor="famillesClientsUseCounter" className="text-sm text-gray-700">
                              Utiliser le compteur
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      {/* Eco-contribution DEEE */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Eco-contribution DEEE
                        </label>
                        <div className="flex items-center space-x-4">
                          <input
                            type="text"
                            name="ecoContributionCode"
                            value={autreFormData.ecoContributionCode}
                            onChange={handleAutreInputChange}
                            className={`${getInputClass()} max-w-xs`}
                            disabled={!editMode}
                            maxLength={5}
                          />
                          <div className={getCheckboxContainerClass()}>
                            <input
                              type="checkbox"
                              id="ecoContributionUseCounter"
                              name="ecoContributionUseCounter"
                              checked={autreFormData.ecoContributionUseCounter}
                              onChange={handleAutreInputChange}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              disabled={!editMode}
                            />
                            <label htmlFor="ecoContributionUseCounter" className="text-sm text-gray-700">
                              Utiliser le compteur
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      {/* Intervenants */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Intervenants
                        </label>
                        <div className="flex items-center space-x-4">
                          <input
                            type="text"
                            name="intervenantsCode"
                            value={autreFormData.intervenantsCode}
                            onChange={handleAutreInputChange}
                            className={`${getInputClass()} max-w-xs`}
                            disabled={!editMode}
                            maxLength={5}
                          />
                          <div className={getCheckboxContainerClass()}>
                            <input
                              type="checkbox"
                              id="intervenantsUseCounter"
                              name="intervenantsUseCounter"
                              checked={autreFormData.intervenantsUseCounter}
                              onChange={handleAutreInputChange}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              disabled={!editMode}
                            />
                            <label htmlFor="intervenantsUseCounter" className="text-sm text-gray-700">
                              Utiliser le compteur
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      {/* Référence de règlement */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Référence de règlement
                        </label>
                        <div className="flex items-center space-x-4">
                          <input
                            type="text"
                            name="referenceReglementCode"
                            value={autreFormData.referenceReglementCode}
                            onChange={handleAutreInputChange}
                            className={`${getInputClass()} max-w-xs`}
                            disabled={!editMode}
                            maxLength={5}
                          />
                          <div className={getCheckboxContainerClass()}>
                            <input
                              type="checkbox"
                              id="referenceReglementUseCounter"
                              name="referenceReglementUseCounter"
                              checked={autreFormData.referenceReglementUseCounter}
                              onChange={handleAutreInputChange}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              disabled={!editMode}
                            />
                            <label htmlFor="referenceReglementUseCounter" className="text-sm text-gray-700">
                              Utiliser le compteur
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Info Box */}
              <div className="mt-8 bg-blue-50 p-4 rounded-xl">
                <div className="flex items-start">
                  <div className="p-1.5 bg-blue-100 rounded-lg mr-3 mt-0.5">
                    <FiInfo className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-blue-800 mb-1">
                      Informations sur la numérotation
                    </h3>
                    <p className="text-xs text-blue-700">
                      La numérotation des documents est essentielle pour assurer un suivi efficace. 
                      Vous pouvez paramétrer un préfixe (ex: FACT) et un numéro de départ pour chaque type de document. 
                      Le compteur s&apos;incrémentera automatiquement à chaque nouvelle création si l&apos;option &quot;Utiliser le compteur&quot; est activée.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Form Actions */}
            {editMode && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-end space-x-4 p-6 bg-gray-50 border-t border-gray-200"
              >
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center space-x-2"
                >
                  <FiX className="w-5 h-5" />
                  <span>Annuler</span>
                </button>
                
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center space-x-2"
                >
                  <FiSave className="w-5 h-5" />
                  <span>Enregistrer les modifications</span>
                </button>
              </motion.div>
            )}
          </form>
        </div>
      </div>
    </motion.div>
  );
}
