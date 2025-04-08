// 7. Create the main page component with lazy loading
// app/dashboard/pbx/mes-lignes/page.tsx
'use client';

import { useState, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { 
  FiPhone, 
  // FiSearch, 
  // FiPlus, 
  FiEdit, 
  // FiTrash2, 
  // FiRefreshCw, 
  FiFilter, 
  FiDownload, 
  FiFileText,
  FiInfo
} from 'react-icons/fi';
import { exportToCSV, exportToPDF } from './utils/helpers';
import { lines, devices, usageLines } from './data/mockData';
import { headerVariants } from './utils/animations';
import { LineType, Device } from './models/types';
import Breadcrumbs from './components/Breadcrumbs';
import { KalicomChatWidget } from '@/app/components/dashboard/KalicomChatWidget';

// Lazy load components that are not needed on initial load
const MesLignesTab = lazy(() => import('./components/tabs/MesLignesTab'));
const UsageSummaryTab = lazy(() => import('./components/tabs/UsageSummaryTab'));
const DevicesTab = lazy(() => import('./components/tabs/DevicesTab'));
const LineDetails = lazy(() => import('./components/forms/LineDetails'));
const DeviceForm = lazy(() => import('./components/forms/DeviceForm'));

// Loading fallbacks
const TabLoading = () => (
  <div className="animate-pulse">
    <div className="h-32 bg-gray-200 rounded-3xl mb-6"></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-36 bg-gray-200 rounded-3xl"></div>
      ))}
    </div>
    <div className="h-96 bg-gray-200 rounded-3xl"></div>
  </div>
);

const FormLoading = () => (
  <div className="animate-pulse">
    <div className="h-16 bg-gray-200 rounded-xl mb-6"></div>
    <div className="h-96 bg-gray-200 rounded-3xl"></div>
  </div>
);

