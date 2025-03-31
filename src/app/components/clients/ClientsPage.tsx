// ClientsPage.tsx
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Client, Stats } from './types';
// import { formatValue } from './utils';
import { clients as initialClients, documentOptions, statusOptions, tagOptions, sourceOptions } from './data';

// Import components
import Header from './Header';
import StatisticsSection from './StatisticsSection';
import FilterBar from './FilterBar';
import SelectedClientsBar from './SelectedClientsBar';
import ClientCard from './ClientCard';
import ClientList from './ClientList';
import Pagination from './Pagination';
import QuickViewModal from './modals/QuickViewModal';
import SendDocumentModal from './modals/SendDocumentModal';

export default function ClientsPage() {
  // State for filters and search
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('Tous');
  const [selectedTag, setSelectedTag] = useState<string>('Tous');
  const [selectedSource, setSelectedSource] = useState<string>('Tous');
  
  // State for view mode
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // State for selected clients (for bulk actions)
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  // State for the send modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedClientForModal, setSelectedClientForModal] = useState<Client | null>(null);
  
  // State for quick view
  const [isQuickViewOpen, setIsQuickViewOpen] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  // State for export dropdown
  const [showExportDropdown, setShowExportDropdown] = useState<boolean>(false);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  // Load client data
  const [clients] = useState<Client[]>(initialClients);

  // Stats calculations
  const [stats, setStats] = useState<Stats>({
    totalClients: 0,
    activeClients: 0,
    inactiveClients: 0,
    pendingClients: 0,
    vipClients: 0,
    totalValue: 0,
    lastMonthNewClients: 3
  });

  // Calculate statistics based on client data
  useEffect(() => {
    const activeClients = clients.filter(client => client.statut === 'Actif').length;
    const inactiveClients = clients.filter(client => client.statut === 'Inactif').length;
    const pendingClients = clients.filter(client => client.statut === 'En attente').length;
    const vipClients = clients.filter(client => client.tags.includes('VIP')).length;
    
    // Calculate total value
    const totalValue = clients.reduce((total, client) => {
      const value = parseFloat(client.valeurTotale.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
      return total + value;
    }, 0);
    
    setStats({
      totalClients: clients.length,
      activeClients,
      inactiveClients,
      pendingClients,
      vipClients,
      totalValue,
      lastMonthNewClients: 3
    });
  }, [clients]);

  // Filter clients based on search and filter criteria (memoized for performance)
  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch = 
        searchTerm === '' || 
        client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.entreprise.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatus === 'Tous' || client.statut === selectedStatus;
      const matchesTag = selectedTag === 'Tous' || client.tags.includes(selectedTag);
      const matchesSource = selectedSource === 'Tous' || client.source === selectedSource;
      
      return matchesSearch && matchesStatus && matchesTag && matchesSource;
    });
  }, [clients, searchTerm, selectedStatus, selectedTag, selectedSource]);

  // Reset filters
  const resetFilters = useCallback((): void => {
    setSelectedStatus('Tous');
    setSelectedTag('Tous');
    setSelectedSource('Tous');
    setSearchTerm('');
  }, []);

  // Handler for toggling all checkboxes
  const handleSelectAll = useCallback((): void => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedClients(filteredClients.map(client => client.id));
    } else {
      setSelectedClients([]);
    }
  }, [selectAll, filteredClients]);

  // Handler for toggling individual checkboxes
  const handleSelectClient = useCallback((clientId: number, event?: React.MouseEvent): void => {
    if (event) {
      event.stopPropagation();
    }
    setSelectedClients(prev => {
      if (prev.includes(clientId)) {
        const newSelection = prev.filter(id => id !== clientId);
        setSelectAll(false);
        return newSelection;
      } else {
        return [...prev, clientId];
      }
    });
  }, []);

  // Handler for opening send modal
  const handleOpenSendModal = useCallback((client: Client, event?: React.MouseEvent): void => {
    if (event) {
      event.stopPropagation();
    }
    setSelectedClientForModal(client);
    setIsModalOpen(true);
  }, []);

  // Handler for closing send modal
  const handleCloseSendModal = useCallback((): void => {
    setIsModalOpen(false);
    setSelectedClientForModal(null);
  }, []);

  // Handler for document selection in modal
  const handleSendDocument = useCallback((documentType: string): void => {
    // Here you would implement the logic to send the document
    console.log(`Sending ${documentType} to ${selectedClientForModal?.prenom} ${selectedClientForModal?.nom}`);
    
    // Close the modal after sending
    handleCloseSendModal();

    // For demo purposes, we'll just display an alert
    setTimeout(() => {
      alert(`${documentType} envoyé à ${selectedClientForModal?.prenom} ${selectedClientForModal?.nom}`);
    }, 500);
  }, [selectedClientForModal, handleCloseSendModal]);

  // Open quick view for a client
  const openQuickView = useCallback((client: Client): void => {
    setSelectedClient(client);
    setIsQuickViewOpen(true);
  }, []);

  // Close quick view
  const closeQuickView = useCallback((): void => {
    setIsQuickViewOpen(false);
    setSelectedClient(null);
  }, []);

  // Export to CSV
  const exportToCSV = useCallback(() => {
    try {
      // Create CSV header
      const headers = ["ID", "Nom", "Prénom", "Email", "Téléphone", "Entreprise", "Ville", "Pays", "Adresse", "Statut", "Source", "Tags", "Dernier Contact", "Valeur Totale"];
      
      // Create CSV content
      const csvContent = [
        headers.join(","),
        ...clients.map(client => [
          client.id,
          client.nom,
          client.prenom,
          client.email,
          client.telephone,
          client.entreprise,
          client.ville,
          client.pays,
          client.adresse.replace(/,/g, " "),
          client.statut,
          client.source,
          client.tags.join(";"),
          client.dernierContact,
          client.valeurTotale
        ].join(","))
      ].join("\n");
      
      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `clients_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      
      // Trigger download
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error("Erreur lors de l'export CSV:", error);
    } finally {
      setShowExportDropdown(false);
    }
  }, [clients]);
  
  // Export to PDF
  const exportToPDF = useCallback(() => {
    try {
      alert("Fonctionnalité d'export PDF à implémenter avec une bibliothèque comme jsPDF");
      // En production, utilisez une bibliothèque comme jsPDF pour générer un PDF
    } catch (error) {
      console.error("Erreur lors de l'export PDF:", error);
    } finally {
      setShowExportDropdown(false);
    }
  }, []);

  // Pagination variables
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, selectedTag, selectedSource]);

  // Get current page data
  const displayedClients = useMemo(() => {
    return filteredClients.slice(
      (currentPage - 1) * itemsPerPage, 
      currentPage * itemsPerPage
    );
  }, [filteredClients, currentPage, itemsPerPage]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 py-6 pt-24">
        {/* Header */}
        <Header stats={stats} />

        {/* Statistics Boxes */}
        <StatisticsSection stats={stats} />

        {/* Filter Bar */}
        <FilterBar 
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          selectedSource={selectedSource}
          setSelectedSource={setSelectedSource}
          resetFilters={resetFilters}
          viewMode={viewMode}
          setViewMode={setViewMode}
          selectAll={selectAll}
          handleSelectAll={handleSelectAll}
          showExportDropdown={showExportDropdown}
          setShowExportDropdown={setShowExportDropdown}
          exportToCSV={exportToCSV}
          exportToPDF={exportToPDF}
          statusOptions={statusOptions}
          tagOptions={tagOptions}
          sourceOptions={sourceOptions}
        />

        {/* Selected clients actions */}
        <SelectedClientsBar selectedCount={selectedClients.length} />

        {/* Main Content - Grid of Cards or List */}
        <div className="mb-6">
          {viewMode === "grid" ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {displayedClients.map((client) => (
                  <ClientCard
                    key={client.id}
                    client={client}
                    isSelected={selectedClients.includes(client.id)}
                    onSelect={handleSelectClient}
                    onOpenQuickView={openQuickView}
                    onSendDocument={handleOpenSendModal}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            /* List View */
            <ClientList 
              clients={displayedClients}
              selectedClients={selectedClients}
              handleSelectClient={handleSelectClient}
              handleSelectAll={handleSelectAll}
              selectAll={selectAll}
              openQuickView={openQuickView}
              handleOpenSendModal={handleOpenSendModal}
            />
          )}
        </div>

        {/* Pagination */}
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredClients.length}
          setCurrentPage={setCurrentPage}
        />
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {isQuickViewOpen && selectedClient && (
          <QuickViewModal 
            isOpen={isQuickViewOpen}
            client={selectedClient}
            onClose={closeQuickView}
            onSendDocument={handleOpenSendModal}
          />
        )}
      </AnimatePresence>

      {/* Send Document Modal */}
      <AnimatePresence>
        {isModalOpen && selectedClientForModal && (
          <SendDocumentModal 
            isOpen={isModalOpen}
            client={selectedClientForModal}
            documentOptions={documentOptions}
            onClose={handleCloseSendModal}
            onSendDocument={handleSendDocument}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
