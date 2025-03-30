import React, { useState, useEffect, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
//   FiPlus, 
  FiX, 
  FiSave, 
//   FiTrash2, 
  FiSearch,
//   FiCalendar,
  FiInfo,
  FiLink,
  FiFileText,
  FiCheck,
  FiPercent,
  FiAlertCircle,
//   FiCreditCard
} from 'react-icons/fi';
import { FaEuroSign } from "react-icons/fa";

// Define interfaces for proper typing
interface CreateDepositCreditNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  numero: string;
  factureAcompteId: string;
  factureAcompteNumero: string;
  clientId: string;
  clientName: string;
  reference: string;
  montantOriginal: string;
  pourcentageAvoir: string;
  montantAvoir: string;
  typePaiement: 'pourcentage' | 'montant';
  raison: string;
  date: string;
  statut: string;
  notes: string;
}

interface DepositInvoice {
  id: string;
  numero: string;
  date: string;
  client: string;
  clientId: string;
  montant: string;
  projet: string;
  statut: string;
}

// Modal component for creating a new deposit credit note
const CreateDepositCreditNoteModal: React.FC<CreateDepositCreditNoteModalProps> = ({ isOpen, onClose }) => {
  // State for form fields
  const [formData, setFormData] = useState<FormData>({
    numero: 'AAC-2025-007',
    factureAcompteId: '',
    factureAcompteNumero: '',
    clientId: '',
    clientName: '',
    reference: '',
    montantOriginal: '0.00',
    pourcentageAvoir: '100',
    montantAvoir: '0.00',
    typePaiement: 'pourcentage',
    raison: '',
    date: new Date().toISOString().split('T')[0],
    statut: 'En attente',
    notes: ''
  });

  // State for showing invoice selection modal
  const [showInvoiceModal, setShowInvoiceModal] = useState<boolean>(false);
  
  // State for showing save confirmation
  const [showSaveConfirmation, setShowSaveConfirmation] = useState<boolean>(false);

  // Sample deposit invoices for selection
  const depositInvoices: DepositInvoice[] = [
    { id: 'INVD001', numero: 'FA-2025-001', date: '01/03/2025', client: 'Acme Corp', clientId: 'CLI001', montant: '1500.00', projet: 'Développement CRM', statut: 'Payée' },
    { id: 'INVD002', numero: 'FA-2025-002', date: '15/02/2025', client: 'Nexus Tech', clientId: 'CLI004', montant: '900.00', projet: 'Module facturation', statut: 'Payée' },
    { id: 'INVD003', numero: 'FA-2025-003', date: '10/02/2025', client: 'Zenith SA', clientId: 'CLI007', montant: '2500.00', projet: 'Refonte site web', statut: 'Payée' },
    { id: 'INVD004', numero: 'FA-2025-004', date: '05/02/2025', client: 'Global Industries', clientId: 'CLI005', montant: '1200.00', projet: 'Formation utilisateurs', statut: 'Payée' },
    { id: 'INVD005', numero: 'FA-2025-005', date: '20/01/2025', client: 'Tech Innovate', clientId: 'CLI002', montant: '6000.00', projet: 'Audit de sécurité', statut: 'Payée' },
    { id: 'INVD006', numero: 'FA-2025-006', date: '15/01/2025', client: 'Solutions Pro', clientId: 'CLI009', montant: '3000.00', projet: 'Développement mobile', statut: 'Payée' },
  ];

  // Sample reasons for credit note
  const creditNoteReasons = [
    "Modification de commande",
    "Remise commerciale",
    "Changement de forfait",
    "Réduction participants",
    "Modules non retenus",
    "Erreur de facturation",
    "Annulation partielle",
    "Service non fourni"
  ];

  // State for invoice search
  const [invoiceSearch, setInvoiceSearch] = useState<string>('');
  const [filteredInvoices, setFilteredInvoices] = useState<DepositInvoice[]>(depositInvoices);
  
  // Filter invoices based on search term
  useEffect(() => {
    if (invoiceSearch) {
      setFilteredInvoices(depositInvoices.filter(invoice => 
        invoice.numero.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
        invoice.client.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
        invoice.projet.toLowerCase().includes(invoiceSearch.toLowerCase())
      ));
    } else {
      setFilteredInvoices(depositInvoices);
    }
  }, [invoiceSearch]);

  // Handle input change for form fields
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Special handling for percentage and amount to keep them in sync
    if (name === 'pourcentageAvoir' && formData.typePaiement === 'pourcentage') {
      const percentage = parseFloat(value) || 0;
      const originalAmount = parseFloat(formData.montantOriginal.replace(/[^\d,.]/g, '').replace(',', '.')) || 0;
      const creditAmount = (originalAmount * percentage / 100).toFixed(2);
      
      setFormData(prev => ({
        ...prev,
        montantAvoir: creditAmount
      }));
    } 
    else if (name === 'montantAvoir' && formData.typePaiement === 'montant') {
      const creditAmount = parseFloat(value) || 0;
      const originalAmount = parseFloat(formData.montantOriginal.replace(/[^\d,.]/g, '').replace(',', '.')) || 0;
      const percentage = originalAmount > 0 ? ((creditAmount * 100) / originalAmount).toFixed(0) : '0';
      
      setFormData(prev => ({
        ...prev,
        pourcentageAvoir: percentage
      }));
    }
    else if (name === 'typePaiement') {
      setFormData(prev => ({
        ...prev,
        typePaiement: value as 'pourcentage' | 'montant'
      }));
    }
  };

  // Toggle between percentage and fixed amount
  const handleTogglePaymentType = (type: 'pourcentage' | 'montant') => {
    setFormData(prev => ({
      ...prev,
      typePaiement: type
    }));
  };

  // Select a deposit invoice and populate related fields
  const selectInvoice = (invoice: DepositInvoice): void => {
    const originalAmount = invoice.montant;
    const percentage = parseFloat(formData.pourcentageAvoir) || 100;
    const creditAmount = (parseFloat(originalAmount) * percentage / 100).toFixed(2);
    
    setFormData(prev => ({
      ...prev,
      factureAcompteId: invoice.id,
      factureAcompteNumero: invoice.numero,
      clientId: invoice.clientId,
      clientName: invoice.client,
      montantOriginal: originalAmount,
      montantAvoir: creditAmount,
      reference: `Avoir sur ${invoice.numero} - ${invoice.projet}`
    }));
    
    setShowInvoiceModal(false);
  };
  
  // Apply a predefined percentage
  const applyPresetPercentage = (percentage: string): void => {
    const cleanPercentage = percentage.replace('%', '');
    const percentageValue = parseFloat(cleanPercentage);
    const originalAmount = parseFloat(formData.montantOriginal.replace(/[^\d,.]/g, '').replace(',', '.')) || 0;
    const creditAmount = (originalAmount * percentageValue / 100).toFixed(2);
    
    setFormData(prev => ({
      ...prev,
      pourcentageAvoir: cleanPercentage,
      montantAvoir: creditAmount,
      typePaiement: 'pourcentage'
    }));
  };
  
  // Handle saving the deposit credit note
  const handleSaveDepositCreditNote = (): void => {
    // Validate form
    if (!formData.factureAcompteId) {
      alert("Veuillez sélectionner une facture d'acompte.");
      return;
    }
    
    if (!formData.raison) {
      alert("Veuillez indiquer une raison pour cet avoir.");
      return;
    }

    // Show save confirmation briefly
    setShowSaveConfirmation(true);
    
    // In a real app, you would save the credit note to your backend here
    console.log("Enregistrement de l'avoir d'acompte:", formData);
    
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
  
  const confirmationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 }
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
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4"
            variants={modalVariants}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b bg-white">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FiFileText className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Nouvel avoir d&apos;acompte</h2>
                <span className="px-2 py-1 text-xs text-red-600 bg-red-50 rounded-full border border-red-200">
                  Avoir
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
              {/* Info Alert */}
              <div className="mb-6 flex items-start space-x-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex-shrink-0 pt-0.5">
                  <FiInfo className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-amber-800">À propos des avoirs d&apos;acompte</h3>
                  <p className="mt-1 text-sm text-amber-700">
                    Un avoir d&apos;acompte est un document qui annule partiellement ou totalement une facture d&apos;acompte déjà émise. 
                    Sélectionnez la facture d&apos;acompte concernée et indiquez le montant ou pourcentage à rembourser.
                  </p>
                </div>
              </div>

              {/* Deposit Invoice Selection */}
              <div className="bg-gray-50 p-6 rounded-xl mb-6 shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Facture d&apos;acompte concernée</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sélectionner une facture d&apos;acompte</label>
                    <div className="relative">
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.factureAcompteNumero}
                          readOnly
                          onClick={() => setShowInvoiceModal(true)}
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all pr-10 text-gray-800 cursor-pointer"
                          placeholder="Sélectionner une facture d'acompte..."
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <FiLink className="text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Référence</label>
                    <input
                      type="text"
                      name="reference"
                      value={formData.reference}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
                      placeholder="Référence de l'avoir"
                    />
                  </div>
                </div>

                {formData.factureAcompteId && (
                  <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-white">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <span className="text-xs text-gray-500">Client</span>
                        <p className="text-sm font-medium text-gray-900">{formData.clientName}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Facture d&apos;acompte</span>
                        <p className="text-sm font-medium text-indigo-600">{formData.factureAcompteNumero}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Montant original</span>
                        <p className="text-sm font-medium text-gray-900">{parseFloat(formData.montantOriginal).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Statut</span>
                        <p className="text-sm font-medium">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Payée
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Credit Note Details */}
              <div className="bg-gray-50 p-6 rounded-xl mb-6 shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Détails de l&apos;avoir</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Numéro d&apos;avoir</label>
                    <input
                      type="text"
                      name="numero"
                      value={formData.numero}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
                      placeholder="AAC-2025-XXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date d&apos;émission</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                    <select
                      name="statut"
                      value={formData.statut}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
                    >
                      <option value="En attente">En attente</option>
                      <option value="Émis">Émis</option>
                      <option value="Traité">Traité</option>
                      <option value="Refusé">Refusé</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Raison de l&apos;avoir</label>
                    <select
                      name="raison"
                      value={formData.raison}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
                    >
                      <option value="">Sélectionner une raison</option>
                      {creditNoteReasons.map((reason, index) => (
                        <option key={index} value={reason}>{reason}</option>
                      ))}
                    </select>
                  </div>
                  <div></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-gray-700">Type de remboursement</label>
                      <div className="flex text-xs space-x-2">
                        <button 
                          className={`px-2 py-1 rounded transition ${formData.typePaiement === 'pourcentage' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
                          onClick={() => handleTogglePaymentType('pourcentage')}
                        >
                          Pourcentage
                        </button>
                        <button 
                          className={`px-2 py-1 rounded transition ${formData.typePaiement === 'montant' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
                          onClick={() => handleTogglePaymentType('montant')}
                        >
                          Montant fixe
                        </button>
                      </div>
                    </div>

                    {formData.typePaiement === 'pourcentage' ? (
                      <div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiPercent className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="pourcentageAvoir"
                            value={formData.pourcentageAvoir}
                            onChange={handleInputChange}
                            className="w-full p-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
                            placeholder="100"
                          />
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {["25%", "50%", "75%", "100%"].map((p, index) => (
                            <button 
                              key={index}
                              onClick={() => applyPresetPercentage(p)}
                              className="text-xs px-2 py-1 bg-indigo-50 text-indigo-600 rounded border border-indigo-100 hover:bg-indigo-100 transition"
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaEuroSign className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="montantAvoir"
                          value={formData.montantAvoir}
                          onChange={handleInputChange}
                          className="w-full p-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
                          placeholder="0.00"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Montant de l&apos;avoir</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEuroSign className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        readOnly
                        value={formData.montantAvoir}
                        className="w-full p-2.5 pl-10 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 font-medium"
                      />
                    </div>
                  </div>
                  <div></div>
                </div>

                <div className="p-4 mt-4 border border-red-100 bg-red-50 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-xs text-gray-500">Facture d&apos;origine</span>
                    <p className="text-sm font-bold text-gray-900">{formData.factureAcompteNumero || "-"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Montant original</span>
                    <p className="text-sm font-bold text-gray-900">{parseFloat(formData.montantOriginal || "0").toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Montant avoir</span>
                    <p className="text-sm font-bold text-red-600">{parseFloat(formData.montantAvoir || "0").toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Pourcentage</span>
                    <p className="text-sm font-bold text-gray-900">{formData.pourcentageAvoir}%</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Notes et informations complémentaires</h3>
                
                <div className="mb-4">
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
                    placeholder="Ajoutez des notes ou informations complémentaires concernant cet avoir..."
                  ></textarea>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex-shrink-0 pt-0.5">
                    <FiAlertCircle className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-amber-700">
                      L&apos;émission d&apos;un avoir d&apos;acompte peut donner lieu à un remboursement au client. 
                      Assurez-vous que les informations sont correctes avant de finaliser.
                    </p>
                  </div>
                </div>
              </div>
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
                  style={{ backgroundColor: '#4F46E5' }}
                  onClick={handleSaveDepositCreditNote}
                >
                  <FiSave className="mr-2" />
                  Enregistrer l&apos;avoir d&apos;acompte
                </motion.button>
              </div>
            </div>
            
            {/* Save confirmation toast */}
            <AnimatePresence>
              {showSaveConfirmation && (
                <motion.div
                  className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg flex items-center"
                  variants={confirmationVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <FiCheck className="mr-2" />
                  Avoir d&apos;acompte enregistré avec succès
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Deposit Invoice Selection Modal */}
          <AnimatePresence>
            {showInvoiceModal && (
              <motion.div
                className="fixed inset-0 z-[60] flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div 
                  className="fixed inset-0 bg-black bg-opacity-50"
                  onClick={() => setShowInvoiceModal(false)}
                />
                <motion.div
                  className="relative bg-white rounded-xl shadow-xl w-full max-w-lg m-4 z-10"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                >
                  <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-medium">
                      Sélectionner une facture d&apos;acompte
                    </h3>
                    <button
                      onClick={() => setShowInvoiceModal(false)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <FiX />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="mb-4">
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all pl-10 text-gray-800"
                          placeholder="Rechercher une facture d'acompte..."
                          value={invoiceSearch}
                          onChange={(e) => setInvoiceSearch(e.target.value)}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                          <FiSearch className="text-gray-400" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="overflow-y-auto max-h-80">
                      <div className="space-y-2">
                        {filteredInvoices.map(invoice => (
                          <div 
                            key={invoice.id} 
                            className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => selectInvoice(invoice)}
                          >
                            <div className="flex justify-between">
                              <div className="font-medium text-gray-900">{invoice.numero}</div>
                              <div className="text-sm font-bold">{parseFloat(invoice.montant).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</div>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <div className="flex items-center space-x-1">
                                <span className="text-xs text-gray-500">{invoice.client}</span>
                                <span className="text-xs text-gray-500">•</span>
                                <span className="text-xs text-gray-500">{invoice.projet}</span>
                              </div>
                              <span className="text-xs text-gray-500">Date: {invoice.date}</span>
                            </div>
                          </div>
                        ))}
                        
                        {filteredInvoices.length === 0 && (
                          <div className="p-4 text-center text-gray-500 border border-dashed border-gray-300 rounded-lg">
                            Aucune facture d&apos;acompte trouvée
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end p-4 border-t">
                    <div className="flex space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowInvoiceModal(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all"
                      >
                        Annuler
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateDepositCreditNoteModal;