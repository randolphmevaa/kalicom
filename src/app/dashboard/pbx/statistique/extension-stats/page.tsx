'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import {
  FiActivity,
  FiHome,
  FiChevronRight,
  FiCalendar,
  FiFilter,
  FiClock,
  FiPhone,
  FiList,
  FiRefreshCw,
  FiDownload,
  FiSearch,
  FiChevronDown,
  FiInfo,
  FiPlus,
  // FiArrowUp,
  // FiArrowDown,
  // FiSliders,
  FiUser,
  FiPhoneIncoming,
  FiPhoneOutgoing,
  FiPhoneMissed,
  // FiUserPlus,
  FiCheckCircle,
  // FiXCircle,
  FiChevronsDown,
  FiChevronsUp,
  FiAlertTriangle,
  // FiEye,
  // FiEyeOff,
  // FiMoreHorizontal,
  FiSettings,
  FiMaximize2,
  FiMinimize2,
  // FiCheck as FiCheckIcon,
  FiMinimize,
  FiMaximize,
  FiMenu
} from 'react-icons/fi';

// Define types for data structures
interface LineData {
  id: number;
  extension: string;
  userName: string;
  firstCall: string;
  lastCall: string;
  duration: string;
  calls: number;
  missed: number;
  average: string;
  incoming: number;
  outgoing: number;
  internal: number;
  status: 'active' | 'inactive';
  [key: string]: string | number; // Index signature to allow dynamic access
}

interface ColumnDefinition {
  key: string;
  label: string;
  icon?: React.ComponentType<{className?: string}>;
  alwaysVisible?: boolean;
}

interface DateRange {
  label: string;
  value: string;
  icon: React.ComponentType<{className?: string}>;
}

// Shimmer loading effect component
interface ShimmerProps {
  className: string;
}

