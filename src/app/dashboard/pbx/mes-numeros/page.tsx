'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiPlus,
  FiTrash2,
  FiEdit,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  // FiX,
} from 'react-icons/fi';

interface Numero {
  id: number;
  destination: string;
  nom: string;
  pays: string;
  active: boolean;
  action: string;
  description: string;
  linesUsed?: number[]; 
}

// Sample lines for multi-select
interface LineOption {
  id: number;
  number: string;
}

// --------------- SAMPLE DATA ---------------
const sampleLines: LineOption[] = [
  { id: 1, number: '+33 1 23 45 67 89' },
  { id: 2, number: '+33 1 98 76 54 32' },
  { id: 3, number: '+33 6 11 22 33 44' },
  { id: 4, number: '+44 20 1234 5678' },
];

const initialNumeros: Numero[] = [
  {
    id: 1,
    destination: '+33 1 23 45 67 89',
    nom: 'Numéro principal',
    pays: 'France',
    active: true,
    action: 'Renvoi vers IP',
    description: 'Numéro utilisé pour les appels entrants principaux.',
    linesUsed: [1],
  },
  {
    id: 2,
    destination: '+44 20 1234 5678',
    nom: 'London Office',
    pays: 'Royaume-Uni',
    active: false,
    action: 'Bloqué temporairement',
    description: 'Numéro inactif en attente de réactivation.',
    linesUsed: [3],
  },
  {
    id: 3,
    destination: '+33 6 98 76 54 32',
    nom: 'Portable équipe',
    pays: 'France',
    active: true,
    action: 'Renvoi vers GSM',
    description: 'Numéro dédié aux déplacements commerciaux.',
    linesUsed: [1, 2],
  },
  {
    id: 4,
    destination: '+39 06 1234 5678',
    nom: 'Italie Bureau',
    pays: 'Italie',
    active: true,
    action: 'Renvoi vers IP',
    description: 'Numéro local italien pour le bureau de Rome.',
    linesUsed: [],
  },
];

