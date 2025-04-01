'use client';

import React, { useState, useEffect, Suspense, lazy, JSX } from 'react';
import { motion, Variants } from 'framer-motion';
import {
  FiHome,
  FiChevronRight,
  FiPhone,
  FiFilter
} from 'react-icons/fi';
import { KalicomChatWidget } from '@/app/components/dashboard/KalicomChatWidget';

// Define CallLog interface
interface CallLog {
  id: number;
  direction: 'Entrant' | 'Sortant' | 'Interne';
  extensionUser: string;
  callerName: string;
  debut: string;
  fin: string;
  monNumero: string;
  numeroDuContact: string;
  dureeAppel: number;
  tta: number;
  enregistrement: boolean;
  du: string;
  vers: string;
  cost: number;
  statut: 'Répondu' | 'Échoué' | 'Annulé' | 'Messagerie vocale';
}

// Define SearchParams interface
interface SearchParams {
  direction: string;
  date: string;
  monNumero: string;
  numeroDuContact: string;
  statut: string;
  extensionUser: string;
  minDureeSec: string;
  maxDureeSec: string;
  callName: string;
}

// Define StatsData interface
interface StatsData {
  totalCalls: number;
  incomingCalls: number;
  outgoingCalls: number;
  internalCalls: number;
  answeredCalls: number;
  failedCalls: number;
  missedCalls: number;
  totalDuration: number;
  totalCost: number;
  avgCallDuration: number;
  avgAnswerTime: number;
}

// ---------- Lazy-loaded components ----------
const StatsCards = lazy(() => import('./components/StatsCards'));
const FilterSection = lazy(() => import('./components/FilterSection'));
const LegendSection = lazy(() => import('./components/LegendSection'));
const CallTable = lazy(() => import('./components/CallTable'));
// const KalicomChatWidget = lazy(() => import('@/app/components/dashboard/KalicomChatWidget'));

// ---------- Animation Variants ----------
const headerVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      ease: "easeOut" 
    }
  }
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.4 } 
  }
};

// ---------- Utility components ----------
interface BreadcrumbsProps {
  items: string[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => (
  <motion.div 
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: 0.1 }}
    className="flex items-center text-sm text-gray-600 mb-6"
  >
    <FiHome className="mr-2 text-gray-500" />
    {items.map((item: string, index: number) => (
      <div key={index} className="flex items-center">
        {index > 0 && <FiChevronRight className="mx-2 text-gray-400" />}
        <span className={index === items.length - 1 ? "text-[#004AC8] font-medium" : ""}>{item}</span>
      </div>
    ))}
  </motion.div>
);

// ---------- Utility functions ----------
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

// Generate sample data (moved to a separate utility file)
const generateSampleLogs = (): Promise<CallLog[]> => 
  import('./utils/sampleDataGenerator').then(module => module.generateSampleLogs());

