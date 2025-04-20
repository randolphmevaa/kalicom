'use client';

import React, { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Types
import { sampleInvoices, ViewMode } from './types';

// Directly import components needed for initial render
import Header from './components/Header';
import ActionBar from './components/ActionBar';

// Dynamically import components that can be deferred
const StatisticsCards = dynamic(() => import('./components/StatisticsCards'), {
  loading: () => <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   {[1,2,3].map(i => (
                     <div key={i} className="animate-pulse bg-gray-200 h-24 rounded"></div>
                   ))}
                 </div>
});

const FilterPanel = dynamic(() => import('./components/FilterPanel'));
const ExportPanel = dynamic(() => import('./components/ExportPanel'));
const BulkActionBar = dynamic(() => import('./components/BulkActionBar'));
const InvoicesTable = dynamic(() => import('./components/InvoicesTable'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded"></div>
});

// Lazily load modals as they aren't shown initially
const CreateInvoiceModal = dynamic(() => import('./CreateInvoiceModal'));
const CreateCreditNoteModal = dynamic(() => import('./CreateCreditNoteModal'));

// Hooks - these are likely small and don't need lazy loading
import { useInvoiceFilter } from './hooks/useInvoiceFilter';
import { useInvoiceSort } from './hooks/useInvoiceSort';
import { useInvoiceSelection } from './hooks/useInvoiceSelection';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const FacturesClient = () => {
  // Date range picker for export
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  
  // View mode
  const [viewMode, setViewMode] = useState<ViewMode>('comfortable');
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateCreditNoteModal, setShowCreateCreditNoteModal] = useState(false);

  // Custom hooks for invoice operations
  const {
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    selectedPeriod,
    setSelectedPeriod,
    selectedClient,
    setSelectedClient,
    filteredInvoices,
    resetFilters,
    clearSearch,
    showFilters,
    setShowFilters,
  } = useInvoiceFilter({ invoices: sampleInvoices });

  const {
    sortField,
    sortDirection,
    handleSort,
    sortedInvoices,
  } = useInvoiceSort({ invoices: filteredInvoices });

  const {
    selectedInvoices,
    selectAll,
    handleSelectAll,
    handleCheckboxChange,
  } = useInvoiceSelection({ invoices: sortedInvoices });

  // Handlers for modal operations
  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
  };

  const handleOpenCreateCreditNoteModal = () => {
    setShowCreateCreditNoteModal(true);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="pt-16 pb-16 min-h-screen"
    >
      <div className="pt-12 max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <Header />

        {/* Statistics Cards */}
        <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {[1,2,3].map(i => (
                                <div key={i} className="animate-pulse bg-gray-200 h-24 rounded"></div>
                              ))}
                            </div>}>
          <StatisticsCards />
        </Suspense>

        {/* Actions & Search Bar */}
        <ActionBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          clearSearch={clearSearch}
          showDateRangePicker={showDateRangePicker}
          setShowDateRangePicker={setShowDateRangePicker}
          viewMode={viewMode}
          setViewMode={setViewMode}
          handleOpenCreateModal={handleOpenCreateModal}
          handleOpenCreateCreditNoteModal={handleOpenCreateCreditNoteModal}
        />

        {/* Filter Panel */}
        {showFilters && (
          <Suspense fallback={<div className="animate-pulse bg-gray-200 h-24 rounded"></div>}>
            <FilterPanel
              showFilters={showFilters}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              selectedPeriod={selectedPeriod}
              setSelectedPeriod={setSelectedPeriod}
              selectedClient={selectedClient}
              setSelectedClient={setSelectedClient}
              resetFilters={resetFilters}
            />
          </Suspense>
        )}

        {/* Export Panel */}
        {showDateRangePicker && (
          <Suspense fallback={<div className="animate-pulse bg-gray-200 h-16 rounded"></div>}>
            <ExportPanel
              showDateRangePicker={showDateRangePicker}
              setShowDateRangePicker={setShowDateRangePicker}
            />
          </Suspense>
        )}

        {/* Bulk Actions */}
        {selectedInvoices.length > 0 && (
          <Suspense fallback={<div className="animate-pulse bg-gray-200 h-12 rounded"></div>}>
            <BulkActionBar selectedInvoices={selectedInvoices} />
          </Suspense>
        )}

        {/* Invoices Table */}
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded"></div>}>
          <InvoicesTable
            invoices={sampleInvoices}
            filteredInvoices={sortedInvoices}
            sortField={sortField}
            sortDirection={sortDirection}
            handleSort={handleSort}
            selectAll={selectAll}
            handleSelectAll={handleSelectAll}
            selectedInvoices={selectedInvoices}
            handleCheckboxChange={handleCheckboxChange}
            resetFilters={resetFilters}
          />
        </Suspense>

        {/* Modals - only load them when they're visible */}
        {showCreateModal && (
          <CreateInvoiceModal 
            isOpen={showCreateModal} 
            onClose={() => setShowCreateModal(false)} 
          />
        )}
        
        {showCreateCreditNoteModal && (
          <CreateCreditNoteModal
            isOpen={showCreateCreditNoteModal} 
            onClose={() => setShowCreateCreditNoteModal(false)} 
          />
        )}
      </div>
    </motion.div>
  );
};

export default FacturesClient;