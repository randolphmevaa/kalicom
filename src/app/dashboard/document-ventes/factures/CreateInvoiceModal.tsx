import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, 
  FiSave, 
  FiFileText,
} from 'react-icons/fi';
import { FaEuroSign } from "react-icons/fa";

// Import types and sample data
import { sampleClients } from './types';

// Import hooks
import { useFormData } from './hooks/useFormData';
import { useLineItems } from './hooks/useLineItems';
import { usePaymentSchedule } from './hooks/usePaymentSchedule';
import { useTotals } from './hooks/useTotals';
import { 
  useModalState, 
  useTabState,
  useClientSelectionState, 
  useSaveConfirmation 
} from './hooks/useModalState';
import { 
  // CreateCreditNoteModalProps,
  Client,  // Add this if it doesn't exist
  // Invoice  // Add this if it doesn't exist
} from './types/creditNote';

// Import components
import ClientSelection from './components/ClientSelection';
import LineItems from './components/LineItems';
import PaymentSchedule from './components/PaymentSchedule';
import InvoiceTotals from './components/InvoiceTotals';
import TabNavigation from './components/TabNavigation';
import SaveConfirmation from './components/SaveConfirmation';
import ClientAddModal from './components/modals/ClientAddModal';
import ArticleSelectionModal from './components/modals/ArticleSelectionModal';

// Import types
import { CreateInvoiceModalProps } from './types';

