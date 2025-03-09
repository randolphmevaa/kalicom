'use client';
import {useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiFileText, 
  FiEdit, 
  FiSave,
  // FiTrash2,
  // FiCopy,
  FiPlus,
  // FiCheck,
  FiX,
  // FiEye,
  FiAlertTriangle,
  FiInfo,
  FiGlobe,
  // FiCornerDownRight,
  FiCheckCircle,
  // FiSettings,
  FiRefreshCw,
  // FiExternalLink,
  FiHelpCircle,
  FiClipboard,
  // FiChevronDown,
  // FiChevronUp,
  // FiArrowRight,
  FiArrowLeft,
  // FiArrowUp,
  // FiArrowDown,
  // FiPrinter,
  // FiMessageSquare,
  // FiDownload,
  // FiUpload,
  // FiDollarSign,
  // FiPercent
} from 'react-icons/fi';

type Mention = {
  id: string;
  titre: string;
  contenu: string;
  isActive: boolean;
  isDefault: boolean;
  dateCreation: string;
  dateMaj: string;
  position: string;
  langue: string;
  categories: string[];
  notes: string;
};

export default function MentionsLegalesFactures() {
  // State for active tab, active mentions, preview, edit mode, help and edited mention
  const [activeTab, setActiveTab] = useState('obligatoires');
  const [activeMention, setActiveMention] = useState<string | null>(null);
  const [ , setShowPreview] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showHelp, setShowHelp] = useState(true);
  const [editedMention, setEditedMention] = useState<Mention | null>(null);

  // Sample legal notices data for invoices - mandatory
  const [mentionsObligatoiresData, setMentionsObligatoiresData] = useState([
    {
      id: 'MO-001',
      titre: 'Mentions légales standard',
      contenu: "En cas de retard de paiement, seront exigibles, conformément à l'article L 441-10 du code de commerce, une indemnité calculée sur la base de trois fois le taux d'intérêt légal en vigueur ainsi qu'une indemnité forfaitaire pour frais de recouvrement de 40 €. Les factures sont payables à réception sauf accord spécifique. Aucun escompte n'est accordé pour paiement anticipé.",
      isActive: true,
      isDefault: true,
      dateCreation: '15/01/2023',
      dateMaj: '10/02/2025',
      position: 'Bas de page',
      langue: 'Français',
      categories: ['Obligatoire', 'Standard'],
      notes: 'Mentions obligatoires selon le code de commerce'
    },
    {
      id: 'MO-002',
      titre: 'Délais de paiement légaux',
      contenu: "Délai de paiement : 30 jours à compter de la date d'émission de la facture. Tout retard de paiement entraîne de plein droit, outre les pénalités de retard au taux de trois fois le taux d'intérêt légal, une obligation pour le débiteur de payer une indemnité forfaitaire de 40€ pour frais de recouvrement. Une indemnité complémentaire pourra être réclamée sur justification.",
      isActive: true,
      isDefault: false,
      dateCreation: '20/03/2023',
      dateMaj: '10/02/2025',
      position: 'Bas de page',
      langue: 'Français',
      categories: ['Obligatoire', 'Délais de paiement'],
      notes: 'Précision sur les délais de paiement légaux'
    },
    {
      id: 'MO-003',
      titre: 'Mandatory legal notice (English)',
      contenu: "Payment terms: 30 days from the invoice issue date. Any late payment will automatically result, in addition to late payment penalties at the rate of three times the legal interest rate, an obligation for the debtor to pay a fixed compensation of 40€ for recovery costs. Additional compensation may be claimed with justification.",
      isActive: true,
      isDefault: false,
      dateCreation: '15/06/2023',
      dateMaj: '10/02/2025',
      position: 'Footer',
      langue: 'Anglais',
      categories: ['Obligatoire', 'International'],
      notes: 'Pour les clients anglophones'
    },
    {
      id: 'MO-004',
      titre: 'Micro-entreprise',
      contenu: "TVA non applicable, art. 293 B du CGI. N° SIRET : [NUMÉRO SIRET]. Auto-entrepreneur dispensé d'immatriculation au registre du commerce et des sociétés (RCS) et au répertoire des métiers (RM).",
      isActive: false,
      isDefault: false,
      dateCreation: '10/09/2023',
      dateMaj: '10/02/2025',
      position: 'Bas de page',
      langue: 'Français',
      categories: ['Obligatoire', 'Micro-entreprise'],
      notes: 'Pour les auto-entrepreneurs et micro-entreprises'
    },
    {
      id: 'MO-005',
      titre: 'Escompte zéro + médiation',
      contenu: "Aucun escompte n'est accordé pour paiement anticipé. En cas de litige, vous pouvez adresser une réclamation écrite à [ADRESSE EMAIL]. Si aucun accord n'est trouvé, vous pouvez recourir gratuitement au service de médiation [NOM ET COORDONNÉES DU MÉDIATEUR] dont nous relevons.",
      isActive: true,
      isDefault: false,
      dateCreation: '05/11/2023',
      dateMaj: '10/02/2025',
      position: 'Bas de page',
      langue: 'Français',
      categories: ['Obligatoire', 'Escompte', 'Médiation'],
      notes: 'Mentions sur la médiation en cas de litige'
    }
  ]);

  // Sample legal notices data for invoices - optional
  const [mentionsOptionnellesData, setMentionsOptionnellesData] = useState([
    {
      id: 'MF-001',
      titre: 'Clause de garantie',
      contenu: "Les produits vendus sont garantis contre tout défaut de fabrication pendant une durée de 24 mois à compter de la date de livraison. Cette garantie ne couvre pas les dommages résultant d'une mauvaise utilisation, d'une négligence ou d'un défaut d'entretien de la part du client. Pour toute demande de garantie, veuillez contacter notre service après-vente à l'adresse [EMAIL].",
      isActive: true,
      isDefault: false,
      dateCreation: '15/01/2023',
      dateMaj: '10/02/2025',
      position: 'Bas de page',
      langue: 'Français',
      categories: ['Optionnel', 'Garantie', 'Produits'],
      notes: 'À utiliser pour les factures de produits physiques'
    },
    {
      id: 'MF-002',
      titre: 'Clause de confidentialité',
      contenu: "Les parties s'engagent mutuellement à maintenir confidentielles toutes informations et documents concernant l'autre partie, de quelque nature qu'ils soient, financiers, techniques, sociaux ou commerciaux, auxquels elles auraient pu avoir accès dans le cadre de l'exécution de la prestation.",
      isActive: true,
      isDefault: false,
      dateCreation: '20/03/2023',
      dateMaj: '10/02/2025',
      position: 'Bas de page',
      langue: 'Français',
      categories: ['Optionnel', 'Confidentialité'],
      notes: 'Pour les prestations sensibles'
    },
    {
      id: 'MF-003',
      titre: 'Propriété intellectuelle',
      contenu: "Sauf accord écrit contraire, le prestataire reste propriétaire de tous les droits de propriété intellectuelle sur les études, dessins, modèles, prototypes, etc., réalisés en vue de la fourniture des services au client. Le client s'interdit donc toute reproduction ou exploitation desdits éléments sans l'autorisation expresse, écrite et préalable du prestataire.",
      isActive: true,
      isDefault: true,
      dateCreation: '05/05/2023',
      dateMaj: '10/02/2025',
      position: 'Bas de page',
      langue: 'Français',
      categories: ['Optionnel', 'Propriété intellectuelle'],
      notes: 'Pour les services créatifs et développement'
    },
    {
      id: 'MF-004',
      titre: 'Données personnelles (RGPD)',
      contenu: "Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation et d'opposition au traitement de vos données. Pour exercer ces droits, vous pouvez nous contacter à l'adresse [EMAIL]. Pour plus d'informations sur la gestion de vos données, consultez notre politique de confidentialité sur notre site internet.",
      isActive: false,
      isDefault: false,
      dateCreation: '10/09/2023',
      dateMaj: '10/02/2025',
      position: 'Bas de page',
      langue: 'Français',
      categories: ['Optionnel', 'RGPD', 'Données personnelles'],
      notes: 'Mention RGPD pour la protection des données'
    },
    {
      id: 'MF-005',
      titre: 'Delivery terms (English)',
      contenu: "The delivery times indicated on our documents are given for information purposes only and are not guaranteed. No compensation will be due in the event of a delay in delivery. The risks relating to the products are transferred to the buyer upon delivery of the products.",
      isActive: true,
      isDefault: false,
      dateCreation: '15/10/2023',
      dateMaj: '10/02/2025',
      position: 'Footer',
      langue: 'Anglais',
      categories: ['Optionnel', 'Delivery', 'International'],
      notes: 'Pour les clients anglophones - conditions de livraison'
    }
  ]);

  // Settings data
  const [settingsData, setSettingsData] = useState({
    defaultFontSize: 'Petit',
    defaultPosition: 'Bas de page',
    prefixMentions: '',
    suffixMentions: '',
    showObligatoire: true,
    showOptionnelle: true,
    combinerMentions: true,
    applyStyling: true,
    autoInclude: true
  });

  // Statistics
  const statisticsObligatoires = [
    { title: "Mentions actives", value: mentionsObligatoiresData.filter(item => item.isActive).length, icon: <FiCheckCircle className="text-green-500" /> },
    { title: "Longueur moyenne", value: "98 mots", icon: <FiFileText className="text-blue-500" /> },
    { title: "Mentions obligatoires", value: "5", icon: <FiAlertTriangle className="text-amber-500" /> },
    { title: "Langues disponibles", value: "2", icon: <FiGlobe className="text-indigo-500" /> }
  ];

  const statisticsOptionnelles = [
    { title: "Mentions actives", value: mentionsOptionnellesData.filter(item => item.isActive).length, icon: <FiCheckCircle className="text-green-500" /> },
    { title: "Longueur moyenne", value: "112 mots", icon: <FiFileText className="text-blue-500" /> },
    { title: "Dernière mise à jour", value: "10/02/2025", icon: <FiRefreshCw className="text-purple-500" /> },
    { title: "Types de mentions", value: "4", icon: <FiClipboard className="text-indigo-500" /> }
  ];

  // Filter options
  const positionOptions = ['Bas de page', 'Pied de page', 'Après signature', 'En-tête', 'Custom'];
  // const langueOptions = ['Français', 'Anglais', 'Espagnol', 'Allemand', 'Italien'];
  // const categoriesOptions = ['Obligatoire', 'Optionnel', 'Standard', 'Délais de paiement', 'International', 'Micro-entreprise', 'Escompte', 'Médiation', 'Garantie', 'Produits', 'Confidentialité', 'Propriété intellectuelle', 'RGPD', 'Données personnelles', 'Delivery'];
  const fontSizeOptions = ['Très petit', 'Petit', 'Moyen', 'Grand'];

  // Toggle help box
  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

  // Set active mention
  const setActiveMentionHandler = (id: string) => {
    if (activeMention === id) {
      setActiveMention(null);
      setEditMode(false);
    } else {
      setActiveMention(id);
      setEditMode(false);
    }
  };

  // Toggle edit mode (initialize editing state if turning on)
  const toggleEditMode = () => {
    if (!editMode) {
      setEditedMention(getActiveMentionDetails() || null);
    }
    setEditMode(!editMode);
  };

  // Get active mentions data based on current tab
  const getActiveMentionsData = () => {
    if (activeTab === 'obligatoires') return mentionsObligatoiresData;
    if (activeTab === 'optionnelles') return mentionsOptionnellesData;
    return [];
  };

  // Get active mention details
  const getActiveMentionDetails = (): Mention | null => {
    if (!activeMention) return null;
    return getActiveMentionsData().find(item => item.id === activeMention) || null;
  };
  

  // Save edited content (update the respective state)
  const saveEditedContent = () => {
    if (!editedMention) return;
    if (activeTab === 'obligatoires') {
      setMentionsObligatoiresData(
        mentionsObligatoiresData.map(item =>
          item.id === editedMention.id ? editedMention : item
        )
      );
    } else if (activeTab === 'optionnelles') {
      setMentionsOptionnellesData(
        mentionsOptionnellesData.map(item =>
          item.id === editedMention.id ? editedMention : item
        )
      );
    }
    setEditMode(false);
  };

  // Get status color for active/inactive mention
  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  // Word count
  const countWords = (text: string) => {
    return text.split(/\s+/).filter(Boolean).length;
  };

  // Character count
  const countCharacters = (text: string | unknown[]): number => {
    return text.length;
  };

  // Format date - just for display in this example
  const formatDate = (dateString: string | undefined) => {
    return dateString;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen bg-gray-50"
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
              Mentions légales des factures
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">
              Gérez les mentions légales obligatoires et optionnelles de vos factures
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
                activeTab === 'obligatoires' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('obligatoires');
                setActiveMention(null);
                setEditMode(false);
              }}
            >
              Mentions obligatoires
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'optionnelles' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('optionnelles');
                setActiveMention(null);
                setEditMode(false);
              }}
            >
              Mentions optionnelles
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'parametres' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('parametres');
                setActiveMention(null);
                setEditMode(false);
              }}
            >
              Paramètres
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'apercu' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('apercu');
                setActiveMention(null);
                setEditMode(false);
                setShowPreview(true);
              }}
            >
              Aperçu
            </button>
          </div>

          {/* Content for Obligatoires and Optionnelles tabs */}
          {(activeTab === 'obligatoires' || activeTab === 'optionnelles') && (
            <>
              {/* Statistics */}
              <div className="p-6 border-b">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {(activeTab === 'obligatoires' ? statisticsObligatoires : statisticsOptionnelles).map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                      <div className="flex items-center mb-2">
                        <div className="p-2 bg-indigo-50 rounded-lg mr-3">
                          {stat.icon}
                        </div>
                        <span className="text-sm font-medium text-gray-500">{stat.title}</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alert for mandatory mentions */}
              {activeTab === 'obligatoires' && showHelp && (
                <div className="mx-6 mt-4">
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FiAlertTriangle className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-amber-800">Mentions légales obligatoires</h3>
                        <div className="mt-2 text-sm text-amber-700">
                          <p>
                            En tant que professionnel, vous êtes tenu d&apos;inclure certaines mentions légales sur vos factures :
                          </p>
                          <ul className="list-disc pl-5 mt-1 space-y-1">
                            <li>Mentions relatives aux pénalités de retard (art. L441-10 du Code de commerce)</li>
                            <li>Indemnité forfaitaire pour frais de recouvrement (40€)</li>
                            <li>Conditions d&apos;escompte ou absence d&apos;escompte</li>
                            <li>Date d&apos;échéance du règlement</li>
                            <li>Numéro SIRET, RCS, et autres identifiants professionnels</li>
                          </ul>
                        </div>
                      </div>
                      <div className="ml-auto pl-3">
                        <button
                          onClick={toggleHelp}
                          className="inline-flex rounded-md text-amber-500 hover:bg-amber-100 focus:outline-none"
                        >
                          <span className="sr-only">Dismiss</span>
                          <FiX className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Info box for optional mentions */}
              {activeTab === 'optionnelles' && showHelp && (
                <div className="mx-6 mt-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FiInfo className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Mentions légales optionnelles</h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>
                            Ces mentions complémentaires peuvent être ajoutées selon vos besoins et activités :
                          </p>
                          <ul className="list-disc pl-5 mt-1 space-y-1">
                            <li>Clauses de propriété intellectuelle</li>
                            <li>Conditions de garantie</li>
                            <li>Clauses de confidentialité</li>
                            <li>Mentions RGPD pour les données personnelles</li>
                            <li>Conditions spécifiques à votre secteur d&apos;activité</li>
                          </ul>
                        </div>
                      </div>
                      <div className="ml-auto pl-3">
                        <button
                          onClick={toggleHelp}
                          className="inline-flex rounded-md text-blue-500 hover:bg-blue-100 focus:outline-none"
                        >
                          <span className="sr-only">Dismiss</span>
                          <FiX className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* List and Details */}
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {activeTab === 'obligatoires' ? 'Mentions légales obligatoires' : 'Mentions légales optionnelles'}
                  </h2>
                  <div className="flex space-x-2">
                    <button 
                      onClick={toggleHelp}
                      className="px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition flex items-center text-sm"
                    >
                      <FiHelpCircle className="mr-2" />
                      <span>{showHelp ? "Masquer l'aide" : "Afficher l'aide"}</span>
                    </button>
                    <button className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition flex items-center text-sm">
                      <FiPlus className="mr-2" />
                      <span>Ajouter une mention</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left column: list of mentions */}
                  <div className={`space-y-3 ${activeMention ? 'hidden md:block' : ''}`}>
                    {getActiveMentionsData().map((mention) => (
                      <div
                        key={mention.id}
                        className={`bg-white border ${activeMention === mention.id ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200'} rounded-lg overflow-hidden shadow-sm hover:shadow transition cursor-pointer`}
                        onClick={() => setActiveMentionHandler(mention.id)}
                      >
                        <div className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start">
                              <div className="flex-shrink-0">
                                <FiFileText className={`h-5 w-5 mt-0.5 ${mention.isActive ? 'text-indigo-500' : 'text-gray-400'}`} />
                              </div>
                              <div className="ml-3">
                                <div className="flex items-center">
                                  <h3 className="text-sm font-medium text-gray-900">{mention.titre}</h3>
                                  {mention.isDefault && (
                                    <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                                      Par défaut
                                    </span>
                                  )}
                                </div>
                                <div className="mt-1 text-xs text-gray-500 space-y-1">
                                  <p>Dernière mise à jour: {formatDate(mention.dateMaj)}</p>
                                  <p>Mots: {countWords(mention.contenu)} | Caractères: {countCharacters(mention.contenu)}</p>
                                </div>
                              </div>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(mention.isActive)}`}>
                              {mention.isActive ? 'Actif' : 'Inactif'}
                            </span>
                          </div>
                          <div className="mt-2">
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {mention.contenu}
                            </p>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {mention.categories.slice(0, 3).map((category, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                {category}
                              </span>
                            ))}
                            {mention.categories.length > 3 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                +{mention.categories.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right column: selected mention details */}
                  {activeMention && (
                    <div className="md:col-span-1">
                      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow">
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                          <h3 className="text-sm font-medium text-gray-900">
                            {getActiveMentionDetails()?.titre}
                          </h3>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setActiveMention(null)}
                              className="p-1 text-gray-500 hover:text-gray-700 md:hidden"
                            >
                              <FiArrowLeft className="h-5 w-5" />
                            </button>
                            <button
                              onClick={toggleEditMode}
                              className="p-1 text-gray-500 hover:text-indigo-600"
                            >
                              <FiEdit className="h-5 w-5" />
                            </button>
                          </div>
                        </div>

                        <div className="p-4">
                          {/* Content section */}
                          <div className="mb-4">
                            <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Contenu</h4>
                            {editMode ? (
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-sm text-gray-700 mb-1">Titre</label>
                                  <input
                                    type="text"
                                    className="w-full border rounded px-3 py-2"
                                    value={editedMention?.titre}
                                    onChange={(e) =>
                                      setEditedMention({ ...editedMention!, titre: e.target.value })
                                    }
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm text-gray-700 mb-1">Contenu</label>
                                  <textarea
                                    className="w-full border rounded px-3 py-2"
                                    rows={4}
                                    value={editedMention?.contenu}
                                    onChange={(e) =>
                                      setEditedMention({ ...editedMention!, contenu: e.target.value })
                                    }
                                  ></textarea>
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={saveEditedContent}
                                    className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center text-sm"
                                  >
                                    <FiSave className="mr-2" />
                                    <span>Enregistrer</span>
                                  </button>
                                  <button
                                    onClick={toggleEditMode}
                                    className="px-3 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition flex items-center text-sm"
                                  >
                                    <FiX className="mr-2" />
                                    <span>Annuler</span>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <p className="text-sm text-gray-700">{getActiveMentionDetails()?.contenu}</p>
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            <p>Date de création: {getActiveMentionDetails()?.dateCreation}</p>
                            <p>Dernière mise à jour: {formatDate(getActiveMentionDetails()?.dateMaj)}</p>
                            <p>Position: {getActiveMentionDetails()?.position}</p>
                            <p>Langue: {getActiveMentionDetails()?.langue}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Content for Paramètres tab */}
          {activeTab === 'parametres' && (
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900">Paramètres</h2>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Taille de police par défaut</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={settingsData.defaultFontSize}
                    onChange={(e) => setSettingsData({ ...settingsData, defaultFontSize: e.target.value })}
                  >
                    {fontSizeOptions.map((size, index) => (
                      <option key={index} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Position par défaut</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={settingsData.defaultPosition}
                    onChange={(e) => setSettingsData({ ...settingsData, defaultPosition: e.target.value })}
                  >
                    {positionOptions.map((position, index) => (
                      <option key={index} value={position}>
                        {position}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={settingsData.showObligatoire}
                      onChange={(e) =>
                        setSettingsData({ ...settingsData, showObligatoire: e.target.checked })
                      }
                    />
                    <span className="ml-2">Afficher mentions obligatoires</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={settingsData.showOptionnelle}
                      onChange={(e) =>
                        setSettingsData({ ...settingsData, showOptionnelle: e.target.checked })
                      }
                    />
                    <span className="ml-2">Afficher mentions optionnelles</span>
                  </label>
                </div>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={settingsData.combinerMentions}
                      onChange={(e) =>
                        setSettingsData({ ...settingsData, combinerMentions: e.target.checked })
                      }
                    />
                    <span className="ml-2">Combiner les mentions</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={settingsData.applyStyling}
                      onChange={(e) =>
                        setSettingsData({ ...settingsData, applyStyling: e.target.checked })
                      }
                    />
                    <span className="ml-2">Appliquer le style</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={settingsData.autoInclude}
                      onChange={(e) =>
                        setSettingsData({ ...settingsData, autoInclude: e.target.checked })
                      }
                    />
                    <span className="ml-2">Inclure automatiquement</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Content for Aperçu tab */}
          {activeTab === 'apercu' && (
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900">Aperçu de la facture</h2>
              <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                {getActiveMentionsData()
                  .filter(item => item.isActive)
                  .map((mention) => (
                    <div key={mention.id} className="mb-4">
                      <h3 className="font-semibold">{mention.titre}</h3>
                      <p>{mention.contenu}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
