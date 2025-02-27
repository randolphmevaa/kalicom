'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiDownload,
  FiChevronDown,
  FiChevronUp,
  FiSearch,
  FiPhoneMissed,
  FiArrowUpRight,
  FiArrowDownRight,
  FiUser,
} from 'react-icons/fi';

// ------------------ Data Types ------------------
interface CallLog {
  id: number;
  direction: 'Entrant' | 'Sortant' | 'Interne';
  extensionUser: string; 
  callerName: string;
  debut: string; // e.g. 'YYYY-MM-DD HH:mm'
  fin: string;   // e.g. 'YYYY-MM-DD HH:mm'
  monNumero: string;
  numeroDuContact: string;
  dureeAppel: number; // in seconds
  tta: number; // time to answer in seconds
  enregistrement: boolean;
  du: string;
  vers: string;
  cost: number;
  statut: 'Répondu' | 'Échoué' | 'Annulé' | 'Messagerie vocale';
}

// Example logs
const sampleLogs: CallLog[] = [
  {
    id: 1,
    direction: 'Sortant',
    extensionUser: '101',
    callerName: 'Alice',
    debut: '2023-10-01 09:00',
    fin: '2023-10-01 09:05',
    monNumero: '+33 1 23 45 67 89',
    numeroDuContact: '+33 6 54 32 10 98',
    dureeAppel: 300,
    tta: 15,
    enregistrement: true,
    du: 'SIP/ProviderA',
    vers: 'SIP/Trunk1',
    cost: 0.24,
    statut: 'Répondu',
  },
  {
    id: 2,
    direction: 'Entrant',
    extensionUser: '102',
    callerName: 'Bob',
    debut: '2023-10-01 10:15',
    fin: '2023-10-01 10:16',
    monNumero: '+33 1 98 76 54 32',
    numeroDuContact: '+33 1 55 66 77 88',
    dureeAppel: 60,
    tta: 10,
    enregistrement: false,
    du: 'SIP/ProviderB',
    vers: 'SIP/Trunk1',
    cost: 0,
    statut: 'Échoué',
  },
  {
    id: 3,
    direction: 'Interne',
    extensionUser: '103',
    callerName: 'Service Tech',
    debut: '2023-10-01 11:30',
    fin: '2023-10-01 11:32',
    monNumero: '103',
    numeroDuContact: '101',
    dureeAppel: 120,
    tta: 5,
    enregistrement: true,
    du: 'Local/103',
    vers: 'Local/101',
    cost: 0,
    statut: 'Annulé',
  },
];

// Example extension dropdown options
const extensionOptions = [
  { value: '', label: 'Toutes' },
  { value: '101', label: '101 (Support)' },
  { value: '102', label: '102 (Sales)' },
  { value: '103', label: '103 (Admin)' },
];

