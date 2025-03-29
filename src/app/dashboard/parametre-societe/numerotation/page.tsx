'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiHash, 
  FiSave,
  FiX,
  FiInfo,
  FiFileText,
  FiBox,
  FiUsers,
  FiGrid
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
    // Show success message
    alert('Paramètres de numérotation mis à jour avec succès!');
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
    }
  };
  
  // Input field styling - always editable now
  const getInputClass = (): string => {
    return `w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black`;
  };
  
  // Prefix input field styling - always editable now
  const getPrefixInputClass = (): string => {
    return `w-24 p-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black`;
  };
  
  // Number input field styling - always editable now
  const getNumberInputClass = (): string => {
    return `w-32 p-3 border-t border-b border-r border-gray-300 rounded-r-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black`;
  };
  
  // Select field styling - always editable now
  const getSelectClass = (): string => {
    return `w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black`;
  };
  
  // Checkbox field styling
  const getCheckboxContainerClass = (): string => {
    return `flex items-center space-x-2`;
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
      <div className="max-w-6xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8 pb-16">
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
                    <FiHash className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-800 to-indigo-500">
                    Numérotation
                  </h1>
                </div>
                
                <p className="text-base text-gray-600 leading-relaxed">
                  Paramètres de numérotation des documents et compteurs. Définissez les règles de numérotation pour vos documents de vente et autres éléments.
                </p>
              </div>
            </div>
            
            {/* Quick tip */}
            <div className="mt-6 flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl text-sm">
              <FiInfo className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-amber-700">Astuce :</span>{' '}
                <span className="text-amber-700">
                  Tous les champs sont directement modifiables. N&apos;oubliez pas d&apos;enregistrer vos modifications en cliquant sur le bouton &quot;Enregistrer les modifications&quot;.
                </span>
              </div>
            </div>
          </div>
        </motion.div>

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
                              maxLength={5}
                              placeholder="Préfixe"
                            />
                            <input
                              type="text"
                              name="factureNumber"
                              value={venteFormData.factureNumber}
                              onChange={handleVenteInputChange}
                              className={getNumberInputClass()}
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
                              maxLength={5}
                              placeholder="Préfixe"
                            />
                            <input
                              type="text"
                              name="avoirNumber"
                              value={venteFormData.avoirNumber}
                              onChange={handleVenteInputChange}
                              className={getNumberInputClass()}
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
                              maxLength={5}
                              placeholder="Préfixe"
                            />
                            <input
                              type="text"
                              name="factureAcompteNumber"
                              value={venteFormData.factureAcompteNumber}
                              onChange={handleVenteInputChange}
                              className={getNumberInputClass()}
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
                              maxLength={5}
                              placeholder="Préfixe"
                            />
                            <input
                              type="text"
                              name="avoirAcompteNumber"
                              value={venteFormData.avoirAcompteNumber}
                              onChange={handleVenteInputChange}
                              className={getNumberInputClass()}
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
                            maxLength={5}
                            placeholder="Préfixe"
                          />
                          <input
                            type="text"
                            name="devisNumber"
                            value={venteFormData.devisNumber}
                            onChange={handleVenteInputChange}
                            className={getNumberInputClass()}
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
            
            {/* Form Actions - now always visible */}
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
          </form>
        </div>
      </div>
    </motion.div>
  );
}
