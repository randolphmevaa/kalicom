'use client';

import React, { useState, useEffect, useRef, Suspense } from "react";
import { motion } from "framer-motion";
// import Link from "next/link";
import {
  // FiSearch,
  FiPlus,
  FiFilter,
  // FiCalendar,
  FiChevronDown,
  FiChevronUp,
  // FiRefreshCw,
  FiCheckSquare,
  FiSquare,
  // FiTag,
  // FiUser,
  FiBarChart2,
  FiInfo,
  FiArrowRight,
  FiGrid,
  FiList,
  FiDownload
} from "react-icons/fi";

// Import types from a separate file
import { Prospect } from "./types/crm-types";

// Import data from a separate file
import { prospectsData, teamMembers, filterModels, tagColors } from "./data/crm-data";
import ProspectGridView from "./components/prospects/ProspectGridView";
import ProspectListView from "./components/prospects/ProspectListView";
import ProspectQuickView from "./components/prospects/ProspectQuickView";
import FilterPanel from "./components/prospects/FilterPanel";
import ExportDropdown from "./components/ui/ExportDropdown";

// Lazy load components that aren't needed immediately
// const ProspectGridView = lazy(() => 
//   import('./components/prospects/ProspectGridView').then(module => ({ default: module.default }))
// );
// const ProspectListView = lazy(() => 
//   import('./components/prospects/ProspectListView').then(module => ({ default: module.default }))
// );
// const ProspectQuickView = lazy(() => 
//   import('./components/prospects/ProspectQuickView').then(module => ({ default: module.default }))
// );
// const FilterPanel = lazy(() => 
//   import('./components/prospects/FilterPanel').then(module => ({ default: module.default }))
// );
// const ExportDropdown = lazy(() => 
//   import('./components/ui/ExportDropdown').then(module => ({ default: module.default }))
// );