// --------------- MAIN PAGE COMPONENT ---------------
export default function MesNumeros() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLines, setSelectedLines] = useState<number[]>([]);
  const [numeros,  ] = useState<Numero[]>(initialNumeros);

  // Sorting config
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Numero | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  // Filter states
  const [showLinesDropdown, setShowLinesDropdown] = useState(false);

  // Derived data
  const totalNumeros = numeros.length;
  const activeNumeros = numeros.filter((n) => n.active).length;
  const inactiveNumeros = numeros.filter((n) => !n.active).length;

  // ----------------- FILTER & SEARCH -----------------
  const filteredNumeros = numeros
    .filter((num) => {
      // Search filter
      const matchSearch =
        num.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        num.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        num.pays.toLowerCase().includes(searchQuery.toLowerCase());

      // LinesUsed filter: if selectedLines is not empty, we only show those containing any selected line
      const matchLines =
        selectedLines.length === 0 ||
        selectedLines.some((lineId) => num.linesUsed?.includes(lineId));

      return matchSearch && matchLines;
    })
    .sort((a, b) => {
      // Sorting
      if (!sortConfig.key) return 0;
      const isAsc = sortConfig.direction === 'asc';
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];

      // Convert non-string fields to strings if needed
      if (typeof valA === 'boolean') valA = valA ? 'true' : 'false';
      if (typeof valB === 'boolean') valB = valB ? 'true' : 'false';
      if (typeof valA === 'number') valA = valA.toString();
      if (typeof valB === 'number') valB = valB.toString();

      return isAsc
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });

  // Handle sort
  const handleSort = (key: keyof Numero) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Reset filters
  const handleReset = () => {
    setSearchQuery('');
    setSelectedLines([]);
  };

  // --------------------------------------------------------------------
  // UI RENDER
  // --------------------------------------------------------------------
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ---------- HEADER ---------- */}
        <div className="relative mb-8 overflow-hidden backdrop-blur-sm bg-white/80 rounded-3xl shadow-2xl border border-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-[#004AC8]/10 to-[#4BB2F6]/10 rounded-3xl pointer-events-none" />
          <div className="relative flex justify-between items-center p-8">
            <div>
              <h1 className="text-3xl font-bold text-[#1B0353]">Gestion des Numéros</h1>
              <p className="text-sm text-gray-500 mt-1">
                Gérez et suivez tous vos numéros téléphoniques
              </p>
            </div>
            <div className="flex space-x-4">
              <button className="p-2 hover:bg-gray-200 rounded-xl transition" title="Ajouter un numéro">
                <FiPlus className="text-[#1B0353] w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* ---------- STATS CARDS (OPTIONAL) ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div
            whileHover={{ scale: 1.03, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)' }}
            className="bg-gradient-to-br from-[#1B0353] to-[#004AC8] p-6 rounded-3xl shadow-lg backdrop-blur-md text-white"
          >
            <div className="flex items-center">
              <FiCheckCircle className="w-10 h-10 mr-4" />
              <div>
                <p className="text-sm font-medium">Total Numéros</p>
                <p className="text-3xl font-extrabold">{totalNumeros}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)' }}
            className="bg-gradient-to-br from-[#004AC8] to-[#4BB2F6] p-6 rounded-3xl shadow-lg backdrop-blur-md text-white"
          >
            <div className="flex items-center">
              <FiCheckCircle className="w-10 h-10 mr-4" />
              <div>
                <p className="text-sm font-medium">Numéros Actifs</p>
                <p className="text-3xl font-extrabold">{activeNumeros}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)' }}
            className="bg-gradient-to-br from-[#4BB2F6] to-[#1B0353] p-6 rounded-3xl shadow-lg backdrop-blur-md text-white"
          >
            <div className="flex items-center">
              <FiXCircle className="w-10 h-10 mr-4" />
              <div>
                <p className="text-sm font-medium">Numéros Inactifs</p>
                <p className="text-3xl font-extrabold">{inactiveNumeros}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ---------- FILTERS SECTION ---------- */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          {/* Search + Multi Select + Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-center">
            {/* Search Bar */}
            <div className="relative col-span-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                <FiSearch className="w-5 h-5 text-[#1B0353]/80" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Chercher..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#004AC8] focus:ring-2 focus:ring-[#004AC8]/20 transition-all duration-200 text-gray-800 placeholder-gray-400"
              />
            </div>

            {/* Multi-select: "Numéro utilisé par la ligne :" */}
            <div className="relative col-span-1">
              <div className="font-medium text-gray-700 mb-1">
                Numéro utilisé par la ligne :
              </div>
              <div
                className="select-none cursor-pointer relative bg-gray-50 border-2 border-gray-200 rounded-xl py-2.5 px-4 flex items-center justify-between"
                onClick={() => setShowLinesDropdown((prev) => !prev)}
              >
                <span className="text-gray-700 text-sm">
                  {selectedLines.length === 0
                    ? 'Toutes les lignes'
                    : `Lignes sélectionnées (${selectedLines.length})`}
                </span>
                {showLinesDropdown ? (
                  <FiChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <FiChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </div>

              {/* Dropdown for lines */}
              {showLinesDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-auto"
                >
                  {sampleLines.map((line) => {
                    const isSelected = selectedLines.includes(line.id);
                    return (
                      <div
                        key={line.id}
                        className={`px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer ${
                          isSelected ? 'bg-gray-100' : ''
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLines((prev) =>
                            isSelected
                              ? prev.filter((x) => x !== line.id)
                              : [...prev, line.id]
                          );
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          readOnly
                          className="mr-2 w-4 h-4 text-[#004AC8] border-gray-300 rounded focus:ring-[#004AC8]"
                        />
                        <span className="text-sm text-gray-700">{line.number}</span>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-3 justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
              >
                Réinitialiser
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 bg-[#004AC8] text-white rounded-xl font-medium hover:bg-[#003DA8]"
              >
                Appliquer le filtre
              </motion.button>
            </div>
          </div>
        </div>

        {/* ---------- TABLE SECTION ---------- */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full">
              {/* Table Header */}
              <thead className="bg-gradient-to-r from-[#004AC8]/5 to-[#4BB2F6]/5">
                <tr>
                  {[
                    'Destination',
                    'Nom',
                    'Pays',
                    'Activé',
                    'Action',
                    'Description',
                    'Actions',
                  ].map((header, idx) => (
                    <th
                      key={header}
                      className={`px-6 py-4 text-left text-sm font-semibold text-[#1B0353] ${
                        idx === 0 ? 'rounded-tl-xl' : idx === 6 ? 'rounded-tr-xl' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {header}
                        {/* Enable sorting on certain columns, e.g., Destination, Nom, Pays, Activé */}
                        {['Destination', 'Nom', 'Pays', 'Activé'].includes(header) && (
                          <button
                            onClick={() =>
                              handleSort(
                                header === 'Destination'
                                  ? 'destination'
                                  : header === 'Nom'
                                  ? 'nom'
                                  : header === 'Pays'
                                  ? 'pays'
                                  : 'active'
                              )
                            }
                            className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            {sortConfig.key ===
                            (header === 'Destination'
                              ? 'destination'
                              : header === 'Nom'
                              ? 'nom'
                              : header === 'Pays'
                              ? 'pays'
                              : 'active')
                              ? sortConfig.direction === 'asc'
                                ? (
                                  <FiChevronUp className="w-4 h-4 text-[#004AC8]" />
                                ) : (
                                  <FiChevronDown className="w-4 h-4 text-[#004AC8]" />
                                )
                              : (
                                <FiChevronDown className="w-4 h-4 text-gray-400" />
                              )}
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-200/80">
                {filteredNumeros.map((num) => (
                  <motion.tr
                    key={num.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: '#f8fafc' }}
                    className="group transition-colors"
                  >
                    {/* Destination */}
                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                      {num.destination}
                    </td>
                    {/* Nom */}
                    <td className="px-6 py-4 text-sm text-gray-700">{num.nom}</td>
                    {/* Pays */}
                    <td className="px-6 py-4 text-sm text-gray-700">{num.pays}</td>
                    {/* Activé */}
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center gap-1.5"
                      >
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            num.active ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        />
                        <span
                          className={`px-3 py-1.5 text-sm font-medium rounded-full ${
                            num.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {num.active ? 'Oui' : 'Non'}
                        </span>
                      </motion.div>
                    </td>
                    {/* Action */}
                    <td className="px-6 py-4 text-sm text-gray-700">{num.action}</td>
                    {/* Description */}
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {num.description}
                    </td>
                    {/* Actions Buttons */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                          title="Modifier"
                        >
                          <FiEdit className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 hover:bg-green-100 rounded-lg text-green-600 transition-colors"
                          title="Réinitialiser"
                        >
                          <FiRefreshCw className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                          title="Supprimer"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}

                {/* Empty State */}
                {filteredNumeros.length === 0 && (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <td
                      colSpan={7}
                      className="py-12 text-center text-gray-600 font-medium"
                    >
                      Aucun numéro trouvé avec ces critères
                    </td>
                  </motion.tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
