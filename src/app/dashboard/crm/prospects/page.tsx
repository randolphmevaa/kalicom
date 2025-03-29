'use client';

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  FiSearch,
  FiPlus,
  FiFilter,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiRefreshCw,
  FiCheckSquare,
  FiSquare,
  FiTag,
  FiUser,
  FiDownload,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiGrid,
  FiList,
  FiEdit,
  FiTrash2,
  FiMessageCircle,
  FiX,
  FiInfo,
  FiArrowRight,
  FiBarChart2,
  FiUserCheck,
  FiCheck,
  FiFileText
} from "react-icons/fi";

/** -----------------------------
 *  Define TypeScript interfaces
 *  -----------------------------
 */
interface Prospect {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  companyName: string;
  zipCode: string;
  address: string;
  description: string;
  email: string;
  mobilePhoneNumber: string;
  city: string;
  country: string;
  tags: string[];
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  lastContactDate: string;
}

interface TeamMember {
  id: number;
  name: string;
}

interface FilterModel {
  id: number;
  name: string;
}

interface FieldOption {
  id: string;
  label: string;
  checked: boolean;
}

/** -----------------------------
 *  Sample Data
 *  -----------------------------
 */
const prospectsData: Prospect[] = [
  {
    id: "LD-12345",
    firstName: "Marie",
    lastName: "Dupont",
    phoneNumber: "06 12 34 56 78",
    companyName: "Nexus Tech",
    zipCode: "75001",
    address: "10 Rue de Rivoli",
    description: "Intéressé par notre offre premium",
    email: "marie.dupont@nexustech.fr",
    mobilePhoneNumber: "06 12 34 56 78",
    city: "Paris",
    country: "France",
    tags: ["VIP", "Premium"],
    assignedTo: "Emma Laurent",
    createdAt: "2023-09-15",
    updatedAt: "2023-10-01",
    lastContactDate: "2023-10-12",
  },
  {
    id: "LD-12346",
    firstName: "Thomas",
    lastName: "Bernard",
    phoneNumber: "06 23 45 67 89",
    companyName: "Global Solutions",
    zipCode: "69001",
    address: "25 Rue de la République",
    description: "A contacté via le site web",
    email: "thomas.bernard@globalsolutions.fr",
    mobilePhoneNumber: "06 23 45 67 89",
    city: "Lyon",
    country: "France",
    tags: ["Nouveau"],
    assignedTo: "Lucas Martin",
    createdAt: "2023-09-18",
    updatedAt: "2023-09-25",
    lastContactDate: "2023-10-05",
  },
  {
    id: "LD-12347",
    firstName: "Sophie",
    lastName: "Leclerc",
    phoneNumber: "06 34 56 78 90",
    companyName: "Innovate Design",
    zipCode: "33000",
    address: "5 Cours de l'Intendance",
    description: "Demande de démonstration",
    email: "sophie.leclerc@innovatedesign.fr",
    mobilePhoneNumber: "06 34 56 78 90",
    city: "Bordeaux",
    country: "France",
    tags: ["Démonstration", "Tech"],
    assignedTo: "Julie Dubois",
    createdAt: "2023-09-20",
    updatedAt: "2023-10-05",
    lastContactDate: "2023-10-18",
  },
  {
    id: "LD-12348",
    firstName: "Pierre",
    lastName: "Moreau",
    phoneNumber: "06 45 67 89 01",
    companyName: "Eco Habitat",
    zipCode: "31000",
    address: "15 Rue du Taur",
    description: "Contact via salon professionnel",
    email: "pierre.moreau@ecohabitat.fr",
    mobilePhoneNumber: "06 45 67 89 01",
    city: "Toulouse",
    country: "France",
    tags: ["Événement", "Priorité"],
    assignedTo: "Emma Laurent",
    createdAt: "2023-09-22",
    updatedAt: "2023-09-30",
    lastContactDate: "2023-10-02",
  },
  {
    id: "LD-12349",
    firstName: "Isabelle",
    lastName: "Petit",
    phoneNumber: "06 56 78 90 12",
    companyName: "Marketing Plus",
    zipCode: "67000",
    address: "30 Avenue des Vosges",
    description: "Recommandé par client existant",
    email: "isabelle.petit@marketingplus.fr",
    mobilePhoneNumber: "06 56 78 90 12",
    city: "Strasbourg",
    country: "France",
    tags: ["Référence"],
    assignedTo: "Lucas Martin",
    createdAt: "2023-09-25",
    updatedAt: "2023-10-02",
    lastContactDate: "2023-10-10",
  },
];

const teamMembers: TeamMember[] = [
  { id: 1, name: "Emma Laurent" },
  { id: 2, name: "Lucas Martin" },
  { id: 3, name: "Julie Dubois" },
  { id: 4, name: "Marc Lefevre" },
  { id: 5, name: "Léa Rousseau" },
];

const filterModels: FilterModel[] = [
  { id: 1, name: "Prospects récents" },
  { id: 2, name: "Prospects VIP" },
  { id: 3, name: "Prospects non assignés" },
  { id: 4, name: "Prospects du mois en cours" },
];

const fieldOptions: FieldOption[] = [
  { id: "firstName", label: "Prénom", checked: true },
  { id: "lastName", label: "Nom", checked: true },
  { id: "phoneNumber", label: "Numéro de téléphone", checked: true },
  { id: "companyName", label: "Nom de l'entreprise", checked: true },
  { id: "zipCode", label: "Code postal", checked: true },
  { id: "address", label: "Adresse", checked: true },
  { id: "description", label: "Description", checked: true },
  { id: "email", label: "E-mail", checked: true },
  { id: "mobilePhoneNumber", label: "Numéro de téléphone mobile", checked: true },
  { id: "city", label: "Ville", checked: false },
  { id: "country", label: "Pays", checked: false },
  { id: "lastContactDate", label: "Dernier contact", checked: true },
];

// Tag color mapping with brand colors (fixed with index signature)
const tagColors: { [key: string]: string } = {
  "VIP": "#1B0353",
  "Premium": "#004AC8",
  "Nouveau": "#4BB2F6",
  "Démonstration": "#004AC8",
  "Tech": "#1B0353",
  "Événement": "#4BB2F6",
  "Priorité": "#1B0353",
  "Référence": "#004AC8",
  // Default color for any other tags
  "default": "#4BB2F6"
};