// Loading fallback component
const LoadingFallback = () => (
  <div className="w-full h-64 flex items-center justify-center">
    <div className="animate-pulse flex space-x-4">
      <div className="rounded-full bg-slate-200 h-10 w-10"></div>
      <div className="flex-1 space-y-6 py-1">
        <div className="h-2 bg-slate-200 rounded"></div>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-4">
            <div className="h-2 bg-slate-200 rounded col-span-2"></div>
            <div className="h-2 bg-slate-200 rounded col-span-1"></div>
          </div>
          <div className="h-2 bg-slate-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

export default function ProspectPage() {
  // State with explicit type annotations
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [phoneSearch, setPhoneSearch] = useState<string>("");
  const [tagSearch, setTagSearch] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null);
  const [selectedFilterModel, setSelectedFilterModel] = useState<string | null>(null);
  const [isExporting] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isFilterExpanded, setIsFilterExpanded] = useState<boolean>(true);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState<boolean>(false);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [conversionSuccess, setConversionSuccess] = useState<{ [key: string]: boolean }>({});

  // Dropdowns state 
  // const [showFieldsDropdown, setShowFieldsDropdown] = useState<boolean>(false);
  const [showTeamDropdown, setShowTeamDropdown] = useState<boolean>(false);
  const [showFilterModelsDropdown, setShowFilterModelsDropdown] = useState<boolean>(false);
  // const [selectedFields, setSelectedFields] = useState<FieldOption[]>(fieldOptions);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  
  // New state for export dropdown
  const [showExportDropdown, setShowExportDropdown] = useState<boolean>(false);
  // State to check if dropdown should be positioned above button
  const [showAbove, setShowAbove] = useState<boolean>(false);
  
  // Refs for checking position
  const exportButtonRef = useRef<HTMLButtonElement>(null);

  // Pagination variables
  const itemsPerPage = 6;
  const totalPages = Math.ceil(prospectsData.length / itemsPerPage);
  
  // Memoize filtered and paginated data
  const [displayedProspects, setDisplayedProspects] = useState<Prospect[]>([]);
  
  // Update displayed prospects when filters or pagination changes
  useEffect(() => {
    // Apply filters first
    let filtered = prospectsData;
    
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(prospect => 
        prospect.firstName.toLowerCase().includes(search) ||
        prospect.lastName.toLowerCase().includes(search) ||
        prospect.email.toLowerCase().includes(search) ||
        prospect.companyName.toLowerCase().includes(search)
      );
    }
    
    if (phoneSearch) {
      filtered = filtered.filter(prospect => 
        prospect.phoneNumber.includes(phoneSearch) ||
        prospect.mobilePhoneNumber.includes(phoneSearch)
      );
    }
    
    if (tagSearch) {
      const search = tagSearch.toLowerCase();
      filtered = filtered.filter(prospect => 
        prospect.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }
    
    if (dateFilter) {
      filtered = filtered.filter(prospect => prospect.createdAt === dateFilter);
    }
    
    if (selectedAssignee) {
      filtered = filtered.filter(prospect => prospect.assignedTo === selectedAssignee);
    }
    
    // Then paginate
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);
    
    setDisplayedProspects(paginatedData);
  }, [currentPage, searchTerm, phoneSearch, tagSearch, dateFilter, selectedAssignee, selectedFilterModel]);

  // Check dropdown position when showing export dropdown
  useEffect(() => {
    if (showExportDropdown && exportButtonRef.current) {
      const buttonRect = exportButtonRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const spaceBelow = windowHeight - buttonRect.bottom;
      
      // If space below button is less than 150px, show dropdown above
      setShowAbove(spaceBelow < 150);
    }
  }, [showExportDropdown]);

  /** -----------------------------
   *  Handlers
   *  -----------------------------
   */
  // Handle client conversion
  const handleConvertToClient = (prospectId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    // In a real app this would call an API to convert the prospect to a client
    // For demo purposes, we'll just set a success state
    setConversionSuccess({
      ...conversionSuccess,
      [prospectId]: true
    });
    
    const prospect = prospectsData.find(p => p.id === prospectId);
    if (prospect) {
      alert(`${prospect.firstName} ${prospect.lastName} a été converti en client avec succès!`);
    }
  };

  // Toggle all rows
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedRows(prospectsData.map((prospect) => prospect.id));
    } else {
      setSelectedRows([]);
    }
  };

  // Toggle row selection
  const toggleRowSelection = (id: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Reset all filters
  const handleReset = () => {
    setSearchTerm("");
    setPhoneSearch("");
    setTagSearch("");
    setDateFilter("");
    setSelectedAssignee(null);
    setSelectedFilterModel(null);
    setActiveFilters([]);
  };

  // Toggle a field's `checked` value
  // const toggleField = (fieldId: string) => {
  //   const updatedFields = selectedFields.map((field) =>
  //     field.id === fieldId ? { ...field, checked: !field.checked } : field
  //   );
  //   setSelectedFields(updatedFields);
  // };

  // Apply filters
  const applyFilters = () => {
    const newActiveFilters = [];

    if (searchTerm) newActiveFilters.push(`Recherche: ${searchTerm}`);
    if (phoneSearch) newActiveFilters.push(`Téléphone: ${phoneSearch}`);
    if (tagSearch) newActiveFilters.push(`Tag: ${tagSearch}`);
    if (dateFilter) newActiveFilters.push(`Date: ${dateFilter}`);
    if (selectedAssignee) newActiveFilters.push(`Assigné à: ${selectedAssignee}`);
    if (selectedFilterModel) newActiveFilters.push(`Modèle: ${selectedFilterModel}`);

    setActiveFilters(newActiveFilters);
    setIsFilterExpanded(false);
    
    // Reset to first page when applying filters
    setCurrentPage(1);
  };

  // Remove a specific filter
  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filter));
    
    // Reset the corresponding state
    if (filter.startsWith("Recherche:")) setSearchTerm("");
    if (filter.startsWith("Téléphone:")) setPhoneSearch("");
    if (filter.startsWith("Tag:")) setTagSearch("");
    if (filter.startsWith("Date:")) setDateFilter("");
    if (filter.startsWith("Assigné à:")) setSelectedAssignee(null);
    if (filter.startsWith("Modèle:")) setSelectedFilterModel(null);
  };
  
  // Open quick view for a prospect
  const openQuickView = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setIsQuickViewOpen(true);
  };

  // Close quick view
  const closeQuickView = () => {
    setIsQuickViewOpen(false);
    setSelectedProspect(null);
  };

  // Shared props for child components
  const sharedProps = {
    selectedRows,
    toggleRowSelection,
    conversionSuccess,
    handleConvertToClient,
    openQuickView,
    getTagColor: (tag: string) => tagColors[tag] || tagColors.default,
    getStatusColor: (lastContactDate: string) => {
      const date = new Date(lastContactDate);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
      if (diffDays <= 7) return "#4BB2F6"; // Light blue for recent contact
      if (diffDays <= 14) return "#004AC8"; // Medium blue for medium
      return "#1B0353"; // Dark blue for stale
    },
    getInitials: (firstName: string, lastName: string) => {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Add additional top padding to account for fixed navbar */}
      <div className="max-w-7xl mx-auto px-4 py-6 pt-24">
        {/* Header - Luxury Gradient Background with Brand Colors */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="rounded-2xl p-8 shadow-2xl mb-6 relative overflow-hidden backdrop-blur-sm"
          style={{ 
            background: "linear-gradient(135deg, rgba(75, 178, 246, 0.95) 0%, rgba(0, 74, 200, 0.95) 60%, rgba(27, 3, 83, 0.95) 100%)",
            boxShadow: "0 10px 25px -5px rgba(27, 3, 83, 0.3), 0 8px 10px -6px rgba(27, 3, 83, 0.2)"
          }}
        >
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            {/* Background pattern */}
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grid)" />
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
            </svg>
          </div>
          
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <div className="flex items-center space-x-3">
                <motion.div
                  initial={{ rotate: -10, scale: 0.9 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white bg-opacity-20 p-2 rounded-lg"
                >
                  <FiFilter className="text-white text-2xl" />
                </motion.div>
                <h1 className="text-3xl font-bold text-white">Prospects</h1>
              </div>
              <p className="text-white text-opacity-90 mt-2 max-w-lg">
                Gérez et suivez tous vos prospects commerciaux. Découvrez les opportunités et convertissez plus de clients.
              </p>
              
              {/* Stats Bar */}
              <div className="mt-6 flex space-x-6">
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                  <div className="text-white text-opacity-80 text-sm">Total</div>
                  <div className="text-white font-bold text-xl">50</div>
                </div>
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                  <div className="text-white text-opacity-80 text-sm">Nouveaux ce mois</div>
                  <div className="text-white font-bold text-xl">12</div>
                </div>
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                  <div className="text-white text-opacity-80 text-sm">Taux de conversion</div>
                  <div className="text-white font-bold text-xl">24%</div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 bg-white text-indigo-900 px-5 py-3 rounded-lg shadow-lg font-medium"
              >
                <FiBarChart2 />
                <span>Statistiques</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 bg-indigo-900 text-white px-5 py-3 rounded-lg shadow-lg font-medium"
              >
                <FiPlus />
                <span>Ajouter un prospect</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Active Filters + Actions Bar */}
        <motion.div 
          className="bg-white bg-opacity-95 backdrop-blur-sm rounded-xl border border-gray-100 p-4 mb-6"
          style={{
            boxShadow: "0 4px 6px -1px rgba(27, 3, 83, 0.05), 0 2px 4px -1px rgba(27, 3, 83, 0.01)"
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-3 flex-grow">
              <motion.button 
                className="bg-[#1B0353] text-white p-2 rounded-lg shadow-md flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              >
                <FiFilter className="w-5 h-5" />
              </motion.button>
              
              {activeFilters.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {activeFilters.map((filter, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center bg-[#4BB2F6] bg-opacity-10 border border-[#4BB2F6] border-opacity-30 px-3 py-1 rounded-full text-sm shadow-sm"
                    >
                      <span className="text-[#1B0353] font-medium">{filter}</span>
                      <motion.button 
                        className="ml-2 text-[#004AC8] hover:text-red-500 focus:outline-none"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeFilter(filter)}
                      >
                        <FiChevronUp size={16} />
                      </motion.button>
                    </motion.div>
                  ))}
                  {activeFilters.length > 0 && (
                    <motion.button 
                      className="text-sm text-[#004AC8] hover:text-[#1B0353] font-medium hover:underline focus:outline-none"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleReset}
                    >
                      Réinitialiser tout
                    </motion.button>
                  )}
                </div>
              ) : (
                <span className="text-gray-500 text-sm italic">Aucun filtre actif</span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex p-1 bg-[#4BB2F6] bg-opacity-10 rounded-lg shadow-sm">
                <motion.button 
                  className={`p-2 rounded transition-all duration-200 ${viewMode === 'grid' ? 'bg-white shadow-md' : ''}`}
                  whileHover={viewMode !== 'grid' ? { scale: 1.05 } : {}}
                  whileTap={viewMode !== 'grid' ? { scale: 0.98 } : {}}
                  onClick={() => setViewMode('grid')}
                >
                  <FiGrid className={viewMode === 'grid' ? 'text-[#1B0353]' : 'text-gray-500'} />
                </motion.button>
                <motion.button 
                  className={`p-2 rounded transition-all duration-200 ${viewMode === 'list' ? 'bg-white shadow-md' : ''}`}
                  whileHover={viewMode !== 'list' ? { scale: 1.05 } : {}}
                  whileTap={viewMode !== 'list' ? { scale: 0.98 } : {}}
                  onClick={() => setViewMode('list')}
                >
                  <FiList className={viewMode === 'list' ? 'text-[#1B0353]' : 'text-gray-500'} />
                </motion.button>
              </div>
              
              {/* Export dropdown */}
              <div className="relative">
                <motion.button
                  ref={exportButtonRef}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowExportDropdown(!showExportDropdown)}
                  disabled={isExporting}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#4BB2F6] to-[#004AC8] text-white rounded-lg shadow-sm hover:shadow transition text-sm font-medium"
                >
                  <FiDownload className="w-4 h-4" />
                  <span>Exporter</span>
                  {showExportDropdown ? (
                    <FiChevronUp className="w-4 h-4" />
                  ) : (
                    <FiChevronDown className="w-4 h-4" />
                  )}
                </motion.button>
                
                {showExportDropdown && (
                  <Suspense fallback={<div className="absolute z-20 right-0 bg-white border rounded-xl shadow-xl p-2">Loading...</div>}>
                    <ExportDropdown 
                      showAbove={showAbove} 
                      onExportCSV={() => {
                        alert("Export CSV functionality would be implemented here");
                        setShowExportDropdown(false);
                      }}
                      onExportPDF={() => {
                        alert("Export PDF functionality would be implemented here");
                        setShowExportDropdown(false);
                      }}
                    />
                  </Suspense>
                )}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSelectAll}
                className="flex items-center gap-2 px-4 py-2 bg-[#4BB2F6] bg-opacity-10 text-[#1B0353] rounded-lg border border-[#4BB2F6] border-opacity-30 shadow-sm hover:shadow transition text-sm font-medium"
              >
                {selectAll ? (
                  <FiCheckSquare className="w-4 h-4 text-[#004AC8]" />
                ) : (
                  <FiSquare className="w-4 h-4" />
                )}
                <span>Tout sélectionner</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Filters Panel (Collapsible) - Lazy loaded */}
        {isFilterExpanded && (
          <Suspense fallback={<LoadingFallback />}>
            <FilterPanel 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              phoneSearch={phoneSearch}
              setPhoneSearch={setPhoneSearch}
              tagSearch={tagSearch}
              setTagSearch={setTagSearch}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              selectedAssignee={selectedAssignee}
              setSelectedAssignee={setSelectedAssignee}
              teamMembers={teamMembers}
              showTeamDropdown={showTeamDropdown}
              setShowTeamDropdown={setShowTeamDropdown}
              selectedFilterModel={selectedFilterModel}
              setSelectedFilterModel={setSelectedFilterModel}
              filterModels={filterModels}
              showFilterModelsDropdown={showFilterModelsDropdown}
              setShowFilterModelsDropdown={setShowFilterModelsDropdown}
              handleReset={handleReset}
              applyFilters={applyFilters}
              setIsFilterExpanded={setIsFilterExpanded}
            />
          </Suspense>
        )}

        {/* Main Content - Grid or List View, Lazy loaded */}
        <div className="mb-6">
          <Suspense fallback={<LoadingFallback />}>
            {viewMode === "grid" ? (
              <ProspectGridView 
                prospects={displayedProspects} 
                {...sharedProps} 
              />
            ) : (
              <ProspectListView 
                prospects={displayedProspects} 
                {...sharedProps} 
              />
            )}
          </Suspense>
        </div>

        {/* Pagination */}
        <motion.div 
          className="flex items-center justify-between bg-white bg-opacity-95 backdrop-blur-sm p-5 rounded-xl border border-[#4BB2F6] border-opacity-20"
          style={{ 
            boxShadow: "0 10px 15px -3px rgba(27, 3, 83, 0.05), 0 4px 6px -2px rgba(27, 3, 83, 0.01)"
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div>
            <p className="text-sm text-[#1B0353] flex items-center">
              <span className="bg-[#4BB2F6] bg-opacity-10 text-[#1B0353] p-1 rounded-md shadow-sm mr-2 flex items-center justify-center">
                <FiInfo className="w-4 h-4" />
              </span>
              Affichage de{" "}
              <span className="font-bold mx-1 text-[#004AC8]">{(currentPage - 1) * itemsPerPage + 1}</span> à{" "}
              <span className="font-bold mx-1 text-[#004AC8]">
                {Math.min(currentPage * itemsPerPage, prospectsData.length)}
              </span>{" "}
              sur <span className="font-bold mx-1 text-[#004AC8]">{prospectsData.length}</span> résultats
            </p>
          </div>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-5 py-2 text-sm rounded-lg font-medium flex items-center shadow-sm transition-all duration-200 ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#004AC8] to-[#1B0353] text-white hover:shadow-md"
              }`}
            >
              <FiArrowRight className="w-4 h-4 mr-1 transform rotate-180" /> Précédent
            </motion.button>
            
            {/* Page numbers */}
            <div className="hidden sm:flex space-x-2">
              {[...Array(totalPages)].map((_, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 flex items-center justify-center text-sm rounded-lg font-medium shadow-sm transition-all duration-200 ${
                    currentPage === i + 1
                      ? "bg-gradient-to-r from-[#004AC8] to-[#1B0353] text-white"
                      : "bg-white border border-[#4BB2F6] border-opacity-30 text-[#1B0353] hover:border-[#004AC8]"
                  }`}
                  style={currentPage === i + 1 ? { boxShadow: "0 4px 10px rgba(27, 3, 83, 0.3)" } : {}}
                >
                  {i + 1}
                </motion.button>
              ))}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05, x: 2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-5 py-2 text-sm rounded-lg font-medium flex items-center shadow-sm transition-all duration-200 ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#1B0353] to-[#004AC8] text-white hover:shadow-md"
              }`}
            >
              Suivant <FiArrowRight className="w-4 h-4 ml-1" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Quick View Modal - Lazy loaded */}
      {isQuickViewOpen && selectedProspect && (
        <Suspense fallback={
          <div className="fixed inset-0 bg-[#1B0353] bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-slate-200 rounded w-1/2"></div>
                <div className="h-4 bg-slate-200 rounded"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-20 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        }>
          <ProspectQuickView 
            prospect={selectedProspect}
            isOpen={isQuickViewOpen}
            onClose={closeQuickView}
            onConvert={handleConvertToClient}
            conversionSuccess={conversionSuccess}
            getTagColor={(tag) => tagColors[tag] || tagColors.default}
            getStatusColor={(lastContactDate) => {
              const date = new Date(lastContactDate);
              const now = new Date();
              const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
          
              if (diffDays <= 7) return "#4BB2F6"; // Light blue for recent contact
              if (diffDays <= 14) return "#004AC8"; // Medium blue for medium
              return "#1B0353"; // Dark blue for stale
            }}
            getInitials={(firstName, lastName) => {
              return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
            }}
          />
        </Suspense>
      )}
    </motion.div>
  );
}
