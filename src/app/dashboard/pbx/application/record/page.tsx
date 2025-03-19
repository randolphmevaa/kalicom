'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMusic,
  FiHome,
  FiChevronRight,
  FiSearch,
  // FiPlus,
  FiEdit,
  FiTrash2,
  // FiFilter,
  // FiRefreshCw,
  FiFile,
  FiFileText,
  FiDownload,
  FiClock,
  FiHardDrive,
  FiPlay,
  FiPause,
  FiUpload,
  FiInfo,
  FiVolume2
} from 'react-icons/fi';

// Types
interface Recording {
  id: number;
  name: string;
  filename: string;
  tools: string;
  size: string;
  uploadedDate: string;
  duration: string;
  format: string;
}

// Breadcrumbs component
const Breadcrumbs = ({ items }: { items: string[] }) => (
  <div className="flex items-center text-sm text-gray-600 mb-6">
    <FiHome className="mr-2 text-gray-500" />
    {items.map((item, index) => (
      <div key={index} className="flex items-center">
        {index > 0 && <FiChevronRight className="mx-2 text-gray-400" />}
        <span className={index === items.length - 1 ? "text-[#004AC8] font-medium" : ""}>{item}</span>
      </div>
    ))}
  </div>
);

// Sample recordings data
const SAMPLE_RECORDINGS: Recording[] = [
  {
    id: 1,
    name: "Message d'accueil principal",
    filename: "welcome-message.wav",
    tools: "Lecture, Pause, Télécharger",
    size: "1.2 MB",
    uploadedDate: "15/02/2023",
    duration: "00:45",
    format: "WAV, 16 bits, 8kHz"
  },
  {
    id: 2,
    name: "Message d'attente",
    filename: "hold-music-1.wav",
    tools: "Lecture, Pause, Télécharger",
    size: "3.7 MB",
    uploadedDate: "22/03/2023",
    duration: "02:15",
    format: "WAV, 16 bits, 16kHz"
  },
  {
    id: 3,
    name: "Message fermeture",
    filename: "closed-message.wav",
    tools: "Lecture, Pause, Télécharger",
    size: "780 KB",
    uploadedDate: "05/01/2023",
    duration: "00:32",
    format: "WAV, 16 bits, 8kHz"
  },
  {
    id: 4,
    name: "Musique d'attente jazz",
    filename: "jazz-hold-music.wav",
    tools: "Lecture, Pause, Télécharger",
    size: "5.2 MB",
    uploadedDate: "10/05/2023",
    duration: "03:21",
    format: "WAV, 16 bits, 16kHz"
  },
  {
    id: 5,
    name: "Message équipe absente",
    filename: "away-message.wav",
    tools: "Lecture, Pause, Télécharger",
    size: "1.5 MB",
    uploadedDate: "18/04/2023",
    duration: "00:58",
    format: "WAV, 16 bits, 8kHz"
  },
];

/**
 * Audio Player Component
 */
const AudioPlayer = ({ }: { filename: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={togglePlay}
        className="p-2 rounded-full hover:bg-teal-50 text-teal-600"
      >
        {isPlaying ? <FiPause className="w-4 h-4" /> : <FiPlay className="w-4 h-4" />}
      </button>
      <div className="h-1 bg-gray-200 rounded-full w-24 overflow-hidden">
        <div 
          className={`h-full bg-teal-500 rounded-full ${isPlaying ? 'animate-progress' : ''}`}
          style={{ width: isPlaying ? '100%' : '0%' }}
        ></div>
      </div>
    </div>
  );
};

/**
 * Enregistrements (Recordings) Component
 */