// Main Component
export default function PBXMesLignes() {
  const [activeTab, setActiveTab] = useState('mes-lignes');
  const [selectedLine, setSelectedLine] = useState<LineType | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [addingDevice, setAddingDevice] = useState(false);
  
  // If a line or device is selected, show the appropriate form
  if (selectedLine) {
    return (
      <Suspense fallback={<FormLoading />}>
        <LineDetails line={selectedLine} onClose={() => setSelectedLine(null)} />
      </Suspense>
    );
  }
  
  if (selectedDevice || addingDevice) {
    return (
      <Suspense fallback={<FormLoading />}>
        <DeviceForm 
          device={selectedDevice || undefined} 
          onClose={() => {
            setSelectedDevice(null);
            setAddingDevice(false);
          }} 
        />
      </Suspense>
    );
  }

  // Get the count for statistics
  const totalLines = lines.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-gray-700 pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 pb-12"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={['PBX', activeTab === 'mes-lignes' ? 'Mes lignes' : activeTab === "résumé-d'utilisation" ? "Résumé d'utilisation" : 'Devices']} />
        
        {/* Enhanced Header / Hero Section */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="relative mb-8 overflow-hidden backdrop-blur-sm bg-white/80 rounded-3xl shadow-2xl border border-gray-100"
        >
          {/* Background pattern and gradient */}
          <div 
            className="absolute inset-0 opacity-5 mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '30px 30px'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#004AC8]/10 via-white/70 to-[#4BB2F6]/10 rounded-3xl pointer-events-none" />

          {/* Blurred circles for decoration */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#004AC8]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#4BB2F6]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative p-8 z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
              <div className="max-w-2xl">
                {/* Title with decorative elements */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#004AC8]/10 rounded-lg">
                    <FiPhone className="w-6 h-6 text-[#004AC8]" />
                  </div>
                  <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#1B0353] to-[#4BB2F6]">
                    Gestion des Lignes
                  </h1>
                  <span className="px-2 py-1 text-xs font-medium text-[#004AC8] bg-[#004AC8]/10 rounded-full">
                    {totalLines} lignes
                  </span>
                </div>
                
                <p className="text-base text-gray-600 leading-relaxed">
                  Contrôlez et surveillez vos lignes téléphoniques. Gérez vos appareils et visualisez 
                  les statistiques d&apos;utilisation pour optimiser votre système.
                </p>
              </div>
              
              <div className="flex space-x-4">
                {/* Export Buttons */}
                <div className="flex space-x-2">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (activeTab === 'mes-lignes') exportToCSV(lines, 'mes-lignes');
                      else if (activeTab === "résumé-d'utilisation") exportToCSV(usageLines, 'resume-utilisation');
                      else exportToCSV(devices, 'devices');
                    }}
                    className="flex items-center px-4 py-2 bg-[#004AC8]/10 text-[#004AC8] rounded-xl hover:bg-[#004AC8]/20 transition"
                    title="Exporter en CSV"
                  >
                    <FiDownload className="mr-2" />
                    CSV
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (activeTab === 'mes-lignes') exportToPDF('mes-lignes-table', 'mes-lignes');
                      else if (activeTab === "résumé-d'utilisation") exportToPDF('resume-utilisation-table', 'resume-utilisation');
                      else exportToPDF('devices-table', 'devices');
                    }}
                    className="flex items-center px-4 py-2 bg-[#004AC8]/10 text-[#004AC8] rounded-xl hover:bg-[#004AC8]/20 transition"
                    title="Exporter en PDF"
                  >
                    <FiFileText className="mr-2" />
                    PDF
                  </motion.button>
                </div>
              </div>
            </div>
            
            {/* Quick tip */}
            <div className="mt-6 flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl text-sm">
              <FiInfo className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-amber-700">Astuce :</span>{' '}
                <span className="text-amber-700">
                  Utilisez les filtres pour affiner vos données. Vous pouvez exporter vos rapports au format CSV ou PDF pour les partager avec votre équipe.
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Tab Navigation */}
        <div className="relative mb-12">
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#004AC8]/20 to-transparent" />
          
          <div className="flex gap-6 px-2">
            {[
              { id: 'mes-lignes', label: 'Mes lignes', icon: FiPhone },
              { id: "résumé-d'utilisation", label: "Résumé d'utilisation", icon: FiFilter },
              { id: 'devices', label: 'Devices', icon: FiEdit }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="text-gray-700 relative py-4"
                >
                  {/* Animated background */}
                  {isActive && (
                    <motion.div
                      layoutId="tabHighlight"
                      className="absolute inset-0 bg-gradient-to-b from-[#004AC8]/10 to-transparent rounded-t-2xl"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}

                  {/* Tab Content */}
                  <div className="relative flex items-center gap-2 px-4">
                    <tab.icon className={`w-5 h-5 ${isActive ? 'text-[#004AC8]' : 'text-gray-600'}`} />
                    <span className={`text-sm font-semibold transition-colors ${
                      isActive 
                        ? 'text-[#004AC8] bg-clip-text bg-gradient-to-r from-[#004AC8] to-[#4BB2F6]' 
                        : 'text-gray-600 hover:text-[#1B0353]'
                    }`}>
                      {tab.label}
                    </span>

                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-1.5 h-1.5 bg-[#4BB2F6] rounded-full"
                      />
                    )}
                  </div>

                  {/* Hover effect */}
                  <motion.div
                    initial={false}
                    whileHover={{ 
                      y: -2,
                      transition: { duration: 0.1 }
                    }}
                    className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                      isActive ? 'bg-[#004AC8]' : 'bg-transparent'
                    }`}
                  />
                </motion.button>
              );
            })}
          </div>

          {/* Animated underline */}
          <motion.div
            className="absolute bottom-0 h-0.5 bg-[#004AC8]"
            animate={{
              width: 'var(--underline-width)',
              left: 'var(--underline-left)',
            }}
            transition={{ type: 'spring', bounce: 0.25, duration: 0.6 }}
          />
        </div>

        {/* Tab Content with Suspense for lazy loading */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Suspense fallback={<TabLoading />}>
            {activeTab === 'mes-lignes' && <MesLignesTab lines={lines} onSelectLine={setSelectedLine} />}
            {activeTab === "résumé-d'utilisation" && <UsageSummaryTab usageLines={usageLines} />}
            {activeTab === 'devices' && <DevicesTab 
              devices={devices} 
              onSelectDevice={setSelectedDevice} 
              onAddDevice={() => setAddingDevice(true)} 
            />}
          </Suspense>
        </motion.div>
      </div>
      {/* Chat Widget */}
            <Suspense fallback={<div className="skeleton-loader">Loading...</div>}>
              <KalicomChatWidget />
            </Suspense>
    </motion.div>
  );
}
