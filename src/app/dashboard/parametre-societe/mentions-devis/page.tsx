'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiFileText, 
  FiEdit, 
  // FiSave,
  // FiTrash2,
  // FiCopy,
  FiPlus,
  FiCheck,
  FiX,
  // FiEye,
  // FiAlertTriangle,
  FiInfo,
  FiGlobe,
  // FiCornerDownRight,
  // FiCheckCircle,
  // FiSettings,
  FiRefreshCw,
  // FiExternalLink,
  FiHelpCircle,
  // FiClipboard,
  // FiChevronDown,
  // FiChevronUp,
  // FiArrowRight,
  // FiArrowUp,
  // FiArrowDown,
  // FiPrinter,
  // FiMessageSquare,
  // FiDownload,
  // FiUpload,
  FiArrowLeft
} from 'react-icons/fi';

export default function MentionsLegalesDevis() {
  // State for active tab, active mentions, and preview
  const [activeTab, setActiveTab] = useState('devis');
  const [activeMention, setActiveMention] = useState<string | null>(null);
  // const [showPreview, setShowPreview] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showHelp, setShowHelp] = useState(true);
  
  // Sample legal notices data for quotes
  const [mentionsDevisData] = useState([
    {
      id: 'MD-001',
      titre: 'Mentions légales standard',
      contenu: "Le présent devis est valable 30 jours à compter de sa date d'émission. Passé ce délai, l'entreprise se réserve le droit de modifier les prix et les conditions de vente. La signature du client et la mention \"Bon pour accord\" sont requises pour valider la commande. Un acompte de 30% sera demandé à la validation du devis, le solde étant payable selon les modalités précisées au devis.",
      isActive: true,
      isDefault: true,
      dateCreation: '15/01/2023',
      dateMaj: '10/02/2025',
      position: 'Bas de page',
      langue: 'Français',
      categories: ['Standard'],
      notes: 'Mentions légales standard pour tous les devis'
    },
    {
      id: 'MD-002',
      titre: 'Conditions de paiement détaillées',
      contenu: "Conditions de paiement : 30% à la commande, 40% au démarrage des prestations, 30% à la livraison. Tout retard de paiement entraînera l'application de pénalités de retard au taux annuel de 12%, ainsi qu'une indemnité forfaitaire pour frais de recouvrement de 40€. Les délais de livraison sont donnés à titre indicatif et ne constituent pas un engagement ferme.",
      isActive: true,
      isDefault: false,
      dateCreation: '20/03/2023',
      dateMaj: '10/02/2025',
      position: 'Bas de page',
      langue: 'Français',
      categories: ['Détaillé', 'Paiement'],
      notes: 'Pour les devis de montant important ou projets longs'
    },
    {
      id: 'MD-003',
      titre: 'Clause de propriété intellectuelle',
      contenu: "Sauf accord écrit contraire, le prestataire conserve la propriété intellectuelle sur tous les éléments produits dans le cadre de cette prestation. Le transfert des droits d'exploitation est conditionné au paiement intégral du prix convenu. Toute reproduction ou réutilisation des éléments sans autorisation écrite est interdite.",
      isActive: true,
      isDefault: false,
      dateCreation: '05/05/2023',
      dateMaj: '10/02/2025',
      position: 'Bas de page',
      langue: 'Français',
      categories: ['Propriété intellectuelle'],
      notes: 'Pour les prestations créatives, sites web, design'
    },
    {
      id: 'MD-004',
      titre: 'Legal notice (English)',
      contenu: "This quotation is valid for 30 days from the date of issue. Beyond this period, the company reserves the right to modify prices and terms of sale. The client's signature and the mention \"Approved\" are required to validate the order. A 30% deposit will be requested upon validation of the quote, the balance being payable according to the terms specified in the quote.",
      isActive: true,
      isDefault: false,
      dateCreation: '15/06/2023',
      dateMaj: '10/02/2025',
      position: 'Footer',
      langue: 'Anglais',
      categories: ['Standard', 'International'],
      notes: 'Pour les clients anglophones'
    },
    {
      id: 'MD-005',
      titre: 'Clause de confidentialité',
      contenu: "Les parties s'engagent à maintenir confidentielles les informations et documents de toute nature dont ils auraient connaissance dans le cadre de l'exécution de la prestation. Cette obligation de confidentialité s'étend pendant toute la durée du contrat et persiste après son expiration pendant une durée de 3 ans.",
      isActive: true,
      isDefault: false,
      dateCreation: '10/09/2023',
      dateMaj: '10/02/2025',
      position: 'Bas de page',
      langue: 'Français',
      categories: ['Confidentialité'],
      notes: 'Pour les prestations sensibles ou clients exigeant la confidentialité'
    },
    {
      id: 'MD-006',
      titre: 'Clause de réserve de propriété',
      contenu: "Le transfert de propriété des produits est subordonné au paiement complet du prix par le client, quelle que soit la date de livraison. Le client s'engage à informer immédiatement le vendeur de tout incident susceptible d'affecter les produits soumis à la présente clause de réserve de propriété.",
      isActive: true,
      isDefault: false,
      dateCreation: '05/11/2023',
      dateMaj: '10/02/2025',
      position: 'Bas de page',
      langue: 'Français',
      categories: ['Vente', 'Livraison'],
      notes: 'Pour la vente de produits physiques'
    },
    {
      id: 'MD-007',
      titre: 'Mentions légales pour travaux BTP',
      contenu: "Conformément à l'article L. 111-3-1 du Code de la construction et de l'habitation, les travaux seront couverts par une assurance responsabilité civile professionnelle et décennale n°[NUMÉRO POLICE]. L'entreprise est inscrite au Registre du Commerce et des Sociétés sous le numéro [NUMÉRO RCS]. TVA intracommunautaire : [NUMÉRO TVA].",
      isActive: false,
      isDefault: false,
      dateCreation: '15/12/2023',
      dateMaj: '10/01/2024',
      position: 'Bas de page',
      langue: 'Français',
      categories: ['BTP', 'Construction'],
      notes: 'Pour les devis de travaux de construction ou rénovation'
    }
  ]);

  // Sample legal notices data for invoices
  const [mentionsFacturesData] = useState([
    {
      id: 'MF-001',
      titre: 'Mentions légales obligatoires factures',
      contenu: "En cas de retard de paiement, seront exigibles, conformément à l'article L 441-10 du code de commerce, une indemnité calculée sur la base de trois fois le taux d'intérêt légal en vigueur ainsi qu'une indemnité forfaitaire pour frais de recouvrement de 40 €. Les factures sont payables à réception sauf accord spécifique. Aucun escompte n'est accordé pour paiement anticipé.",
      isActive: true,
      isDefault: true,
      dateCreation: '15/01/2023',
      dateMaj: '10/02/2025',
      position: 'Bas de page',
      langue: 'Français',
      categories: ['Standard', 'Obligatoire'],
      notes: 'Mentions obligatoires selon le code de commerce'
    },
    {
      id: 'MF-002',
      titre: 'Délais de paiement légaux',
      contenu: "Délai de paiement : 30 jours à compter de la date d'émission de la facture. Tout retard de paiement entraîne de plein droit, outre les pénalités de retard au taux de trois fois le taux d'intérêt légal, une obligation pour le débiteur de payer une indemnité forfaitaire de 40€ pour frais de recouvrement. Une indemnité complémentaire pourra être réclamée sur justification.",
      isActive: true,
      isDefault: false,
      dateCreation: '20/03/2023',
      dateMaj: '10/02/2025',
      position: 'Bas de page',
      langue: 'Français',
      categories: ['Standard', 'Délais'],
      notes: 'Précision sur les délais de paiement légaux'
    },
    {
      id: 'MF-003',
      titre: 'Invoice legal notice (English)',
      contenu: "Payment terms: 30 days from the invoice issue date. Any late payment will automatically result, in addition to late payment penalties at the rate of three times the legal interest rate, an obligation for the debtor to pay a fixed compensation of 40€ for recovery costs. Additional compensation may be claimed with justification.",
      isActive: true,
      isDefault: false,
      dateCreation: '15/06/2023',
      dateMaj: '10/02/2025',
      position: 'Footer',
      langue: 'Anglais',
      categories: ['Standard', 'International'],
      notes: 'Pour les clients anglophones'
    },
    {
      id: 'MF-004',
      titre: 'Micro-entreprise',
      contenu: "TVA non applicable, art. 293 B du CGI. N° SIRET : [NUMÉRO SIRET]. Auto-entrepreneur dispensé d'immatriculation au registre du commerce et des sociétés (RCS) et au répertoire des métiers (RM).",
      isActive: true,
      isDefault: false,
      dateCreation: '10/09/2023',
      dateMaj: '10/02/2025',
      position: 'Bas de page',
      langue: 'Français',
      categories: ['Micro-entreprise'],
      notes: 'Pour les auto-entrepreneurs et micro-entreprises'
    },
    {
      id: 'MF-005',
      titre: 'Escompte zéro + médiation',
      contenu: "Aucun escompte n'est accordé pour paiement anticipé. En cas de litige, vous pouvez adresser une réclamation écrite à [ADRESSE EMAIL]. Si aucun accord n'est trouvé, vous pouvez recourir gratuitement au service de médiation [NOM ET COORDONNÉES DU MÉDIATEUR] dont nous relevons.",
      isActive: true,
      isDefault: false,
      dateCreation: '05/11/2023',
      dateMaj: '10/02/2025',
      position: 'Bas de page',
      langue: 'Français',
      categories: ['Escompte', 'Médiation'],
      notes: 'Mentions sur la médiation en cas de litige'
    }
  ]);

  // Settings data
  const [settingsData, setSettingsData] = useState({
    defaultFontSize: 'Petit',
    defaultPosition: 'Bas de page',
    prefixMentions: '',
    suffixMentions: '',
    showOnAllDevis: true,
    showOnAllFactures: true,
    applyStyling: true,
    autoInclude: true
  });

  // Statistics
  const statisticsDevis = [
    { title: "Mentions actives", value: mentionsDevisData.filter(item => item.isActive).length, icon: <FiCheck className="text-green-500" /> },
    { title: "Longueur moyenne", value: "136 mots", icon: <FiFileText className="text-blue-500" /> },
    { title: "Dernière mise à jour", value: "10/02/2025", icon: <FiRefreshCw className="text-indigo-500" /> },
    { title: "Langues disponibles", value: "2", icon: <FiGlobe className="text-amber-500" /> }
  ];

  const statisticsFactures = [
    { title: "Mentions actives", value: mentionsFacturesData.filter(item => item.isActive).length, icon: <FiCheck className="text-green-500" /> },
    { title: "Longueur moyenne", value: "102 mots", icon: <FiFileText className="text-blue-500" /> },
    { title: "Dernière mise à jour", value: "10/02/2025", icon: <FiRefreshCw className="text-indigo-500" /> },
    { title: "Langues disponibles", value: "2", icon: <FiGlobe className="text-amber-500" /> }
  ];

  // Filter options
  const positionOptions = ['Bas de page', 'Pied de page', 'Après signature', 'En-tête', 'Custom'];
  // const langueOptions = ['Français', 'Anglais', 'Espagnol', 'Allemand', 'Italien'];
  // const categoriesOptions = ['Standard', 'Détaillé', 'Paiement', 'Propriété intellectuelle', 'International', 'Confidentialité', 'Vente', 'Livraison', 'BTP', 'Construction', 'Obligatoire', 'Délais', 'Micro-entreprise', 'Escompte', 'Médiation'];
  const fontSizeOptions = ['Très petit', 'Petit', 'Moyen', 'Grand'];

  // Toggle help box
  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

  // Set active mention
  const setActiveMentionHandler = (id: string) => {
    if (activeMention === id) {
      setActiveMention(null);
    } else {
      setActiveMention(id);
    }
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  // Toggle active status
  // const toggleActive = (id: string) => {
  //   if (activeTab === 'devis') {
  //     setMentionsDevisData(
  //       mentionsDevisData.map(item => 
  //         item.id === id ? { ...item, isActive: !item.isActive } : item
  //       )
  //     );
  //   } else {
  //     setMentionsFacturesData(
  //       mentionsFacturesData.map(item => 
  //         item.id === id ? { ...item, isActive: !item.isActive } : item
  //       )
  //     );
  //   }
  // };

  // Set as default
  // const setAsDefault = (id: string) => {
  //   if (activeTab === 'devis') {
  //     setMentionsDevisData(
  //       mentionsDevisData.map(item => 
  //         item.id === id ? { ...item, isDefault: true } : { ...item, isDefault: false }
  //       )
  //     );
  //   } else {
  //     setMentionsFacturesData(
  //       mentionsFacturesData.map(item => 
  //         item.id === id ? { ...item, isDefault: true } : { ...item, isDefault: false }
  //       )
  //     );
  //   }
  // };

  // Get active mentions data
  const getActiveMentionsData = () => {
    return activeTab === 'devis' ? mentionsDevisData : mentionsFacturesData;
  };

  // Get active mention details
  const getActiveMentionDetails = () => {
    if (!activeMention) return null;
    return getActiveMentionsData().find(item => item.id === activeMention);
  };

  // Save edited content (mock function)
  const saveEditedContent = () => {
    setEditMode(false);
    // Here you would save the edited content
  };

  // Get status color
  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  // Word count
  const countWords = (text: string) => {
    return text.split(/\s+/).filter(Boolean).length;
  };

  const activelMentionDetails = getActiveMentionDetails();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen"
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
              Mentions légales
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">
              Gérez les mentions légales qui apparaissent sur vos devis et factures
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
                activeTab === 'devis' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('devis');
                setActiveMention(null);
                setEditMode(false);
              }}
            >
              Devis
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'factures' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('factures');
                setActiveMention(null);
                setEditMode(false);
              }}
            >
              Factures
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
          </div>

          {/* Content for Devis and Factures tabs */}
          {(activeTab === 'devis' || activeTab === 'factures') && (
            <>
              {/* Statistics */}
              <div className="p-6 border-b">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {(activeTab === 'devis' ? statisticsDevis : statisticsFactures).map((stat, index) => (
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

              {/* Help box */}
              {showHelp && (
                <div className="mx-6 mt-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FiInfo className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">À propos des mentions légales</h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>
                            Les mentions légales sont des informations obligatoires qui doivent figurer sur vos documents commerciaux :
                          </p>
                          <ul className="list-disc pl-5 mt-1 space-y-1">
                            <li>Certaines mentions sont <strong>obligatoires</strong> (conditions de paiement, pénalités de retard...)</li>
                            <li>D&apos;autres sont <strong>facultatives</strong> mais recommandées (clauses de propriété intellectuelle, confidentialité...)</li>
                            <li>Vous pouvez définir plusieurs types de mentions et les activer selon vos besoins</li>
                            <li>Une seule mention peut être définie comme <strong>mention par défaut</strong></li>
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

              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {activeTab === 'devis' ? 'Mentions légales des devis' : 'Mentions légales des factures'}
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

                {/* Two column layout when item is selected */}
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
                                  <p>Dernière mise à jour: {mention.dateMaj}</p>
                                  <p>Mots: {countWords(mention.contenu)}</p>
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
                          <h3 className="text-sm font-medium text-gray-900">{activelMentionDetails?.titre}</h3>
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
                                    defaultValue={activelMentionDetails?.titre}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm text-gray-700 mb-1">Texte</label>
                                  <textarea
                                    rows={6}
                                    defaultValue={activelMentionDetails?.contenu}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                                  />
                                </div>
                                <div className="flex justify-end space-x-2 pt-2">
                                  <button
                                    onClick={() => setEditMode(false)}
                                    className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50"
                                  >
                                    Annuler
                                  </button>
                                  <button
                                    onClick={saveEditedContent}
                                    className="px-3 py-1.5 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
                                  >
                                    Enregistrer
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-gray-50 p-3 rounded border border-gray-200 text-sm">
                                {activelMentionDetails?.contenu}
                              </div>
                            )}
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
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Paramètres</h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Taille de police par défaut</label>
                  <select
                    value={settingsData.defaultFontSize}
                    onChange={(e) => setSettingsData({ ...settingsData, defaultFontSize: e.target.value })}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  >
                    {fontSizeOptions.map((size, idx) => (
                      <option key={idx} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Position par défaut</label>
                  <select
                    value={settingsData.defaultPosition}
                    onChange={(e) => setSettingsData({ ...settingsData, defaultPosition: e.target.value })}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  >
                    {positionOptions.map((pos, idx) => (
                      <option key={idx} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Préfixe des mentions</label>
                  <input
                    type="text"
                    value={settingsData.prefixMentions}
                    onChange={(e) => setSettingsData({ ...settingsData, prefixMentions: e.target.value })}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Suffixe des mentions</label>
                  <input
                    type="text"
                    value={settingsData.suffixMentions}
                    onChange={(e) => setSettingsData({ ...settingsData, suffixMentions: e.target.value })}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settingsData.showOnAllDevis}
                      onChange={(e) => setSettingsData({ ...settingsData, showOnAllDevis: e.target.checked })}
                      className="h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">Afficher sur tous les devis</span>
                  </label>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settingsData.showOnAllFactures}
                      onChange={(e) => setSettingsData({ ...settingsData, showOnAllFactures: e.target.checked })}
                      className="h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">Afficher sur toutes les factures</span>
                  </label>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settingsData.applyStyling}
                      onChange={(e) => setSettingsData({ ...settingsData, applyStyling: e.target.checked })}
                      className="h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">Appliquer le style</span>
                  </label>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settingsData.autoInclude}
                      onChange={(e) => setSettingsData({ ...settingsData, autoInclude: e.target.checked })}
                      className="h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">Inclusion automatique</span>
                  </label>
                </div>
                <div className="pt-4">
                  <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                    Enregistrer les paramètres
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
