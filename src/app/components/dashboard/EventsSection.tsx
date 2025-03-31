'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCalendar,
  FiList,
  FiGrid,
  FiFilter,
  FiPlusCircle,
  FiMaximize2,
  FiMinimize2,
  FiPhoneCall,
  FiUsers,
  FiFileText,
  FiSettings,
  FiServer,
  FiCheck,
  FiArrowRight,
  FiPlus,
  FiChevronRight,
  FiEdit,
  FiPlay,
  FiRotateCcw,
  FiMapPin,
  FiClock,
  FiUser,
  FiCheckSquare,
  FiBell
} from 'react-icons/fi';
import { CircleStat } from '@/app/components/dashboard/CircleStat';
import { PriorityBadge } from '@/app/components/dashboard/PriorityBadge';
import { StatusBadge } from '@/app/components/dashboard/StatusBadge';

// Define TypeScript interfaces for our data
interface TaskData {
  id: string;
  title: string;
  due: string;
  assignee: string;
  status: string;
  priority: string;
  type: string;
  notes: string;
}

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}

// Animated Card Component
const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  className = "", 
  delay = 0, 
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ 
        y: -5, 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        transition: { duration: 0.2 }
      }}
      className={`bg-white rounded-xl shadow-md border border-gray-100 transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Sample task data
const taskData: TaskData[] = [
  { id: 'T-1035', title: 'Appel de suivi client Acme Corp', due: '2025-03-23 14:30', assignee: 'Léa Martin', status: 'À faire', priority: 'Haute', type: 'Appel', notes: 'Discuter des nouveaux besoins en téléphonie' },
  { id: 'T-1034', title: 'Préparation démo produit', due: '2025-03-23 16:00', assignee: 'Marc Dubois', status: 'En cours', priority: 'Haute', type: 'Réunion', notes: 'Présentation solution CRM/PBX intégrée' },
  { id: 'T-1033', title: 'Mise à jour documentation API', due: '2025-03-24 12:00', assignee: 'Julie Robert', status: 'À faire', priority: 'Moyenne', type: 'Document', notes: 'Ajouter les nouvelles fonctionnalités' },
  { id: 'T-1032', title: 'Vérification rapport mensuel', due: '2025-03-25 09:00', assignee: 'Thomas Bernard', status: 'À faire', priority: 'Basse', type: 'Admin', notes: 'Valider les chiffres avant envoi à la direction' },
  { id: 'T-1031', title: 'Configuration serveur test', due: '2025-03-23 11:00', assignee: 'Sophie Leroy', status: 'Terminée', priority: 'Critique', type: 'Technique', notes: 'Environnement de test pour la version 2.5' },
];

interface EventsSectionProps {
  darkMode?: boolean;
  expandedCard?: string | null;
  toggleCardExpand?: (cardId: string) => void;
}

const EventsSection: React.FC<EventsSectionProps> = ({ 
  darkMode = false, 
  expandedCard = null, 
  toggleCardExpand = (cardId) => console.log(`Toggle ${cardId}`) 
}) => {
  const [taskView, setTaskView] = useState<'list' | 'board'>('board');
  
  // Calculate pending tasks count
  const pendingTasks = taskData.filter(t => t.status !== 'Terminée').length;
  
  // Prioritize tasks due soon
  const urgentTasks = [...taskData]
    .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime())
    .slice(0, 3);

  return (
    <AnimatedCard 
      className={`lg:col-span-2 p-6 ${
        expandedCard === 'tasks' ? 'lg:col-span-3 order-first' : ''
      }`} 
      delay={0.5}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <CircleStat 
            icon={<FiCalendar />} 
            color="#F59E0B" 
            size="sm" 
            pulse={pendingTasks > 3} 
          />
          <div>
            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Événements
            </h3>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Organisation et suivi de vos activités
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className={`flex items-center p-1 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTaskView('list')}
              className={`p-2 rounded-lg text-sm ${
                taskView === 'list' 
                  ? darkMode
                    ? 'bg-gray-800 text-amber-400 shadow-sm'
                    : 'bg-white text-amber-700 shadow-sm'
                  : darkMode
                    ? 'text-gray-400 hover:bg-gray-600'
                    : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FiList className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTaskView('board')}
              className={`p-2 rounded-lg text-sm ${
                taskView === 'board' 
                  ? darkMode
                    ? 'bg-gray-800 text-amber-400 shadow-sm'
                    : 'bg-white text-amber-700 shadow-sm'
                  : darkMode
                    ? 'text-gray-400 hover:bg-gray-600'
                    : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FiGrid className="w-4 h-4" />
            </motion.button>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              darkMode 
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            <FiFilter className="w-3.5 h-3.5" />
            Filtrer
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 text-white transition-colors ${
              darkMode ? 'bg-amber-600 hover:bg-amber-500' : 'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            <FiPlusCircle className="w-3.5 h-3.5" />
            Nouveau
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleCardExpand('tasks')}
            className={`p-2 rounded-lg ${
              darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {expandedCard === 'tasks' ? <FiMinimize2 className="w-4 h-4" /> : <FiMaximize2 className="w-4 h-4" />}
          </motion.button>
        </div>
      </div>

      {/* Tasks Container with Animation */}
      <div className="mt-4 overflow-hidden">
        <AnimatePresence mode="wait">
          {taskView === 'list' ? (
            <motion.div
              key="listView"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className={`border rounded-xl overflow-hidden shadow-sm ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-50'}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Événement</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Type</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Échéance</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Assigné à</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Priorité</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Statut</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'bg-gray-900 divide-gray-700' : 'bg-white divide-gray-200'}`}>
                  {urgentTasks.map((task) => (
                    <motion.tr 
                      key={task.id}
                      whileHover={{ backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.5)' : 'rgba(249, 250, 251, 0.7)' }}
                      className="transition-colors"
                    >
                      <td className="px-4 py-4 text-sm">
                        <div className="flex items-start gap-3">
                          <div className={`
                            p-2 rounded-lg
                            ${task.type === 'Appel' 
                              ? darkMode ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-600' 
                              : task.type === 'Réunion' 
                              ? darkMode ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-600' 
                              : task.type === 'Document' 
                              ? darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600' 
                              : task.type === 'Admin' 
                              ? darkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600' 
                              : darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}
                          `}>
                            {task.type === 'Appel' ? (
                              <FiPhoneCall className="w-4 h-4" />
                            ) : task.type === 'Réunion' ? (
                              <FiUsers className="w-4 h-4" />
                            ) : task.type === 'Document' ? (
                              <FiFileText className="w-4 h-4" />
                            ) : task.type === 'Admin' ? (
                              <FiSettings className="w-4 h-4" />
                            ) : (
                              <FiServer className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{task.title}</div>
                            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>{task.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          task.type === 'Appel' 
                            ? darkMode ? 'bg-indigo-900/30 text-indigo-400 border border-indigo-800/30' : 'bg-indigo-100 text-indigo-600 border border-indigo-200'
                            : task.type === 'Réunion' 
                            ? darkMode ? 'bg-amber-900/30 text-amber-400 border border-amber-800/30' : 'bg-amber-100 text-amber-600 border border-amber-200'
                            : darkMode ? 'bg-green-900/30 text-green-400 border border-green-800/30' : 'bg-green-100 text-green-600 border border-green-200'
                        }`}>
                          {task.type === 'Appel' ? 'Rappel' : 
                          task.type === 'Réunion' ? 'Rendez-vous' : 'Tâche'}
                        </span>
                      </td>
                      <td className={`px-4 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        {new Date(task.due).toLocaleString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className={`px-4 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{task.assignee}</td>
                      <td className="px-4 py-4 text-sm">
                        <PriorityBadge priority={task.priority} />
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <StatusBadge status={task.status} />
                      </td>
                      <td className="px-4 py-4 text-right text-sm">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`p-1.5 rounded transition-colors ${
                              darkMode 
                                ? 'bg-green-800/30 text-green-400 hover:bg-green-800/50' 
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            <FiCheck className="w-3.5 h-3.5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`p-1.5 rounded transition-colors ${
                              darkMode 
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            <FiArrowRight className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          ) : (
            <motion.div
              key="boardView"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-3 gap-4"
            >
              {/* Column views: 'À faire', 'En cours', 'Terminé' */}
              {['À faire', 'En cours', 'Terminé'].map((column) => (
                <div 
                  key={column} 
                  className={`rounded-xl border ${
                    darkMode 
                      ? 'bg-gray-800/50 border-gray-700' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                  data-column={column}
                >
                  <div className="p-3 border-b flex items-center justify-between">
                    <h4 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                      {column}
                    </h4>
                    <span className={`
                      text-xs font-medium px-2 py-1 rounded-full
                      ${column === 'À faire' 
                        ? darkMode ? 'bg-blue-800/30 text-blue-400' : 'bg-blue-100 text-blue-700' 
                        : column === 'En cours' 
                        ? darkMode ? 'bg-amber-800/30 text-amber-400' : 'bg-amber-100 text-amber-700' 
                        : darkMode ? 'bg-green-800/30 text-green-400' : 'bg-green-100 text-green-700'
                      }
                    `}>
                      {/* Filter tasks by their status to match the column */}
                      {taskData.filter(t => 
                        column === 'À faire' 
                          ? t.status === 'À faire'
                          : column === 'En cours' 
                          ? t.status === 'En cours'
                          : t.status === 'Terminée'
                      ).length}
                    </span>
                  </div>
                  
                  <div className="p-3 space-y-3 max-h-96 overflow-y-auto" data-column={column}>
                    {taskData
                      .filter(t => 
                        column === 'À faire' 
                          ? t.status === 'À faire'
                          : column === 'En cours' 
                          ? t.status === 'En cours'
                          : t.status === 'Terminée'
                      )
                      .map((task, index) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 * index }}
                          whileHover={{ 
                            y: -5, 
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                          }}
                          drag
                          dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
                          dragElastic={0.1}
                          onDragEnd={(e, info) => {
                            // Handle drag end - in a real implementation, this would update the task's status
                            const targetColumn = document.elementsFromPoint(info.point.x, info.point.y)
                              .find(el => el.getAttribute('data-column'));
                            
                            if (targetColumn) {
                              const newStatus = targetColumn.getAttribute('data-column');
                              console.log(`Moving task ${task.id} to status: ${newStatus}`);
                              // In a real implementation you would update the task status here
                            }
                          }}
                          className={`relative p-4 rounded-xl shadow-sm border transition-all cursor-grab active:cursor-grabbing ${
                            darkMode 
                              ? 'bg-gray-900 border-gray-700 hover:border-gray-600' 
                              : 'bg-white border-gray-100 hover:border-gray-200'
                          }`}
                        >
                          {/* Top ribbon to indicate task type */}
                          <div className={`absolute top-0 inset-x-0 h-1 rounded-t-xl ${
                            task.type === 'Appel' 
                              ? 'bg-indigo-500' 
                              : task.type === 'Réunion' 
                              ? 'bg-amber-500' 
                              : 'bg-green-500'
                          }`}></div>
                          
                          {/* Task Type Badge */}
                          <div className="absolute top-2 right-2">
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                              task.type === 'Appel' 
                                ? darkMode ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-700' : 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                                : task.type === 'Réunion' 
                                ? darkMode ? 'bg-amber-900/50 text-amber-300 border border-amber-700' : 'bg-amber-100 text-amber-700 border border-amber-200' 
                                : darkMode ? 'bg-green-900/50 text-green-300 border border-green-700' : 'bg-green-100 text-green-700 border border-green-200'
                            }`}>
                              {task.type === 'Appel' ? 'Rappel' : 
                              task.type === 'Réunion' ? 'Rendez-vous' : 'Tâche'}
                            </span>
                          </div>
                          
                          {/* Card header */}
                          <div className="flex items-start mb-3 mt-3 pr-20">
                            <div className="flex items-center gap-2">
                              <div className={`
                                p-1.5 rounded
                                ${task.type === 'Appel' 
                                  ? darkMode ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-600' 
                                  : task.type === 'Réunion' 
                                  ? darkMode ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-600' 
                                  : task.type === 'Document' 
                                  ? darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600' 
                                  : task.type === 'Admin' 
                                  ? darkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600' 
                                  : darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}
                              `}>
                                {task.type === 'Appel' ? (
                                  <FiPhoneCall className="w-3 h-3" />
                                ) : task.type === 'Réunion' ? (
                                  <FiUsers className="w-3 h-3" />
                                ) : task.type === 'Document' ? (
                                  <FiFileText className="w-3 h-3" />
                                ) : task.type === 'Admin' ? (
                                  <FiSettings className="w-3 h-3" />
                                ) : (
                                  <FiServer className="w-3 h-3" />
                                )}
                              </div>
                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                darkMode ? 'bg-gray-800 text-gray-300 border border-gray-700' : 'bg-gray-100 text-gray-700'
                              }`}>
                                {task.id}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mb-3">
                            <h4 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                              {task.title}
                            </h4>
                            <PriorityBadge priority={task.priority} />
                          </div>
                          
                          {/* Task details based on type */}
                          <div className={`mb-3 p-2 rounded-lg text-xs ${
                            darkMode ? 'bg-gray-800/70 text-gray-300' : 'bg-gray-50 text-gray-600'
                          }`}>
                            {task.type === 'Réunion' && (
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <FiCalendar className="w-3 h-3 text-amber-500" />
                                    <span>Date:</span>
                                  </div>
                                  <span className="font-medium">{new Date(task.due).toLocaleDateString('fr-FR')}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <FiClock className="w-3 h-3 text-amber-500" />
                                    <span>Horaire:</span>
                                  </div>
                                  <span className="font-medium">{new Date(task.due).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <FiMapPin className="w-3 h-3 text-amber-500" />
                                    <span>Lieu:</span>
                                  </div>
                                  <span className="font-medium">Salle Conférence A</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <FiUsers className="w-3 h-3 text-amber-500" />
                                    <span>Participants:</span>
                                  </div>
                                  <span className="font-medium">4</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <FiBell className="w-3 h-3 text-amber-500" />
                                    <span>Rappel:</span>
                                  </div>
                                  <span className="font-medium">15 min avant</span>
                                </div>
                              </div>
                            )}
                            
                            {task.type === 'Appel' && (
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <FiCalendar className="w-3 h-3 text-indigo-500" />
                                    <span>Date:</span>
                                  </div>
                                  <span className="font-medium">{new Date(task.due).toLocaleDateString('fr-FR')}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <FiClock className="w-3 h-3 text-indigo-500" />
                                    <span>Heure:</span>
                                  </div>
                                  <span className="font-medium">{new Date(task.due).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <FiPhoneCall className="w-3 h-3 text-indigo-500" />
                                    <span>Numéro:</span>
                                  </div>
                                  <span className="font-medium">+33 1 45 67 89 10</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <FiUser className="w-3 h-3 text-indigo-500" />
                                    <span>Contact:</span>
                                  </div>
                                  <span className="font-medium">{
                                    task.title.includes('Acme') ? 'Jean Dupont' : 
                                    task.title.includes('Nexus') ? 'Marie Laurent' : 'Thomas Bernard'
                                  }</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <FiClock className="w-3 h-3 text-indigo-500" />
                                    <span>Durée estimée:</span>
                                  </div>
                                  <span className="font-medium">20 min</span>
                                </div>
                              </div>
                            )}
                            
                            {(task.type === 'Document' || task.type === 'Admin' || task.type === 'Technique') && (
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <FiCalendar className="w-3 h-3 text-green-500" />
                                    <span>Date limite:</span>
                                  </div>
                                  <span className="font-medium">{new Date(task.due).toLocaleDateString('fr-FR')}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <FiFileText className="w-3 h-3 text-green-500" />
                                    <span>Projet:</span>
                                  </div>
                                  <span className="font-medium">{
                                    task.title.includes('documentation') ? 'API v2.5' : 
                                    task.title.includes('rapport') ? 'Commercial Q1' : 'Infrastructure'
                                  }</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <FiCheckSquare className="w-3 h-3 text-green-500" />
                                    <span>Progression:</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                      <div className="h-full bg-green-500 rounded-full" style={{ 
                                        width: `${task.status === 'À faire' ? 0 : task.status === 'En cours' ? 65 : 100}%` 
                                      }}></div>
                                    </div>
                                    <span className="ml-1 font-medium">{
                                      task.status === 'À faire' ? '0%' : 
                                      task.status === 'En cours' ? '65%' : '100%'
                                    }</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {task.notes && (
                            <p className={`text-xs mb-3 italic ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {task.notes}
                            </p>
                          )}
                          
                          <div className="flex justify-between items-center text-xs">
                            <span className={`flex items-center gap-1 ${
                              new Date(task.due) < new Date() && task.status !== 'Terminée' 
                                ? darkMode ? 'text-red-400' : 'text-red-600' 
                                : darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              <FiClock className="w-3 h-3" />
                              {new Date(task.due).toLocaleString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            <div className="flex items-center gap-1">
                              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-[8px] font-bold">
                                {task.assignee.charAt(0)}
                              </div>
                              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {task.assignee.split(' ')[0]}
                              </span>
                            </div>
                          </div>
                          
                          {/* Action buttons */}
                          <div className={`mt-3 pt-2 border-t flex justify-end gap-1 ${
                            darkMode ? 'border-gray-700' : 'border-gray-200'
                          }`}>
                            {column !== 'Terminé' && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`p-1.5 rounded-full ${
                                  darkMode 
                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                <FiEdit className="w-3 h-3" />
                              </motion.button>
                            )}
                            
                            {column === 'À faire' && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`p-1.5 rounded-full ${
                                  darkMode 
                                    ? 'bg-amber-800/30 text-amber-400 hover:bg-amber-800/50' 
                                    : 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                                }`}
                              >
                                <FiPlay className="w-3 h-3" />
                              </motion.button>
                            )}
                            
                            {column === 'En cours' && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`p-1.5 rounded-full ${
                                  darkMode 
                                    ? 'bg-green-800/30 text-green-400 hover:bg-green-800/50' 
                                    : 'bg-green-100 text-green-600 hover:bg-green-200'
                                }`}
                              >
                                <FiCheck className="w-3 h-3" />
                              </motion.button>
                            )}
                            
                            {column === 'Terminé' && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`p-1.5 rounded-full ${
                                  darkMode 
                                    ? 'bg-blue-800/30 text-blue-400 hover:bg-blue-800/50' 
                                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                }`}
                              >
                                <FiRotateCcw className="w-3 h-3" />
                              </motion.button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                      
                    {/* Add task button at the end of each column */}
                    <motion.button
                      whileHover={{ opacity: 1 }}
                      className={`w-full p-3 rounded-lg mt-2 flex items-center justify-center gap-1 text-xs font-medium opacity-60 transition-opacity ${
                        darkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      data-column={column}
                    >
                      <FiPlus className="w-3.5 h-3.5" />
                      Ajouter {column === 'À faire' ? 'une nouvelle tâche' : column === 'En cours' ? 'un événement en cours' : 'une tâche terminée'}
                    </motion.button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* View all tasks button */}
      <div className={`mt-4 pt-3 border-t flex justify-between items-center ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Affichage de {urgentTasks.length} événements sur {taskData.length}
        </div>
        <motion.button
          whileHover={{ x: 5 }}
          whileTap={{ x: -2 }}
          className={`text-xs font-medium flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity ${
            darkMode ? 'text-amber-400' : 'text-amber-600'
          }`}
        >
          Voir tous les événements <FiChevronRight className="w-3 h-3" />
        </motion.button>
      </div>
    </AnimatedCard>
  );
};

export default EventsSection;