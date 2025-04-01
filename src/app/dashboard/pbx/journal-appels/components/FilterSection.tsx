import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  FiFilter,
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiCornerUpRight,
  FiCalendar,
  FiPhone,
  FiInfo,
  FiHash,
  FiClock,
  FiVolume2,
  FiRefreshCw
} from 'react-icons/fi';

// Define interfaces for our types
interface DropdownOption {
  value: string;
  label: string;
}

// Define the shape of searchParams
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
  enregistrement?: string; // Optional as it doesn't seem to be directly used in searchParams
}

// Define the props for FilterSection
interface FilterSectionProps {
  searchParams: SearchParams;
  handleChange: (field: string, value: string) => void;
  handleReset: () => void;
  showAdvanced: boolean;
  setShowAdvanced: React.Dispatch<React.SetStateAction<boolean>>;
  itemVariants: Variants;
}

// Status options for dropdown
const statusOptions: DropdownOption[] = [
  { value: '', label: 'Tous' },
  { value: 'Répondu', label: 'Répondu' },
  { value: 'Échoué', label: 'Échoué' },
  { value: 'Annulé', label: 'Annulé' },
  { value: 'Messagerie vocale', label: 'Messagerie vocale' },
];

// Direction options for dropdown
const directionOptions: DropdownOption[] = [
  { value: '', label: 'Toutes' },
  { value: 'Entrant', label: 'Entrant' },
  { value: 'Sortant', label: 'Sortant' },
  { value: 'Interne', label: 'Interne' },
];

// Example extension dropdown options
const extensionOptions: DropdownOption[] = [
  { value: '', label: 'Toutes' },
  { value: '101', label: '101 (Support)' },
  { value: '102', label: '102 (Commercial)' },
  { value: '103', label: '103 (Administration)' },
  { value: '104', label: '104 (Direction)' },
  { value: '105', label: '105 (Technique)' },
];

