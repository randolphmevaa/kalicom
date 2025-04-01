'use client';

import { Suspense, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiRefreshCw,
  FiEdit,
  FiTrash2,
  FiMail,
  // FiAlertCircle,
  FiSearch,
  FiFilter,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiExternalLink,
  FiDownload,
  FiServer,
  FiUserCheck,
  FiInfo,
  FiCalendar,
  // FiFileText,
  FiBarChart2,
  // FiCpu,
  // FiMonitor,
  FiActivity,
  FiEye,
  // FiChevronDown,
  FiUpload,
  FiAlertTriangle,
  FiMoreVertical
} from 'react-icons/fi';
import { KalicomChatWidget } from '@/app/components/dashboard/KalicomChatWidget';

// ------------------ Sample Interfaces & Data ------------------

interface Enregistrement {
  id: number;
  utilisateur1: string;
  utilisateur2: string;
  lanIP: string;
  ip: string;
  port: number;
  hote: string;
  statut: 'En ligne' | 'Hors ligne';
  ping: string; // e.g. "25ms"
  lastUpdated?: string;
}

interface EmailRow {
  id: number;
  envoye: string; // e.g. "10/10/2023 09:15"
  type: string;
  statut: 'Envoyé' | 'En cours' | 'Échec';
  reference: string;
  destinataire?: string;
  sujet?: string;
}

// Enhanced sample data
const sampleEnregistrements: Enregistrement[] = [
  {
    id: 1,
    utilisateur1: 'Alice Martin',
    utilisateur2: 'Account 101',
    lanIP: '192.168.1.10',
    ip: '203.0.113.5',
    port: 5060,
    hote: 'sip.provider.com',
    statut: 'En ligne',
    ping: '27ms',
    lastUpdated: '2023-10-15 09:30:15'
  },
  {
    id: 2,
    utilisateur1: 'Bob Dupont',
    utilisateur2: 'Account 102',
    lanIP: '192.168.1.11',
    ip: '203.0.113.10',
    port: 5060,
    hote: 'sip.provider.com',
    statut: 'Hors ligne',
    ping: '-',
    lastUpdated: '2023-10-14 17:45:22'
  },
  {
    id: 3,
    utilisateur1: 'Céline Petit',
    utilisateur2: 'Account 103',
    lanIP: '192.168.1.12',
    ip: '203.0.113.15',
    port: 5060,
    hote: 'sip.provider.com',
    statut: 'En ligne',
    ping: '32ms',
    lastUpdated: '2023-10-15 08:15:40'
  },
  {
    id: 4,
    utilisateur1: 'David Bernard',
    utilisateur2: 'Account 104',
    lanIP: '192.168.1.13',
    ip: '203.0.113.20',
    port: 5060,
    hote: 'sip.provider.com',
    statut: 'En ligne',
    ping: '18ms',
    lastUpdated: '2023-10-15 10:05:33'
  },
];

// Enhanced email data
const sampleEmails: EmailRow[] = [
  {
    id: 1,
    envoye: '2023-10-12 09:30',
    type: 'Notification',
    statut: 'Envoyé',
    reference: 'MSG-1001',
    destinataire: 'support@example.com',
    sujet: 'Rapport quotidien - Système PBX'
  },
  {
    id: 2,
    envoye: '2023-10-12 10:15',
    type: 'Alerte',
    statut: 'Échec',
    reference: 'MSG-1002',
    destinataire: 'admin@example.com',
    sujet: 'ALERTE: Détection de problème de connexion'
  },
  {
    id: 3,
    envoye: '2023-10-13 08:45',
    type: 'Rapport',
    statut: 'Envoyé',
    reference: 'MSG-1003',
    destinataire: 'direction@example.com',
    sujet: 'Rapport hebdomadaire - Performance système'
  },
  {
    id: 4,
    envoye: '2023-10-13 14:30',
    type: 'Notification',
    statut: 'En cours',
    reference: 'MSG-1004',
    destinataire: 'equipe@example.com',
    sujet: 'Mise à jour système prévue'
  },
];