// ------------------ Main Component ------------------
export default function JournalAppelsEnregistrements() {
  // The call logs
  const [logs] = useState<CallLog[]>(sampleLogs);

  // ------------------ Filter States ------------------
  const [searchParams, setSearchParams] = useState({
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
  const [showAdvanced, setShowAdvanced] = useState(false);

  // --------------- Handlers ---------------
  const handleChange = (field: string, value: string) => {
    setSearchParams((prev) => ({ ...prev, [field]: value }));
  };

  const handleFilter = () => {
    // Implement your filtering logic or call an API
    console.log('Filtering with:', searchParams);
  };

  const handleReset = () => {
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
  };

  // ------------------ JSX ------------------
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen"
    >
      <div className="max-w-7xl mx-auto space-y-8 px-4 md:px-0">
        {/* ========== Header ========== */}
        <div className="relative overflow-hidden bg-white/80 rounded-3xl shadow-2xl border border-gray-100 p-8">
          {/* Soft gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#004AC8]/10 to-[#4BB2F6]/10 rounded-3xl pointer-events-none" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-[#1B0353]">
                Journal d&apos;appels & enregistrements
              </h1>
              <p className="text-sm text-gray-600 mt-1 max-w-lg">
                Consultez, filtrez et exportez l&apos;historique de vos appels.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#004AC8] text-white rounded-xl font-semibold hover:bg-[#003DA8] transition-colors"
                title="Exporter en CSV"
              >
                <FiDownload className="w-5 h-5" />
                Exporter en CSV
              </button>
              <button
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#4BB2F6] text-white rounded-xl font-semibold hover:bg-[#3AA1E6] transition-colors"
                title="Exporter en PDF"
              >
                <FiDownload className="w-5 h-5" />
                Exporter en PDF
              </button>
            </div>
          </div>
        </div>

        {/* ========== Filters ========== */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 space-y-4">
          {/* Basic Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Direction */}
            <div className="flex flex-col">
              <label htmlFor="direction" className="text-sm text-gray-700 mb-1">
                Direction
              </label>
              <select
                id="direction"
                value={searchParams.direction}
                onChange={(e) => handleChange('direction', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#004AC8]/20 text-gray-800"
              >
                <option value="">Toutes</option>
                <option value="Entrant">Entrant</option>
                <option value="Sortant">Sortant</option>
                <option value="Interne">Interne</option>
              </select>
            </div>

            {/* Date */}
            <div className="flex flex-col">
              <label htmlFor="date" className="text-sm text-gray-700 mb-1">
                Date
              </label>
              <input
                id="date"
                type="date"
                value={searchParams.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#004AC8]/20 text-gray-800"
              />
            </div>

            {/* Mon numéro */}
            <div className="flex flex-col">
              <label htmlFor="monNumero" className="text-sm text-gray-700 mb-1">
                Mon numéro
              </label>
              <input
                id="monNumero"
                type="text"
                value={searchParams.monNumero}
                onChange={(e) => handleChange('monNumero', e.target.value)}
                placeholder="Ex: +33 1 23 45 67 89"
                className="px-3 py-2 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#004AC8]/20 text-gray-800"
              />
            </div>

            {/* Numéro du contact */}
            <div className="flex flex-col">
              <label
                htmlFor="numeroDuContact"
                className="text-sm text-gray-700 mb-1"
              >
                Numéro du contact
              </label>
              <input
                id="numeroDuContact"
                type="text"
                value={searchParams.numeroDuContact}
                onChange={(e) => handleChange('numeroDuContact', e.target.value)}
                placeholder="Ex: +33 6 54 32 10 98"
                className="px-3 py-2 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#004AC8]/20 text-gray-800"
              />
            </div>
          </div>

          {/* Advanced Toggle */}
          <div className="flex items-center">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="inline-flex items-center gap-2 py-2 px-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              <FiSearch className="w-5 h-5" />
              Avancé
              {showAdvanced ? (
                <FiChevronUp className="w-5 h-5" />
              ) : (
                <FiChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Advanced Filters (AnimatePresence for smooth show/hide) */}
          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                  {/* Statut */}
                  <div className="flex flex-col">
                    <label htmlFor="statut" className="text-sm text-gray-700 mb-1">
                      Statut
                    </label>
                    <select
                      id="statut"
                      value={searchParams.statut}
                      onChange={(e) => handleChange('statut', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#004AC8]/20 text-gray-800"
                    >
                      <option value="">Tous</option>
                      <option value="Répondu">Répondu</option>
                      <option value="Échoué">Échoué</option>
                      <option value="Annulé">Annulé</option>
                      <option value="Messagerie vocale">Messagerie vocale</option>
                    </select>
                  </div>

                  {/* Extension (Utilisateur) as dropdown */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="extensionUser"
                      className="text-sm text-gray-700 mb-1"
                    >
                      Extension (Utilisateur)
                    </label>
                    <select
                      id="extensionUser"
                      value={searchParams.extensionUser}
                      onChange={(e) =>
                        handleChange('extensionUser', e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#004AC8]/20 text-gray-800"
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
                    <label className="text-sm text-gray-700 mb-1">
                      Durée de l&apos;appel (sec) (Min - Max)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min={0}
                        placeholder="Min"
                        value={searchParams.minDureeSec}
                        onChange={(e) =>
                          handleChange('minDureeSec', e.target.value)
                        }
                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#004AC8]/20 text-gray-800"
                      />
                      <input
                        type="number"
                        min={0}
                        placeholder="Max"
                        value={searchParams.maxDureeSec}
                        onChange={(e) =>
                          handleChange('maxDureeSec', e.target.value)
                        }
                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#004AC8]/20 text-gray-800"
                      />
                    </div>
                  </div>

                  {/* Call name */}
                  <div className="flex flex-col">
                    <label htmlFor="callName" className="text-sm text-gray-700 mb-1">
                      Call name
                    </label>
                    <input
                      id="callName"
                      type="text"
                      placeholder="Ex: SupportCall"
                      value={searchParams.callName}
                      onChange={(e) => handleChange('callName', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#004AC8]/20 text-gray-800"
                    />
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
              className="px-5 py-2.5 bg-[#004AC8] text-white rounded-xl font-semibold hover:bg-[#003DA8] transition-colors"
            >
              Appliquer le filtre
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReset}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Réinitialiser
            </motion.button>
          </div>
        </div>

        {/* ========== Legend Section ========== */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-gray-800">
            {/* Status Legend */}
            <div>
              <h2 className="text-sm font-semibold mb-3 text-gray-900">
                Légende Statuts
              </h2>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-gray-900">Répondu</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-gray-900">Échoué</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-400" />
                  <span className="text-gray-900">Annulé</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-600" />
                  <span className="text-gray-900">Messagerie vocale</span>
                </div>
              </div>
            </div>

            {/* Direction Legend */}
            <div>
              <h2 className="text-sm font-semibold mb-3 text-gray-900">
                Légende Directions
              </h2>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <FiArrowUpRight className="w-4 h-4 text-[#004AC8]" />
                  <span className="text-gray-900">Appels sortants</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiArrowDownRight className="w-4 h-4 text-green-600" />
                  <span className="text-gray-900">Appels entrants</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiUser className="w-4 h-4 text-purple-600" />
                  <span className="text-gray-900">Internes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========== Table Section ========== */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gradient-to-r from-[#004AC8]/5 to-[#4BB2F6]/5 text-gray-900">
                <tr>
                  {[
                    'Direction',
                    'Extension (Utilisateur)',
                    'Caller name',
                    'Début',
                    'Fin',
                    'Mon numéro',
                    'Numéro du contact',
                    "Durée de l'appel",
                    'TTA',
                    'Enregistrement',
                    'Du',
                    'Vers',
                    'Cost',
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-sm font-semibold first:rounded-tl-xl last:rounded-tr-xl"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/80 text-sm">
                {logs.map((log) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: '#f8fafc' }}
                    className="group transition-colors"
                  >
                    {/* Direction */}
                    <td className="px-4 py-3 font-medium text-gray-700">
                      <div className="flex items-center gap-2">
                        {log.direction === 'Sortant' && (
                          <FiArrowUpRight className="w-4 h-4 text-[#004AC8]" />
                        )}
                        {log.direction === 'Entrant' && (
                          <FiArrowDownRight className="w-4 h-4 text-green-600" />
                        )}
                        {log.direction === 'Interne' && (
                          <FiUser className="w-4 h-4 text-purple-600" />
                        )}
                        <span>{log.direction}</span>
                      </div>
                    </td>
                    {/* Extension (Utilisateur) */}
                    <td className="px-4 py-3 text-gray-700">{log.extensionUser}</td>
                    {/* Caller name */}
                    <td className="px-4 py-3 text-gray-700">{log.callerName}</td>
                    {/* Début */}
                    <td className="px-4 py-3 text-gray-700">{log.debut}</td>
                    {/* Fin */}
                    <td className="px-4 py-3 text-gray-700">{log.fin}</td>
                    {/* Mon numéro */}
                    <td className="px-4 py-3 text-gray-700">{log.monNumero}</td>
                    {/* Numéro du contact */}
                    <td className="px-4 py-3 text-gray-700">
                      {log.numeroDuContact}
                    </td>
                    {/* Durée de l'appel */}
                    <td className="px-4 py-3 text-gray-700">
                      {log.dureeAppel} sec
                    </td>
                    {/* TTA */}
                    <td className="px-4 py-3 text-gray-700">{log.tta} sec</td>
                    {/* Enregistrement */}
                    <td className="px-4 py-3 text-gray-700">
                      {log.enregistrement ? (
                        <div className="inline-flex items-center gap-1.5 text-green-600">
                          <FiPhoneMissed className="w-4 h-4 rotate-90" />
                          <span>Oui</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Non</span>
                      )}
                    </td>
                    {/* Du */}
                    <td className="px-4 py-3 text-gray-700">{log.du}</td>
                    {/* Vers */}
                    <td className="px-4 py-3 text-gray-700">{log.vers}</td>
                    {/* Cost */}
                    <td className="px-4 py-3 text-gray-700">
                      {log.cost.toFixed(2)} €
                    </td>
                  </motion.tr>
                ))}

                {/* If no logs found */}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={13} className="py-8 text-center text-gray-600">
                      Aucun appel trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