export default function ProspectPage() {
  // State with explicit type annotations
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [phoneSearch, setPhoneSearch] = useState<string>("");
  const [tagSearch, setTagSearch] = useState<string>("");
  // const [showDetailedView, setShowDetailedView] = useState<boolean>(false);
  const [dateFilter, setDateFilter] = useState<string>("");
  const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null);
  const [selectedFilterModel, setSelectedFilterModel] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isFilterExpanded, setIsFilterExpanded] = useState<boolean>(true);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState<boolean>(false);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [conversionSuccess, setConversionSuccess] = useState<{ [key: string]: boolean }>({});

  // Dropdowns state 
  const [showFieldsDropdown, setShowFieldsDropdown] = useState<boolean>(false);
  const [showTeamDropdown, setShowTeamDropdown] = useState<boolean>(false);
  const [showFilterModelsDropdown, setShowFilterModelsDropdown] = useState<boolean>(false);
  const [selectedFields, setSelectedFields] = useState<FieldOption[]>(fieldOptions);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  
  // New state for export dropdown
  const [showExportDropdown, setShowExportDropdown] = useState<boolean>(false);
  // State to check if dropdown should be positioned above button
  const [showAbove, setShowAbove] = useState<boolean>(false);
  
  // Refs for checking position
  const exportButtonRef = useRef<HTMLButtonElement>(null);

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

//   // Function to open detailed view
// const openDetailedView = () => {
//   if (selectedProspect) {
//     setShowDetailedView(true);
//   }
// };

