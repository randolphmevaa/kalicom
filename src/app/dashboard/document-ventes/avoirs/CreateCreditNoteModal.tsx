// CreateCreditNoteModal.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSave } from 'react-icons/fi';

// Types
import { Client, Invoice, CreateCreditNoteModalProps } from './types';

// Hooks
import useFormData from './hooks/useFormData';
import useLineItems from './hooks/useLineItems';
import useTotals from './hooks/useTotals';

// Components
import CreditNoteHeader from './components/CreditNoteHeader';
import ClientInfoSection from './components/ClientInfoSection';
import LineItemsTable from './components/LineItemsTable';
import CreditNoteTotals from './components/CreditNoteTotals';
import SaveConfirmation from './components/SaveConfirmation';
import InvoiceSelectionModal from './components/modals/InvoiceSelectionModal';
import ArticleSelectionModal from './components/modals/ArticleSelectionModal';

// Sample data
import { clients, sampleInvoices, articlesCommuns, moyensPaiement, refundReasons } from './data/sampleData';

const CreateCreditNoteModal: React.FC<CreateCreditNoteModalProps> = ({ isOpen, onClose }) => {
  // Don't return null here - let AnimatePresence handle the conditional rendering
  
  // Initialize custom hooks
  const { formData, setFormData, handleInputChange } = useFormData();
  
  const {
    lineItems,
    showArticleModal,
    setShowArticleModal,
    // selectedLineId,
    handleLineItemChange,
    addLineItem,
    removeLineItem,
    openArticleSelection,
    selectArticle
  } = useLineItems();

  const { totals, setTotals } = useTotals(lineItems);

  // State for modals
  const [showInvoiceModal, setShowInvoiceModal] = useState<boolean>(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState<boolean>(false);

  // State for client search
  const [clientSearch, setClientSearch] = useState<string>('');
  const [showClientDropdown, setShowClientDropdown] = useState<boolean>(false);
  
  // State for invoice search
  const [invoiceSearch, setInvoiceSearch] = useState<string>('');
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>(sampleInvoices);

  // Filter clients based on search term
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    client.id.toLowerCase().includes(clientSearch.toLowerCase())
  );

  // Filter invoices based on search term
  useEffect(() => {
    if (invoiceSearch) {
      setFilteredInvoices(sampleInvoices.filter(invoice => 
        invoice.id.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
        invoice.client.toLowerCase().includes(invoiceSearch.toLowerCase())
      ));
    } else {
      setFilteredInvoices(sampleInvoices);
    }
  }, [invoiceSearch]);

  // Handle client selection and populate fields
  const selectClient = (client: Client): void => {
    setFormData(prev => ({
      ...prev,
      codeTiers: client.id,
      civilite: client.civilite || '',
      nom: client.nom || '',
      prenom: client.prenom || '',
      adresse: client.adresse || '',
      codePostal: client.codePostal || '',
      ville: client.ville || '',
    }));
    setClientSearch(client.name);
    setShowClientDropdown(false);
  };

  // Select an invoice to link
  const selectInvoice = (invoice: Invoice): void => {
    setFormData(prev => ({
      ...prev,
      factureLiee: invoice.id
    }));
    
    // Find the client associated with this invoice
    const associatedClient = clients.find(c => c.name === invoice.client);
    if (associatedClient) {
      selectClient(associatedClient);
    }
    
    setShowInvoiceModal(false);
  };

  // Handle saving the credit note
  const handleSaveCreditNote = (): void => {
    // Show save confirmation briefly
    setShowSaveConfirmation(true);
    
    // In a real app, you would save the credit note to your backend here
    console.log("Enregistrement de l'avoir:", {
      formData,
      lineItems,
      totals
    });
    
    // Hide confirmation after 1.5 seconds
    setTimeout(() => {
      setShowSaveConfirmation(false);
      onClose();
    }, 1500);
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
            <div className="p-6">
              {/* Header */}
              <CreditNoteHeader onClose={onClose} />

              {/* Client Info Section */}
              <ClientInfoSection 
                formData={formData}
                handleInputChange={handleInputChange}
                clients={clients}
                clientSearch={clientSearch}
                setClientSearch={setClientSearch}
                showClientDropdown={showClientDropdown}
                setShowClientDropdown={setShowClientDropdown}
                selectClient={selectClient}
                filteredClients={filteredClients}
                moyensPaiement={moyensPaiement}
                refundReasons={refundReasons}
                setShowInvoiceModal={setShowInvoiceModal}
              />

              {/* Line Items Table */}
              <LineItemsTable 
                lineItems={lineItems}
                handleLineItemChange={handleLineItemChange}
                openArticleSelection={openArticleSelection}
                removeLineItem={removeLineItem}
                addLineItem={addLineItem}
              />

              {/* Totals */}
              <CreditNoteTotals 
                totals={totals}
                setTotals={setTotals}
                formData={formData}
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
                  onClick={handleSaveCreditNote}
                >
                  <FiSave className="mr-2" />
                  Enregistrer l&apos;avoir
                </motion.button>
              </div>
            </div>
            
            {/* Child modals */}
            <InvoiceSelectionModal 
              isOpen={showInvoiceModal}
              onClose={() => setShowInvoiceModal(false)}
              invoiceSearch={invoiceSearch}
              setInvoiceSearch={setInvoiceSearch}
              filteredInvoices={filteredInvoices}
              selectInvoice={selectInvoice}
            />
            
            <ArticleSelectionModal 
              isOpen={showArticleModal}
              onClose={() => setShowArticleModal(false)}
              selectArticle={selectArticle}
              articles={articlesCommuns}
            />
            
            <SaveConfirmation isOpen={showSaveConfirmation} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateCreditNoteModal;