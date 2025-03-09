'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiFileText, FiSearch, FiFilter, FiPlus, FiEdit, FiTrash2, FiEye,
FiClock,
  FiCheckCircle, FiAlertTriangle, FiXCircle, FiDatabase,
  FiPieChart, FiGlobe, FiMail, FiPhone
} from 'react-icons/fi';

export default function InformationsAdministratives() {
  // State for active tab, filters, and search
  const [activeTab, setActiveTab] = useState('entreprise');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('Tous');
  const [selectedStatus, setSelectedStatus] = useState('Tous');
  const [selectedPeriod, setSelectedPeriod] = useState('Tous');
  
  // State for selected items (for bulk actions)
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Company information state
  const [companyInfo ] = useState({
    name: 'Votre Entreprise SARL',
    legalForm: 'SARL',
    address: '123 Rue des Entrepreneurs, 75001 Paris',
    postalCode: '75001',
    city: 'Paris',
    country: 'France',
    siret: '123 456 789 00012',
    siren: '123 456 789',
    vatNumber: 'FR 12 123456789',
    registrationDate: '15/03/2018',
    capital: '10 000 €',
    phone: '+33 1 23 45 67 89',
    email: 'contact@votreentreprise.fr',
    website: 'www.votreentreprise.fr',
    mainActivity: 'Développement de logiciels',
    ape: '6201Z',
    legalRepresentative: 'Jean Dubois'
  });

  // Tax settings state
  const [taxSettings] = useState({
    vatRegime: 'Régime réel normal',
    vatPeriodicity: 'Mensuelle',
    taxSystem: 'Impôt sur les sociétés (IS)',
    fiscalYearStart: '01/01',
    fiscalYearEnd: '31/12',
    accountingMethod: 'Engagement',
    defaultVatRate: '20%'
  });

  // Sample legal documents data
  const documentsData = [
    {
      id: 'DOC-2025-001',
      titre: 'Statuts de la société',
      type: 'Document juridique',
      dateCreation: '15/03/2018',
      dateExpiration: null,
      statut: 'Actif',
      fichier: 'statuts_entreprise.pdf',
      taille: '2.3 Mo',
      auteur: 'Cabinet juridique Martin',
      alertesActivees: true,
      notes: 'Statuts initiaux de la société'
    },
    {
      id: 'DOC-2025-002',
      titre: 'Extrait KBIS',
      type: 'Document juridique',
      dateCreation: '01/02/2025',
      dateExpiration: '01/02/2026',
      statut: 'Actif',
      fichier: 'extrait_kbis_2025.pdf',
      taille: '1.2 Mo',
      auteur: 'Greffe du tribunal de commerce',
      alertesActivees: true,
      notes: 'À renouveler annuellement'
    },
    {
      id: 'DOC-2025-003',
      titre: 'Attestation d\'assurance',
      type: 'Assurance',
      dateCreation: '15/01/2025',
      dateExpiration: '14/01/2026',
      statut: 'Actif',
      fichier: 'attestation_assurance_2025.pdf',
      taille: '1.5 Mo',
      auteur: 'AssurPro',
      alertesActivees: true,
      notes: 'Assurance responsabilité civile professionnelle'
    },
    {
      id: 'DOC-2025-004',
      titre: 'Procès-verbal d\'assemblée générale',
      type: 'Document juridique',
      dateCreation: '20/03/2024',
      dateExpiration: null,
      statut: 'Actif',
      fichier: 'pv_ag_2024.pdf',
      taille: '1.8 Mo',
      auteur: 'Direction',
      alertesActivees: false,
      notes: 'Approbation des comptes 2023'
    },
    {
      id: 'DOC-2025-005',
      titre: 'Contrat de bail',
      type: 'Contrat',
      dateCreation: '01/06/2023',
      dateExpiration: '31/05/2026',
      statut: 'Actif',
      fichier: 'contrat_bail_2023.pdf',
      taille: '3.2 Mo',
      auteur: 'Agence immobilière Dupont',
      alertesActivees: true,
      notes: 'Bail commercial des locaux principaux'
    },
    {
      id: 'DOC-2025-006',
      titre: 'Déclaration TVA Janvier 2025',
      type: 'Document fiscal',
      dateCreation: '15/02/2025',
      dateExpiration: null,
      statut: 'Archivé',
      fichier: 'tva_01_2025.pdf',
      taille: '0.8 Mo',
      auteur: 'Comptable',
      alertesActivees: false,
      notes: 'Déclaration mensuelle TVA'
    },
    {
      id: 'DOC-2025-007',
      titre: 'Contrat de maintenance informatique',
      type: 'Contrat',
      dateCreation: '01/01/2025',
      dateExpiration: '31/12/2025',
      statut: 'Actif',
      fichier: 'contrat_maintenance_2025.pdf',
      taille: '1.7 Mo',
      auteur: 'InfoSupport',
      alertesActivees: true,
      notes: 'Contrat annuel de support technique'
    },
    {
      id: 'DOC-2025-008',
      titre: 'Certificat de dépôt de marque',
      type: 'Propriété intellectuelle',
      dateCreation: '10/05/2022',
      dateExpiration: '09/05/2032',
      statut: 'Actif',
      fichier: 'certificat_marque.pdf',
      taille: '1.3 Mo',
      auteur: 'INPI',
      alertesActivees: true,
      notes: 'Protection du nom et logo de l\'entreprise'
    },
    {
      id: 'DOC-2025-009',
      titre: 'Déclaration sociale nominative Février 2025',
      type: 'Document social',
      dateCreation: '05/03/2025',
      dateExpiration: null,
      statut: 'En cours',
      fichier: 'dsn_02_2025.pdf',
      taille: '1.1 Mo',
      auteur: 'RH',
      alertesActivees: false,
      notes: 'À finaliser avant le 15/03/2025'
    }
  ];

  // Sample tax declarations data
  const declarationsData = [
    {
      id: 'DECL-2025-001',
      titre: 'Déclaration TVA Janvier 2025',
      type: 'TVA',
      dateCreation: '15/02/2025',
      dateEcheance: '15/02/2025',
      statut: 'Soumis',
      montant: '4 320,00 €',
      periode: 'Janvier 2025',
      auteur: 'Marie Comptable',
      notes: 'Déclaration mensuelle TVA'
    },
    {
      id: 'DECL-2025-002',
      titre: 'Déclaration TVA Février 2025',
      type: 'TVA',
      dateCreation: '05/03/2025',
      dateEcheance: '15/03/2025',
      statut: 'En cours',
      montant: '3 890,00 €',
      periode: 'Février 2025',
      auteur: 'Marie Comptable',
      notes: 'À finaliser et soumettre'
    },
    {
      id: 'DECL-2025-003',
      titre: 'Déclaration sociale nominative Janvier 2025',
      type: 'DSN',
      dateCreation: '05/02/2025',
      dateEcheance: '15/02/2025',
      statut: 'Soumis',
      montant: '8 250,00 €',
      periode: 'Janvier 2025',
      auteur: 'Sophie RH',
      notes: 'Déclaration mensuelle cotisations sociales'
    },
    {
      id: 'DECL-2025-004',
      titre: 'Déclaration sociale nominative Février 2025',
      type: 'DSN',
      dateCreation: '05/03/2025',
      dateEcheance: '15/03/2025',
      statut: 'En cours',
      montant: '8 350,00 €',
      periode: 'Février 2025',
      auteur: 'Sophie RH',
      notes: 'À finaliser avant échéance'
    },
    {
      id: 'DECL-2025-005',
      titre: 'Acompte IS 1er trimestre 2025',
      type: 'IS',
      dateCreation: '10/03/2025',
      dateEcheance: '15/04/2025',
      statut: 'À soumettre',
      montant: '15 400,00 €',
      periode: 'T1 2025',
      auteur: 'Marie Comptable',
      notes: 'Acompte trimestriel impôt sur les sociétés'
    },
    {
      id: 'DECL-2024-012',
      titre: 'Déclaration annuelle des résultats 2024',
      type: 'IS',
      dateCreation: '15/04/2025',
      dateEcheance: '30/04/2025',
      statut: 'À soumettre',
      montant: '62 800,00 €',
      periode: 'Année 2024',
      auteur: 'Marie Comptable',
      notes: 'Déclaration fiscale annuelle à finaliser'
    },
    {
      id: 'DECL-2024-011',
      titre: 'Cotisation foncière des entreprises 2024',
      type: 'CFE',
      dateCreation: '01/12/2024',
      dateEcheance: '15/12/2024',
      statut: 'Payé',
      montant: '2 350,00 €',
      periode: 'Année 2024',
      auteur: 'Marie Comptable',
      notes: 'Cotisation annuelle'
    }
  ];

  // Filter options
  const documentTypeOptions = ['Tous', 'Document juridique', 'Document fiscal', 'Document social', 'Contrat', 'Assurance', 'Propriété intellectuelle'];
  const declarationTypeOptions = ['Tous', 'TVA', 'IS', 'DSN', 'CFE', 'CVAE', 'CET'];
  const statusOptions = ['Tous', 'Actif', 'En cours', 'Archivé', 'Expiré', 'Soumis', 'À soumettre', 'Payé'];
  const periodOptions = ['Tous', 'Ce mois', 'Mois dernier', 'Ce trimestre', 'Cette année'];

  // Statistics
  const documentsStatistics = [
    { title: "Documents actifs", value: "18", icon: <FiFileText className="text-green-500" />, change: "+2 ce mois" },
    { title: "Documents à renouveler", value: "3", icon: <FiAlertTriangle className="text-amber-500" />, change: "Dans les 30 jours" },
    { title: "Documents expirés", value: "1", icon: <FiXCircle className="text-red-500" />, change: "+0 ce mois" },
    { title: "Taille totale", value: "125 Mo", icon: <FiDatabase className="text-indigo-500" />, change: "+15 Mo ce mois" }
  ];

  const declarationsStatistics = [
    { title: "Déclarations à venir", value: "4", icon: <FiClock className="text-blue-500" />, change: "Prochains 30 jours" },
    { title: "En attente", value: "3", icon: <FiAlertTriangle className="text-amber-500" />, change: "+1 ce mois" },
    { title: "Soumises", value: "2", icon: <FiCheckCircle className="text-green-500" />, change: "+2 ce mois" },
    { title: "Total annuel", value: "186 750 €", icon: <FiPieChart className="text-purple-500" />, change: "+23% vs 2024" }
  ];

  // Handler for toggling all checkboxes
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      if (activeTab === 'documents') {
        setSelectedDocuments(filteredDocuments.map(doc => doc.id));
      } else if (activeTab === 'declarations') {
        setSelectedDocuments(filteredDeclarations.map(decl => decl.id));
      }
    } else {
      setSelectedDocuments([]);
    }
  };

  // Handler for toggling individual checkboxes
  const handleSelectItem = (itemId: string) => {
    if (selectedDocuments.includes(itemId)) {
      setSelectedDocuments(selectedDocuments.filter(id => id !== itemId));
      setSelectAll(false);
    } else {
      setSelectedDocuments([...selectedDocuments, itemId]);
    }
  };

  // Filter documents based on search and filter criteria
  const filteredDocuments = documentsData.filter(document => {
    const matchesSearch = 
      searchTerm === '' || 
      document.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.auteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.notes.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'Tous' || document.type === selectedType;
    const matchesStatus = selectedStatus === 'Tous' || document.statut === selectedStatus;
    const matchesPeriod = selectedPeriod === 'Tous' || true; // Simplified
    
    return matchesSearch && matchesType && matchesStatus && matchesPeriod;
  });

  // Filter declarations based on search and filter criteria
  const filteredDeclarations = declarationsData.filter(declaration => {
    const matchesSearch = 
      searchTerm === '' || 
      declaration.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      declaration.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      declaration.auteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      declaration.notes.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'Tous' || declaration.type === selectedType;
    const matchesStatus = selectedStatus === 'Tous' || declaration.statut === selectedStatus;
    const matchesPeriod = selectedPeriod === 'Tous' || true; // Simplified
    
    return matchesSearch && matchesType && matchesStatus && matchesPeriod;
  });

  // Reset filters
  const resetFilters = () => {
    setSelectedType('Tous');
    setSelectedStatus('Tous');
    setSelectedPeriod('Tous');
    setSearchTerm('');
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string): string => {
    switch(status) {
      case 'Actif':
      case 'Soumis':
      case 'Payé':
        return 'bg-green-100 text-green-800';
      case 'En cours':
      case 'À soumettre':
        return 'bg-amber-100 text-amber-800';
      case 'Archivé':
        return 'bg-blue-100 text-blue-800';
      case 'Expiré':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-purple-100 text-purple-800';
    }
  };

  // Handle edit for company info
  // const handleCompanyInfoEdit = (field, value) => {
  //   setCompanyInfo({
  //     ...companyInfo,
  //     [field]: value
  //   });
  // };

  // // Handle edit for tax settings
  // const handleTaxSettingsEdit = (field, value) => {
  //   setTaxSettings({
  //     ...taxSettings,
  //     [field]: value
  //   });
  // };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen bg-gray-100"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center p-6 bg-white rounded-2xl shadow-xl">
          <div>
            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-3xl font-bold text-indigo-700 drop-shadow-md"
            >
              Informations administratives
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">
              Gérez les informations légales et administratives de votre entreprise
            </p>
          </div>
          <div className="p-2 bg-indigo-100 rounded-lg">
            <FiFileText className="w-6 h-6 text-indigo-600" />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'entreprise' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('entreprise');
                setSelectedDocuments([]);
                setSelectAll(false);
              }}
            >
              Entreprise
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'documents' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('documents');
                setSelectedDocuments([]);
                setSelectAll(false);
              }}
            >
              Documents légaux
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'declarations' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('declarations');
                setSelectedDocuments([]);
                setSelectAll(false);
              }}
            >
              Déclarations fiscales
            </button>
          </div>

          {/* Company Information Tab */}
          {activeTab === 'entreprise' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Identité de l'entreprise */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Identité de l&apos;entreprise</h3>
                    <button className="p-1 text-gray-400 hover:text-indigo-600">
                      <FiEdit />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Nom</span>
                      <span className="font-medium">{companyInfo.name}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Forme juridique</span>
                      <span className="font-medium">{companyInfo.legalForm}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Adresse</span>
                      <span className="font-medium">{companyInfo.address}</span>
                      <span className="font-medium">{companyInfo.postalCode} {companyInfo.city}</span>
                      <span className="font-medium">{companyInfo.country}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Représentant légal</span>
                      <span className="font-medium">{companyInfo.legalRepresentative}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Capital social</span>
                      <span className="font-medium">{companyInfo.capital}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Date d&apos;immatriculation</span>
                      <span className="font-medium">{companyInfo.registrationDate}</span>
                    </div>
                  </div>
                </div>
                {/* Numéros d'identification */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Numéros d&apos;identification</h3>
                    <button className="p-1 text-gray-400 hover:text-indigo-600">
                      <FiEdit />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">SIRET</span>
                      <span className="font-medium">{companyInfo.siret}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">SIREN</span>
                      <span className="font-medium">{companyInfo.siren}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Numéro de TVA</span>
                      <span className="font-medium">{companyInfo.vatNumber}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Code APE</span>
                      <span className="font-medium">{companyInfo.ape}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Activité principale</span>
                      <span className="font-medium">{companyInfo.mainActivity}</span>
                    </div>
                  </div>
                </div>
                {/* Coordonnées */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Coordonnées</h3>
                    <button className="p-1 text-gray-400 hover:text-indigo-600">
                      <FiEdit />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <FiPhone className="h-5 w-5 text-gray-400 mr-2" />
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">Téléphone</span>
                        <span className="font-medium">{companyInfo.phone}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FiMail className="h-5 w-5 text-gray-400 mr-2" />
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">Email</span>
                        <span className="font-medium">{companyInfo.email}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FiGlobe className="h-5 w-5 text-gray-400 mr-2" />
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">Site web</span>
                        <span className="font-medium">{companyInfo.website}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Paramètres fiscaux */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Paramètres fiscaux</h3>
                    <button className="p-1 text-gray-400 hover:text-indigo-600">
                      <FiEdit />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Régime de TVA</span>
                      <span className="font-medium">{taxSettings.vatRegime}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Périodicité TVA</span>
                      <span className="font-medium">{taxSettings.vatPeriodicity}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Régime fiscal</span>
                      <span className="font-medium">{taxSettings.taxSystem}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Exercice fiscal</span>
                      <span className="font-medium">Du {taxSettings.fiscalYearStart} au {taxSettings.fiscalYearEnd}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Méthode comptable</span>
                      <span className="font-medium">{taxSettings.accountingMethod}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Taux de TVA par défaut</span>
                      <span className="font-medium">{taxSettings.defaultVatRate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Documents Légaux Tab */}
          {activeTab === 'documents' && (
            <div className="p-6">
              {/* Statistics Cards */}
              <div className="mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {documentsStatistics.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                      <div className="flex items-center mb-2">
                        <div className="p-2 bg-indigo-50 rounded-lg mr-3">
                          {stat.icon}
                        </div>
                        <span className="text-sm font-medium text-gray-500">{stat.title}</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-xs text-gray-500 mt-2">{stat.change}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions and Filters */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div className="flex items-center space-x-2 mb-2 md:mb-0">
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center px-3 py-2 border rounded text-gray-600 hover:bg-gray-50"
                  >
                    <FiFilter className="mr-1" /> Filtres
                  </button>
                  <button 
                    onClick={resetFilters}
                    className="px-3 py-2 border rounded text-gray-600 hover:bg-gray-50"
                  >
                    Réinitialiser
                  </button>
                </div>
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-2 border rounded"
                  />
                  <button className="ml-2 px-3 py-2 border rounded text-gray-600 hover:bg-gray-50">
                    <FiSearch />
                  </button>
                </div>
                <button className="mt-2 md:mt-0 flex items-center px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                  <FiPlus className="mr-1" /> Nouveau document
                </button>
              </div>

              {/* Filter Options */}
              {showFilters && (
                <div className="mb-4 p-4 bg-gray-50 rounded">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600">Type</label>
                      <select 
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="mt-1 block w-full border rounded px-2 py-1"
                      >
                        {documentTypeOptions.map((option, idx) => (
                          <option key={idx} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">Statut</label>
                      <select 
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="mt-1 block w-full border rounded px-2 py-1"
                      >
                        {statusOptions.map((option, idx) => (
                          <option key={idx} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">Période</label>
                      <select 
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="mt-1 block w-full border rounded px-2 py-1"
                      >
                        {periodOptions.map((option, idx) => (
                          <option key={idx} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border">
                        <input 
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th className="px-4 py-2 border">ID</th>
                      <th className="px-4 py-2 border">Titre</th>
                      <th className="px-4 py-2 border">Type</th>
                      <th className="px-4 py-2 border">Création</th>
                      <th className="px-4 py-2 border">Expiration</th>
                      <th className="px-4 py-2 border">Statut</th>
                      <th className="px-4 py-2 border">Auteur</th>
                      <th className="px-4 py-2 border">Notes</th>
                      <th className="px-4 py-2 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocuments.map((doc) => (
                      <tr key={doc.id} className="text-center">
                        <td className="px-4 py-2 border">
                          <input 
                            type="checkbox"
                            checked={selectedDocuments.includes(doc.id)}
                            onChange={() => handleSelectItem(doc.id)}
                          />
                        </td>
                        <td className="px-4 py-2 border">{doc.id}</td>
                        <td className="px-4 py-2 border">{doc.titre}</td>
                        <td className="px-4 py-2 border">{doc.type}</td>
                        <td className="px-4 py-2 border">{doc.dateCreation}</td>
                        <td className="px-4 py-2 border">{doc.dateExpiration || '-'}</td>
                        <td className={`px-4 py-2 border ${getStatusBadgeColor(doc.statut)}`}>
                          {doc.statut}
                        </td>
                        <td className="px-4 py-2 border">{doc.auteur}</td>
                        <td className="px-4 py-2 border">{doc.notes}</td>
                        <td className="px-4 py-2 border">
                          <div className="flex justify-center space-x-2">
                            <button className="text-blue-500 hover:text-blue-700">
                              <FiEye />
                            </button>
                            <button className="text-green-500 hover:text-green-700">
                              <FiEdit />
                            </button>
                            <button className="text-red-500 hover:text-red-700">
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredDocuments.length === 0 && (
                      <tr>
                        <td colSpan={10} className="text-center py-4">
                          Aucun document trouvé.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Déclarations Fiscales Tab */}
          {activeTab === 'declarations' && (
            <div className="p-6">
              {/* Statistics Cards */}
              <div className="mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {declarationsStatistics.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                      <div className="flex items-center mb-2">
                        <div className="p-2 bg-indigo-50 rounded-lg mr-3">
                          {stat.icon}
                        </div>
                        <span className="text-sm font-medium text-gray-500">{stat.title}</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-xs text-gray-500 mt-2">{stat.change}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions and Filters */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div className="flex items-center space-x-2 mb-2 md:mb-0">
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center px-3 py-2 border rounded text-gray-600 hover:bg-gray-50"
                  >
                    <FiFilter className="mr-1" /> Filtres
                  </button>
                  <button 
                    onClick={resetFilters}
                    className="px-3 py-2 border rounded text-gray-600 hover:bg-gray-50"
                  >
                    Réinitialiser
                  </button>
                </div>
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-2 border rounded"
                  />
                  <button className="ml-2 px-3 py-2 border rounded text-gray-600 hover:bg-gray-50">
                    <FiSearch />
                  </button>
                </div>
                <button className="mt-2 md:mt-0 flex items-center px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                  <FiPlus className="mr-1" /> Nouvelle déclaration
                </button>
              </div>

              {/* Filter Options */}
              {showFilters && (
                <div className="mb-4 p-4 bg-gray-50 rounded">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600">Type</label>
                      <select 
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="mt-1 block w-full border rounded px-2 py-1"
                      >
                        {declarationTypeOptions.map((option, idx) => (
                          <option key={idx} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">Statut</label>
                      <select 
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="mt-1 block w-full border rounded px-2 py-1"
                      >
                        {statusOptions.map((option, idx) => (
                          <option key={idx} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">Période</label>
                      <select 
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="mt-1 block w-full border rounded px-2 py-1"
                      >
                        {periodOptions.map((option, idx) => (
                          <option key={idx} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Declarations Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border">
                        <input 
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th className="px-4 py-2 border">ID</th>
                      <th className="px-4 py-2 border">Titre</th>
                      <th className="px-4 py-2 border">Type</th>
                      <th className="px-4 py-2 border">Création</th>
                      <th className="px-4 py-2 border">Échéance</th>
                      <th className="px-4 py-2 border">Statut</th>
                      <th className="px-4 py-2 border">Montant</th>
                      <th className="px-4 py-2 border">Période</th>
                      <th className="px-4 py-2 border">Auteur</th>
                      <th className="px-4 py-2 border">Notes</th>
                      <th className="px-4 py-2 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDeclarations.map((decl) => (
                      <tr key={decl.id} className="text-center">
                        <td className="px-4 py-2 border">
                          <input 
                            type="checkbox"
                            checked={selectedDocuments.includes(decl.id)}
                            onChange={() => handleSelectItem(decl.id)}
                          />
                        </td>
                        <td className="px-4 py-2 border">{decl.id}</td>
                        <td className="px-4 py-2 border">{decl.titre}</td>
                        <td className="px-4 py-2 border">{decl.type}</td>
                        <td className="px-4 py-2 border">{decl.dateCreation}</td>
                        <td className="px-4 py-2 border">{decl.dateEcheance}</td>
                        <td className={`px-4 py-2 border ${getStatusBadgeColor(decl.statut)}`}>
                          {decl.statut}
                        </td>
                        <td className="px-4 py-2 border">{decl.montant}</td>
                        <td className="px-4 py-2 border">{decl.periode}</td>
                        <td className="px-4 py-2 border">{decl.auteur}</td>
                        <td className="px-4 py-2 border">{decl.notes}</td>
                        <td className="px-4 py-2 border">
                          <div className="flex justify-center space-x-2">
                            <button className="text-blue-500 hover:text-blue-700">
                              <FiEye />
                            </button>
                            <button className="text-green-500 hover:text-green-700">
                              <FiEdit />
                            </button>
                            <button className="text-red-500 hover:text-red-700">
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredDeclarations.length === 0 && (
                      <tr>
                        <td colSpan={12} className="text-center py-4">
                          Aucune déclaration trouvée.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