export default function Enregistrements() {
  const [recordings, setRecordings] = useState<Recording[]>(SAMPLE_RECORDINGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFileSelectOpen, setIsFileSelectOpen] = useState(false);

  // Filter the data based on search term
  const filteredRecordings = recordings.filter(recording => 
    recording.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recording.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reset search filter
  const resetFilters = () => {
    setSearchTerm('');
  };

  // Handle delete recording
  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement?')) {
      setRecordings(recordings.filter(recording => recording.id !== id));
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="pt-20 min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-0">
        {/* Breadcrumbs */}
        <Breadcrumbs items={['PBX', 'Applications', 'Enregistrements']} />
        
        {/* Header section */}
        <motion.div
          variants={itemVariants}
          className="relative mb-8 overflow-hidden backdrop-blur-sm bg-white/80 rounded-3xl shadow-2xl border border-gray-100"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#004AC8]/10 to-[#00BFA5]/10 rounded-3xl pointer-events-none" />
          <div className="relative flex justify-between items-center p-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-teal-100 text-teal-700 rounded-xl">
                <FiMusic className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#1B0353]">Enregistrements</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Importer vos fichiers audios (WAV 16 bits, 8khz/16khz mono) à utiliser comme musiques d&apos;attente, annonces, etc.
                </p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFileSelectOpen(true)}
              className="flex items-center px-5 py-2.5 bg-[#004AC8] text-white rounded-xl font-medium hover:bg-[#003DA8] transition-colors"
            >
              <FiUpload className="mr-2" />
              Sélectionner un fichier
            </motion.button>
          </div>
        </motion.div>
        
        {/* Filter section */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-6"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="relative flex-1 w-full md:w-auto">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                <FiSearch className="w-5 h-5 text-[#1B0353]/80" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par nom ou fichier..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#004AC8] focus:ring-2 focus:ring-[#004AC8]/20 transition-all duration-200 text-gray-800 placeholder-gray-400"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Réinitialiser
              </button>
              <button
                className="px-5 py-2.5 bg-[#004AC8] text-white rounded-xl hover:bg-[#003DA8] transition-colors"
              >
                Appliquer le filtre
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Info box */}
        <motion.div
          variants={itemVariants}
          className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 mb-6"
        >
          <FiInfo className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-medium text-blue-800">Info :</span>{' '}
            <span className="text-blue-700">
              Vous pouvez aussi créer un son depuis votre poste en composant <strong>*732</strong>. 
              Suivez les instructions vocales pour enregistrer et sauvegarder votre message.
            </span>
          </div>
        </motion.div>
        
        {/* Table section */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Table Header */}
              <thead className="bg-gradient-to-r from-[#004AC8]/5 to-[#00BFA5]/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1B0353]">
                    <div className="flex items-center gap-2">
                      <FiFileText className="w-4 h-4 text-[#004AC8]" />
                      Nom de l&apos;annonce
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1B0353]">
                    <div className="flex items-center gap-2">
                      <FiFile className="w-4 h-4 text-[#004AC8]" />
                      Nom du fichier
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1B0353]">
                    <div className="flex items-center gap-2">
                      <FiVolume2 className="w-4 h-4 text-[#004AC8]" />
                      Outils
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1B0353]">
                    <div className="flex items-center gap-2">
                      <FiHardDrive className="w-4 h-4 text-[#004AC8]" />
                      Taille du fichier
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1B0353]">
                    <div className="flex items-center gap-2">
                      <FiClock className="w-4 h-4 text-[#004AC8]" />
                      Téléversé le
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-[#1B0353]">Actions</th>
                </tr>
              </thead>
              
              {/* Table Body */}
              <tbody className="divide-y divide-gray-200/80">
                {filteredRecordings.length > 0 ? (
                  filteredRecordings.map((recording) => (
                    <motion.tr
                      key={recording.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ backgroundColor: '#f8fafc' }}
                      className="group transition-colors"
                    >
                      {/* Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-teal-50 text-teal-600 rounded-lg">
                            <FiMusic className="w-4 h-4" />
                          </div>
                          <span className="font-medium text-gray-900">{recording.name}</span>
                        </div>
                      </td>
                      
                      {/* Filename */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-700">{recording.filename}</span>
                          <span className="text-xs text-gray-500">{recording.format}</span>
                        </div>
                      </td>
                      
                      {/* Tools */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <AudioPlayer filename={recording.filename} />
                          <button className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors">
                            <FiDownload className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      
                      {/* File Size */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-700">{recording.size}</span>
                          <span className="text-xs text-gray-500">{recording.duration}</span>
                        </div>
                      </td>
                      
                      {/* Upload Date */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">{recording.uploadedDate}</span>
                      </td>
                      
                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-3">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                            title="Modifier"
                          >
                            <FiEdit className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(recording.id)}
                            className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                            title="Supprimer"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <FiSearch className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-gray-600 font-medium mb-1">
                          Aucun enregistrement trouvé
                        </p>
                        <p className="text-sm text-gray-500">
                          Aucun résultat ne correspond à votre recherche
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
        
        {/* File upload modal - Placeholder, would need to be built out further */}
        <AnimatePresence>
          {isFileSelectOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setIsFileSelectOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center z-50"
              >
                <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full max-w-2xl mx-auto overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <FiUpload className="text-[#004AC8]" />
                      Téléverser un fichier audio
                    </h2>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                      <FiMusic className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-700 font-medium mb-2">
                        Déposez votre fichier audio ici
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        ou
                      </p>
                      <button className="px-4 py-2 bg-[#004AC8] text-white rounded-lg hover:bg-[#003DA8] transition-colors">
                        Parcourir les fichiers
                      </button>
                      <p className="text-xs text-gray-500 mt-4">
                        Formats acceptés: WAV 16 bits, 8khz/16khz mono
                      </p>
                    </div>
                    
                    <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
                      <div className="flex items-start gap-2">
                        <FiInfo className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <p>
                          La taille maximale du fichier est de 10 MB. Les fichiers seront automatiquement convertis au format requis par le système si nécessaire.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-gray-50 flex justify-end gap-3">
                    <button
                      onClick={() => setIsFileSelectOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      className="px-4 py-2 bg-[#004AC8] text-white rounded-lg hover:bg-[#003DA8] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                      disabled
                    >
                      Téléverser
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Add this to your global CSS to support the audio player animation
// const globalStyles = `
// @keyframes progress {
//   0% { width: 0%; }
//   100% { width: 100%; }
// }
// .animate-progress {
//   animation: progress 20s linear;
// }
// `;