// Modal component for creating a new invoice
const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({ isOpen, onClose }) => {
  // Custom hooks for state management
  const { formData, handleInputChange, populateFromClient } = useFormData();
  const { 
    lineItems, 
    handleLineItemChange, 
    addLineItem, 
    removeLineItem, 
    openArticleSelection,
    selectArticle,
    updateLineItemsWithCalculatedAmounts,
    lineItemsDependencies,
    // selectedLineId
  } = useLineItems();
  
  const { totals, updateTotalField, calculateTotals, totalsDependencies } = useTotals(lineItems);
  
  const {
    paymentSchedule,
    handlePaymentScheduleChange,
    addPaymentSchedule,
    removePaymentSchedule,
    markPaymentComplete,
    calculatePaymentScheduleTotal,
    calculateDifference,
    isPaymentScheduleBalanced
  } = usePaymentSchedule(totals.totalTTC);
  
  // Tab state
  const { activeTab, setActiveTab } = useTabState();
  
  // Modal state hooks
  const articleSelectionModal = useModalState(false);
  const clientAddModal = useModalState(false);
  const { showSaveConfirmation, handleSaveInvoice } = useSaveConfirmation(onClose);
  
  // Client selection state
  const { 
    showClientDropdown, 
    clientSearch, 
    clientType,
    setClientType, 
    setClientSearch,
    openDropdown,
    closeDropdown,
    handleSearchChange,
    // setClientTypeAndCloseDropdown 
  } = useClientSelectionState();

  // Calculate totals when line items change
  useEffect(() => {
    updateLineItemsWithCalculatedAmounts();
    calculateTotals();
  }, [
    lineItemsDependencies.prices,
    lineItemsDependencies.quantities,
    lineItemsDependencies.discounts,
    totalsDependencies.portHT,
    totalsDependencies.tvaPort,
    totalsDependencies.pourcentageRemise,
    totalsDependencies.pourcentageAcompte,
    updateLineItemsWithCalculatedAmounts,
    calculateTotals
  ]);

  // Filter clients based on search term
  const filteredClients = useMemo(() => {
    return sampleClients.filter(client => 
      client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
      client.id.toLowerCase().includes(clientSearch.toLowerCase())
    );
  }, [clientSearch]);

  // Handle client selection
  const handleSelectClient = (client: Client) => {
    populateFromClient(client);
    setClientSearch(client.name);
    closeDropdown();
  };

  // Handle client/prospect add
  const handleAddClient = (type: 'client' | 'prospect') => {
    setClientType(type);
    closeDropdown();
    clientAddModal.open();
  };

  // Handle article selection
  const handleOpenArticleSelection = (id: number) => {
    openArticleSelection(id);
    articleSelectionModal.open();
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 30 
      } 
    },
    exit: { 
      opacity: 0, 
      y: 50, 
      scale: 0.95,
      transition: { 
        duration: 0.2 
      } 
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Backdrop */}
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-7xl max-h-[90vh] overflow-y-auto m-4"
            variants={modalVariants}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b bg-white">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-[#1B0353]/10 rounded-lg">
                  <FiFileText className="w-6 h-6 text-[#1B0353]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Nouvelle Facture</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FiX className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              {/* Top Section */}
              <div className="bg-gray-50 p-6 rounded-xl mb-6 shadow-sm">
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
                        placeholder="FACT-2025-XXX"
                      />
                    </div>
                    
                    {/* Client Selection Component */}
                    <ClientSelection 
                      clientSearch={clientSearch}
                      showClientDropdown={showClientDropdown}
                      filteredClients={filteredClients}
                      onSearchChange={handleSearchChange}
                      onFocus={openDropdown}
                      onAddClient={handleAddClient}
                      onSelectClient={handleSelectClient}
                    />

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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Référence</label>
                        <input
                          type="text"
                          name="reference"
                          value={formData.reference}
                          onChange={handleInputChange}
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
                          placeholder="Référence"
                        />
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Etat</label>
                        <select
                          name="etat"
                          value={formData.etat}
                          onChange={handleInputChange}
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
                        >
                          <option value="En attente">En attente</option>
                          <option value="Payée">Payée</option>
                          <option value="En retard">En retard</option>
                          <option value="Partiellement payée">Partiellement payée</option>
                          <option value="Annulée">Annulée</option>
                        </select>
                      </div>
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
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mode de règlement</label>
                        <select
                          name="modeReglement"
                          value={formData.modeReglement}
                          onChange={handleInputChange}
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
                        >
                          <option value="Virement">Virement</option>
                          <option value="Carte bancaire">Carte bancaire</option>
                          <option value="Chèque">Chèque</option>
                          <option value="Espèces">Espèces</option>
                          <option value="Prélèvement">Prélèvement</option>
                          <option value="PayPal">PayPal</option>
                          <option value="Lettre de change">Lettre de change</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mode de calcul</label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="modeCalcul"
                          value="HT"
                          checked={formData.modeCalcul === 'HT'}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">HT</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="modeCalcul"
                          value="TTC"
                          checked={formData.modeCalcul === 'TTC'}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">TTC</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Montant HT</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEuroSign className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={totals.totalNetHT}
                        readOnly
                        className="w-full p-2.5 pl-10 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <TabNavigation 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
              />

              {/* Details Tab */}
              {activeTab === 'details' && (
                <LineItems 
                  lineItems={lineItems}
                  onLineItemChange={handleLineItemChange}
                  onRemoveLineItem={removeLineItem}
                  onAddLineItem={addLineItem}
                  onOpenArticleSelection={handleOpenArticleSelection}
                />
              )}
              
              {/* Payment Schedule Tab */}
              {activeTab === 'echeance' && (
                <PaymentSchedule
                  paymentSchedule={paymentSchedule}
                  onPaymentScheduleChange={handlePaymentScheduleChange}
                  onRemovePaymentSchedule={removePaymentSchedule}
                  onAddPaymentSchedule={addPaymentSchedule}
                  onMarkPaymentComplete={markPaymentComplete}
                  paymentScheduleTotal={calculatePaymentScheduleTotal()}
                  invoiceTotal={totals.totalTTC}
                  difference={calculateDifference()}
                  isBalanced={isPaymentScheduleBalanced()}
                />
              )}

              {/* Invoice Totals Component */}
              <InvoiceTotals 
                totals={totals}
                onUpdateTotalField={updateTotalField}
              />
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 z-10 flex justify-end items-center p-6 border-t bg-gray-50">
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all"
                >
                  Annuler
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 text-white rounded-lg shadow-sm hover:shadow-md transition-all flex items-center"
                  style={{ backgroundColor: '#1B0353' }}
                  onClick={handleSaveInvoice}
                >
                  <FiSave className="mr-2" />
                  Enregistrer la facture
                </motion.button>
              </div>
            </div>
            
            {/* Save confirmation toast */}
            <AnimatePresence>
              {showSaveConfirmation && <SaveConfirmation show={showSaveConfirmation} />}
            </AnimatePresence>
          </motion.div>

          {/* Client/Prospect Add Modal */}
          <AnimatePresence>
            {clientAddModal.isOpen && (
              <ClientAddModal 
                isOpen={clientAddModal.isOpen}
                onClose={clientAddModal.close}
                clientType={clientType}
              />
            )}
          </AnimatePresence>
          
          {/* Article Selection Modal */}
          <AnimatePresence>
            {articleSelectionModal.isOpen && (
              <ArticleSelectionModal 
                isOpen={articleSelectionModal.isOpen}
                onClose={articleSelectionModal.close}
                onSelectArticle={selectArticle}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateInvoiceModal;