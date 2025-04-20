'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Types
import { sampleInvoices, ViewMode } from './types';

// Components
import Header from './components/Header';
import StatisticsCards from './components/StatisticsCards';
import ActionBar from './components/ActionBar';
import FilterPanel from './components/FilterPanel';
import ExportPanel from './components/ExportPanel';
import BulkActionBar from './components/BulkActionBar';
import InvoicesTable from './components/InvoicesTable';
import CreateInvoiceModal from './CreateInvoiceModal';
import CreateCreditNoteModal from './CreateCreditNoteModal';

// Hooks
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

const FacturesClient: React.FC = () => {
  // Date range picker for export
  const [showDateRangePicker, setShowDateRangePicker] = useState<boolean>(false);
  
  // View mode
  const [viewMode, setViewMode] = useState<ViewMode>('comfortable');
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showCreateCreditNoteModal, setShowCreateCreditNoteModal] = useState<boolean>(false);

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
        <StatisticsCards />

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

        {/* Export Panel */}
        <ExportPanel
          showDateRangePicker={showDateRangePicker}
          setShowDateRangePicker={setShowDateRangePicker}
        />

        {/* Bulk Actions */}
        <BulkActionBar selectedInvoices={selectedInvoices} />

        {/* Invoices Table */}
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

        {/* Modals */}
        <CreateInvoiceModal 
          isOpen={showCreateModal} 
          onClose={() => setShowCreateModal(false)} 
        />
        <CreateCreditNoteModal
          isOpen={showCreateCreditNoteModal} 
          onClose={() => setShowCreateCreditNoteModal(false)} 
        />
      </div>
    </motion.div>
  );
};

export default FacturesClient;