// Status summary data
// const statusSummary = {
//   enregistrements: {
//     total: sampleEnregistrements.length,
//     online: sampleEnregistrements.filter(e => e.statut === 'En ligne').length,
//     offline: sampleEnregistrements.filter(e => e.statut === 'Hors ligne').length
//   },
//   emails: {
//     total: sampleEmails.length,
//     sent: sampleEmails.filter(e => e.statut === 'Envoyé').length,
//     failed: sampleEmails.filter(e => e.statut === 'Échec').length,
//     pending: sampleEmails.filter(e => e.statut === 'En cours').length
//   }
// };

// ------------------ Status Card Component ------------------
const StatusCard = ({ title, value, icon: Icon, color, bgColor }: { 
  title: string, 
  value: number | string, 
  icon: React.ElementType, 
  color: string, 
  bgColor: string 
}) => (
  <motion.div
    whileHover={{ y: -3, boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)' }}
    className={`p-4 rounded-xl border shadow-sm flex items-center gap-4 ${bgColor}`}
  >
    <div className={`w-10 h-10 ${color} bg-opacity-20 rounded-lg flex items-center justify-center`}>
      <Icon className={`w-5 h-5 ${color}`} />
    </div>
    <div>
      <p className="text-sm text-gray-600 font-medium">{title}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
    </div>
  </motion.div>
);

// ------------------ Search Bar Component ------------------
const SearchBar = ({ 
  searchTerm, 
  setSearchTerm, 
  placeholder 
}: { 
  searchTerm: string, 
  setSearchTerm: (term: string) => void, 
  placeholder: string 
}) => (
  <div className="relative">
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8]/30 focus:border-[#004AC8]"
    />
    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
  </div>
);

// ------------------ Main Component ------------------
export default function StatutPage() {
  // State for tabs and data
  const [activeTab, setActiveTab] = useState<'enregistrement' | 'emails'>('enregistrement');
  const [enregistrementData, setEnregistrementData] = useState<Enregistrement[]>(sampleEnregistrements);
  const [emailData, setEmailData] = useState<EmailRow[]>(sampleEmails);
  
  // UI states
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [searchTermRegistration, setSearchTermRegistration] = useState('');
  const [searchTermEmails, setSearchTermEmails] = useState('');

  // Filtered data based on search terms
  const filteredEnregistrements = enregistrementData.filter(item => 
    item.utilisateur1.toLowerCase().includes(searchTermRegistration.toLowerCase()) ||
    item.utilisateur2.toLowerCase().includes(searchTermRegistration.toLowerCase()) ||
    item.lanIP.includes(searchTermRegistration) ||
    item.ip.includes(searchTermRegistration) ||
    item.hote.toLowerCase().includes(searchTermRegistration.toLowerCase())
  );

  const filteredEmails = emailData.filter(item => 
    item.type.toLowerCase().includes(searchTermEmails.toLowerCase()) ||
    item.reference.toLowerCase().includes(searchTermEmails.toLowerCase()) ||
    (item.destinataire && item.destinataire.toLowerCase().includes(searchTermEmails.toLowerCase())) ||
    (item.sujet && item.sujet.toLowerCase().includes(searchTermEmails.toLowerCase()))
  );

  // Status summaries updated based on filtered data
  const filteredStatusSummary = {
    enregistrements: {
      total: filteredEnregistrements.length,
      online: filteredEnregistrements.filter(e => e.statut === 'En ligne').length,
      offline: filteredEnregistrements.filter(e => e.statut === 'Hors ligne').length
    },
    emails: {
      total: filteredEmails.length,
      sent: filteredEmails.filter(e => e.statut === 'Envoyé').length,
      failed: filteredEmails.filter(e => e.statut === 'Échec').length,
      pending: filteredEmails.filter(e => e.statut === 'En cours').length
    }
  };

  // Handler for refresh - now with visual feedback
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate API request with a delay
    setTimeout(() => {
      // For demo purposes, we're just setting the same data
      // In a real application, you would fetch fresh data here
      setEnregistrementData([...sampleEnregistrements]);
      setEmailData([...sampleEmails]);
      
      setLastRefresh(new Date());
      setIsRefreshing(false);
    }, 1200); // Simulated 1.2 second refresh
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen pb-12"
    >
      <div className="max-w-7xl mx-auto space-y-6 px-4 md:px-0">
        {/* ---------- Enhanced Header ---------- */}
        <div className="relative mb-8 overflow-hidden bg-white/80 rounded-3xl shadow-2xl border border-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-[#004AC8]/10 to-[#4BB2F6]/10 rounded-3xl pointer-events-none" />
          
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#4BB2F6]/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-[#004AC8]/20 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
          
          <div className="relative p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-[#004AC8]/10 rounded-xl">
                    <FiActivity className="w-6 h-6 text-[#004AC8]" />
                  </div>
                  <h1 className="text-3xl font-extrabold text-[#1B0353]">Statut</h1>
                </div>
                <p className="text-sm text-gray-600 mt-1 max-w-lg">
                  Consultez l&apos;état de vos enregistrements et emails. Surveillez la disponibilité et les problèmes potentiels.
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-500 flex items-center">
                  <FiClock className="mr-1.5 w-4 h-4" />
                  <span>
                    Dernière actualisation: {lastRefresh.toLocaleTimeString()}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 ${
                    isRefreshing 
                      ? 'bg-[#004AC8]/70 cursor-wait' 
                      : 'bg-[#004AC8] hover:bg-[#003DA8]'
                  } text-white rounded-xl font-semibold transition-colors shadow-md shadow-[#004AC8]/20`}
                >
                  <FiRefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? 'Actualisation...' : 'Actualiser'}
                </motion.button>
              </div>
            </div>
            
            {/* Status Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {activeTab === 'enregistrement' ? (
                <>
                  <StatusCard 
                    title="Total Enregistrements" 
                    value={filteredStatusSummary.enregistrements.total} 
                    icon={FiServer} 
                    color="text-blue-600" 
                    bgColor="bg-blue-50 border-blue-100" 
                  />
                  <StatusCard 
                    title="En ligne" 
                    value={filteredStatusSummary.enregistrements.online} 
                    icon={FiCheckCircle} 
                    color="text-green-600" 
                    bgColor="bg-green-50 border-green-100" 
                  />
                  <StatusCard 
                    title="Hors ligne" 
                    value={filteredStatusSummary.enregistrements.offline} 
                    icon={FiXCircle} 
                    color="text-red-600" 
                    bgColor="bg-red-50 border-red-100" 
                  />
                  <StatusCard 
                    title="Taux de disponibilité" 
                    value={`${filteredStatusSummary.enregistrements.total > 0 
                      ? Math.round((filteredStatusSummary.enregistrements.online / filteredStatusSummary.enregistrements.total) * 100) 
                      : 0}%`} 
                    icon={FiBarChart2} 
                    color="text-purple-600" 
                    bgColor="bg-purple-50 border-purple-100" 
                  />
                </>
              ) : (
                <>
                  <StatusCard 
                    title="Total Emails" 
                    value={filteredStatusSummary.emails.total} 
                    icon={FiMail} 
                    color="text-blue-600" 
                    bgColor="bg-blue-50 border-blue-100" 
                  />
                  <StatusCard 
                    title="Envoyés" 
                    value={filteredStatusSummary.emails.sent} 
                    icon={FiCheckCircle} 
                    color="text-green-600" 
                    bgColor="bg-green-50 border-green-100" 
                  />
                  <StatusCard 
                    title="Échecs" 
                    value={filteredStatusSummary.emails.failed} 
                    icon={FiXCircle} 
                    color="text-red-600" 
                    bgColor="bg-red-50 border-red-100" 
                  />
                  <StatusCard 
                    title="En cours" 
                    value={filteredStatusSummary.emails.pending} 
                    icon={FiClock} 
                    color="text-amber-600" 
                    bgColor="bg-amber-50 border-amber-100" 
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* ---------- Tabs Navigation (Preserved with added icons) ---------- */}
        <div className="relative mb-12">
          {/* Subtle divider below tabs */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#004AC8]/20 to-transparent" />

          <div className="flex gap-6 px-2">
            {[
              { id: 'enregistrement', label: 'Enregistrement', icon: FiServer },
              { id: 'emails', label: 'Emails', icon: FiMail }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'enregistrement' | 'emails')}
                  className="relative py-4"
                >
                  {/* Animated background for active tab */}
                  {isActive && (
                    <motion.div
                      layoutId="tabHighlight"
                      className="absolute inset-0 bg-gradient-to-b from-[#004AC8]/10 to-transparent rounded-t-2xl"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}

                  {/* Tab label with icon */}
                  <div className="relative flex items-center gap-2 px-4">
                    {/* Icon added here as requested */}
                    <tab.icon className={`w-4 h-4 ${isActive ? 'text-[#004AC8]' : 'text-gray-500'}`} />
                    
                    <span
                      className={`text-sm font-semibold transition-colors ${
                        isActive
                          ? 'text-[#004AC8] bg-clip-text bg-gradient-to-r from-[#004AC8] to-[#4BB2F6]'
                          : 'text-gray-600 hover:text-[#1B0353]'
                      }`}
                    >
                      {tab.label}
                    </span>
                    {/* Active dot */}
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-1.5 h-1.5 bg-[#4BB2F6] rounded-full"
                      />
                    )}
                  </div>

                  {/* Hover underline */}
                  <motion.div
                    initial={false}
                    whileHover={{
                      y: -2,
                      transition: { duration: 0.1 },
                    }}
                    className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                      isActive ? 'bg-[#004AC8]' : 'bg-transparent'
                    }`}
                  />
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ---------- Tab Content with Enhanced UI ---------- */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4 }}
          >
            {activeTab === 'enregistrement' ? (
              <EnregistrementTab 
                enregistrements={filteredEnregistrements} 
                searchTerm={searchTermRegistration}
                setSearchTerm={setSearchTermRegistration}
                isRefreshing={isRefreshing}
              />
            ) : (
              <EmailsTab 
                emails={filteredEmails} 
                searchTerm={searchTermEmails}
                setSearchTerm={setSearchTermEmails}
                isRefreshing={isRefreshing}
              />
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* ---------- System Alert Banner ---------- */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3"
        >
          <div className="p-1 bg-blue-100 rounded-full">
            <FiInfo className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-600">Information système</h3>
            <p className="text-sm text-blue-800 mt-1">
              Surveillez cette page pour l&apos;état de votre système. En cas de problème, consultez nos 
              <a href="#" className="font-medium underline ml-1">guides de dépannage</a> ou 
              <a href="#" className="font-medium underline ml-1">contactez le support</a>.
            </p>
          </div>
        </motion.div>
      </div>
      {/* Chat Widget */}
            <Suspense fallback={<div className="skeleton-loader">Loading...</div>}>
              <KalicomChatWidget />
            </Suspense>
    </motion.div>
  );
}

// ------------------ Enhanced Enregistrement Tab ------------------
function EnregistrementTab({
  enregistrements,
  searchTerm,
  setSearchTerm,
  isRefreshing
}: {
  enregistrements: Enregistrement[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isRefreshing: boolean;
}) {
  // Calculate how recently a record was updated
  const getUpdateStatus = (lastUpdated?: string) => {
    if (!lastUpdated) return { text: 'Inconnu', color: 'text-gray-500' };
    
    const updateTime = new Date(lastUpdated).getTime();
    const now = new Date().getTime();
    const hoursDiff = (now - updateTime) / (1000 * 60 * 60);
    
    if (hoursDiff < 1) return { text: 'Récent', color: 'text-green-600' };
    if (hoursDiff < 24) return { text: 'Aujourd\'hui', color: 'text-blue-600' };
    return { text: 'Plus ancien', color: 'text-amber-600' };
  };

  return (
    <div className="space-y-4">
      {/* Search and Action Bar */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="md:w-1/3">
          <SearchBar 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            placeholder="Rechercher par utilisateur, IP, hôte..." 
          />
        </div>
        
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <FiDownload className="w-4 h-4" />
            <span className="text-sm font-medium">Exporter</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <FiFilter className="w-4 h-4" />
            <span className="text-sm font-medium">Filtrer</span>
          </motion.button>
        </div>
      </div>
      
      {/* Main Table */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        {isRefreshing ? (
          // Loading State
          <div className="flex items-center justify-center h-72">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-[#004AC8] border-t-transparent animate-spin"></div>
              <p className="text-gray-500 font-medium">Actualisation des données...</p>
            </div>
          </div>
        ) : enregistrements.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FiServer className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Aucun enregistrement trouvé</h3>
            <p className="text-gray-500 max-w-md text-center mb-6">
              Aucun enregistrement ne correspond à vos critères de recherche. Essayez de modifier votre recherche ou d&apos;actualiser la page.
            </p>
            <button 
              onClick={() => setSearchTerm('')}
              className="px-4 py-2 bg-[#004AC8] text-white rounded-xl hover:bg-[#003DA8] transition-colors"
            >
              Effacer la recherche
            </button>
          </div>
        ) : (
          // Table Content
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-gradient-to-r from-[#004AC8]/5 to-[#4BB2F6]/5">
                <tr>
                  {[
                    'Utilisateur',
                    'Utilisateur',
                    'LAN IP',
                    'IP',
                    'Port',
                    'Hôte',
                    'Statut',
                    'Ping',
                    'Dernière MAJ',
                    'Actions',
                  ].map((header, idx) => (
                    <th
                      key={idx}
                      className="px-6 py-3 text-left text-sm font-semibold text-[#1B0353] first:rounded-tl-xl last:rounded-tr-xl"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/80 text-sm">
                {enregistrements.map((item) => {
                  const updateStatus = getUpdateStatus(item.lastUpdated);
                  
                  return (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ backgroundColor: '#f8fafc' }}
                      className="group transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <FiUserCheck className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-800">{item.utilisateur1}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{item.utilisateur2}</td>
                      <td className="px-6 py-4 text-gray-700">
                        <div className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">{item.lanIP}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        <div className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">{item.ip}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{item.port}</td>
                      <td className="px-6 py-4 text-gray-700">
                        <div className="flex items-center gap-1.5">
                          <span>{item.hote}</span>
                          <a href="#" className="text-blue-500 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity">
                            <FiExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`relative flex h-2.5 w-2.5 ${item.statut === 'En ligne' ? 'animate-pulse' : ''}`}
                          >
                            {item.statut === 'En ligne' && (
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            )}
                            <span 
                              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                                item.statut === 'En ligne' ? 'bg-green-500' : 'bg-red-500'
                              }`}
                            ></span>
                          </span>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${
                              item.statut === 'En ligne'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {item.statut}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {item.ping !== '-' ? (
                          <div className="flex items-center gap-1.5">
                            <FiActivity className="w-4 h-4 text-blue-500" />
                            <span className="font-medium">{item.ping}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {item.lastUpdated ? (
                          <div className="flex flex-col">
                            <span className={`text-xs ${updateStatus.color}`}>{updateStatus.text}</span>
                            <span className="text-xs text-gray-500">{new Date(item.lastUpdated).toLocaleString('fr-FR')}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                            title="Modifier"
                          >
                            <FiEdit className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                            title="Supprimer"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 hover:bg-amber-100 rounded-lg text-amber-600 transition-colors"
                            title="Plus d'options"
                          >
                            <FiMoreVertical className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ------------------ Enhanced Emails Tab ------------------
function EmailsTab({ 
  emails,
  searchTerm,
  setSearchTerm,
  isRefreshing
}: { 
  emails: EmailRow[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isRefreshing: boolean;
}) {
  // Function to get appropriate status styles
  const getStatusStyles = (status: string) => {
    switch(status) {
      case 'Envoyé':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          icon: FiCheckCircle,
          iconColor: 'text-green-600'
        };
      case 'Échec':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          icon: FiXCircle,
          iconColor: 'text-red-600'
        };
      case 'En cours':
        return {
          bgColor: 'bg-amber-100',
          textColor: 'text-amber-800',
          icon: FiClock,
          iconColor: 'text-amber-600'
        };
      default:
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          icon: FiInfo,
          iconColor: 'text-gray-600'
        };
    }
  };

  // Function to get appropriate type badge styles
  const getTypeBadgeStyles = (type: string) => {
    switch(type) {
      case 'Notification':
        return {
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200'
        };
      case 'Alerte':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200'
        };
      case 'Rapport':
        return {
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-800',
          borderColor: 'border-purple-200'
        };
      default:
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200'
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Action Bar */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="md:w-1/3">
          <SearchBar 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            placeholder="Rechercher par type, référence, sujet..." 
          />
        </div>
        
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <FiDownload className="w-4 h-4" />
            <span className="text-sm font-medium">Exporter</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-xl bg-[#004AC8] text-white flex items-center gap-2 hover:bg-[#003DA8] transition-colors shadow-sm"
          >
            <FiUpload className="w-4 h-4" />
            <span className="text-sm font-medium">Nouvel Email</span>
          </motion.button>
        </div>
      </div>
      
      {/* Main Table */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        {isRefreshing ? (
          // Loading State
          <div className="flex items-center justify-center h-72">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-[#004AC8] border-t-transparent animate-spin"></div>
              <p className="text-gray-500 font-medium">Actualisation des données...</p>
            </div>
          </div>
        ) : emails.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FiMail className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Aucun email trouvé</h3>
            <p className="text-gray-500 max-w-md text-center mb-6">
              Aucun email ne correspond à vos critères de recherche. Essayez de modifier votre recherche ou d&apos;actualiser la page.
            </p>
            <button 
              onClick={() => setSearchTerm('')}
              className="px-4 py-2 bg-[#004AC8] text-white rounded-xl hover:bg-[#003DA8] transition-colors"
            >
              Effacer la recherche
            </button>
          </div>
        ) : (
          // Table Content
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gradient-to-r from-[#004AC8]/5 to-[#4BB2F6]/5">
                <tr>
                  {['Envoyé', 'Type', 'Sujet', 'Destinataire', 'Statut', 'Référence', 'Actions'].map(
                    (header, idx) => (
                      <th
                        key={idx}
                        className="px-6 py-3 text-left text-sm font-semibold text-[#1B0353] first:rounded-tl-xl last:rounded-tr-xl"
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/80 text-sm">
                {emails.map((item) => {
                  const statusStyles = getStatusStyles(item.statut);
                  const typeBadgeStyles = getTypeBadgeStyles(item.type);
                  const StatusIcon = statusStyles.icon;
                  
                  return (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ backgroundColor: '#f8fafc' }}
                      className="group transition-colors"
                    >
                      <td className="px-6 py-4 text-gray-700">
                        <div className="flex items-center gap-1.5">
                          <FiCalendar className="w-4 h-4 text-gray-400" />
                          {new Date(item.envoye).toLocaleString('fr-FR')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${typeBadgeStyles.bgColor} ${typeBadgeStyles.textColor} ${typeBadgeStyles.borderColor}`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {item.sujet || '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {item.destinataire ? (
                          <div className="flex items-center gap-1.5">
                            <FiMail className="w-4 h-4 text-gray-400" />
                            <span>{item.destinataire}</span>
                          </div>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <StatusIcon className={`w-4 h-4 ${statusStyles.iconColor}`} />
                          <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusStyles.bgColor} ${statusStyles.textColor}`}>
                            {item.statut}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                          {item.reference}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                            title="Voir l'email"
                          >
                            <FiEye className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 hover:bg-amber-100 rounded-lg text-amber-600 transition-colors"
                            title="Renvoyer"
                          >
                            <FiMail className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                            title="Supprimer"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Error notification example */}
        {emails.some(email => email.statut === 'Échec') && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <div className="p-1.5 bg-red-100 rounded-lg">
              <FiAlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-red-800">Problèmes de livraison détectés</h3>
              <p className="text-xs text-red-700 mt-1">
                Certains emails n&apos;ont pas pu être livrés. Vérifiez les paramètres de votre serveur SMTP ou les adresses des destinataires.
              </p>
              <button className="mt-2 px-3 py-1 bg-white border border-red-300 rounded-lg text-xs font-medium text-red-700 hover:bg-red-50">
                Voir les détails
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