const Shimmer: React.FC<ShimmerProps> = ({ className }) => (
  <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_100%] ${className}`}></div>
);

// Enhanced Breadcrumbs component with hover effects
interface BreadcrumbsProps {
  items: string[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => (
  <motion.div 
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center text-sm text-gray-600 mb-6 overflow-x-auto whitespace-nowrap pb-1"
  >
    <Link href="/dashboard" className="hover:text-[#004AC8] transition-colors">
      <FiHome className="mr-2 text-gray-500" />
    </Link>
    {items.map((item, index) => (
      <div key={index} className="flex items-center">
        <FiChevronRight className="mx-2 text-gray-400" />
        {index === items.length - 1 ? (
          <span className="text-[#004AC8] font-medium">{item}</span>
        ) : (
          <Link 
            href={index === 0 ? "/dashboard" : "/dashboard/pbx/statistique"}
            className="hover:text-[#004AC8] transition-colors"
          >
            {item}
          </Link>
        )}
      </div>
    ))}
  </motion.div>
);

// Enhanced Date Range Selector Component
interface DateRangeSelectorProps {
  selectedRange: string;
  setSelectedRange: (range: string) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ selectedRange, setSelectedRange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  
  const dateRanges: DateRange[] = [
    { label: "Aujourd'hui", value: "today", icon: FiCalendar },
    { label: "Hier", value: "yesterday", icon: FiCalendar },
    { label: "7 derniers jours", value: "last7days", icon: FiCalendar },
    { label: "30 derniers jours", value: "last30days", icon: FiCalendar },
    { label: "Ce mois", value: "thisMonth", icon: FiCalendar },
    { label: "Tout le temps", value: "allTime", icon: FiCalendar },
    { label: "Plage personnalisée", value: "custom", icon: FiCalendar }
  ];

  const selectedRangeData = dateRanges.find(r => r.value === selectedRange) || dateRanges[0];

  return (
    <div className="relative inline-block w-full">
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="w-full flex items-center justify-between pl-4 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent hover:border-orange-300 transition-colors"
      >
        <div className="flex items-center">
          <selectedRangeData.icon className="w-4 h-4 text-gray-500 mr-2" />
          <span>{selectedRangeData.label}</span>
        </div>
        <FiChevronDown className={`w-4 h-4 text-gray-500 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </motion.button>
      
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg py-1 max-h-64 overflow-auto"
          >
            {dateRanges.map((range) => (
              <motion.div
                key={range.value}
                whileHover={{ backgroundColor: '#F3F4F6' }}
                className={`px-4 py-2 cursor-pointer flex items-center ${selectedRange === range.value ? 'bg-orange-50 text-orange-700' : ''}`}
                onClick={() => {
                  setSelectedRange(range.value);
                  setIsDropdownOpen(false);
                }}
              >
                <range.icon className="w-4 h-4 mr-2 text-gray-500" />
                {range.label}
                {selectedRange === range.value && (
                  <FiCheckCircle className="w-4 h-4 ml-auto text-orange-600" />
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Loading State Component
const LoadingState: React.FC = () => (
  <div className="space-y-6">
    <div className="flex justify-between">
      <Shimmer className="h-10 w-48 rounded-xl" />
      <Shimmer className="h-10 w-36 rounded-xl" />
    </div>
    <Shimmer className="h-16 w-full rounded-xl" />
    <Shimmer className="h-64 w-full rounded-xl" />
  </div>
);

// Enhanced Table Row for Mobile View (Card Style)
interface MobileTableRowProps {
  line: LineData;
  index: number;
}

const MobileTableRow: React.FC<MobileTableRowProps> = ({ line, index }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 mb-3 overflow-hidden"
    >
      <div 
        className="p-4 flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <div className={`w-2.5 h-2.5 rounded-full mr-2.5 ${line.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <div>
            <div className="font-medium text-gray-800">{line.extension}</div>
            <div className="text-sm text-gray-500">{line.userName}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="font-medium text-gray-700">{line.calls}</div>
            <div className="text-xs text-gray-500">Appels</div>
          </div>
          <FiChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-100"
          >
            <div className="p-4 space-y-3 bg-gray-50">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-gray-500">Premier appel</div>
                  <div className="text-sm font-medium">{line.firstCall}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Dernier appel</div>
                  <div className="text-sm font-medium">{line.lastCall}</div>
                </div>
              </div>
              
              <div>
                <div className="text-xs text-gray-500">Durée</div>
                <div className="text-sm font-medium">{line.duration}</div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center p-2 bg-white rounded-lg border border-gray-100">
                  <FiPhoneIncoming className="w-4 h-4 text-blue-500 mb-1" />
                  <div className="text-sm font-medium">{line.incoming}</div>
                  <div className="text-xs text-gray-500">Entrants</div>
                </div>
                <div className="flex flex-col items-center p-2 bg-white rounded-lg border border-gray-100">
                  <FiPhoneOutgoing className="w-4 h-4 text-green-500 mb-1" />
                  <div className="text-sm font-medium">{line.outgoing}</div>
                  <div className="text-xs text-gray-500">Sortants</div>
                </div>
                <div className="flex flex-col items-center p-2 bg-white rounded-lg border border-gray-100">
                  <FiPhoneMissed className="w-4 h-4 text-red-500 mb-1" />
                  <div className="text-sm font-medium">{line.missed}</div>
                  <div className="text-xs text-gray-500">Manqués</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div>
                  <div className="text-xs text-gray-500">Moyenne</div>
                  <div className="text-sm font-medium">{line.average}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Internes</div>
                  <div className="text-sm font-medium">{line.internal}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Table Column Management Component
interface ColumnManagerProps {
  columns: ColumnDefinition[];
  visibleColumns: string[];
  setVisibleColumns: React.Dispatch<React.SetStateAction<string[]>>;
}

const ColumnManager: React.FC<ColumnManagerProps> = ({ columns, visibleColumns, setVisibleColumns }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  return (
    <div className="relative">
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-xs px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-orange-300 transition-colors"
      >
        <FiSettings className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
        Colonnes
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-2 z-50 w-64"
          >
            <div className="text-xs font-medium text-gray-500 px-2 pb-1.5">Gérer les colonnes visibles</div>
            
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {columns.map((column) => (
                <div 
                  key={column.key} 
                  className="flex items-center justify-between px-2 py-1.5 hover:bg-gray-50 rounded-lg cursor-pointer"
                  onClick={() => {
                    if (column.key === 'extension' || column.key === 'userName') return; // Always visible
                    
                    if (visibleColumns.includes(column.key)) {
                      if (visibleColumns.length > 3) { // Keep at least 3 columns
                        setVisibleColumns(visibleColumns.filter(c => c !== column.key));
                      }
                    } else {
                      setVisibleColumns([...visibleColumns, column.key]);
                    }
                  }}
                >
                  <div className="flex items-center">
                    {column.icon && <column.icon className="w-3.5 h-3.5 mr-1.5 text-gray-500" />}
                    <span className="text-sm">{column.label}</span>
                  </div>
                  
                  <div className={`w-4 h-4 rounded-sm border flex items-center justify-center ${
                    visibleColumns.includes(column.key) 
                      ? 'bg-orange-500 border-orange-500' 
                      : 'border-gray-300'
                  }`}>
                    {visibleColumns.includes(column.key) && (
                      <FiCheck className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-100 mt-2 pt-2 flex justify-between px-2">
              <button 
                onClick={() => setVisibleColumns(columns.map(c => c.key))}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Tout afficher
              </button>
              <button 
                onClick={() => setVisibleColumns(['extension', 'userName', 'calls', 'duration'])}
                className="text-xs text-gray-600 hover:text-gray-800"
              >
                Par défaut
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// FiCheck icon component
interface IconProps {
  className?: string;
}

const FiCheck: React.FC<IconProps> = ({ className = "" }) => (
  <svg 
    className={className} 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

// // RenderColumn component
// interface RenderColumnProps {
//   columnKey: string;
//   children: React.ReactNode;
// }

// // const RenderColumn: React.FC<RenderColumnProps> = ({ columnKey, children }) => {
// //   const visibleColumnsContext = useVisibleColumns();
// //   const columnsContext = useColumns();
  
// //   if (!visibleColumnsContext.includes(columnKey) && 
// //       !columnsContext.find(c => c.key === columnKey)?.alwaysVisible) {
// //     return null;
// //   }
  
// //   return <>{children}</>;
// // };

// // Context hooks for columns and visibility
// const useVisibleColumns = () => {
//   // This would normally be a real context hook
//   // For this example, we're mocking it with a function
//   return ['extension', 'userName', 'calls', 'duration'];
// };

// const useColumns = () => {
//   // This would normally be a real context hook
//   return [
//     { key: 'extension', label: 'Extension', alwaysVisible: true },
//     { key: 'userName', label: "Nom de l'utilisateur", alwaysVisible: true },
//     { key: 'calls', label: 'Appels' },
//     { key: 'duration', label: 'Durée' }
//   ];
// };

export default function StatistiquesDesLignes() {
  // State variables
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedLine, setSelectedLine] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('last7days');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFilterExpanded, setIsFilterExpanded] = useState<boolean>(true);
  const [sortConfig, setSortConfig] = useState<{key: string; direction: 'asc' | 'desc'}>({ key: 'calls', direction: 'desc' });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'auto' | 'table' | 'cards'>('auto'); // 'auto', 'table', 'cards'
  
  // Reference for the table container to handle scrolling
  const tableContainerRef = useRef<HTMLDivElement>(null);
  
  // Table columns configuration
  const columns: ColumnDefinition[] = [
    { key: 'extension', label: 'Extension', icon: FiPhone, alwaysVisible: true },
    { key: 'userName', label: "Nom de l'utilisateur", icon: FiUser, alwaysVisible: true },
    { key: 'firstCall', label: 'Premier appel', icon: FiClock },
    { key: 'lastCall', label: 'Dernier appel', icon: FiClock },
    { key: 'duration', label: 'Durée', icon: FiClock },
    { key: 'calls', label: 'Appels', icon: FiPhone },
    { key: 'missed', label: 'Manqué', icon: FiPhoneMissed },
    { key: 'average', label: 'Moyenne', icon: FiClock },
    { key: 'incoming', label: 'Entrants', icon: FiPhoneIncoming },
    { key: 'outgoing', label: 'Sortants', icon: FiPhoneOutgoing },
    { key: 'internal', label: 'Internes', icon: FiClock }
  ];
  
  // Visible columns state
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    typeof window !== 'undefined' && window.innerWidth < 768 
      ? ['extension', 'userName', 'calls', 'duration'] 
      : columns.map(c => c.key)
  );
  
  // Responsive handling - update view mode based on screen size
  const updateViewMode = () => {
    if (viewMode !== 'auto') return; // Skip if manually set
    
    if (window.innerWidth < 640) {
      setViewMode('cards');
    } else {
      setViewMode('table');
    }
  };
  
  // Initialize view mode and add resize listener
  useEffect(() => {
    updateViewMode();
    window.addEventListener('resize', updateViewMode);
    return () => window.removeEventListener('resize', updateViewMode);
  }, [viewMode]);
  
  // Sample data for extensions/lines
  const linesData: LineData[] = [
    { 
      id: 1,
      extension: '100',
      userName: 'Jean Dupont',
      firstCall: '2023-06-01 08:24:15',
      lastCall: '2023-06-15 17:45:32',
      duration: '42h 36m 15s',
      calls: 287,
      missed: 18,
      average: '8m 54s',
      incoming: 145,
      outgoing: 142,
      internal: 36,
      status: 'active'
    },
    { 
      id: 2,
      extension: '101',
      userName: 'Marie Laurent',
      firstCall: '2023-06-01 09:12:04',
      lastCall: '2023-06-15 16:31:22',
      duration: '28h 12m 44s',
      calls: 194,
      missed: 12,
      average: '8m 43s',
      incoming: 118,
      outgoing: 76,
      internal: 42,
      status: 'active'
    },
    { 
      id: 3,
      extension: '102',
      userName: 'Philippe Martin',
      firstCall: '2023-06-01 08:36:45',
      lastCall: '2023-06-15 18:01:12',
      duration: '53h 24m 08s',
      calls: 312,
      missed: 24,
      average: '10m 14s',
      incoming: 186,
      outgoing: 126,
      internal: 48,
      status: 'active'
    },
    { 
      id: 4,
      extension: '103',
      userName: 'Sophie Leroy',
      firstCall: '2023-06-01 10:05:38',
      lastCall: '2023-06-15 15:42:18',
      duration: '18h 36m 24s',
      calls: 122,
      missed: 8,
      average: '9m 08s',
      incoming: 72,
      outgoing: 50,
      internal: 22,
      status: 'inactive'
    },
    { 
      id: 5,
      extension: '104',
      userName: 'Thomas Petit',
      firstCall: '2023-06-01 08:15:12',
      lastCall: '2023-06-15 17:55:24',
      duration: '38h 42m 16s',
      calls: 248,
      missed: 16,
      average: '9m 22s',
      incoming: 136,
      outgoing: 112,
      internal: 32,
      status: 'active'
    },
    { 
      id: 6,
      extension: '105',
      userName: 'Julie Dubois',
      firstCall: '2023-06-01 09:25:32',
      lastCall: '2023-06-15 16:48:35',
      duration: '24h 18m 42s',
      calls: 178,
      missed: 14,
      average: '8m 12s',
      incoming: 96,
      outgoing: 82,
      internal: 28,
      status: 'active'
    },
    { 
      id: 7,
      extension: '106',
      userName: 'Lucas Moreau',
      firstCall: '2023-06-01 08:42:18',
      lastCall: '2023-06-15 17:36:48',
      duration: '32h 54m 26s',
      calls: 216,
      missed: 18,
      average: '9m 07s',
      incoming: 124,
      outgoing: 92,
      internal: 36,
      status: 'active'
    },
    { 
      id: 8,
      extension: '107',
      userName: 'Emma Lefebvre',
      firstCall: '2023-06-01 09:18:24',
      lastCall: '2023-06-15 16:12:36',
      duration: '22h 06m 32s',
      calls: 156,
      missed: 10,
      average: '8m 28s',
      incoming: 88,
      outgoing: 68,
      internal: 24,
      status: 'inactive'
    },
    { 
      id: 9,
      extension: '108',
      userName: 'Olivier Roux',
      firstCall: '2023-06-01 08:30:42',
      lastCall: '2023-06-15 17:48:22',
      duration: '36h 24m 18s',
      calls: 232,
      missed: 16,
      average: '9m 22s',
      incoming: 128,
      outgoing: 104,
      internal: 38,
      status: 'active'
    },
    { 
      id: 10,
      extension: '109',
      userName: 'Camille Bernard',
      firstCall: '2023-06-01 09:36:14',
      lastCall: '2023-06-15 16:24:48',
      duration: '26h 48m 36s',
      calls: 186,
      missed: 12,
      average: '8m 38s',
      incoming: 102,
      outgoing: 84,
      internal: 32,
      status: 'active'
    }
  ];
  
  // Filtered and sorted data
  const getFilteredData = () => {
    return linesData
      .filter(line => {
        if (selectedLine !== 'all' && line.extension !== selectedLine) return false;
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            line.extension.toLowerCase().includes(query) ||
            line.userName.toLowerCase().includes(query)
          );
        }
        return true;
      })
      .sort((a, b) => {
        const aValue = a[sortConfig.key] as string | number;
        const bValue = b[sortConfig.key] as string | number;
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
  };
  
  const filteredData = getFilteredData();
  
  // Request sort change
  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Get sort direction icon
  const getSortDirectionIcon = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <FiChevronsUp className="w-3.5 h-3.5" /> : <FiChevronsDown className="w-3.5 h-3.5" />;
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    // Apply fullscreen to the table container if needed
    if (tableContainerRef.current) {
      if (!isFullscreen) {
        if (tableContainerRef.current.requestFullscreen) {
          tableContainerRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }
  };

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);

  // Animation variants
  const pageVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { ease: 'easeOut', duration: 0.4 } },
  };

  const tableRowVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { ease: 'easeOut', duration: 0.3 } },
  };
  
  // Function to determine if we should show cards or table view
  const shouldShowCards = () => {
    if (viewMode === 'cards') return true;
    if (viewMode === 'table') return false;
    // If auto, depend on screen width
    return false; // Default to table in auto mode - component will handle responsiveness
  };
  
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={pageVariants}
      className="pt-20 min-h-screen pb-10"
    >
      <div className="max-w-7xl mx-auto space-y-6 px-4 md:px-0">
        {/* Breadcrumbs */}
        <Breadcrumbs items={['PBX', 'Statistiques', 'Time Conditions']} />

        {/* Page Header */}
        <motion.div
          variants={itemVariants}
          className="relative mb-8 overflow-hidden backdrop-blur-sm bg-white/90 rounded-3xl shadow-xl border border-gray-100"
        >
          {/* Background elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#F97316]/10 via-white/70 to-[#FDBA74]/10 rounded-3xl pointer-events-none" />
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#FDBA74]/10 rounded-full blur-3xl pointer-events-none"></div>
          
          {/* Subtle pattern */}
          <div 
            className="absolute inset-0 opacity-5 mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '30px 30px'
            }}
          />

          <div className="relative p-6 md:p-8 z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="p-2.5 bg-[#F97316]/15 rounded-xl shadow-inner"
                  >
                    <FiActivity className="w-6 h-6 text-[#F97316]" />
                  </motion.div>
                  <h1 className="text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#F97316] to-[#FDBA74]">
                    Statistiques des lignes
                  </h1>
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="px-2.5 py-1 text-xs font-semibold text-orange-600 bg-orange-100 rounded-full shadow-sm border border-orange-200"
                  >
                    {filteredData.length} lignes
                  </motion.div>
                </div>
                
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Consultez les statistiques détaillées de vos lignes téléphoniques. Analysez l&apos;utilisation, 
                  les performances et identifiez les tendances.
                </p>
              </div>
              
              <div className="flex space-x-3">
                {/* Add new time condition button with enhanced style */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center px-4 py-2.5 bg-gradient-to-r from-[#F97316] to-[#FDBA74] text-white rounded-xl hover:shadow-md transition shadow-sm text-sm md:text-base"
                >
                  <FiPlus className="mr-2" />
                  <span className="hidden sm:inline">Ajouter une nouvelle condition de temps</span>
                  <span className="sm:hidden">Nouvelle condition</span>
                </motion.button>
              </div>
            </div>
            
            {/* Quick tip with enhanced style */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-6 flex items-start gap-3 p-4 bg-orange-50/70 border border-orange-100 rounded-xl text-sm backdrop-blur-sm shadow-inner"
            >
              <div className="p-1.5 bg-orange-100 rounded-lg shrink-0">
                <FiInfo className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <span className="font-medium text-orange-800">Astuce :</span>{' '}
                <span className="text-orange-700">
                  Cliquez sur les en-têtes de colonne pour trier les données. Utilisez les filtres pour affiner vos résultats par ligne ou par période.
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Loading State */}
        <AnimatePresence>
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <LoadingState />
            </motion.div>
          ) : (
            <motion.div variants={itemVariants}>
              {/* Filters Panel */}
              <motion.div
                variants={itemVariants}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden backdrop-blur-sm mb-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-1.5 mr-2 bg-orange-100 rounded-lg">
                      <FiFilter className="w-4 h-4 text-orange-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">Filtres</h2>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {isFilterExpanded ? <FiMinimize className="w-4 h-4" /> : <FiMaximize className="w-4 h-4" />}
                  </motion.button>
                </div>
                
                <AnimatePresence>
                  {isFilterExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Line Selector with enhanced style */}
                        <div>
                          <label className="block text-sm text-gray-600 font-medium mb-2">Ligne</label>
                          <div className="relative">
                            <select
                              value={selectedLine}
                              onChange={(e) => setSelectedLine(e.target.value)}
                              className="w-full appearance-none pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent hover:border-orange-300 transition-colors shadow-sm"
                            >
                              <option value="all">Toutes les lignes</option>
                              {linesData.map(line => (
                                <option key={line.id} value={line.extension}>
                                  {line.extension} - {line.userName}
                                </option>
                              ))}
                            </select>
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                              <FiPhone className="w-4 h-4 text-gray-500" />
                            </div>
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                              <FiChevronDown className="w-4 h-4 text-gray-500" />
                            </div>
                          </div>
                        </div>
                        
                        {/* Date Range with enhanced component */}
                        <div>
                          <label className="block text-sm text-gray-600 font-medium mb-2">Période</label>
                          <DateRangeSelector
                            selectedRange={selectedDateRange}
                            setSelectedRange={setSelectedDateRange}
                          />
                        </div>
                      </div>
                      
                      {/* Apply Filter Button with enhanced style */}
                      <motion.button
                        whileHover={{ scale: 1.01, boxShadow: "0 4px 12px rgba(249, 115, 22, 0.15)" }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-2.5 px-4 bg-gradient-to-r from-[#F97316] to-[#FDBA74] text-white rounded-xl transition-all flex items-center justify-center shadow-md hover:from-[#F97316] hover:to-[#FB923C]"
                      >
                        <FiFilter className="mr-2" />
                        Appliquer le filtre
                        <span className="ml-3 text-xs bg-white/20 px-2 py-0.5 rounded-md">
                          {filteredData.length} lignes
                        </span>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Decorative elements */}
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-orange-500/5 rounded-full blur-xl pointer-events-none"></div>
              </motion.div>

              {/* Table Panel */}
              <motion.div
                ref={tableContainerRef}
                variants={itemVariants}
                className={`bg-white rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden backdrop-blur-sm ${isFullscreen ? 'fixed inset-0 z-50 rounded-none p-4' : ''}`}
              >
                {/* Table Header */}
                <div className="p-4 md:p-6 border-b border-gray-100">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center">
                      <div className="p-1.5 mr-2 bg-orange-100 rounded-lg">
                        <FiList className="w-4 h-4 text-orange-600" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-800">Statistiques des lignes</h2>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                      {/* Search Field */}
                      <div className="relative flex-grow">
                        <input
                          type="text"
                          placeholder="Rechercher une ligne..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent hover:border-orange-300 transition-colors shadow-sm"
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <FiSearch className="w-4 h-4 text-gray-500" />
                        </div>
                      </div>
                      
                      {/* Table/Card View Toggle */}
                      <div className="flex items-center gap-2">
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                          <button
                            onClick={() => setViewMode('table')}
                            className={`p-1.5 rounded-lg ${viewMode === 'table' || (viewMode === 'auto' && !shouldShowCards()) ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                            title="Vue tableau"
                          >
                            <FiList className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setViewMode('cards')}
                            className={`p-1.5 rounded-lg ${viewMode === 'cards' || (viewMode === 'auto' && shouldShowCards()) ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                            title="Vue cartes"
                          >
                            <FiMenu className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setViewMode('auto')}
                            className={`p-1.5 rounded-lg ${viewMode === 'auto' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                            title="Vue automatique"
                          >
                            <FiMaximize2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* Column Manager */}
                        {(viewMode === 'table' || (viewMode === 'auto' && !shouldShowCards())) && (
                          <ColumnManager
                            columns={columns}
                            visibleColumns={visibleColumns}
                            setVisibleColumns={setVisibleColumns}
                          />
                        )}
                        
                        {/* Fullscreen Toggle */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={toggleFullscreen}
                          className="flex items-center p-1.5 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-orange-300 transition-colors"
                        >
                          {isFullscreen ? (
                            <FiMinimize2 className="w-4 h-4 text-gray-500" />
                          ) : (
                            <FiMaximize2 className="w-4 h-4 text-gray-500" />
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Mobile Card View */}
                {(viewMode === 'cards' || (viewMode === 'auto' && shouldShowCards())) && (
                  <div className="p-4">
                    {filteredData.length > 0 ? (
                      filteredData.map((line, index) => (
                        <MobileTableRow key={line.id} line={line} index={index} />
                      ))
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        <FiAlertTriangle className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                        <p>Aucune ligne ne correspond à vos critères de recherche.</p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Desktop Table View */}
                {(viewMode === 'table' || (viewMode === 'auto' && !shouldShowCards())) && (
                  <div className="relative">
                    {/* Horizontal scroll indicator - left */}
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-6 h-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none opacity-70"></div>
                    
                    {/* Horizontal scroll indicator - right */}
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-6 h-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none opacity-70"></div>
                    
                    <div className="overflow-x-auto">
                      <div className="inline-block min-w-full align-middle">
                        <table className="min-w-full divide-y divide-gray-100">
                          <thead className="bg-gray-50">
                            <tr>
                              {columns.map((column) => (
                                visibleColumns.includes(column.key) || column.alwaysVisible ? (
                                  <th 
                                    key={column.key}
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition whitespace-nowrap"
                                    onClick={() => requestSort(column.key)}
                                  >
                                    <div className="flex items-center">
                                      {column.icon && <column.icon className="w-3.5 h-3.5 mr-1.5 text-gray-500" />}
                                      {column.label}
                                      {getSortDirectionIcon(column.key)}
                                    </div>
                                  </th>
                                ) : null
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-100">
                            {filteredData.length > 0 ? (
                              filteredData.map((line, index) => (
                                <motion.tr 
                                  key={line.id}
                                  variants={tableRowVariants}
                                  custom={index}
                                  initial="hidden"
                                  animate="show"
                                  className="hover:bg-orange-50/30 transition-colors"
                                >
                                  {visibleColumns.includes('extension') || columns.find(c => c.key === 'extension')?.alwaysVisible ? (
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <div className={`w-2 h-2 rounded-full mr-2 ${line.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                        <span className="font-medium text-gray-800">{line.extension}</span>
                                      </div>
                                    </td>
                                  ) : null}
                                  
                                  {visibleColumns.includes('userName') || columns.find(c => c.key === 'userName')?.alwaysVisible ? (
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-2">
                                          <FiUser className="w-4 h-4 text-orange-600" />
                                        </div>
                                        <span>{line.userName}</span>
                                      </div>
                                    </td>
                                  ) : null}
                                  
                                  {visibleColumns.includes('firstCall') && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{line.firstCall}</td>
                                  )}
                                  
                                  {visibleColumns.includes('lastCall') && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{line.lastCall}</td>
                                  )}
                                  
                                  {visibleColumns.includes('duration') && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{line.duration}</td>
                                  )}
                                  
                                  {visibleColumns.includes('calls') && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{line.calls}</td>
                                  )}
                                  
                                  {visibleColumns.includes('missed') && (
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <FiPhoneMissed className="w-4 h-4 text-red-500 mr-1.5" />
                                        <span className="text-sm text-red-600 font-medium">{line.missed}</span>
                                      </div>
                                    </td>
                                  )}
                                  
                                  {visibleColumns.includes('average') && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{line.average}</td>
                                  )}
                                  
                                  {visibleColumns.includes('incoming') && (
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <FiPhoneIncoming className="w-4 h-4 text-blue-500 mr-1.5" />
                                        <span className="text-sm text-gray-800">{line.incoming}</span>
                                      </div>
                                    </td>
                                  )}
                                  
                                  {visibleColumns.includes('outgoing') && (
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <FiPhoneOutgoing className="w-4 h-4 text-green-500 mr-1.5" />
                                        <span className="text-sm text-gray-800">{line.outgoing}</span>
                                      </div>
                                    </td>
                                  )}
                                  
                                  {visibleColumns.includes('internal') && (
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span className="text-sm text-gray-800">{line.internal}</span>
                                    </td>
                                  )}
                                </motion.tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={visibleColumns.length} className="px-6 py-12 text-center text-gray-500">
                                  <div className="flex flex-col items-center">
                                    <FiAlertTriangle className="w-8 h-8 text-orange-400 mb-2" />
                                    <p>Aucune ligne ne correspond à vos critères de recherche.</p>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Table Footer */}
                <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 gap-3">
                  <div>
                    Affichage de {filteredData.length} sur {linesData.length} lignes
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="py-1 px-2 border border-gray-200 rounded hover:bg-gray-50 transition">
                      <FiRefreshCw className="w-4 h-4" />
                    </button>
                    <button className="py-1 px-3 border border-gray-200 rounded hover:bg-gray-50 transition flex items-center">
                      <FiDownload className="w-4 h-4 mr-1.5" />
                      Exporter
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}