// // Function to close detailed view
// const closeDetailedView = () => {
//   setShowDetailedView(false);
// };

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
  const toggleField = (fieldId: string) => {
    const updatedFields = selectedFields.map((field) =>
      field.id === fieldId ? { ...field, checked: !field.checked } : field
    );
    setSelectedFields(updatedFields);
  };

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

  // Export to CSV
  const exportToCSV = () => {
    setIsExporting(true);
    
    try {
      // Create CSV header
      const headers = ["ID", "Nom", "Prénom", "Téléphone", "Mobile", "Email", "Entreprise", "Adresse", "Code Postal", "Ville", "Tags", "Description", "Dernier Contact"];
      
      // Create CSV content
      const csvContent = [
        headers.join(","),
        ...prospectsData.map(prospect => [
          prospect.id,
          prospect.lastName,
          prospect.firstName,
          prospect.phoneNumber,
          prospect.mobilePhoneNumber,
          prospect.email,
          prospect.companyName,
          prospect.address,
          prospect.zipCode,
          prospect.city,
          prospect.tags.join(";"),
          prospect.description.replace(/,/g, " "),
          prospect.lastContactDate
        ].join(","))
      ].join("\n");
      
      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `prospects_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      
      // Trigger download
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error("Erreur lors de l'export CSV:", error);
    } finally {
      setIsExporting(false);
      setShowExportDropdown(false);
    }
  };
  
  // Export to PDF
  const exportToPDF = () => {
    setIsExporting(true);
    
    try {
      alert("Fonctionnalité d'export PDF à implémenter avec une bibliothèque comme jsPDF");
      // En production, utilisez une bibliothèque comme jsPDF pour générer un PDF
      
    } catch (error) {
      console.error("Erreur lors de l'export PDF:", error);
    } finally {
      setIsExporting(false);
      setShowExportDropdown(false);
    }
  };

  // Get the initials of a person
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Get appropriate tag color
  const getTagColor = (tag: string) => {
    return tagColors[tag] || tagColors.default;
  };

  // Get status color based on last contact date (using brand colors)
  const getStatusColor = (lastContactDate: string) => {
    const date = new Date(lastContactDate);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) return "#4BB2F6"; // Light blue for recent contact
    if (diffDays <= 14) return "#004AC8"; // Medium blue for medium
    return "#1B0353"; // Dark blue for stale
  };

  /** -----------------------------
   *  Rendering
   *  -----------------------------
   */
  // Enhanced animation variants
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24,
        mass: 1.2
      } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      y: 10,
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  // Pagination variables
  const itemsPerPage = 6;
  const totalPages = Math.ceil(prospectsData.length / itemsPerPage);
  const displayedProspects = prospectsData.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );
  
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
                  <FiBriefcase className="text-white text-2xl" />
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

        {/* Active Filters + Actions Bar - Refined with brand colors */}
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
                        <FiX size={16} />
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
              
              {/* Export dropdown button with position control */}
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
                
                <AnimatePresence>
                  {showExportDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: showAbove ? -10 : 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: showAbove ? -10 : 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute z-20 ${showAbove ? 'bottom-full mb-2' : 'top-full mt-2'} right-0 w-40 bg-white border border-[#4BB2F6] border-opacity-30 rounded-xl shadow-xl overflow-hidden`}
                      style={{ boxShadow: "0 10px 25px -5px rgba(27, 3, 83, 0.1), 0 8px 10px -6px rgba(27, 3, 83, 0.08)" }}
                    >
                      <motion.button
                        whileHover={{ backgroundColor: "rgba(75, 178, 246, 0.1)" }}
                        className="w-full flex items-center gap-2 px-4 py-3 text-[#004AC8] text-sm font-medium text-left hover:bg-blue-50"
                        onClick={exportToCSV}
                      >
                        <FiDownload className="w-4 h-4" />
                        <span>Exporter en CSV</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ backgroundColor: "rgba(75, 178, 246, 0.1)" }}
                        className="w-full flex items-center gap-2 px-4 py-3 text-[#004AC8] text-sm font-medium text-left hover:bg-blue-50"
                        onClick={exportToPDF}
                      >
                        <FiFileText className="w-4 h-4" />
                        <span>Exporter en PDF</span>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
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
              
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1B0353] bg-opacity-10 text-[#1B0353] rounded-lg border border-[#1B0353] border-opacity-20 shadow-sm hover:shadow transition text-sm font-medium"
                  onClick={() => setShowFieldsDropdown(!showFieldsDropdown)}
                >
                  <span>Colonnes</span>
                  <FiChevronDown className="w-4 h-4" />
                </motion.button>
                <AnimatePresence>
                  {showFieldsDropdown && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute z-20 mt-2 right-0 w-64 bg-white border border-[#4BB2F6] border-opacity-30 rounded-xl shadow-xl p-4 backdrop-blur-sm"
                      style={{ boxShadow: "0 10px 25px -5px rgba(27, 3, 83, 0.1), 0 8px 10px -6px rgba(27, 3, 83, 0.08)" }}
                    >
                      <h4 className="font-medium text-sm mb-3 text-[#1B0353]">Afficher les champs :</h4>
                      <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#4BB2F6] scrollbar-track-transparent">
                        {selectedFields.map((field) => (
                          <motion.div 
                            key={field.id} 
                            className="flex items-center p-2 hover:bg-[#4BB2F6] hover:bg-opacity-5 rounded-lg transition-colors"
                            whileHover={{ x: 2 }}
                          >
                            <motion.button
                              className="mr-2 focus:outline-none"
                              whileTap={{ scale: 0.9 }}
                              onClick={() => toggleField(field.id)}
                            >
                              {field.checked ? (
                                <FiCheckSquare className="text-[#004AC8] w-5 h-5" />
                              ) : (
                                <FiSquare className="text-gray-400 w-5 h-5" />
                              )}
                            </motion.button>
                            <span className="text-sm text-gray-700">{field.label}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters Panel (Collapsible) with glass effect - Make it scrollable if needed */}
        <AnimatePresence>
          {isFilterExpanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white bg-opacity-95 backdrop-blur-sm rounded-xl border border-gray-100 shadow-lg overflow-hidden mb-6"
              style={{
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.01)"
              }}
            >
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Phone Number */}
                  <div className="col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Numéro de Tél.
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiPhone className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={phoneSearch}
                        onChange={(e) => setPhoneSearch(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Ex: 06 12 34 56 78"
                      />
                    </div>
                  </div>

                  {/* Search */}
                  <div className="col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Chercher
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Nom, email, entreprise..."
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Tags
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiTag className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={tagSearch}
                        onChange={(e) => setTagSearch(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="VIP, Premium..."
                      />
                    </div>
                  </div>

                  {/* Date Created */}
                  <div className="col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Créé le
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="text-gray-400" />
                      </div>
                      <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Assigned To */}
                  <div className="col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Assigné à
                    </label>
                    <div className="relative">
                      <button
                        className="w-full flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                        onClick={() => setShowTeamDropdown(!showTeamDropdown)}
                      >
                        <div className="flex items-center">
                          <FiUser className="text-gray-400 mr-2" />
                          <span className="text-gray-700">
                            {selectedAssignee ? selectedAssignee : "Sélectionner"}
                          </span>
                        </div>
                        <FiChevronDown className="text-gray-400" />
                      </button>
                      {showTeamDropdown && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                          {teamMembers.map((member) => (
                            <div
                              key={member.id}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                              onClick={() => {
                                setSelectedAssignee(member.name);
                                setShowTeamDropdown(false);
                              }}
                            >
                              {member.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Filter Models */}
                  <div className="col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Modèles de filtres
                    </label>
                    <div className="relative">
                      <button
                        className="w-full flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                        onClick={() =>
                          setShowFilterModelsDropdown(!showFilterModelsDropdown)
                        }
                      >
                        <div className="flex items-center">
                          <FiFilter className="text-gray-400 mr-2" />
                          <span className="text-gray-700">
                            {selectedFilterModel ? selectedFilterModel : "Sélectionner"}
                          </span>
                        </div>
                        <FiChevronDown className="text-gray-400" />
                      </button>
                      {showFilterModelsDropdown && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                          {filterModels.map((model) => (
                            <div
                              key={model.id}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                              onClick={() => {
                                setSelectedFilterModel(model.name);
                                setShowFilterModelsDropdown(false);
                              }}
                            >
                              {model.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="flex justify-between mt-6">
                  <div className="flex space-x-3">
                    <button
                      onClick={handleReset}
                      className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
                    >
                      <FiRefreshCw className="mr-2" />
                      <span>Réinitialiser</span>
                    </button>
                    <button
                      onClick={applyFilters}
                      className="flex items-center px-4 py-2 text-white rounded-lg transition text-sm bg-indigo-600 hover:bg-indigo-700"
                    >
                      <FiFilter className="mr-2" />
                      <span>Appliquer le filtre</span>
                    </button>
                  </div>
                  
                  <button
                    onClick={() => setIsFilterExpanded(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content - Grid of Cards or List */}
        <div className="mb-6">
          {viewMode === "grid" ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {displayedProspects.map((prospect) => (
                  <motion.div
                    key={prospect.id}
                    layoutId={`card-${prospect.id}`}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    whileHover={{ 
                      y: -8, 
                      scale: 1.02,
                      boxShadow: "0 20px 25px -5px rgba(0, 74, 200, 0.15), 0 10px 10px -5px rgba(27, 3, 83, 0.1)"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="group bg-white rounded-xl overflow-hidden cursor-pointer border border-gray-100"
                    style={{ 
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)",
                      transform: "perspective(1000px) rotateX(0deg)"
                    }}
                    onClick={() => openQuickView(prospect)}
                  >
                    {/* Card Header with Gradient using brand colors */}
                    <div 
                      className="h-16 relative overflow-hidden"
                      style={{ 
                        background: "linear-gradient(120deg, #4BB2F6, #004AC8, #1B0353)",
                        clipPath: "polygon(0 0, 100% 0, 100% 80%, 0 100%)"
                      }}
                    >
                      {/* Abstract pattern overlay with animated subtle movement */}
                      <motion.div 
                        className="absolute inset-0 opacity-20"
                        animate={{ 
                          backgroundPosition: ["0% 0%", "100% 100%"], 
                        }} 
                        transition={{ 
                          duration: 20, 
                          ease: "linear", 
                          repeat: Infinity, 
                          repeatType: "reverse" 
                        }}
                        style={{
                          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3C/g%3E%3C/svg%3E\")",
                        }}
                      />
                    </div>

                    <div className="relative px-6 pt-8 pb-6">
                      {/* Status indicator with pulse animation for recent contacts - Fixed comparison */}
                      <div className="absolute top-4 right-4 flex items-center">
                        <div 
                          className={`w-2 h-2 rounded-full ${
                            getStatusColor(prospect.lastContactDate) === "#4BB2F6" ? "animate-ping absolute" : ""
                          }`}
                          style={{ 
                            backgroundColor: getStatusColor(prospect.lastContactDate),
                            opacity: 0.5
                          }}
                        />
                        <div 
                          className="w-2 h-2 rounded-full relative"
                          style={{ backgroundColor: getStatusColor(prospect.lastContactDate) }}
                          title={`Dernier contact: ${prospect.lastContactDate}`}
                        />
                        <span className="ml-2 text-xs text-gray-500">{prospect.lastContactDate}</span>
                      </div>
                      
                      {/* Checkbox for selection */}
                      <button
                        className="absolute top-4 left-4 focus:outline-none"
                        onClick={(e) => toggleRowSelection(prospect.id, e)}
                      >
                        {selectedRows.includes(prospect.id) ? (
                          <motion.div 
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="text-indigo-600"
                          >
                            <FiCheckSquare className="h-5 w-5" />
                          </motion.div>
                        ) : (
                          <FiSquare className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                        )}
                      </button>
                      
                      <div className="flex flex-col items-center mb-6">
                        {/* Improved avatar with depth and subtle glow */}
                        <div className="relative mb-4">
                          {/* Soft glow behind avatar */}
                          <div 
                            className="absolute -inset-1 rounded-full opacity-20 blur-md"
                            style={{ 
                              background: "radial-gradient(circle, #4BB2F6, #004AC8)", 
                            }}
                          />
                          <motion.div 
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            className="w-20 h-20 rounded-full flex items-center justify-center text-white text-xl font-bold relative z-10 border-2 border-white"
                            style={{ 
                              background: "linear-gradient(45deg, #4BB2F6, #004AC8, #1B0353)",
                              boxShadow: "0 10px 15px -3px rgba(27, 3, 83, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.15)"
                            }}
                          >
                            {getInitials(prospect.firstName, prospect.lastName)}
                            
                            {/* Shine effect */}
                            <motion.div 
                              className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-30 rounded-full"
                              animate={{ 
                                x: ["150%", "-150%"],
                              }}
                              transition={{ 
                                repeat: Infinity, 
                                repeatType: "mirror", 
                                duration: 2,
                                ease: "easeInOut",
                                repeatDelay: 4
                              }}
                              style={{ 
                                transform: "skewX(45deg)",
                                width: "50%"
                              }}
                            />
                          </motion.div>
                        </div>
                        
                        <h3 className="text-lg font-bold text-[#1B0353] group-hover:text-[#004AC8] transition-colors">
                          {prospect.firstName} {prospect.lastName}
                        </h3>
                        
                        <p className="text-sm font-medium text-[#004AC8] mb-2">
                          {prospect.companyName}
                        </p>
                        
                        {/* Tags with glass morphism and hover effect */}
                        <div className="flex flex-wrap gap-2 justify-center mt-2">
                          {prospect.tags.map((tag, tagIndex) => (
                            <motion.span 
                              key={tagIndex}
                              whileHover={{ y: -2, scale: 1.05 }}
                              className="px-3 py-1 text-xs font-medium rounded-full text-white shadow-sm transform transition-transform" 
                              style={{ 
                                backgroundColor: getTagColor(tag),
                                boxShadow: `0 2px 5px ${getTagColor(tag)}40`,
                                backdropFilter: "blur(8px)"
                              }}
                            >
                              {tag}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Enhanced contact info with glass morphism and brand colors */}
                      <div className="space-y-3 mt-4">
                        <motion.div 
                          whileHover={{ scale: 1.02, x: 5 }}
                          className="flex items-center p-3 rounded-lg border border-gray-100 group-hover:border-[#4BB2F6] transition-colors"
                          style={{
                            background: "linear-gradient(to right, rgba(240, 249, 255, 0.8), rgba(255, 255, 255, 0.9))",
                            backdropFilter: "blur(8px)",
                            boxShadow: "0 2px 6px rgba(75, 178, 246, 0.1)"
                          }}
                        >
                          <div className="p-2 rounded-full bg-[#4BB2F6] bg-opacity-10 text-[#004AC8] mr-3 flex-shrink-0">
                            <FiMail className="w-4 h-4" />
                          </div>
                          <span className="text-[#004AC8] text-sm font-medium truncate" title={prospect.email}>
                            {prospect.email}
                          </span>
                        </motion.div>
                        
                        <motion.div
                          whileHover={{ scale: 1.02, x: 5 }}
                          className="flex items-center p-3 rounded-lg border border-gray-100 group-hover:border-[#4BB2F6] transition-colors"
                          style={{
                            background: "linear-gradient(to right, rgba(240, 249, 255, 0.8), rgba(255, 255, 255, 0.9))",
                            backdropFilter: "blur(8px)",
                            boxShadow: "0 2px 6px rgba(0, 74, 200, 0.1)"
                          }}
                        >
                          <div className="p-2 rounded-full bg-[#004AC8] bg-opacity-10 text-[#004AC8] mr-3 flex-shrink-0">
                            <FiPhone className="w-4 h-4" />
                          </div>
                          <a 
                            href={`tel:${prospect.mobilePhoneNumber.replace(/\s/g, '')}`} 
                            className="text-gray-700 text-sm font-medium truncate hover:text-[#004AC8]" 
                            title={prospect.mobilePhoneNumber}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {prospect.mobilePhoneNumber}
                          </a>
                        </motion.div>
                        
                        <motion.div
                          whileHover={{ scale: 1.02, x: 5 }}
                          className="flex items-center p-3 rounded-lg border border-gray-100 group-hover:border-[#4BB2F6] transition-colors"
                          style={{
                            background: "linear-gradient(to right, rgba(240, 249, 255, 0.8), rgba(255, 255, 255, 0.9))",
                            backdropFilter: "blur(8px)",
                            boxShadow: "0 2px 6px rgba(27, 3, 83, 0.1)"
                          }}
                        >
                          <div className="p-2 rounded-full bg-[#1B0353] bg-opacity-10 text-[#1B0353] mr-3 flex-shrink-0">
                            <FiMapPin className="w-4 h-4" />
                          </div>
                          {/* Show full address with proper truncation */}
                          <div className="flex-1 min-w-0">
                            <div className="text-gray-700 text-sm font-medium truncate" title={`${prospect.address}, ${prospect.zipCode} ${prospect.city}, ${prospect.country}`}>
                              {prospect.address}, {prospect.zipCode} {prospect.city}
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      {/* Enhanced Quick Actions with advanced hover effects */}
                      <div className="flex justify-center space-x-2 mt-6">
                        <motion.button 
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 rounded-lg shadow-sm transition-all duration-300"
                          style={{
                            background: "linear-gradient(135deg, rgba(75, 178, 246, 0.1), rgba(75, 178, 246, 0.2))",
                            border: "1px solid rgba(75, 178, 246, 0.2)",
                            boxShadow: "0 2px 5px rgba(75, 178, 246, 0.1)"
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `tel:${prospect.mobilePhoneNumber.replace(/\s/g, '')}`;
                          }}
                        >
                          <FiPhone className="w-5 h-5 text-[#004AC8]" />
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 rounded-lg shadow-sm transition-all duration-300"
                          style={{
                            background: "linear-gradient(135deg, rgba(0, 74, 200, 0.1), rgba(0, 74, 200, 0.2))",
                            border: "1px solid rgba(0, 74, 200, 0.2)",
                            boxShadow: "0 2px 5px rgba(0, 74, 200, 0.1)"
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `mailto:${prospect.email}`;
                          }}
                        >
                          <FiMail className="w-5 h-5 text-[#004AC8]" />
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 rounded-lg shadow-sm transition-all duration-300"
                          style={{
                            background: "linear-gradient(135deg, rgba(27, 3, 83, 0.1), rgba(27, 3, 83, 0.2))",
                            border: "1px solid rgba(27, 3, 83, 0.2)",
                            boxShadow: "0 2px 5px rgba(27, 3, 83, 0.1)"
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Commencer une conversation avec ${prospect.firstName}`);
                          }}
                        >
                          <FiMessageCircle className="w-5 h-5 text-[#1B0353]" />
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 rounded-lg shadow-sm transition-all duration-300"
                          style={{
                            background: "linear-gradient(135deg, rgba(75, 178, 246, 0.1), rgba(75, 178, 246, 0.2))",
                            border: "1px solid rgba(75, 178, 246, 0.2)",
                            boxShadow: "0 2px 5px rgba(75, 178, 246, 0.1)"
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Modifier les informations de ${prospect.firstName}`);
                          }}
                        >
                          <FiEdit className="w-5 h-5 text-[#004AC8]" />
                        </motion.button>
                        
                        {/* Added Transform to Client button as an action */}
                        <motion.button 
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-2 rounded-lg shadow-sm transition-all duration-300 ${
                            conversionSuccess[prospect.id] ? 'bg-green-100' : 'bg-gradient-to-r from-[#004AC8] to-[#1B0353]'
                          }`}
                          style={{
                            border: conversionSuccess[prospect.id] ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(27, 3, 83, 0.2)',
                            boxShadow: "0 2px 5px rgba(27, 3, 83, 0.1)"
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConvertToClient(prospect.id, e);
                          }}
                          disabled={conversionSuccess[prospect.id]}
                        >
                          {conversionSuccess[prospect.id] ? (
                            <FiCheck className="w-5 h-5 text-green-600" />
                          ) : (
                            <FiUserCheck className="w-5 h-5 text-white" />
                          )}
                        </motion.button>
                      </div>

                      {/* Replace "Transformer en client" with "Voir le detail" Button */}
                      <div className="mt-5 flex justify-center">
                        <motion.button
                          whileHover={{ scale: 1.03, y: -2 }}
                          whileTap={{ scale: 0.97 }}
                          className="px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center w-full transition-all duration-300 bg-gradient-to-r from-[#004AC8] to-[#1B0353] text-white shadow-md hover:shadow-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            openQuickView(prospect);
                          }}
                        >
                          <FiArrowRight className="mr-2 w-4 h-4" />
                          <span>Voir le détail</span>
                        </motion.button>
                      </div>
                      
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            /* List View */
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="w-10 px-4 py-3 text-left">
                        <button onClick={handleSelectAll} className="focus:outline-none">
                          {selectAll ? (
                            <FiCheckSquare className="text-indigo-600" />
                          ) : (
                            <FiSquare className="text-gray-400" />
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Nom complet
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Entreprise
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Contact
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Localisation
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Tags
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Dernier contact
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {displayedProspects.map((prospect, index) => (
                      <tr
                        key={prospect.id}
                        className={`hover:bg-gray-50 cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                        onClick={() => openQuickView(prospect)}
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          <button
                            className="focus:outline-none"
                            onClick={(e) => toggleRowSelection(prospect.id, e)}
                          >
                            {selectedRows.includes(prospect.id) ? (
                              <FiCheckSquare className="text-indigo-600" />
                            ) : (
                              <FiSquare className="text-gray-400" />
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {prospect.id}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3"
                              style={{ background: "linear-gradient(45deg, #4BB2F6, #004AC8)" }}
                            >
                              {getInitials(prospect.firstName, prospect.lastName)}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {prospect.firstName} {prospect.lastName}
                              </div>
                              <div className="text-xs text-gray-500">
                                Assigné à: {prospect.assignedTo}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {prospect.companyName}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-indigo-600">
                            <a href={`mailto:${prospect.email}`} onClick={(e) => e.stopPropagation()}>
                              {prospect.email}
                            </a>
                          </div>
                          <div className="text-sm text-gray-500">
                            <a 
                              href={`tel:${prospect.mobilePhoneNumber.replace(/\s/g, '')}`} 
                              className="hover:text-[#004AC8]"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {prospect.mobilePhoneNumber}
                            </a>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {/* Show full address in list view */}
                          <div className="max-w-xs truncate" title={`${prospect.address}, ${prospect.zipCode} ${prospect.city}, ${prospect.country}`}>
                            {prospect.address}, {prospect.zipCode} {prospect.city}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {prospect.tags.map((tag, tagIndex) => (
                              <span 
                                key={tagIndex} 
                                className="px-2 py-1 text-xs rounded-full text-white" 
                                style={{ backgroundColor: getTagColor(tag) }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <div 
                              className="w-2 h-2 rounded-full mr-2" 
                              style={{ backgroundColor: getStatusColor(prospect.lastContactDate) }}
                            />
                            {prospect.lastContactDate}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-1">
                            <button 
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.location.href = `tel:${prospect.mobilePhoneNumber.replace(/\s/g, '')}`;
                              }}
                            >
                              <FiPhone size={16} />
                            </button>
                            <button 
                              className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.location.href = `mailto:${prospect.email}`;
                              }}
                            >
                              <FiMail size={16} />
                            </button>
                            <button 
                              className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
                              onClick={(e) => {
                                e.stopPropagation();
                                alert(`Modifier les informations de ${prospect.firstName}`);
                              }}
                            >
                              <FiEdit size={16} />
                            </button>
                            <button 
                              className={`p-1 ${conversionSuccess[prospect.id] ? 'text-green-600 hover:bg-green-50' : 'text-indigo-600 hover:bg-indigo-50'} rounded`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleConvertToClient(prospect.id, e);
                              }}
                            >
                              {conversionSuccess[prospect.id] ? <FiCheck size={16} /> : <FiUserCheck size={16} />}
                            </button>
                            
                            {/* Added "Voir le détail" button */}
                            <button 
                              className="p-1 text-blue-700 hover:bg-blue-50 rounded"
                              onClick={(e) => {
                                e.stopPropagation();
                                openQuickView(prospect);
                              }}
                            >
                              <FiArrowRight size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Pagination - Updated with brand colors */}
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
            
            {/* Page numbers with elegant design and brand colors */}
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

      {/* Quick View Modal with Navigation to Detail Page */}
      <AnimatePresence>
        {isQuickViewOpen && selectedProspect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#1B0353] bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={closeQuickView}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, rotateX: 5 }}
              animate={{ scale: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.9, y: 30, rotateX: 5 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                mass: 1.5
              }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden relative"
              style={{ 
                boxShadow: "0 25px 50px -12px rgba(27, 3, 83, 0.25), 0 0 40px rgba(0, 0, 0, 0.1)",
                transform: "perspective(1000px)",
                transformStyle: "preserve-3d"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Enhanced modal header with advanced gradient and overlay */}
              <div className="relative p-8" style={{ 
                background: "linear-gradient(135deg, #4BB2F6 0%, #004AC8 60%, #1B0353 100%)",
                boxShadow: "0 4px 6px -1px rgba(27, 3, 83, 0.1)"
              }}>
                {/* Animated background pattern */}
                <motion.div 
                  className="absolute inset-0 opacity-15"
                  animate={{ 
                    backgroundPosition: ["0% 0%", "100% 100%"], 
                  }} 
                  transition={{ 
                    duration: 20, 
                    ease: "linear", 
                    repeat: Infinity, 
                    repeatType: "reverse" 
                  }}
                  style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E\")",
                  }}
                />
                
                <button 
                  className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 z-10"
                  onClick={closeQuickView}
                >
                  <FiX size={24} />
                </button>
                
                <div className="flex items-center space-x-4 relative z-10">
                  {/* Enhanced avatar with 3D effect */}
                  <motion.div 
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold overflow-hidden"
                    style={{ 
                      background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent 80%)",
                      boxShadow: "0 8px 16px rgba(0,0,0,0.2), inset 0 0 20px rgba(255,255,255,0.3)"
                    }}
                  >
                    {getInitials(selectedProspect.firstName, selectedProspect.lastName)}
                    
                    {/* Animated shine effect */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-40"
                      animate={{ 
                        x: ["150%", "-150%"],
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        repeatType: "mirror", 
                        duration: 1.5,
                        ease: "easeInOut",
                        repeatDelay: 3
                      }}
                      style={{ 
                        transform: "skewX(45deg)",
                        width: "50%"
                      }}
                    />
                  </motion.div>
                  
                  <div className="text-white">
                    <h2 className="text-2xl font-bold">{selectedProspect.firstName} {selectedProspect.lastName}</h2>
                    <p className="opacity-90">{selectedProspect.companyName}</p>
                    <div className="flex mt-2 space-x-2">
                      {selectedProspect.tags.map((tag, index) => (
                        <motion.span 
                          key={index}
                          whileHover={{ y: -2, scale: 1.05 }}
                          className="px-2 py-1 text-xs rounded-full bg-white bg-opacity-20 backdrop-blur-sm shadow-sm"
                          style={{
                            border: "1px solid rgba(255,255,255,0.2)",
                            textShadow: "0 1px 2px rgba(0,0,0,0.1)"
                          }}
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Modal Content */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-lg font-bold mb-4 text-indigo-900 flex items-center">
                      <div className="p-2 rounded-lg bg-indigo-100 mr-3 shadow-sm">
                        <FiInfo className="text-indigo-600 w-5 h-5" />
                      </div>
                      Informations de contact
                    </h3>
                    
                    <div className="space-y-4">
                      <motion.div 
                        className="flex items-center p-4 rounded-xl shadow-sm transition-all duration-300"
                        whileHover={{ y: -5, scale: 1.02 }}
                        style={{
                          background: "linear-gradient(145deg, #f0f9ff, #e6f7ff)",
                          boxShadow: "5px 5px 10px rgba(0,0,0,0.05), -5px -5px 10px #ffffff",
                          border: "1px solid rgba(75, 178, 246, 0.2)"
                        }}
                      >
                        <div className="p-3 rounded-full mr-4 flex items-center justify-center"
                          style={{
                            background: "linear-gradient(145deg, #4BB2F6, #004AC8)",
                            boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.3), 3px 3px 6px rgba(0,0,0,0.1)"
                          }}
                        >
                          <FiMail className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-medium uppercase tracking-wider text-[#004AC8]">Email</div>
                          <div className="text-sm font-semibold text-gray-800 mt-1 truncate">
                            {selectedProspect.email}
                          </div>
                        </div>
                        <motion.button 
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.95 }}
                          className="ml-auto p-2 rounded-lg text-[#004AC8] hover:bg-[#004AC8] hover:text-white transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Envoyer un email à ${selectedProspect.email}`);
                          }}
                          style={{
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                          }}
                        >
                          <FiMail className="w-4 h-4" />
                        </motion.button>
                      </motion.div>
                      
                      <motion.div 
                        className="flex items-center p-4 rounded-xl shadow-sm transition-all duration-300"
                        whileHover={{ y: -5, scale: 1.02 }}
                        style={{
                          background: "linear-gradient(145deg, #f2f0ff, #e8e6ff)",
                          boxShadow: "5px 5px 10px rgba(0,0,0,0.05), -5px -5px 10px #ffffff",
                          border: "1px solid rgba(0, 74, 200, 0.2)"
                        }}
                      >
                        <div className="p-3 rounded-full mr-4 flex items-center justify-center"
                          style={{
                            background: "linear-gradient(145deg, #1B0353, #004AC8)",
                            boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.3), 3px 3px 6px rgba(0,0,0,0.1)"
                          }}
                        >
                          <FiPhone className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-xs font-medium uppercase tracking-wider text-[#1B0353]">Téléphone Mobile</div>
                          <div className="text-sm font-semibold text-gray-800 mt-1">{selectedProspect.mobilePhoneNumber}</div>
                        </div>
                        <motion.button 
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.95 }}
                          className="ml-auto p-2 rounded-lg text-[#1B0353] hover:bg-[#1B0353] hover:text-white transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Appeler ${selectedProspect.mobilePhoneNumber}`);
                          }}
                          style={{
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                          }}
                        >
                          <FiPhone className="w-4 h-4" />
                        </motion.button>
                      </motion.div>
                      
                      <motion.div 
                        className="flex items-center p-4 rounded-xl shadow-sm transition-all duration-300"
                        whileHover={{ y: -5, scale: 1.02 }}
                        style={{
                          background: "linear-gradient(145deg, #f5f0ff, #efe6ff)",
                          boxShadow: "5px 5px 10px rgba(0,0,0,0.05), -5px -5px 10px #ffffff",
                          border: "1px solid rgba(27, 3, 83, 0.2)"
                        }}
                      >
                        <div className="p-3 rounded-full mr-4 flex items-center justify-center"
                          style={{
                            background: "linear-gradient(145deg, #004AC8, #1B0353)",
                            boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.3), 3px 3px 6px rgba(0,0,0,0.1)"
                          }}
                        >
                          <FiPhone className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-xs font-medium uppercase tracking-wider text-[#004AC8]">Téléphone Fixe</div>
                          <div className="text-sm font-semibold text-gray-800 mt-1">{selectedProspect.phoneNumber}</div>
                        </div>
                        <motion.button 
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.95 }}
                          className="ml-auto p-2 rounded-lg text-[#004AC8] hover:bg-[#004AC8] hover:text-white transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Appeler ${selectedProspect.phoneNumber}`);
                          }}
                          style={{
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                          }}
                        >
                          <FiPhone className="w-4 h-4" />
                        </motion.button>
                      </motion.div>
                      
                      <motion.div 
                        className="flex items-center p-4 rounded-xl shadow-sm transition-all duration-300"
                        whileHover={{ y: -5, scale: 1.02 }}
                        style={{
                          background: "linear-gradient(145deg, #f0f9ff, #e6f7ff)",
                          boxShadow: "5px 5px 10px rgba(0,0,0,0.05), -5px -5px 10px #ffffff",
                          border: "1px solid rgba(75, 178, 246, 0.2)"
                        }}
                      >
                        <div className="p-3 rounded-full mr-4 flex items-center justify-center"
                          style={{
                            background: "linear-gradient(145deg, #4BB2F6, #004AC8)",
                            boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.3), 3px 3px 6px rgba(0,0,0,0.1)"
                          }}
                        >
                          <FiMapPin className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-medium uppercase tracking-wider text-[#004AC8]">Adresse</div>
                          <div className="text-sm font-semibold text-gray-800 mt-1">{selectedProspect.address}, {selectedProspect.zipCode} {selectedProspect.city}, {selectedProspect.country}</div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-lg font-bold mb-4 text-indigo-900 flex items-center">
                      <div className="p-2 rounded-lg bg-indigo-100 mr-3 shadow-sm">
                        <FiBriefcase className="text-indigo-600 w-5 h-5" />
                      </div>
                      Informations additionnelles
                    </h3>
                    
                    <div className="space-y-4">
                      <motion.div 
                        className="p-4 rounded-xl shadow-sm transition-all duration-300"
                        whileHover={{ y: -5, scale: 1.02 }}
                        style={{
                          background: "linear-gradient(145deg, #fff9e6, #fff5d6)",
                          boxShadow: "5px 5px 10px rgba(0,0,0,0.05), -5px -5px 10px #ffffff",
                          border: "1px solid rgba(251, 191, 36, 0.2)"
                        }}
                      >
                        <div className="text-xs font-medium text-amber-700 uppercase tracking-wide">Description</div>
                        <div className="text-sm font-medium text-gray-800 mt-2 italic">&quot;{selectedProspect.description}&quot;</div>
                      </motion.div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <motion.div 
                          className="p-4 rounded-xl shadow-sm transition-all duration-300"
                          whileHover={{ y: -5, scale: 1.02 }}
                          style={{
                            background: "linear-gradient(145deg, #f0f9ff, #e6f7ff)",
                            boxShadow: "5px 5px 10px rgba(0,0,0,0.05), -5px -5px 10px #ffffff",
                            border: "1px solid rgba(75, 178, 246, 0.2)"
                          }}
                        >
                          <div className="text-xs font-medium text-cyan-700 uppercase tracking-wide">Assigné à</div>
                          <div className="mt-2 flex items-center">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 shadow-sm"
                              style={{ background: "linear-gradient(45deg, #4BB2F6, #004AC8)" }}
                            >
                              {getInitials(selectedProspect.assignedTo.split(' ')[0], selectedProspect.assignedTo.split(' ')[1] || '')}
                            </div>
                            <div className="text-sm font-semibold text-gray-800">{selectedProspect.assignedTo}</div>
                          </div>
                        </motion.div>
                        
                        <motion.div className="p-4 rounded-xl shadow-sm transition-all duration-300"
                          whileHover={{ y: -5, scale: 1.02 }}
                          style={{
                          background: "linear-gradient(145deg, #f2f0ff, #e8e6ff)",
                          boxShadow: "5px 5px 10px rgba(0,0,0,0.05), -5px -5px 10px #ffffff",
                          border: "1px solid rgba(124, 58, 237, 0.2)"
                          }}
                          >
                          <div className="text-xs font-medium text-violet-700 uppercase tracking-wide">ID Prospect</div>
                          <div className="text-sm font-mono font-semibold text-gray-800 mt-2 bg-violet-100 py-1 px-2 rounded inline-block">{selectedProspect.id}</div>
                        </motion.div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <motion.div 
                          className="p-4 rounded-xl shadow-sm transition-all duration-300"
                          whileHover={{ y: -5, scale: 1.02 }}
                          style={{
                            background: "linear-gradient(145deg, #fff0f0, #ffe6e6)",
                            boxShadow: "5px 5px 10px rgba(0,0,0,0.05), -5px -5px 10px #ffffff",
                            border: "1px solid rgba(244, 63, 94, 0.2)"
                          }}
                        >
                          <div className="text-xs font-medium text-rose-700 uppercase tracking-wide">Créé le</div>
                          <div className="text-sm font-semibold text-gray-800 mt-2">{selectedProspect.createdAt}</div>
                        </motion.div>
                        
                        <motion.div 
                          className="p-4 rounded-xl shadow-sm transition-all duration-300"
                          whileHover={{ y: -5, scale: 1.02 }}
                          style={{
                            background: "linear-gradient(145deg, #fdf0ff, #f8e6ff)",
                            boxShadow: "5px 5px 10px rgba(0,0,0,0.05), -5px -5px 10px #ffffff",
                            border: "1px solid rgba(217, 70, 239, 0.2)"
                          }}
                        >
                          <div className="text-xs font-medium text-fuchsia-700 uppercase tracking-wide">Mise à jour</div>
                          <div className="text-sm font-semibold text-gray-800 mt-2">{selectedProspect.updatedAt}</div>
                        </motion.div>
                      </div>
                      
                      <motion.div 
                        className="p-4 rounded-xl shadow-sm transition-all duration-300"
                        whileHover={{ y: -5, scale: 1.02 }}
                        style={{
                          background: "linear-gradient(145deg, #f0fff4, #e6ffe9)",
                          boxShadow: "5px 5px 10px rgba(0,0,0,0.05), -5px -5px 10px #ffffff",
                          border: "1px solid rgba(52, 211, 153, 0.2)"
                        }}
                      >
                        <div className="text-xs font-medium text-emerald-700 uppercase tracking-wide">Dernier contact</div>
                        <div className="flex items-center mt-2">
                          <div 
                            className="w-3 h-3 rounded-full mr-2 shadow-sm" 
                            style={{ backgroundColor: getStatusColor(selectedProspect.lastContactDate) }}
                          />
                          <span className="text-sm font-semibold text-gray-800">{selectedProspect.lastContactDate}</span>
                          
                          <div className="ml-auto flex gap-1">
                            {selectedProspect.tags.map((tag, index) => (
                              <span 
                                key={index} 
                                className="px-2 py-1 text-xs rounded-full text-white font-medium shadow-sm" 
                                style={{ backgroundColor: getTagColor(tag) }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </div>
              
              {/* Modal Footer */}
              <div className="border-t p-4 flex justify-between items-center bg-gray-50">
                <div className="flex space-x-2">
                  <button 
                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Supprimer ${selectedProspect.firstName} ?`);
                    }}
                  >
                    <FiTrash2 className="mr-2" />
                    <span>Supprimer</span>
                  </button>
                  
                  <button 
                    className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Appeler ${selectedProspect.firstName} au ${selectedProspect.mobilePhoneNumber}`);
                    }}
                  >
                    <FiPhone className="mr-2" />
                    <span>Appeler</span>
                  </button>
                  
                  <button 
                    className="px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition text-sm flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Envoyer un email à ${selectedProspect.email}`);
                    }}
                  >
                    <FiMail className="mr-2" />
                    <span>Email</span>
                  </button>
                </div>
                
                <div className="flex space-x-2">
                  <motion.button 
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className={`px-4 py-2 rounded-lg text-sm flex items-center ${
                      conversionSuccess[selectedProspect.id] 
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-gradient-to-r from-[#004AC8] to-[#1B0353] text-white"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConvertToClient(selectedProspect.id);
                    }}
                    disabled={conversionSuccess[selectedProspect.id]}
                  >
                    {conversionSuccess[selectedProspect.id] ? (
                      <>
                        <FiCheck className="mr-2" />
                        <span>Converti en client</span>
                      </>
                    ) : (
                      <>
                        <FiUserCheck className="mr-2" />
                        <span>Transformer en client</span>
                      </>
                    )}
                  </motion.button>
                
                  <button 
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Éditer les informations de ${selectedProspect.firstName}`);
                    }}
                  >
                    <FiEdit className="mr-2" />
                    <span>Modifier</span>
                  </button>
                </div>
              </div>

              {/* Add a prominent "Voir fiche complète" button as a sticky element at bottom */}
              <div className="sticky bottom-0 left-0 right-0 p-4 bg-white bg-opacity-90 backdrop-blur-sm border-t border-gray-100 flex justify-center shadow-lg">
                <Link 
                  href={`/dashboard/crm/prospects/${selectedProspect.id}`}
                  passHref
                  legacyBehavior
                >
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 rounded-lg font-bold text-white flex items-center gap-2 w-full max-w-md"
                    style={{
                      background: "linear-gradient(135deg, #4BB2F6, #004AC8, #1B0353)"
                    }}
                    onClick={() => {
                      // Close the modal when navigating to the detail page
                      closeQuickView();
                    }}
                  >
                    <span className="mx-auto flex items-center">
                      Voir fiche complète
                      <FiArrowRight className="ml-2" />
                    </span>
                  </motion.a>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </motion.div>
  );
}