// ---------- Main Component ----------
export default function JournalAppelsEnregistrements(): JSX.Element {
  // The call logs
  const [logs, setLogs] = useState<CallLog[]>([]);
  const [ , setIsLoading] = useState<boolean>(true);
  
  // Load sample data
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const data = await generateSampleLogs();
        setLogs(data);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // ---------- Filter States ----------
  const [searchParams, setSearchParams] = useState<SearchParams>({
    direction: '',
    date: '',
    monNumero: '',
    numeroDuContact: '',
    statut: '',
    extensionUser: '',
    minDureeSec: '',
    maxDureeSec: '',
    callName: '',
  });
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 5;
  
  // ---------- Filtered logs ----------
  const filteredLogs = logs.filter(log => {
    // Apply filters
    if (searchParams.direction && log.direction !== searchParams.direction) return false;
    if (searchParams.statut && log.statut !== searchParams.statut) return false;
    if (searchParams.extensionUser && log.extensionUser !== searchParams.extensionUser) return false;
    if (searchParams.date && !log.debut.includes(searchParams.date)) return false;
    
    // Phone number filters (partial match)
    if (searchParams.monNumero && !log.monNumero.includes(searchParams.monNumero)) return false;
    if (searchParams.numeroDuContact && !log.numeroDuContact.includes(searchParams.numeroDuContact)) return false;
    
    // Caller name filter (partial match)
    if (searchParams.callName && !log.callerName.toLowerCase().includes(searchParams.callName.toLowerCase())) return false;
    
    // Duration range filter
    if (searchParams.minDureeSec && log.dureeAppel < parseInt(searchParams.minDureeSec)) return false;
    if (searchParams.maxDureeSec && log.dureeAppel > parseInt(searchParams.maxDureeSec)) return false;
    
    return true;
  });
  
  // ---------- Pagination ----------
  const pageCount: number = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs: CallLog[] = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  // ---------- Filter Handlers ----------
  const handleChange = (field: string, value: string): void => {
    setSearchParams((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };
  
  const handleReset = (): void => {
    setSearchParams({
      direction: '',
      date: '',
      monNumero: '',
      numeroDuContact: '',
      statut: '',
      extensionUser: '',
      minDureeSec: '',
      maxDureeSec: '',
      callName: '',
    });
    setCurrentPage(1);
  };
  
  // Calculate stats for passing to StatsCards component
  const calculateStats = (): StatsData => {
    const totalCalls = logs.length;
    const incomingCalls = logs.filter(log => log.direction === 'Entrant').length;
    const outgoingCalls = logs.filter(log => log.direction === 'Sortant').length;
    const internalCalls = logs.filter(log => log.direction === 'Interne').length;
    const answeredCalls = logs.filter(log => log.statut === 'Répondu').length;
    const failedCalls = logs.filter(log => log.statut === 'Échoué').length;
    const missedCalls = logs.filter(log => log.statut === 'Annulé' || log.statut === 'Messagerie vocale').length;
    const totalDuration = logs.reduce((sum, log) => sum + log.dureeAppel, 0);
    const totalCost = logs.reduce((sum, log) => sum + log.cost, 0);
    const avgCallDuration = totalCalls > 0 ? Math.round(totalDuration / totalCalls) : 0;
    const avgAnswerTime = logs.length > 0 ? logs.reduce((sum, log) => sum + log.tta, 0) / logs.length : 0;
    
    return {
      totalCalls,
      incomingCalls,
      outgoingCalls,
      internalCalls,
      answeredCalls,
      failedCalls,
      missedCalls,
      totalDuration,
      totalCost,
      avgCallDuration,
      avgAnswerTime
    };
  };
  
  const stats: StatsData = calculateStats();
  
  // ---------- Render ----------
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className=" "
    >
      <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 pb-12">
        {/* Breadcrumbs */}
        <Breadcrumbs items={['PBX', 'Applications', 'Journal d\'appels']} />
        
        {/* Header Section */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="relative mb-8 overflow-hidden backdrop-blur-sm bg-white/80 rounded-3xl shadow-2xl border border-gray-100"
        >
          {/* Background decorations and content */}
          <div 
            className="absolute inset-0 opacity-5 mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '30px 30px'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#004AC8]/10 via-white/70 to-[#4BB2F6]/10 rounded-3xl pointer-events-none" />
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#004AC8]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#4BB2F6]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative p-8 z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#004AC8]/10 rounded-lg">
                    <FiPhone className="w-6 h-6 text-[#004AC8]" />
                  </div>
                  <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#1B0353] to-[#4BB2F6]">
                    Journal d&apos;appels & enregistrements
                  </h1>
                  <span className="px-2 py-1 text-xs font-medium text-[#004AC8] bg-[#004AC8]/10 rounded-full">
                    {stats.totalCalls} appels
                  </span>
                </div>
                
                <p className="text-base text-gray-600 leading-relaxed">
                  Consultez, filtrez et exportez l&apos;historique de vos appels. Analysez les performances 
                  et optimisez votre gestion téléphonique.
                </p>
              </div>
              
              <div className="flex space-x-4">
                {/* Export Buttons */}
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      console.log('Exporting to CSV');
                      alert('Le CSV journal-appels.csv a été généré et téléchargé.');
                    }}
                    className="flex items-center px-4 py-2 bg-[#004AC8]/10 text-[#004AC8] rounded-xl hover:bg-[#004AC8]/20 transition"
                    title="Exporter en CSV"
                  >
                    <FiFilter className="mr-2" />
                    CSV
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      console.log('Exporting to PDF');
                      alert('Le PDF journal-appels.pdf a été généré et téléchargé.');
                    }}
                    className="flex items-center px-4 py-2 bg-[#004AC8]/10 text-[#004AC8] rounded-xl hover:bg-[#004AC8]/20 transition"
                    title="Exporter en PDF"
                  >
                    <FiFilter className="mr-2" />
                    PDF
                  </motion.button>
                </div>
              </div>
            </div>
            
            {/* Quick tip */}
            <div className="mt-6 flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl text-sm">
              <FiFilter className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-amber-700">Astuce :</span>{' '}
                <span className="text-amber-700">
                  Utilisez les filtres avancés pour affiner votre recherche. Vous pouvez filtrer par date, direction, extension ou statut. 
                  Exportez vos résultats au format CSV ou PDF pour les partager avec votre équipe.
                </span>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Stats Cards Section */}
        <Suspense fallback={<div className="h-32 bg-gray-100 rounded-3xl animate-pulse"></div>}>
          <StatsCards stats={stats} itemVariants={itemVariants} />
        </Suspense>
        
        {/* Filters Section */}
        <Suspense fallback={<div className="h-64 bg-gray-100 rounded-2xl animate-pulse"></div>}>
          <FilterSection 
            searchParams={searchParams}
            handleChange={handleChange}
            handleReset={handleReset}
            showAdvanced={showAdvanced}
            setShowAdvanced={setShowAdvanced}
            itemVariants={itemVariants}
          />
        </Suspense>
        
        {/* Legend Section */}
        <Suspense fallback={<div className="h-32 bg-gray-100 rounded-2xl animate-pulse"></div>}>
          <LegendSection itemVariants={itemVariants} />
        </Suspense>
        
        {/* Table Section */}
        <Suspense fallback={<div className="h-96 bg-gray-100 rounded-2xl animate-pulse"></div>}>
          <CallTable 
            paginatedLogs={paginatedLogs}
            filteredLogs={filteredLogs}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            pageCount={pageCount}
            formatTime={formatTime}
            itemVariants={itemVariants}
          />
        </Suspense>
      </div>
      
      {/* Chat Widget */}
      <Suspense fallback={<div className="skeleton-loader">Loading...</div>}>
        <KalicomChatWidget />
      </Suspense>
    </motion.div>
  );
}
