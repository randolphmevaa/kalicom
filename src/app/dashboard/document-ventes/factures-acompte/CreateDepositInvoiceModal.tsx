import React, { useState, useEffect, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, 
  FiX, 
  FiSave, 
  FiTrash2, 
//   FiUser, 
  FiSearch,
//   FiCalendar,
  FiInfo,
//   FiClipboard,
  FiCheck,
  FiFileText,
  FiChevronsRight,
//   FiCreditCard,
  FiPercent,
//   FiAlertCircle,
//   FiArrowRight,
  FiLink,
//   FiSliders
} from 'react-icons/fi';
import { FaEuroSign } from "react-icons/fa";

// Define interfaces for proper typing
interface CreateDepositInvoiceModalProps {
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
  projetLie: string;
  montantTotal: string;
  pourcentageAcompte: string;
  montantAcompte: string;
  etat: string;
  date: string;
  dateEcheance: string;
  modeReglement: string;
  typePaiement: 'pourcentage' | 'montant';
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
  montantAcompte: string;
  pourcentageAcompte: string;
  soldeFinalPrevu: string;
}

// Sample projects for quick selection
const projetsList = [
  { id: 'PROJ001', titre: 'Développement CRM', client: 'Société Dupont', montant: '15600.00', echeance: '30/05/2025' },
  { id: 'PROJ002', titre: 'Refonte site web', client: 'Entreprise Martin', montant: '8900.00', echeance: '15/04/2025' },
  { id: 'PROJ003', titre: 'Module facturation', client: 'Nexus Tech', montant: '2990.00', echeance: '10/04/2025' },
  { id: 'PROJ004', titre: 'Audit de sécurité', client: 'Global Industries', montant: '3500.00', echeance: '05/04/2025' },
  { id: 'PROJ005', titre: 'Formation utilisateurs', client: 'Tech Innovate', montant: '12750.00', echeance: '20/04/2025' },
];

// Sample articles for quick selection
const articlesCommuns = [
  { code: 'ART001', desc: 'Acompte pour consultation standard', prix: '75.00', unite: 'h', tva: '20.00' },
  { code: 'ART002', desc: 'Acompte pour maintenance informatique', prix: '95.00', unite: 'h', tva: '20.00' },
  { code: 'ART003', desc: 'Acompte pour développement sur mesure', prix: '120.00', unite: 'h', tva: '20.00' },
  { code: 'ART004', desc: 'Acompte pour formation utilisateurs', prix: '650.00', unite: 'jour', tva: '20.00' },
  { code: 'ART005', desc: 'Acompte pour audit de sécurité', prix: '1200.00', unite: 'forfait', tva: '20.00' },
];

// Deposit percentages
const depositPercentages = ['30%', '40%', '50%', '60%', '70%'];

interface Project {
  id: string;
  titre: string;
  client: string;
  montant: string;
  echeance: string;
}

interface Article {
  code: string;
  desc: string;
  prix: string;
  unite: string;
  tva: string;
}

// Modal component for creating a new deposit invoice
const CreateDepositInvoiceModal: React.FC<CreateDepositInvoiceModalProps> = ({ isOpen, onClose }) => {
  // State for form fields
  const [formData, setFormData] = useState<FormData>({
    numero: 'FA-2025-008',
    codeTiers: '',
    civilite: '',
    nom: '',
    prenom: '',
    adresse: '',
    codePostal: '',
    ville: '',
    reference: '',
    projetLie: '',
    montantTotal: '0.00',
    pourcentageAcompte: '30',
    montantAcompte: '0.00',
    etat: 'En attente',
    date: new Date().toISOString().split('T')[0],
    dateEcheance: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString().split('T')[0],
    modeReglement: 'Virement',
    typePaiement: 'pourcentage'
  });

  // State for the line items in the invoice
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { 
      id: 1, 
      codeArticle: '', 
      description: 'Acompte sur projet', 
      quantite: 1, 
      codeUnite: 'forfait', 
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
    montantAcompte: '0.00',
    pourcentageAcompte: '30',
    soldeFinalPrevu: '0.00'
  });

  // State for showing client/prospect add modal
  const [showClientModal, setShowClientModal] = useState<boolean>(false);
  const [clientType, setClientType] = useState<'client' | 'prospect'>('client');
  
  // State for showing article selection modal
  const [showArticleModal, setShowArticleModal] = useState<boolean>(false);
  const [selectedLineId, setSelectedLineId] = useState<number | null>(null);
  
  // State for showing project selection modal
  const [showProjectModal, setShowProjectModal] = useState<boolean>(false);
  
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
      id: 'CLI004', 
      name: 'Nexus Tech', 
      type: 'client',
      civilite: 'Mme',
      nom: 'Nexus',
      prenom: 'Technologies',
      adresse: '456 Tech Street',
      codePostal: '69002',
      ville: 'Lyon',
      telephone: '04 78 12 34 56',
      email: 'info@nexus-tech.fr'
    },
    { 
      id: 'CLI005', 
      name: 'Tech Innovate', 
      type: 'client',
      civilite: 'Mme',
      nom: 'Tech',
      prenom: 'Innovate',
      adresse: '34 Rue des Lilas',
      codePostal: '67000',
      ville: 'Strasbourg',
      telephone: '03 88 56 78 90',
      email: 'm.petit@techinnovate.fr'
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
  
  // State for project search
  const [projectSearch, setProjectSearch] = useState<string>('');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projetsList);
  
  // Filter clients based on search term
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    client.id.toLowerCase().includes(clientSearch.toLowerCase())
  );

  // Filter projects based on search term
  useEffect(() => {
    if (projectSearch) {
      setFilteredProjects(projetsList.filter(project => 
        project.id.toLowerCase().includes(projectSearch.toLowerCase()) ||
        project.titre.toLowerCase().includes(projectSearch.toLowerCase()) ||
        project.client.toLowerCase().includes(projectSearch.toLowerCase())
      ));
    } else {
      setFilteredProjects(projetsList);
    }
  }, [projectSearch]);

  // Handle input change for top section fields
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Special handling for percentage and montant to keep them in sync
    if (name === 'pourcentageAcompte' && formData.typePaiement === 'pourcentage') {
      const percentage = parseFloat(value) || 0;
      const totalAmount = parseFloat(formData.montantTotal.replace(/[^\d,.]/g, '').replace(',', '.')) || 0;
      const depositAmount = (totalAmount * percentage / 100).toFixed(2);
      
      setFormData(prev => ({
        ...prev,
        montantAcompte: depositAmount
      }));
      
      setTotals(prev => ({
        ...prev,
        pourcentageAcompte: value,
        montantAcompte: depositAmount
      }));
      
      // Update the line item with the new amount
      if (lineItems.length > 0) {
        setLineItems(prev => 
          prev.map((item, index) => 
            index === 0 ? { ...item, pvHT: depositAmount } : item
          )
        );
      }
    } 
    else if (name === 'montantAcompte' && formData.typePaiement === 'montant') {
      const depositAmount = parseFloat(value) || 0;
      const totalAmount = parseFloat(formData.montantTotal.replace(/[^\d,.]/g, '').replace(',', '.')) || 0;
      const percentage = totalAmount > 0 ? ((depositAmount * 100) / totalAmount).toFixed(0) : '0';
      
      setFormData(prev => ({
        ...prev,
        pourcentageAcompte: percentage
      }));
      
      setTotals(prev => ({
        ...prev,
        pourcentageAcompte: percentage,
        montantAcompte: value
      }));
      
      // Update the line item with the new amount
      if (lineItems.length > 0) {
        setLineItems(prev => 
          prev.map((item, index) => 
            index === 0 ? { ...item, pvHT: value } : item
          )
        );
      }
    }
    else if (name === 'montantTotal') {
      const totalAmount = parseFloat(value.replace(/[^\d,.]/g, '').replace(',', '.')) || 0;
      const percentage = parseFloat(formData.pourcentageAcompte) || 0;
      const depositAmount = (totalAmount * percentage / 100).toFixed(2);
      
      setFormData(prev => ({
        ...prev,
        montantAcompte: depositAmount
      }));
      
      setTotals(prev => ({
        ...prev,
        montantAcompte: depositAmount,
        soldeFinalPrevu: (totalAmount - parseFloat(depositAmount)).toFixed(2)
      }));
      
      // Update the line item with the new amount
      if (lineItems.length > 0) {
        setLineItems(prev => 
          prev.map((item, index) => 
            index === 0 ? { ...item, pvHT: depositAmount } : item
          )
        );
      }
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
        description: 'Ajustement ligne', 
        quantite: 1, 
        codeUnite: 'forfait', 
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
  
  // Select a project and populate related fields
  const selectProject = (project: Project): void => {
    // Find the client associated with this project
    const associatedClient = clients.find(c => c.name === project.client);
    
    if (associatedClient) {
      selectClient(associatedClient);
    }
    
    const totalAmount = project.montant;
    const percentage = parseFloat(formData.pourcentageAcompte) || 30;
    const depositAmount = (parseFloat(totalAmount) * percentage / 100).toFixed(2);
    
    setFormData(prev => ({
      ...prev,
      projetLie: project.id,
      montantTotal: totalAmount,
      montantAcompte: depositAmount,
      reference: `Acompte ${project.id} - ${project.titre}`
    }));
    
    setTotals(prev => ({
      ...prev,
      montantAcompte: depositAmount,
      soldeFinalPrevu: (parseFloat(totalAmount) - parseFloat(depositAmount)).toFixed(2)
    }));
    
    // Update the line item with the new amount and description
    if (lineItems.length > 0) {
      setLineItems(prev => 
        prev.map((item, index) => 
          index === 0 ? { 
            ...item, 
            description: `Acompte pour ${project.titre}`, 
            pvHT: depositAmount 
          } : item
        )
      );
    }
    
    setShowProjectModal(false);
  };
  
  // Apply a predefined percentage
  const applyPresetPercentage = (percentage: string): void => {
    const cleanPercentage = percentage.replace('%', '');
    const percentageValue = parseFloat(cleanPercentage);
    const totalAmount = parseFloat(formData.montantTotal.replace(/[^\d,.]/g, '').replace(',', '.')) || 0;
    const depositAmount = (totalAmount * percentageValue / 100).toFixed(2);
    
    setFormData(prev => ({
      ...prev,
      pourcentageAcompte: cleanPercentage,
      montantAcompte: depositAmount,
      typePaiement: 'pourcentage'
    }));
    
    setTotals(prev => ({
      ...prev,
      pourcentageAcompte: cleanPercentage,
      montantAcompte: depositAmount,
      soldeFinalPrevu: (totalAmount - parseFloat(depositAmount)).toFixed(2)
    }));
    
    // Update the line item with the new amount
    if (lineItems.length > 0) {
      setLineItems(prev => 
        prev.map((item, index) => 
          index === 0 ? { ...item, pvHT: depositAmount } : item
        )
      );
    }
  };
  
  // Handle saving the deposit invoice
  const handleSaveDepositInvoice = (): void => {
    // Show save confirmation briefly
    setShowSaveConfirmation(true);
    
    // In a real app, you would save the invoice to your backend here
    console.log("Enregistrement de la facture d'acompte:", {
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
    
    // Update deposit amount based on first line item if in percentage mode
    const firstItemAmount = updatedLineItems.length > 0 ? parseFloat(updatedLineItems[0].montantNetHT) : 0;
    
    setTotals(prev => ({
      ...prev,
      totalBrutHT,
      totalNetHT,
      totalTTC,
      montantAcompte: firstItemAmount.toFixed(2)
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
  const handleAddClient = (type: 'client' | 'prospect'): void => {
    setClientType(type);
    setShowClientDropdown(false);
    setShowClientModal(true);
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
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-7xl max-h-[90vh] overflow-y-auto m-4"
            variants={modalVariants}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b bg-white">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <FiFileText className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Nouvelle Facture d&apos;acompte</h2>
                <span className="px-2 py-1 text-xs text-indigo-600 bg-indigo-50 rounded-full border border-indigo-200">
                  Acompte
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
              <div className="mb-6 flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex-shrink-0 pt-0.5">
                  <FiInfo className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-blue-800">À propos des factures d&apos;acompte</h3>
                  <p className="mt-1 text-sm text-blue-700">
                    Une facture d&apos;acompte est un document qui permet de demander un paiement partiel avant la réalisation complète 
                    d&apos;un projet. Ce montant sera déduit de la facture finale. Sélectionnez un projet existant 
                    ou définissez un pourcentage sur le montant total.
                  </p>
                </div>
              </div>

              {/* Project Selection */}
              <div className="bg-gray-50 p-6 rounded-xl mb-6 shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Projet lié</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sélectionner un projet</label>
                    <div className="relative">
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.projetLie}
                          readOnly
                          onClick={() => setShowProjectModal(true)}
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all pr-10 text-gray-800 cursor-pointer"
                          placeholder="Sélectionner un projet..."
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
                      placeholder="Référence de l'acompte"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Montant total du projet</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEuroSign className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="montantTotal"
                        value={formData.montantTotal}
                        onChange={handleInputChange}
                        className="w-full p-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-gray-700">Type de paiement</label>
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
                            name="pourcentageAcompte"
                            value={formData.pourcentageAcompte}
                            onChange={handleInputChange}
                            className="w-full p-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
                            placeholder="30"
                          />
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {depositPercentages.map((p, index) => (
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
                          name="montantAcompte"
                          value={formData.montantAcompte}
                          onChange={handleInputChange}
                          className="w-full p-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
                          placeholder="0.00"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Montant d&apos;acompte</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEuroSign className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        readOnly
                        value={formData.montantAcompte}
                        className="w-full p-2.5 pl-10 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 mt-4 border border-indigo-100 bg-indigo-50 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-xs text-gray-500">Montant total</span>
                    <p className="text-sm font-bold text-gray-900">{parseFloat(formData.montantTotal).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Acompte</span>
                    <p className="text-sm font-bold text-indigo-600">{parseFloat(formData.montantAcompte).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Pourcentage</span>
                    <p className="text-sm font-bold text-gray-900">{formData.pourcentageAcompte}%</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Solde prévu</span>
                    <p className="text-sm font-bold text-gray-900">{(parseFloat(formData.montantTotal) - parseFloat(formData.montantAcompte)).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</p>
                  </div>
                </div>
              </div>

              {/* Top Section - Client Info */}
              <div className="bg-gray-50 p-6 rounded-xl mb-6 shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informations client</h3>

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
                        placeholder="FA-2025-XXX"
                      />
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
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all pr-10 text-gray-800"
                            placeholder="Rechercher un client..."
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <FiSearch className="text-gray-400" />
                          </div>
                        </div>

                        {showClientDropdown && (
                          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg max-h-60 overflow-auto border border-gray-200">
                            <div className="p-2 border-b">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleAddClient('client')}
                                  className="flex items-center text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                                >
                                  <FiPlus className="mr-1" />
                                  Client
                                </button>
                                <button
                                  onClick={() => handleAddClient('prospect')}
                                  className="flex items-center text-xs px-2 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                                >
                                  <FiPlus className="mr-1" />
                                  Prospect
                                </button>
                              </div>
                            </div>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">État</label>
                        <select
                          name="etat"
                          value={formData.etat}
                          onChange={handleInputChange}
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
                        >
                          <option value="En attente">En attente</option>
                          <option value="Payée">Payée</option>
                          <option value="En retard">En retard</option>
                          <option value="Annulée">Annulée</option>
                        </select>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
                        />
                      </div>
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
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mode de règlement</label>
                      <select
                        name="modeReglement"
                        value={formData.modeReglement}
                        onChange={handleInputChange}
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
                      >
                        {moyensPaiement.map((moyen, index) => (
                          <option key={index} value={moyen}>{moyen}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detail Tab */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Détails de l&apos;acompte</h3>
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
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800 cursor-pointer"
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
                              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
                              placeholder="Description"
                            />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <input
                              type="number"
                              value={item.quantite}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => handleLineItemChange(item.id, 'quantite', parseInt(e.target.value) || 0)}
                              className="w-24 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
                              min="1"
                            />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <select
                              value={item.codeUnite}
                              onChange={(e: ChangeEvent<HTMLSelectElement>) => handleLineItemChange(item.id, 'codeUnite', e.target.value)}
                              className="w-24 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
                            >
                              <option value="forfait">forfait</option>
                              <option value="jour">jour</option>
                              <option value="h">h</option>
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
                                className="w-24 p-2 pl-6 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                <FiPercent className="text-gray-400" size={12} />
                              </div>
                              <input
                                type="text"
                                value={item.remise}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleLineItemChange(item.id, 'remise', e.target.value)}
                                className="w-24 p-2 pl-6 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
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
                                <FiPercent className="text-gray-400" size={12} />
                              </div>
                              <input
                                type="text"
                                value={item.tva}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleLineItemChange(item.id, 'tva', e.target.value)}
                                className="w-24 p-2 pl-6 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
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
                    className="flex items-center text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded transition-colors font-medium"
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Notes / Conditions</label>
                      <textarea
                        className="w-full h-40 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
                        placeholder="Saisissez vos notes ou conditions particulières pour cet acompte..."
                      ></textarea>
                    </div>
                  </div>
                  
                  {/* Right Column - Totals */}
                  <div className="space-y-2">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                      <div className="flex items-start">
                        <FiInfo className="text-blue-500 mt-0.5 mr-2" />
                        <div>
                          <span className="text-sm font-medium text-blue-700">Cet acompte représente </span>
                          <span className="text-sm text-blue-600 font-bold">{formData.pourcentageAcompte}%</span>
                          <span className="text-sm text-blue-700"> du montant total prévu de </span>
                          <span className="text-sm text-blue-600 font-bold">{parseFloat(formData.montantTotal).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</span>
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
                    
                    <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                      <span className="font-medium text-gray-700">TVA</span>
                      <span className="font-medium">
                        {(parseFloat(totals.totalNetHT) * 0.2).toFixed(2)} €
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-indigo-100 rounded-lg shadow-sm">
                      <span className="font-medium text-gray-700">Total TTC à payer</span>
                      <span className="font-bold text-lg text-indigo-700">{totals.totalTTC} €</span>
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
                  style={{ backgroundColor: '#4F46E5' }}
                  onClick={handleSaveDepositInvoice}
                >
                  <FiSave className="mr-2" />
                  Enregistrer la facture d&apos;acompte
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
                  Facture d&apos;acompte enregistrée avec succès
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Client/Prospect Add Modal */}
          <AnimatePresence>
            {showClientModal && (
              <motion.div
                className="fixed inset-0 z-[60] flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div 
                  className="fixed inset-0 bg-black bg-opacity-50"
                  onClick={() => setShowClientModal(false)}
                />
                <motion.div
                  className="relative bg-white rounded-xl shadow-xl w-full max-w-lg m-4 z-10"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                >
                  <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-medium">
                      {clientType === 'client' ? 'Ajouter un client' : 'Ajouter un prospect'}
                    </h3>
                    <button
                      onClick={() => setShowClientModal(false)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <FiX />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                        <input
                          type="text"
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
                          placeholder={clientType === 'client' ? 'CLI-XXX' : 'PRO-XXX'}
                          defaultValue={clientType === 'client' ? 'CLI-' : 'PRO-'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom / Raison sociale</label>
                        <input
                          type="text"
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
                          placeholder="Nom ou raison sociale"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                          <input
                            type="text"
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
                            placeholder="Téléphone"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input
                            type="email"
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
                            placeholder="Email"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
                          <input
                            type="text"
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
                            placeholder="Code postal"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                          <input
                            type="text"
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
                            placeholder="Ville"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end p-4 border-t">
                    <div className="flex space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowClientModal(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all"
                      >
                        Annuler
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 text-white rounded-lg shadow-sm hover:shadow-md transition-all"
                        style={{ backgroundColor: '#4F46E5' }}
                        onClick={() => setShowClientModal(false)}
                      >
                        Enregistrer
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Project Selection Modal */}
          <AnimatePresence>
            {showProjectModal && (
              <motion.div
                className="fixed inset-0 z-[60] flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div 
                  className="fixed inset-0 bg-black bg-opacity-50"
                  onClick={() => setShowProjectModal(false)}
                />
                <motion.div
                  className="relative bg-white rounded-xl shadow-xl w-full max-w-lg m-4 z-10"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                >
                  <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-medium">
                      Sélectionner un projet
                    </h3>
                    <button
                      onClick={() => setShowProjectModal(false)}
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
                          placeholder="Rechercher un projet..."
                          value={projectSearch}
                          onChange={(e) => setProjectSearch(e.target.value)}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                          <FiSearch className="text-gray-400" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="overflow-y-auto max-h-80">
                      <div className="space-y-2">
                        {filteredProjects.map(project => (
                          <div 
                            key={project.id} 
                            className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => selectProject(project)}
                          >
                            <div className="flex justify-between">
                              <div className="font-medium text-gray-900">{project.titre}</div>
                              <div className="text-sm font-bold">{parseFloat(project.montant).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</div>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <div className="flex items-center space-x-1">
                                <span className="text-xs text-indigo-600">{project.id}</span>
                                <span className="text-xs text-gray-500">•</span>
                                <span className="text-xs text-gray-500">{project.client}</span>
                              </div>
                              <span className="text-xs text-gray-500">Échéance: {project.echeance}</span>
                            </div>
                          </div>
                        ))}
                        
                        {filteredProjects.length === 0 && (
                          <div className="p-4 text-center text-gray-500 border border-dashed border-gray-300 rounded-lg">
                            Aucun projet trouvé
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
                        onClick={() => setShowProjectModal(false)}
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
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all pl-10 text-gray-800"
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
                        style={{ backgroundColor: '#4F46E5' }}
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

export default CreateDepositInvoiceModal;