const FilterSection: React.FC<FilterSectionProps> = ({ 
  searchParams, 
  handleChange, 
  handleReset, 
  showAdvanced, 
  setShowAdvanced,
  itemVariants 
}) => {
  
  const handleFilter = (): void => {
    // Filter is applied automatically through the filteredLogs calculation
    console.log('Filtering with:', searchParams);
  };
  
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <h3 className="text-lg font-semibold text-[#1B0353] flex items-center gap-2">
          <FiFilter className="text-[#004AC8]" />
          Filtres
        </h3>
        
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
            <FiSearch className="w-5 h-5 text-[#1B0353]/80" />
          </div>
          <input
            type="text"
            value={searchParams.callName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('callName', e.target.value)}
            placeholder="Rechercher par nom..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#004AC8] focus:ring-2 focus:ring-[#004AC8]/20 transition-all duration-200 text-gray-800 placeholder-gray-400"
          />
        </div>
      </div>
      
      {/* Basic Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Direction */}
        <div className="flex flex-col">
          <label htmlFor="direction" className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
            <FiCornerUpRight className="w-4 h-4 text-[#004AC8]" />
            Direction
          </label>
          <select
            id="direction"
            value={searchParams.direction}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange('direction', e.target.value)}
            className="px-3 py-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#004AC8]/20 focus:border-[#004AC8] text-gray-800 appearance-none"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M12 15l-4.243-4.243 1.415-1.414L12 12.172l2.828-2.829 1.415 1.414z' fill='rgba(74,85,104,1)'/%3E%3C/svg%3E\")", backgroundPosition: "right 8px center", backgroundRepeat: "no-repeat", paddingRight: "2.5rem" }}
          >
            {directionOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div className="flex flex-col">
          <label htmlFor="date" className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
            <FiCalendar className="w-4 h-4 text-[#004AC8]" />
            Date
          </label>
          <input
            id="date"
            type="date"
            value={searchParams.date}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('date', e.target.value)}
            className="px-3 py-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#004AC8]/20 focus:border-[#004AC8] text-gray-800"
          />
        </div>

        {/* Mon numéro */}
        <div className="flex flex-col">
          <label htmlFor="monNumero" className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
            <FiPhone className="w-4 h-4 text-[#004AC8]" />
            Mon numéro
          </label>
          <input
            id="monNumero"
            type="text"
            value={searchParams.monNumero}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('monNumero', e.target.value)}
            placeholder="Ex: +33 1 23 45 67 89"
            className="px-3 py-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#004AC8]/20 focus:border-[#004AC8] text-gray-800"
          />
        </div>

        {/* Numéro du contact */}
        <div className="flex flex-col">
          <label
            htmlFor="numeroDuContact"
            className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5"
          >
            <FiPhone className="w-4 h-4 text-[#004AC8]" />
            Numéro du contact
          </label>
          <input
            id="numeroDuContact"
            type="text"
            value={searchParams.numeroDuContact}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('numeroDuContact', e.target.value)}
            placeholder="Ex: +33 6 54 32 10 98"
            className="px-3 py-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#004AC8]/20 focus:border-[#004AC8] text-gray-800"
          />
        </div>
      </div>

      {/* Advanced Toggle */}
      <div className="flex items-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="inline-flex items-center gap-2 py-2 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
        >
          <FiSearch className="w-4 h-4" />
          Filtres avancés
          {showAdvanced ? (
            <FiChevronUp className="w-4 h-4" />
          ) : (
            <FiChevronDown className="w-4 h-4" />
          )}
        </motion.button>
      </div>

      {/* Advanced Filters (AnimatePresence for smooth show/hide) */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              {/* Statut */}
              <div className="flex flex-col">
                <label htmlFor="statut" className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                  <FiInfo className="w-4 h-4 text-[#004AC8]" />
                  Statut
                </label>
                <select
                  id="statut"
                  value={searchParams.statut}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange('statut', e.target.value)}
                  className="px-3 py-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#004AC8]/20 focus:border-[#004AC8] text-gray-800 appearance-none"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M12 15l-4.243-4.243 1.415-1.414L12 12.172l2.828-2.829 1.415 1.414z' fill='rgba(74,85,104,1)'/%3E%3C/svg%3E\")", backgroundPosition: "right 8px center", backgroundRepeat: "no-repeat", paddingRight: "2.5rem" }}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Extension (Utilisateur) as dropdown */}
              <div className="flex flex-col">
                <label
                  htmlFor="extensionUser"
                  className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5"
                >
                  <FiHash className="w-4 h-4 text-[#004AC8]" />
                  Extension (Utilisateur)
                </label>
                <select
                  id="extensionUser"
                  value={searchParams.extensionUser}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleChange('extensionUser', e.target.value)
                  }
                  className="px-3 py-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#004AC8]/20 focus:border-[#004AC8] text-gray-800 appearance-none"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M12 15l-4.243-4.243 1.415-1.414L12 12.172l2.828-2.829 1.415 1.414z' fill='rgba(74,85,104,1)'/%3E%3C/svg%3E\")", backgroundPosition: "right 8px center", backgroundRepeat: "no-repeat", paddingRight: "2.5rem" }}
                >
                  {extensionOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Durée de l'appel (sec) => min / max */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                  <FiClock className="w-4 h-4 text-[#004AC8]" />
                  Durée de l&apos;appel (sec)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={0}
                    placeholder="Min"
                    value={searchParams.minDureeSec}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleChange('minDureeSec', e.target.value)
                    }
                    className="w-1/2 px-3 py-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#004AC8]/20 focus:border-[#004AC8] text-gray-800"
                  />
                  <input
                    type="number"
                    min={0}
                    placeholder="Max"
                    value={searchParams.maxDureeSec}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleChange('maxDureeSec', e.target.value)
                    }
                    className="w-1/2 px-3 py-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#004AC8]/20 focus:border-[#004AC8] text-gray-800"
                  />
                </div>
              </div>

              {/* Recording */}
              <div className="flex flex-col">
                <label htmlFor="enregistrement" className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                  <FiVolume2 className="w-4 h-4 text-[#004AC8]" />
                  Enregistrement
                </label>
                <select
                  id="enregistrement"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                    handleChange('enregistrement', e.target.value)
                  }
                  className="px-3 py-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#004AC8]/20 focus:border-[#004AC8] text-gray-800 appearance-none"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M12 15l-4.243-4.243 1.415-1.414L12 12.172l2.828-2.829 1.415 1.414z' fill='rgba(74,85,104,1)'/%3E%3C/svg%3E\")", backgroundPosition: "right 8px center", backgroundRepeat: "no-repeat", paddingRight: "2.5rem" }}
                >
                  <option value="">Tous</option>
                  <option value="true">Oui</option>
                  <option value="false">Non</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Actions */}
      <div className="flex items-center gap-3 mt-4">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleFilter}
          className="px-5 py-2.5 bg-[#004AC8] text-white rounded-xl font-medium hover:bg-[#003DA8] transition-colors"
        >
          <span className="flex items-center gap-2">
            <FiFilter className="w-4 h-4" />
            Appliquer le filtre
          </span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleReset}
          className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <FiRefreshCw className="w-4 h-4" />
            Réinitialiser
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default FilterSection;