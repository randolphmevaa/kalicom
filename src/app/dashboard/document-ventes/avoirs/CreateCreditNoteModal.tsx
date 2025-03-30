import React, { useState, useEffect, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, 
  FiX, 
  FiSave, 
  FiTrash2, 
  // FiUser, 
  FiSearch,
  // FiCalendar,
  FiInfo,
  // FiClipboard,
  FiCheck,
  FiFileText,
  FiChevronsRight,
  // FiCreditCard,
//   FiDollar,
  // FiAlertCircle,
  // FiArrowRight,
  FiLink,
  // FiFileText as FiFile,
  FiCornerDownRight
} from 'react-icons/fi';
import { FaEuroSign } from "react-icons/fa";

// Define interfaces for proper typing
interface CreateCreditNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Client {
  id: string;
  name: string;
  type: 'client' | 'prospect';
  // Extended client data
  civilite?: string;
  nom?: string;
  prenom?: string;
  adresse?: string;
  codePostal?: string;
  ville?: string;
  telephone?: string;
  email?: string;
}

interface Invoice {
  id: string;
  client: string;
  date: string;
  montantTTC: string;
  statut: string;
}

interface Article {
  code: string;
  desc: string;
  prix: string;
  unite: string;
  tva: string;
}


interface FormData {
  numero: string;
  codeTiers: string;
  civilite: string;
  nom: string;
  prenom: string;
  adresse: string;
  codePostal: string;
  ville: string;
  reference: string;
  factureLiee: string;
  motif: string;
  etat: string;
  date: string;
  dateReglement: string;
  modeReglement: string;
  modeCalcul: 'HT' | 'TTC';
  montantHT: string;
}

interface LineItem {
  id: number;
  codeArticle: string;
  description: string;
  quantite: number;
  codeUnite: string;
  pvHT: string;
  remise: string;
  montantNetHT: string;
  tva: string;
}

interface Totals {
  totalBrutHT: string;
  pourcentageRemise: string;
  portHT: string;
  tvaPort: string;
  totalNetHT: string;
  soit: string;
  totalTTC: string;
  soitTTC: string;
  netARembourser: string;
}

// Sample articles for quick selection
const articlesCommuns = [
  { code: 'ART001', desc: 'Consultation standard', prix: '75.00', unite: 'h', tva: '20.00' },
  { code: 'ART002', desc: 'Maintenance informatique', prix: '95.00', unite: 'h', tva: '20.00' },
  { code: 'ART003', desc: 'Développement sur mesure', prix: '120.00', unite: 'h', tva: '20.00' },
  { code: 'ART004', desc: 'Formation utilisateurs', prix: '650.00', unite: 'jour', tva: '20.00' },
  { code: 'ART005', desc: 'Audit de sécurité', prix: '1200.00', unite: 'forfait', tva: '20.00' },
];

// Sample invoices for reference
const sampleInvoices: Invoice[] = [
  {
    id: 'FACT-2025-001',
    client: 'Société Dupont',
    date: '05/03/2025',
    montantTTC: '15 600,00 €',
    statut: 'Payée'
  },
  {
    id: 'FACT-2025-002',
    client: 'Entreprise Martin',
    date: '28/02/2025',
    montantTTC: '2 990,00 €',
    statut: 'En attente'
  },
  {
    id: 'FACT-2025-004',
    client: 'Industries Moreau',
    date: '20/02/2025',
    montantTTC: '3 500,00 €',
    statut: 'Payée'
  },
  {
    id: 'FACT-2025-006',
    client: 'Tech Petit SARL',
    date: '10/02/2025',
    montantTTC: '8 400,00 €',
    statut: 'Payée'
  }
];

// Refund reasons
const refundReasons = [
  'Erreur de facturation',
  'Produit retourné',
  'Service annulé',
  'Remise commerciale',
  'Double facturation',
  'Article défectueux',
  'Annulation de commande',
  'Autre'
];

// Modal component for creating a new credit note
const CreateCreditNoteModal: React.FC<CreateCreditNoteModalProps> = ({ isOpen, onClose }) => {
  // State for form fields
  const [formData, setFormData] = useState<FormData>({
    numero: 'AV-2025-001',
    codeTiers: '',
    civilite: '',
    nom: '',
    prenom: '',
    adresse: '',
    codePostal: '',
    ville: '',
    reference: '',
    factureLiee: '',
    motif: 'Erreur de facturation',
    etat: 'En attente',
    date: new Date().toISOString().split('T')[0],
    dateReglement: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString().split('T')[0],
    modeReglement: 'Virement',
    modeCalcul: 'HT',
    montantHT: '0.00',
  });

  // State for the line items in the credit note
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { 
      id: 1, 
      codeArticle: '', 
      description: '', 
      quantite: 1, 
      codeUnite: 'h', 
      pvHT: '0.00', 
      remise: '0.00', 
      montantNetHT: '0.00', 
      tva: '20.00' 
    }
  ]);

  // State for the totals
  const [totals, setTotals] = useState<Totals>({
    totalBrutHT: '0.00',
    pourcentageRemise: '0.00',
    portHT: '0.00',
    tvaPort: '20.00',
    totalNetHT: '0.00',
    soit: '',
    totalTTC: '0.00',
    soitTTC: '',
    netARembourser: '0.00',
  });

  // State for showing client/prospect add modal
  // const [showClientModal, setShowClientModal] = useState<boolean>(false);
  // const [clientType, setClientType] = useState<'client' | 'prospect'>('client');
  
  // State for showing article selection modal
  const [showArticleModal, setShowArticleModal] = useState<boolean>(false);
  const [selectedLineId, setSelectedLineId] = useState<number | null>(null);
  
  // State for showing invoice selection modal
  const [showInvoiceModal, setShowInvoiceModal] = useState<boolean>(false);
  
  // State for showing save confirmation
  const [showSaveConfirmation, setShowSaveConfirmation] = useState<boolean>(false);

  // Sample client data for dropdown with extended information (French data)
  const clients: Client[] = [
    { 
      id: 'CLI001', 
      name: 'Société Dupont', 
      type: 'client',
      civilite: 'M.',
      nom: 'Dupont',
      prenom: 'Jean',
      adresse: '23 Rue de la République',
      codePostal: '75001',
      ville: 'Paris',
      telephone: '01 23 45 67 89',
      email: 'contact@dupont.fr'
    },
    { 
      id: 'CLI002', 
      name: 'Entreprise Martin', 
      type: 'client',
      civilite: 'Mme',
      nom: 'Martin',
      prenom: 'Sophie',
      adresse: '45 Avenue Victor Hugo',
      codePostal: '69002',
      ville: 'Lyon',
      telephone: '04 78 12 34 56',
      email: 'info@martin-entreprise.fr'
    },
    { 
      id: 'CLI003', 
      name: 'Industries Moreau', 
      type: 'client',
      civilite: 'M.',
      nom: 'Moreau',
      prenom: 'Pierre',
      adresse: '78 Boulevard Gambetta',
      codePostal: '59000',
      ville: 'Lille',
      telephone: '03 20 45 67 89',
      email: 'p.moreau@industriesmoreau.fr'
    },
    { 
      id: 'PRO002', 
      name: 'Tech Petit SARL', 
      type: 'prospect',
      civilite: 'Mme',
      nom: 'Petit',
      prenom: 'Marie',
      adresse: '34 Rue des Lilas',
      codePostal: '67000',
      ville: 'Strasbourg',
      telephone: '03 88 56 78 90',
      email: 'm.petit@techpetit.fr'
    },
  ];

  // Payment method options
  const moyensPaiement = [
    'Virement', 
    'Carte bancaire', 
    'Chèque', 
    'Espèces', 
    'Prélèvement', 
    'PayPal', 
    'Lettre de change'
  ];

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

  // Handle input change for top section fields
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle line item changes
  const handleLineItemChange = (id: number, field: keyof LineItem, value: string | number) => {
    setLineItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // Calculate line item amount
  const calculateLineItemAmount = (item: LineItem): string => {
    const quantity = typeof item.quantite === 'string' ? parseFloat(item.quantite) : item.quantite || 0;
    const price = parseFloat(item.pvHT) || 0;
    const discount = parseFloat(item.remise) || 0;
    
    const grossAmount = quantity * price;
    const discountAmount = grossAmount * (discount / 100);
    const netAmount = grossAmount - discountAmount;
    
    return netAmount.toFixed(2);
  };

  // Add a new line item
  const addLineItem = (): void => {
    const newId = lineItems.length > 0 ? Math.max(...lineItems.map(item => item.id)) + 1 : 1;
    setLineItems(prev => [
      ...prev, 
      { 
        id: newId, 
        codeArticle: '', 
        description: '', 
        quantite: 1, 
        codeUnite: 'h', 
        pvHT: '0.00', 
        remise: '0.00', 
        montantNetHT: '0.00', 
        tva: '20.00' 
      }
    ]);
  };

  // Remove a line item
  const removeLineItem = (id: number): void => {
    setLineItems(prev => prev.filter(item => item.id !== id));
  };
  
  // Open article selection modal for a specific line
  const openArticleSelection = (id: number): void => {
    setSelectedLineId(id);
    setShowArticleModal(true);
  };
  
  // Select an article and add it to the line item
  const selectArticle = (article: Article): void => {
    if (selectedLineId !== null) {
      setLineItems(prev => 
        prev.map(item => 
          item.id === selectedLineId ? { 
            ...item,
            codeArticle: article.code,
            description: article.desc,
            pvHT: article.prix,
            codeUnite: article.unite,
            tva: article.tva
          } : item
        )
      );
      setShowArticleModal(false);
    }
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

  // Calculate totals when line items change
  useEffect(() => {
    // Calculate each line item's net amount
    const updatedLineItems = lineItems.map(item => ({
      ...item,
      montantNetHT: calculateLineItemAmount(item)
    }));
    
    setLineItems(updatedLineItems);
    
    // Calculate totals
    const totalBrutHT = updatedLineItems.reduce(
      (sum, item) => {
        const quantity = typeof item.quantite === 'string' ? parseFloat(item.quantite) : item.quantite;
        return sum + (quantity * parseFloat(item.pvHT));
      }, 
      0
    ).toFixed(2);
    
    const remiseGlobale = parseFloat(totalBrutHT) * parseFloat(totals.pourcentageRemise) / 100;
    
    const totalNetHT = (parseFloat(totalBrutHT) - remiseGlobale).toFixed(2);
    
    const totalTVA = updatedLineItems.reduce(
      (sum, item) => sum + (parseFloat(item.montantNetHT) * parseFloat(item.tva) / 100), 
      0
    ).toFixed(2);
    
    const portHTValue = parseFloat(totals.portHT) || 0;
    const tvaPortValue = (portHTValue * parseFloat(totals.tvaPort) / 100);
    
    const totalTTC = (parseFloat(totalNetHT) + parseFloat(totalTVA) + portHTValue + tvaPortValue).toFixed(2);
    
    setTotals(prev => ({
      ...prev,
      totalBrutHT,
      totalNetHT,
      totalTTC,
      netARembourser: totalTTC
    }));
    
  }, [lineItems, totals.portHT, totals.tvaPort, totals.pourcentageRemise]);

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

  // Handle opening the add client/prospect modal
  // const handleAddClient = (type: 'client' | 'prospect'): void => {
  //   setClientType(type);
  //   setShowClientDropdown(false);
  //   setShowClientModal(true);
  // };

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
                            onClick={() => setShowInvoiceModal(true)}
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
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Code tiers</label>
                      <div className="relative">
                        <div className="relative">
                          <input
                            type="text"
                            value={clientSearch}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              setClientSearch(e.target.value);
                              setShowClientDropdown(true);
                            }}
                            onFocus={() => setShowClientDropdown(true)}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all pr-10 text-gray-800"
                            placeholder="Rechercher un client..."
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <FiSearch className="text-gray-400" />
                          </div>
                        </div>

                        {showClientDropdown && (
                          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg max-h-60 overflow-auto border border-gray-200">
                            {filteredClients.length > 0 ? (
                              filteredClients.map(client => (
                                <div
                                  key={client.id}
                                  className="p-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                                  onClick={() => selectClient(client)}
                                >
                                  <div>
                                    <div className="font-medium">{client.name}</div>
                                    <div className="text-xs text-gray-500">{client.id}</div>
                                  </div>
                                  <span className={`text-xs px-2 py-0.5 rounded ${
                                    client.type === 'client' 
                                      ? 'bg-blue-100 text-blue-800' 
                                      : 'bg-green-100 text-green-800'
                                  }`}>
                                    {client.type === 'client' ? 'Client' : 'Prospect'}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <div className="p-3 text-center text-gray-500">
                                Aucun résultat trouvé
                              </div>
                            )}
                          </div>
                        )}
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
              <div className="mb-6 flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex-shrink-0 pt-0.5">
                  <FiInfo className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-blue-800">À propos des avoirs</h3>
                  <p className="mt-1 text-sm text-blue-700">
                    Un avoir est un document émis pour annuler partiellement ou totalement une facture. 
                    Sélectionnez la facture concernée, indiquez les articles à rembourser et le montant sera calculé automatiquement.
                  </p>
                </div>
              </div>

              {/* Detail Tab */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Détails des articles à rembourser</h3>
                  <div className="flex items-center text-xs text-gray-500">
                    <FiInfo className="mr-1" />
                    Cliquez sur Code article pour sélectionner un article
                  </div>
                </div>
                
                <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Code article
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantité
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Code unité
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          PV HT
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          % remise
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Montant Net HT
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          TVA
                        </th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {lineItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="relative">
                              <input
                                type="text"
                                value={item.codeArticle}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleLineItemChange(item.id, 'codeArticle', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all text-gray-800 cursor-pointer"
                                onClick={() => openArticleSelection(item.id)}
                                readOnly
                                placeholder="Sélectionner..."
                              />
                              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <FiChevronsRight size={16} className="text-gray-400" />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => handleLineItemChange(item.id, 'description', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all text-gray-800"
                              placeholder="Description"
                            />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <input
                              type="number"
                              value={item.quantite}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => handleLineItemChange(item.id, 'quantite', parseInt(e.target.value) || 0)}
                              className="w-24 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all text-gray-800"
                              min="1"
                            />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <select
                              value={item.codeUnite}
                              onChange={(e: ChangeEvent<HTMLSelectElement>) => handleLineItemChange(item.id, 'codeUnite', e.target.value)}
                              className="w-24 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all text-gray-800"
                            >
                              <option value="h">h</option>
                              <option value="jour">jour</option>
                              <option value="forfait">forfait</option>
                              <option value="pcs">pcs</option>
                              <option value="kg">kg</option>
                              <option value="m">m</option>
                              <option value="m2">m²</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                <FaEuroSign className="text-gray-400" size={12} />
                              </div>
                              <input
                                type="text"
                                value={item.pvHT}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleLineItemChange(item.id, 'pvHT', e.target.value)}
                                className="w-24 p-2 pl-6 border border-gray-300 rounded focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all text-gray-800"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                <FiInfo className="text-gray-400" size={12} />
                              </div>
                              <input
                                type="text"
                                value={item.remise}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleLineItemChange(item.id, 'remise', e.target.value)}
                                className="w-24 p-2 pl-6 border border-gray-300 rounded focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all text-gray-800"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                <FaEuroSign className="text-gray-400" size={12} />
                              </div>
                              <input
                                type="text"
                                value={item.montantNetHT}
                                readOnly
                                className="w-24 p-2 pl-6 border border-gray-200 rounded bg-gray-50 text-gray-800"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                <FiInfo className="text-gray-400" size={12} />
                              </div>
                              <input
                                type="text"
                                value={item.tva}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleLineItemChange(item.id, 'tva', e.target.value)}
                                className="w-24 p-2 pl-6 border border-gray-300 rounded focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all text-gray-800"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            <button
                              onClick={() => removeLineItem(item.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                              disabled={lineItems.length === 1}
                              title="Supprimer la ligne"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-3">
                  <button
                    onClick={addLineItem}
                    className="flex items-center text-red-600 hover:bg-red-50 px-3 py-2 rounded transition-colors font-medium"
                  >
                    <FiPlus className="mr-1" />
                    Ajouter une ligne
                  </button>
                </div>
              </div>

              {/* Totals */}
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column - Notes */}
                  <div>
                    <div className="p-4 border border-gray-200 rounded-lg bg-white h-full shadow-sm">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Commentaires / Motif détaillé</label>
                      <textarea
                        className="w-full h-40 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all text-gray-800"
                        placeholder="Saisissez les détails du motif de l'avoir ou des commentaires supplémentaires..."
                      ></textarea>
                    </div>
                  </div>
                  
                  {/* Right Column - Totals */}
                  <div className="space-y-2">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                      <div className="flex items-start">
                        <FiCornerDownRight className="text-blue-500 mt-0.5 mr-2" />
                        <div>
                          <span className="text-sm font-medium text-blue-700">Facture d&apos;origine : </span>
                          <span className="text-sm text-blue-600">{formData.factureLiee || "Non sélectionnée"}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3">
                      <span className="text-sm text-gray-600">Total brut HT</span>
                      <span className="font-medium">{totals.totalBrutHT} €</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-white rounded border border-gray-200 shadow-sm">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600 mr-2">% Remise</span>
                        <input
                          type="text"
                          name="pourcentageRemise"
                          value={totals.pourcentageRemise}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setTotals({...totals, pourcentageRemise: e.target.value})}
                          className="w-16 p-1 border border-gray-300 rounded text-gray-800"
                        />
                      </div>
                      <span className="font-medium">
                        {(parseFloat(totals.totalBrutHT) * parseFloat(totals.pourcentageRemise) / 100).toFixed(2)} €
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-white rounded border border-gray-200 shadow-sm">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600 mr-2">Port HT</span>
                        <input
                          type="text"
                          name="portHT"
                          value={totals.portHT}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setTotals({...totals, portHT: e.target.value})}
                          className="w-16 p-1 border border-gray-300 rounded text-gray-800"
                        />
                      </div>
                      <span className="font-medium">{totals.portHT} €</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-white rounded border border-gray-200 shadow-sm">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600 mr-2">TVA Port</span>
                        <input
                          type="text"
                          name="tvaPort"
                          value={totals.tvaPort}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setTotals({...totals, tvaPort: e.target.value})}
                          className="w-16 p-1 border border-gray-300 rounded text-gray-800"
                        />
                        <span className="ml-1">%</span>
                      </div>
                      <span className="font-medium">
                        {(parseFloat(totals.portHT) * parseFloat(totals.tvaPort) / 100).toFixed(2)} €
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3">
                      <span className="text-sm text-gray-600">Total Net HT</span>
                      <span className="font-medium">{totals.totalNetHT} €</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                      <span className="font-medium text-gray-700">TVA</span>
                      <span className="font-medium">
                        {(parseFloat(totals.totalNetHT) * 0.2).toFixed(2)} €
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-red-100 rounded-lg shadow-sm">
                      <span className="font-medium text-gray-700">Total TTC à rembourser</span>
                      <span className="font-bold text-lg text-red-700">{totals.totalTTC} €</span>
                    </div>
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
                  style={{ backgroundColor: '#e53e3e' }}
                  onClick={handleSaveCreditNote}
                >
                  <FiSave className="mr-2" />
                  Enregistrer l&apos;avoir
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
                  Avoir enregistré avec succès
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Invoice Selection Modal */}
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
                      Sélectionner une facture
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
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all pl-10 text-gray-800"
                          placeholder="Rechercher une facture..."
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
                              <div className="font-medium text-gray-900">{invoice.id}</div>
                              <div className="text-sm font-bold">{invoice.montantTTC}</div>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <div className="text-sm text-gray-500">{invoice.client}</div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500">{invoice.date}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  invoice.statut === 'Payée' 
                                    ? 'bg-green-100 text-green-800' 
                                    : invoice.statut === 'En attente'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {invoice.statut}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {filteredInvoices.length === 0 && (
                          <div className="p-4 text-center text-gray-500 border border-dashed border-gray-300 rounded-lg">
                            Aucune facture trouvée
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
          
          {/* Article Selection Modal */}
          <AnimatePresence>
            {showArticleModal && (
              <motion.div
                className="fixed inset-0 z-[60] flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div 
                  className="fixed inset-0 bg-black bg-opacity-50"
                  onClick={() => setShowArticleModal(false)}
                />
                <motion.div
                  className="relative bg-white rounded-xl shadow-xl w-full max-w-lg m-4 z-10"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                >
                  <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-medium">
                      Sélectionner un article
                    </h3>
                    <button
                      onClick={() => setShowArticleModal(false)}
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
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all pl-10 text-gray-800"
                          placeholder="Rechercher un article..."
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                          <FiSearch className="text-gray-400" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="overflow-y-auto max-h-80">
                      <div className="space-y-2">
                        {articlesCommuns.map(article => (
                          <div 
                            key={article.code} 
                            className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => selectArticle(article)}
                          >
                            <div className="flex justify-between">
                              <div className="font-medium">{article.desc}</div>
                              <div className="text-sm font-bold">{article.prix} €</div>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <div className="text-xs text-gray-500">{article.code}</div>
                              <div className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                                {article.unite} | TVA: {article.tva}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t text-center text-gray-500 text-sm">
                      <p>Sélectionnez un article prédéfini ou saisissez les informations manuellement</p>
                    </div>
                  </div>
                  <div className="flex justify-end p-4 border-t">
                    <div className="flex space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowArticleModal(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all"
                      >
                        Annuler
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 text-white rounded-lg shadow-sm hover:shadow-md transition-all"
                        style={{ backgroundColor: '#e53e3e' }}
                        onClick={() => setShowArticleModal(false)}
                      >
                        Créer nouvel article
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

export default CreateCreditNoteModal;