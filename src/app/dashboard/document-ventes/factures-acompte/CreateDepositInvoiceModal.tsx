// src/app/dashboard/document-ventes/factures-acompte/CreateDepositInvoiceModal.tsx
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSave } from 'react-icons/fi';

// Types
import { Client, Project, CreateDepositInvoiceModalProps } from './types';

// Hooks
import useFormData from './hooks/useFormData';
import useLineItems from './hooks/useLineItems';
import useTotals from './hooks/useTotals';

// Core components - imported directly because needed immediately
import InvoiceHeader from './components/InvoiceHeader';
import ProjectSection from './components/ProjectSection';
import ClientInfoSection from './components/ClientInfoSection';
import LineItemsTable from './components/LineItemsTable';
import InvoiceTotals from './components/InvoiceTotals';

// Lazy loaded components - these will only be loaded when needed
const ClientModal = lazy(() => import('./components/modals/ClientModal'));
const ProjectSelectionModal = lazy(() => import('./components/modals/ProjectSelectionModal'));
const ArticleSelectionModal = lazy(() => import('./components/modals/ArticleSelectionModal'));
const SaveConfirmation = lazy(() => import('./components/SaveConfirmation'));

// Sample data - consider moving to a context or server component if possible
import {
  clients,
  projetsList,
  articlesCommuns,
  moyensPaiement,
} from './data/sampleData';

// Simple loading component for lazy loaded modals
const ModalLoadingFallback = () => (
  <div className="fixed inset-0 bg-white/10 flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const CreateDepositInvoiceModal: React.FC<CreateDepositInvoiceModalProps> = ({
  isOpen,
  onClose,
}) => {
  /** ------------------------------------------------
   *  Hooks – must be called unconditionally (top‑level)
   * ------------------------------------------------*/
  // Modal visibility
  const [showClientModal, setShowClientModal] = useState(false);
  const [clientType, setClientType] = useState<'client' | 'prospect'>('client');
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  // Client search
  const [clientSearch, setClientSearch] = useState('');
  const [showClientDropdown, setShowClientDropdown] = useState(false);

  // Project search
  const [projectSearch, setProjectSearch] = useState('');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projetsList);

  // Custom hooks
  const {
    lineItems,
    setLineItems,
    showArticleModal,
    setShowArticleModal,
    handleLineItemChange,
    removeLineItem,
    openArticleSelection,
    selectArticle,
    updateLineItemAmounts,
  } = useLineItems();

  const { totals, setTotals } = useTotals(lineItems);

  const {
    formData,
    setFormData,
    handleInputChange,
    handleTogglePaymentType,
    applyPresetPercentage,
  } = useFormData(setLineItems, setTotals);

  /** ------------------------------------------------
   *  Derived data + side‑effects
   * ------------------------------------------------*/
  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.id.toLowerCase().includes(clientSearch.toLowerCase())
  );

  // project search
  useEffect(() => {
    setFilteredProjects(
      projectSearch
        ? projetsList.filter(
            (p) =>
              p.id.toLowerCase().includes(projectSearch.toLowerCase()) ||
              p.titre.toLowerCase().includes(projectSearch.toLowerCase()) ||
              p.client.toLowerCase().includes(projectSearch.toLowerCase())
          )
        : projetsList
    );
  }, [projectSearch]);

  // keep line‑item amounts in sync
  useEffect(() => {
    updateLineItemAmounts();
  }, [lineItems, updateLineItemAmounts]);

  /** ------------------------------------------------
   *  Event handlers
   * ------------------------------------------------*/
  const selectClient = (client: Client) => {
    setFormData((prev) => ({
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

  const handleAddClient = (type: 'client' | 'prospect') => {
    setClientType(type);
    setShowClientDropdown(false);
    setShowClientModal(true);
  };

  const selectProject = (project: Project) => {
    const associatedClient = clients.find((c) => c.name === project.client);
    if (associatedClient) selectClient(associatedClient);

    const total = project.montant;
    const pct = parseFloat(formData.pourcentageAcompte) || 30;
    const deposit = ((parseFloat(total) * pct) / 100).toFixed(2);

    setFormData((prev) => ({
      ...prev,
      projetLie: project.id,
      montantTotal: total,
      montantAcompte: deposit,
      reference: `Acompte ${project.id} - ${project.titre}`,
    }));

    setTotals((prev) => ({
      ...prev,
      montantAcompte: deposit,
      soldeFinalPrevu: (parseFloat(total) - parseFloat(deposit)).toFixed(2),
    }));

    if (lineItems.length > 0) {
      setLineItems((prev) =>
        prev.map((item, idx) =>
          idx === 0
            ? { ...item, description: `Acompte pour ${project.titre}`, pvHT: deposit }
            : item
        )
      );
    }

    setShowProjectModal(false);
  };

  const handleSaveDepositInvoice = () => {
    setShowSaveConfirmation(true);
    console.log('Enregistrement de la facture dacompte:', { formData, lineItems, totals });

    setTimeout(() => {
      setShowSaveConfirmation(false);
      onClose();
    }, 1500);
  };

  /** ------------------------------------------------
   *  Render (gate after hooks)
   * ------------------------------------------------*/
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative bg-white rounded-2xl shadow-xl w-full max-w-7xl max-h-[90vh] overflow-y-auto m-4"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } }}
          exit={{ opacity: 0, y: 50, scale: 0.95, transition: { duration: 0.2 } }}
        >
          <div className="p-6">
            <InvoiceHeader onClose={onClose} />

            <ProjectSection
              formData={formData}
              handleInputChange={handleInputChange}
              handleTogglePaymentType={handleTogglePaymentType}
              setShowProjectModal={setShowProjectModal}
              applyPresetPercentage={applyPresetPercentage}
            />

            <ClientInfoSection
              formData={formData}
              handleInputChange={handleInputChange}
              clients={clients}
              clientSearch={clientSearch}
              setClientSearch={setClientSearch}
              showClientDropdown={showClientDropdown}
              setShowClientDropdown={setShowClientDropdown}
              selectClient={selectClient}
              handleAddClient={handleAddClient}
              filteredClients={filteredClients}
              moyensPaiement={moyensPaiement}
            />

            <LineItemsTable
              lineItems={lineItems}
              handleLineItemChange={handleLineItemChange}
              openArticleSelection={openArticleSelection}
              removeLineItem={removeLineItem}
            />

            <InvoiceTotals totals={totals} setTotals={setTotals} formData={formData} />
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 z-10 flex justify-end p-6 border-t bg-gray-50 space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              Annuler
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveDepositInvoice}
              className="px-4 py-2 text-white rounded-lg shadow-sm flex items-center"
              style={{ backgroundColor: '#4F46E5' }}
            >
              <FiSave className="mr-2" />
              Enregistrer la facture d&apos;acompte
            </motion.button>
          </div>

          {/* Lazy loaded nested modals & toast */}
          {showClientModal && (
            <Suspense fallback={<ModalLoadingFallback />}>
              <ClientModal 
                isOpen={showClientModal} 
                onClose={() => setShowClientModal(false)} 
                clientType={clientType} 
              />
            </Suspense>
          )}
          
          {showProjectModal && (
            <Suspense fallback={<ModalLoadingFallback />}>
              <ProjectSelectionModal
                isOpen={showProjectModal}
                onClose={() => setShowProjectModal(false)}
                projectSearch={projectSearch}
                setProjectSearch={setProjectSearch}
                filteredProjects={filteredProjects}
                selectProject={selectProject}
              />
            </Suspense>
          )}
          
          {showArticleModal && (
            <Suspense fallback={<ModalLoadingFallback />}>
              <ArticleSelectionModal
                isOpen={showArticleModal}
                onClose={() => setShowArticleModal(false)}
                selectArticle={selectArticle}
                articles={articlesCommuns}
              />
            </Suspense>
          )}
          
          {showSaveConfirmation && (
            <Suspense fallback={<ModalLoadingFallback />}>
              <SaveConfirmation isOpen={showSaveConfirmation} />
            </Suspense>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateDepositInvoiceModal;