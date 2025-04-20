import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, 
  FiSave, 
  FiFileText,
  FiLink
} from 'react-icons/fi';
import { FaEuroSign } from "react-icons/fa";

// Import types and sample data
import { sampleClients, refundReasons, moyensPaiement } from './types/creditNote';
import { 
  // CreateCreditNoteModalProps,
  Client,  // Add this if it doesn't exist
  Invoice  // Add this if it doesn't exist
} from './types/creditNote';

// Import hooks
import { useCreditNoteForm } from './hooks/useCreditNoteForm';
import { useLineItems } from './hooks/useLineItems';
import { useCreditNoteTotals } from './hooks/useCreditNoteTotals';
import { 
  useModalState, 
  useClientSelectionState, 
  useInvoiceSelection,
  useSaveConfirmation 
} from './hooks/useModalState';

// Import components
import ClientSelection from './components/ClientSelection';
import CreditNoteLineItems from './components/CreditNoteLineItems';
import CreditNoteTotals from './components/CreditNoteTotals';
import InfoAlert from './components/InfoAlert';
import SaveConfirmation from './components/SaveConfirmation';
import InvoiceSelectionModal from './components/modals/InvoiceSelectionModal';
import ArticleSelectionModal from './components/modals/ArticleSelectionModal';

// Import types
import { CreateCreditNoteModalProps } from './types/creditNote';

// Modal component for creating a new credit note
const CreateCreditNoteModal: React.FC<CreateCreditNoteModalProps> = ({ isOpen, onClose }) => {
  // Custom hooks for state management
  const { formData, handleInputChange, populateFromClient, setLinkedInvoice } = useCreditNoteForm();
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
  
  const { totals, updateTotalField, calculateTotals, totalsDependencies } = useCreditNoteTotals(lineItems);
  
  // Modal state hooks
  const articleSelectionModal = useModalState(false);
  const invoiceSelectionModal = useModalState(false);
  const { showSaveConfirmation, handleSave } = useSaveConfirmation(onClose);
  
  // Client selection state
  const { 
    showClientDropdown, 
    clientSearch, 
    // clientType,
    setClientSearch,
    openDropdown,
    closeDropdown,
    handleSearchChange
  } = useClientSelectionState();

  // Invoice selection state
  const { invoiceSearch, setInvoiceSearch, filteredInvoices } = useInvoiceSelection();

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

// Handle invoice selection
const handleSelectInvoice = (invoice: Invoice) => {
  setLinkedInvoice(invoice);
  
  // Find the client associated with this invoice
  const associatedClient = sampleClients.find(client => client.name === invoice.client);
  if (associatedClient) {
    handleSelectClient(associatedClient);
  }
  
  invoiceSelectionModal.close();
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
                <div className="p-2 bg-red-100 rounded-lg">
                  <FiFileText className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Nouvel Avoir</h2>
                <span className="px-2 py-1 text-xs text-red-600 bg-red-50 rounded-full border border-red-200">
                  Remboursement
                </span>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Numéro d&apos;avoir</label>
                      <input
                        type="text"
                        name="numero"
                        value={formData.numero}
                        onChange={handleInputChange}
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all text-gray-800"
                        placeholder="AV-2025-XXX"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Facture liée</label>
                      <div className="relative">
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.factureLiee}
                            readOnly
                            onClick={invoiceSelectionModal.open}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all pr-10 text-gray-800 cursor-pointer"
                            placeholder="Sélectionner une facture..."
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <FiLink className="text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Motif de l&apos;avoir</label>
                      <select
                        name="motif"
                        value={formData.motif}
                        onChange={handleInputChange}
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all text-gray-800"
                      >
                        {refundReasons.map((reason, index) => (
                          <option key={index} value={reason}>{reason}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Client Selection Component */}
                    <ClientSelection 
                      clientSearch={clientSearch}
                      showClientDropdown={showClientDropdown}
                      filteredClients={filteredClients}
                      onSearchChange={handleSearchChange}
                      onFocus={openDropdown}
                      onSelectClient={handleSelectClient}
                      accentColor="red"
                    />
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
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all text-gray-800"
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
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all text-gray-800"
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
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all text-gray-800"
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
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all text-gray-800"
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
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all text-gray-800"
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
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all text-gray-800"
                        >
                          <option value="En attente">En attente</option>
                          <option value="Validé">Validé</option>
                          <option value="Remboursé">Remboursé</option>
                          <option value="Annulé">Annulé</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all text-gray-800"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date de remboursement</label>
                        <input
                          type="date"
                          name="dateReglement"
                          value={formData.dateReglement}
                          onChange={handleInputChange}
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all text-gray-800"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mode de remboursement</label>
                        <select
                          name="modeReglement"
                          value={formData.modeReglement}
                          onChange={handleInputChange}
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all text-gray-800"
                        >
                          {moyensPaiement.map((moyen, index) => (
                            <option key={index} value={moyen}>{moyen}</option>
                          ))}
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
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
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
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">TTC</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Montant à rembourser</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEuroSign className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={totals.netARembourser}
                        readOnly
                        className="w-full p-2.5 pl-10 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Alert */}
              <InfoAlert 
                title="À propos des avoirs" 
                message="Un avoir est un document émis pour annuler partiellement ou totalement une facture. Sélectionnez la facture concernée, indiquez les articles à rembourser et le montant sera calculé automatiquement." 
              />

              {/* Line Items Component */}
              <CreditNoteLineItems 
                lineItems={lineItems}
                onLineItemChange={handleLineItemChange}
                onRemoveLineItem={removeLineItem}
                onAddLineItem={addLineItem}
                onOpenArticleSelection={handleOpenArticleSelection}
              />

              {/* Credit Note Totals Component */}
              <CreditNoteTotals 
                totals={totals}
                factureLiee={formData.factureLiee}
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
                  style={{ backgroundColor: '#e53e3e' }}
                  onClick={handleSave}
                >
                  <FiSave className="mr-2" />
                  Enregistrer l&apos;avoir
                </motion.button>
              </div>
            </div>
            
            {/* Save confirmation toast */}
            <AnimatePresence>
              {showSaveConfirmation && <SaveConfirmation show={showSaveConfirmation} />}
            </AnimatePresence>
          </motion.div>

          {/* Invoice Selection Modal */}
          <AnimatePresence>
            {invoiceSelectionModal.isOpen && (
              <InvoiceSelectionModal 
                isOpen={invoiceSelectionModal.isOpen}
                onClose={invoiceSelectionModal.close}
                invoiceSearch={invoiceSearch}
                onSearchChange={setInvoiceSearch}
                filteredInvoices={filteredInvoices}
                onSelectInvoice={handleSelectInvoice}
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

export default CreateCreditNoteModal;