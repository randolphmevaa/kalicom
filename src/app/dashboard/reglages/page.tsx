'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiSettings,
  // FiSliders,
  FiGlobe,
  FiServer,
  FiDatabase,
  FiLock,
  FiMail,
  FiSmartphone,
  // FiPrinter,
  FiFileText,
  FiImage,
  FiEdit,
  FiSave,
  // FiCheck,
  FiX,
  // FiRefreshCw,
  FiAlertTriangle,
  // FiInfo,
  // FiKey,
  // FiClock,
  // FiCalendar,
  // FiColumns,
  FiCreditCard,
  // FiBookmark,
  // FiClipboard,
  // FiHelpCircle,
  FiLayout,
  // FiPackage,
  // FiDownload,
  // FiUpload,
  // FiGrid,
  FiUser
} from 'react-icons/fi';
import { FaEuroSign } from 'react-icons/fa6';

export default function Reglages() {
  // State for active tab and section
  const [activeTab, setActiveTab] = useState('general');
  const [activeSection, setActiveSection] = useState('societe');
  const [editMode, setEditMode] = useState(false);

  // General settings states
  const [companySettings, setCompanySettings] = useState({
    nom: 'Ma Société',
    siret: '123 456 789 00012',
    tva: 'FR12345678900',
    adresse: '123 Rue Principale',
    codePostal: '75001',
    ville: 'Paris',
    pays: 'France',
    telephone: '+33 1 23 45 67 89',
    email: 'contact@masociete.com',
    site: 'www.masociete.com',
    logo: '/logo.png',
    signature: '/signature.png'
  });

  const [localeSettings, setLocaleSettings] = useState({
    langue: 'Français',
    devise: 'EUR',
    formatDate: 'DD/MM/YYYY',
    formatHeure: '24h',
    fuseauHoraire: 'Europe/Paris',
    formatNombre: '1 234,56',
    premierJourSemaine: 'Lundi'
  });

  const [documentSettings, setDocumentSettings] = useState({
    prefixeDevis: 'D',
    prefixeFacture: 'F',
    prefixeAvoir: 'A',
    formatNumeroDevis: '[PREFIX][ANNEE]-[NUMERO]',
    formatNumeroFacture: '[PREFIX][ANNEE]-[NUMERO]',
    formatNumeroAvoir: '[PREFIX][ANNEE]-[NUMERO]',
    delaiValiditeDevis: '30',
    conditionsPaiementDefaut: '30 jours',
    modesPaiementActifs: ['Virement', 'Carte bancaire', 'Chèque', 'Espèces'],
    textePiedPageDevis: 'Merci de votre confiance',
    textePiedPageFacture: 'Payable à réception',
    textePiedPageAvoir: 'Avoir à valoir sur facture future'
  });

  // const [notificationSettings, setNotificationSettings] = useState({
  //   emailNouvelleDemande: true,
  //   emailDevisAccepte: true,
  //   emailFacturePayee: true,
  //   emailRappelPaiement: true,
  //   emailRappelDevis: true,
  //   smsNouvelleDemande: false,
  //   smsDevisAccepte: true,
  //   smsFacturePayee: false,
  //   smsRappelPaiement: true,
  //   smsRappelDevis: false,
  //   frequenceRappelPaiement: '7',
  //   frequenceRappelDevis: '3'
  // });

  const [taxSettings, setTaxSettings] = useState({
    tvaDefaut: '20.0',
    tauxTVA: [
      { taux: '20.0', description: 'Standard', defaut: true },
      { taux: '10.0', description: 'Réduit', defaut: false },
      { taux: '5.5', description: 'Réduit', defaut: false },
      { taux: '2.1', description: 'Super réduit', defaut: false },
      { taux: '0.0', description: 'Exonéré', defaut: false }
    ],
    afficherMontantHT: true,
    afficherDetailTVA: true,
    ventilationComptableTVA: true
  });

  const [integrationSettings ] = useState({
    apiActive: true,
    clesApi: ['sk_live_12345abcdef', 'sk_test_67890ghijkl'],
    webhookUrl: 'https://masociete.com/api/webhook',
    integrationComptable: 'API Comptabilité',
    synchronisationProduits: true,
    synchronisationClients: true,
    logsApiActifs: true,
    limiteRequetesApi: '1000'
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpServeur: 'smtp.masociete.com',
    smtpPort: '587',
    smtpUsername: 'noreply@masociete.com',
    smtpPassword: '••••••••••••',
    smtpSecurity: 'TLS',
    emailExpediteur: 'noreply@masociete.com',
    nomExpediteur: 'Ma Société',
    signatureEmail: "L'équipe Ma Société\nwww.masociete.com",
    templateEmailsActifs: ['devis', 'facture', 'relance', 'paiement']
  });

  const [smsSettings, setSmsSettings] = useState({
    fournisseurSMS: 'SMS Provider',
    apiKeySMS: '••••••••••••',
    expediteurSMS: 'MaSociete',
    templateSMSActifs: ['rappel', 'confirmation', 'paiement'],
    prefixeInternational: '+33',
    limiteSMSMensuel: '500'
  });

  const [userSettings, setUserSettings] = useState({
    sessionTimeout: '120',
    tentativesConnexion: '5',
    complexiteMotDePasse: 'Forte',
    authentificationDeuxFacteurs: true,
    changerMotDePassePeriodique: true,
    dureeMdp: '90',
    journalisationActions: true,
    niveauJournalisation: 'Détaillé'
  });

  // Options for selects
  const languageOptions = ['Français', 'English', 'Español', 'Deutsch', 'Italiano'];
  const currencyOptions = ['EUR', 'USD', 'GBP', 'CHF', 'CAD'];
  const dateFormatOptions = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'];
  const timeFormatOptions = ['24h', '12h'];
  const timezoneOptions = ['Europe/Paris', 'America/New_York', 'Asia/Tokyo', 'Australia/Sydney'];
  const weekdayOptions = ['Lundi', 'Dimanche'];
  const numberFormatOptions = ['1 234,56', '1,234.56'];
  // const paymentMethodOptions = ['Virement', 'Carte bancaire', 'Chèque', 'Espèces', 'PayPal', 'Prélèvement'];
  const paymentTermsOptions = ['À réception', '15 jours', '30 jours', '45 jours', '60 jours'];
  const smtpSecurityOptions = ['Aucune', 'SSL', 'TLS'];
  // const passwordComplexityOptions = ['Faible', 'Moyenne', 'Forte', 'Très forte'];
  // const loggingLevelOptions = ['Minimal', 'Standard', 'Détaillé', 'Debug'];
  const smsProviderOptions = ['SMS Provider', 'Twilio', 'MessageBird', 'OVH', 'Autre'];

  // Toggle edit mode
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  // Save settings
  const saveSettings = () => {
    // Here you would typically save the settings to your backend
    setEditMode(false);
    alert('Les réglages ont été enregistrés.');
  };

  // Set active section
  const setActiveSectionHandler = (section: string): void => {
    setActiveSection(section);
  };
  

  // Reset settings
  const resetSettings = () => {
    // Here you would typically reset settings to default values
    alert('Les réglages ont été réinitialisés aux valeurs par défaut.');
  };

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
              Réglages
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">
              Configurez les paramètres de votre application
            </p>
          </div>
          <div className="p-2 bg-gray-100 rounded-lg">
            <FiSettings className="w-6 h-6 text-gray-600" />
          </div>
        </div>

        {/* Settings Interface */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Main Tabs */}
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'general'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('general');
                setActiveSection('societe');
              }}
            >
              Général
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'documents'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('documents');
                setActiveSection('numerotation');
              }}
            >
              Documents
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'notifications'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('notifications');
                setActiveSection('email');
              }}
            >
              Notifications
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'avance'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('avance');
                setActiveSection('api');
              }}
            >
              Avancé
            </button>
          </div>

          <div className="flex min-h-[600px]">
            {/* Left Sidebar - Categories */}
            <div className="w-64 border-r bg-gray-50">
              {activeTab === 'general' && (
                <div className="p-4 space-y-1">
                  <button
                    className={`w-full text-left px-4 py-2 rounded ${
                      activeSection === 'societe'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveSectionHandler('societe')}
                  >
                    <div className="flex items-center">
                      <FiUser className="mr-2" />
                      <span>Société</span>
                    </div>
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 rounded ${
                      activeSection === 'localisation'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveSectionHandler('localisation')}
                  >
                    <div className="flex items-center">
                      <FiGlobe className="mr-2" />
                      <span>Localisation</span>
                    </div>
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 rounded ${
                      activeSection === 'taxes'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveSectionHandler('taxes')}
                  >
                    <div className="flex items-center">
                      <FaEuroSign className="mr-2" />
                      <span>Taxes</span>
                    </div>
                  </button>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="p-4 space-y-1">
                  <button
                    className={`w-full text-left px-4 py-2 rounded ${
                      activeSection === 'numerotation'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveSectionHandler('numerotation')}
                  >
                    <div className="flex items-center">
                      <FiFileText className="mr-2" />
                      <span>Numérotation</span>
                    </div>
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 rounded ${
                      activeSection === 'modeles'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveSectionHandler('modeles')}
                  >
                    <div className="flex items-center">
                      <FiLayout className="mr-2" />
                      <span>Modèles</span>
                    </div>
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 rounded ${
                      activeSection === 'paiements'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveSectionHandler('paiements')}
                  >
                    <div className="flex items-center">
                      <FiCreditCard className="mr-2" />
                      <span>Conditions de paiement</span>
                    </div>
                  </button>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="p-4 space-y-1">
                  <button
                    className={`w-full text-left px-4 py-2 rounded ${
                      activeSection === 'email'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveSectionHandler('email')}
                  >
                    <div className="flex items-center">
                      <FiMail className="mr-2" />
                      <span>Configuration email</span>
                    </div>
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 rounded ${
                      activeSection === 'sms'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveSectionHandler('sms')}
                  >
                    <div className="flex items-center">
                      <FiSmartphone className="mr-2" />
                      <span>Configuration SMS</span>
                    </div>
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 rounded ${
                      activeSection === 'alertes'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveSectionHandler('alertes')}
                  >
                    <div className="flex items-center">
                      <FiAlertTriangle className="mr-2" />
                      <span>Alertes et rappels</span>
                    </div>
                  </button>
                </div>
              )}

              {activeTab === 'avance' && (
                <div className="p-4 space-y-1">
                  <button
                    className={`w-full text-left px-4 py-2 rounded ${
                      activeSection === 'api'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveSectionHandler('api')}
                  >
                    <div className="flex items-center">
                      <FiServer className="mr-2" />
                      <span>API et intégrations</span>
                    </div>
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 rounded ${
                      activeSection === 'securite'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveSectionHandler('securite')}
                  >
                    <div className="flex items-center">
                      <FiLock className="mr-2" />
                      <span>Sécurité</span>
                    </div>
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 rounded ${
                      activeSection === 'donnees'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveSectionHandler('donnees')}
                  >
                    <div className="flex items-center">
                      <FiDatabase className="mr-2" />
                      <span>Sauvegarde et données</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Right Panel - Settings Content */}
            <div className="flex-1 p-6">
              {/* Settings Header with Edit/Save Buttons */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  {activeSection === 'societe' && 'Informations de la société'}
                  {activeSection === 'localisation' && 'Paramètres de localisation'}
                  {activeSection === 'taxes' && 'Configuration des taxes'}
                  {activeSection === 'numerotation' && 'Numérotation des documents'}
                  {activeSection === 'modeles' && 'Modèles de documents'}
                  {activeSection === 'paiements' && 'Conditions de paiement'}
                  {activeSection === 'email' && 'Configuration email'}
                  {activeSection === 'sms' && 'Configuration SMS'}
                  {activeSection === 'alertes' && 'Alertes et rappels'}
                  {activeSection === 'api' && 'API et intégrations'}
                  {activeSection === 'securite' && 'Paramètres de sécurité'}
                  {activeSection === 'donnees' && 'Sauvegarde et données'}
                </h2>
                <div className="flex space-x-2">
                  {!editMode ? (
                    <button
                      onClick={toggleEditMode}
                      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition flex items-center"
                    >
                      <FiEdit className="mr-2" /> Modifier
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={saveSettings}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center"
                      >
                        <FiSave className="mr-2" /> Enregistrer
                      </button>
                      <button
                        onClick={toggleEditMode}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition flex items-center"
                      >
                        <FiX className="mr-2" /> Annuler
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Settings Form Content */}
              <div className="space-y-6">
                {/* Société Section */}
                {activeSection === 'societe' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nom de la société
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                          value={companySettings.nom}
                          onChange={(e) =>
                            setCompanySettings({ ...companySettings, nom: e.target.value })
                          }
                          disabled={!editMode}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          SIRET
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                          value={companySettings.siret}
                          onChange={(e) =>
                            setCompanySettings({ ...companySettings, siret: e.target.value })
                          }
                          disabled={!editMode}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          N° de TVA
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                          value={companySettings.tva}
                          onChange={(e) =>
                            setCompanySettings({ ...companySettings, tva: e.target.value })
                          }
                          disabled={!editMode}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Adresse
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                          value={companySettings.adresse}
                          onChange={(e) =>
                            setCompanySettings({ ...companySettings, adresse: e.target.value })
                          }
                          disabled={!editMode}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Code postal
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                          value={companySettings.codePostal}
                          onChange={(e) =>
                            setCompanySettings({ ...companySettings, codePostal: e.target.value })
                          }
                          disabled={!editMode}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ville
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                          value={companySettings.ville}
                          onChange={(e) =>
                            setCompanySettings({ ...companySettings, ville: e.target.value })
                          }
                          disabled={!editMode}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pays
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                          value={companySettings.pays}
                          onChange={(e) =>
                            setCompanySettings({ ...companySettings, pays: e.target.value })
                          }
                          disabled={!editMode}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Téléphone
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                          value={companySettings.telephone}
                          onChange={(e) =>
                            setCompanySettings({ ...companySettings, telephone: e.target.value })
                          }
                          disabled={!editMode}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                          value={companySettings.email}
                          onChange={(e) =>
                            setCompanySettings({ ...companySettings, email: e.target.value })
                          }
                          disabled={!editMode}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Site web
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                        value={companySettings.site}
                        onChange={(e) =>
                          setCompanySettings({ ...companySettings, site: e.target.value })
                        }
                        disabled={!editMode}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Logo
                        </label>
                        <div className="flex items-center">
                          <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center overflow-hidden border border-gray-300">
                            <FiImage className="w-8 h-8 text-gray-400" />
                          </div>
                          {editMode && (
                            <button className="ml-4 px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition">
                              Changer
                            </button>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Signature
                        </label>
                        <div className="flex items-center">
                          <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center overflow-hidden border border-gray-300">
                            <FiImage className="w-8 h-8 text-gray-400" />
                          </div>
                          {editMode && (
                            <button className="ml-4 px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition">
                              Changer
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Localisation Section */}
                {activeSection === 'localisation' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Langue
                        </label>
                        <select
                          className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                          value={localeSettings.langue}
                          onChange={(e) =>
                            setLocaleSettings({ ...localeSettings, langue: e.target.value })
                          }
                          disabled={!editMode}
                        >
                          {languageOptions.map((lang, index) => (
                            <option key={index} value={lang}>
                              {lang}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Devise
                        </label>
                        <select
                          className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                          value={localeSettings.devise}
                          onChange={(e) =>
                            setLocaleSettings({ ...localeSettings, devise: e.target.value })
                          }
                          disabled={!editMode}
                        >
                          {currencyOptions.map((cur, index) => (
                            <option key={index} value={cur}>
                              {cur}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Format de la date
                        </label>
                        <select
                          className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                          value={localeSettings.formatDate}
                          onChange={(e) =>
                            setLocaleSettings({ ...localeSettings, formatDate: e.target.value })
                          }
                          disabled={!editMode}
                        >
                          {dateFormatOptions.map((fmt, index) => (
                            <option key={index} value={fmt}>
                              {fmt}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Format de l&apos;heure
                        </label>
                        <select
                          className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                          value={localeSettings.formatHeure}
                          onChange={(e) =>
                            setLocaleSettings({ ...localeSettings, formatHeure: e.target.value })
                          }
                          disabled={!editMode}
                        >
                          {timeFormatOptions.map((fmt, index) => (
                            <option key={index} value={fmt}>
                              {fmt}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fuseau horaire
                        </label>
                        <select
                          className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                          value={localeSettings.fuseauHoraire}
                          onChange={(e) =>
                            setLocaleSettings({ ...localeSettings, fuseauHoraire: e.target.value })
                          }
                          disabled={!editMode}
                        >
                          {timezoneOptions.map((tz, index) => (
                            <option key={index} value={tz}>
                              {tz}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Format de nombre
                        </label>
                        <select
                          className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                          value={localeSettings.formatNombre}
                          onChange={(e) =>
                            setLocaleSettings({ ...localeSettings, formatNombre: e.target.value })
                          }
                          disabled={!editMode}
                        >
                          {numberFormatOptions.map((fmt, index) => (
                            <option key={index} value={fmt}>
                              {fmt}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Premier jour de la semaine
                        </label>
                        <select
                          className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                          value={localeSettings.premierJourSemaine}
                          onChange={(e) =>
                            setLocaleSettings({
                              ...localeSettings,
                              premierJourSemaine: e.target.value
                            })
                          }
                          disabled={!editMode}
                        >
                          {weekdayOptions.map((day, index) => (
                            <option key={index} value={day}>
                              {day}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Taxes Section */}
                {activeSection === 'taxes' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        TVA par défaut
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                        value={taxSettings.tvaDefaut}
                        onChange={(e) =>
                          setTaxSettings({ ...taxSettings, tvaDefaut: e.target.value })
                        }
                        disabled={!editMode}
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-700 mb-2">Taux de TVA disponibles:</p>
                      {taxSettings.tauxTVA.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={item.taux}
                            onChange={(e) => {
                              const newTaux = [...taxSettings.tauxTVA];
                              newTaux[index].taux = e.target.value;
                              setTaxSettings({ ...taxSettings, tauxTVA: newTaux });
                            }}
                            disabled={!editMode}
                            className="w-20 p-2 border border-gray-300 rounded"
                          />
                          <span>{item.description}</span>
                          {item.defaut && <span className="text-green-600">Défaut</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents > Numérotation Section */}
                {activeSection === 'numerotation' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Préfixe devis
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={documentSettings.prefixeDevis}
                        onChange={(e) =>
                          setDocumentSettings({ ...documentSettings, prefixeDevis: e.target.value })
                        }
                        disabled={!editMode}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Format numéro de devis
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={documentSettings.formatNumeroDevis}
                        onChange={(e) =>
                          setDocumentSettings({
                            ...documentSettings,
                            formatNumeroDevis: e.target.value
                          })
                        }
                        disabled={!editMode}
                      />
                    </div>
                    {/* Add additional document settings as needed */}
                  </div>
                )}

                {/* Documents > Modèles Section */}
                {activeSection === 'modeles' && (
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Cette section vous permet de gérer les modèles de documents. (Contenu à définir)
                    </p>
                  </div>
                )}

                {/* Documents > Conditions de paiement Section */}
                {activeSection === 'paiements' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Conditions de paiement par défaut
                      </label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded"
                        value={documentSettings.conditionsPaiementDefaut}
                        onChange={(e) =>
                          setDocumentSettings({
                            ...documentSettings,
                            conditionsPaiementDefaut: e.target.value
                          })
                        }
                        disabled={!editMode}
                      >
                        {paymentTermsOptions.map((term, index) => (
                          <option key={index} value={term}>
                            {term}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Notifications > Email Section */}
                {activeSection === 'email' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SMTP Serveur
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={emailSettings.smtpServeur}
                        onChange={(e) =>
                          setEmailSettings({ ...emailSettings, smtpServeur: e.target.value })
                        }
                        disabled={!editMode}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Port SMTP
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded"
                          value={emailSettings.smtpPort}
                          onChange={(e) =>
                            setEmailSettings({ ...emailSettings, smtpPort: e.target.value })
                          }
                          disabled={!editMode}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sécurité SMTP
                        </label>
                        <select
                          className="w-full p-2 border border-gray-300 rounded"
                          value={emailSettings.smtpSecurity}
                          onChange={(e) =>
                            setEmailSettings({ ...emailSettings, smtpSecurity: e.target.value })
                          }
                          disabled={!editMode}
                        >
                          {smtpSecurityOptions.map((sec, index) => (
                            <option key={index} value={sec}>
                              {sec}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications > SMS Section */}
                {activeSection === 'sms' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fournisseur SMS
                      </label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded"
                        value={smsSettings.fournisseurSMS}
                        onChange={(e) =>
                          setSmsSettings({ ...smsSettings, fournisseurSMS: e.target.value })
                        }
                        disabled={!editMode}
                      >
                        {smsProviderOptions.map((prov, index) => (
                          <option key={index} value={prov}>
                            {prov}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Notifications > Alertes Section */}
                {activeSection === 'alertes' && (
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Paramètres pour la gestion des alertes et rappels. (Contenu à définir)
                    </p>
                  </div>
                )}

                {/* Avancé > API Section */}
                {activeSection === 'api' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Clés API
                      </label>
                      <ul className="list-disc ml-6">
                        {integrationSettings.clesApi.map((key, index) => (
                          <li key={index}>{key}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Avancé > Sécurité Section */}
                {activeSection === 'securite' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Délai de session (en minutes)
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={userSettings.sessionTimeout}
                        onChange={(e) =>
                          setUserSettings({ ...userSettings, sessionTimeout: e.target.value })
                        }
                        disabled={!editMode}
                      />
                    </div>
                  </div>
                )}

                {/* Avancé > Sauvegarde et données Section */}
                {activeSection === 'donnees' && (
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Paramètres de sauvegarde et gestion des données. (Contenu à définir)
                    </p>
                  </div>
                )}
              </div>

              {/* Reset Button */}
              <div className="mt-8">
                <button
                  onClick={resetSettings}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Réinitialiser les réglages
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
