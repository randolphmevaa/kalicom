'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  FiFilter,
  FiPlusCircle,
  FiHeadphones,
  FiAlertCircle,
  FiActivity,
  FiClock,
  FiCheckCircle,
  FiCheck,
  FiChevronRight
} from 'react-icons/fi';
import { CircleStat } from '@/app/components/dashboard/CircleStat';
import { PriorityBadge } from '@/app/components/dashboard/PriorityBadge';
// import { StatusBadge } from '@/app/components/dashboard/StatusBadge';
import { AnimatedCard } from '@/app/components/dashboard/AnimatedCard';

// Define types
interface TicketData {
  id: string;
  client: string;
  subject: string;
  status: string;
  priority: string;
  created: string;
  updated: string;
  agent: string;
  sla: string;
  progress: number;
}

interface TicketsSAVSectionProps {
  darkMode: boolean;
  ticketData: TicketData[];
  totalTickets: number;
  openTickets: number;
}

export const TicketsSAVSection: React.FC<TicketsSAVSectionProps> = ({
  darkMode,
  ticketData,
  totalTickets,
  openTickets
}) => {
  // Prioritize tickets for attention
  const priorityTickets = [...ticketData]
    .sort((a, b) => {
      const priorityOrder: Record<string, number> = { 'Critique': 0, 'Haute': 1, 'Moyenne': 2, 'Basse': 3 };
      const aValue = priorityOrder[a.priority] !== undefined ? priorityOrder[a.priority] : 999;
      const bValue = priorityOrder[b.priority] !== undefined ? priorityOrder[b.priority] : 999;
      return aValue - bValue;
    })
    .slice(0, 3);

  return (
    <AnimatedCard className="lg:col-span-2 p-6 flex flex-col h-full" delay={0.3}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <CircleStat 
            icon={<FiHeadphones />} 
            color="#8B5CF6" 
            size="sm" 
            pulse={openTickets > 0} 
          />
          <div>
            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Tickets SAV
            </h3>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Support clients et résolution d&apos;incidents
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 text-xs font-medium flex items-center gap-1.5 rounded-lg transition-colors ${
              darkMode 
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
            }`}
          >
            <FiFilter className="w-3.5 h-3.5" />
            Filtrer
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 text-xs font-medium flex items-center gap-1.5 rounded-lg text-white transition-colors ${
              darkMode ? 'bg-purple-700 hover:bg-purple-600' : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            <FiPlusCircle className="w-3.5 h-3.5" />
            Nouveau
          </motion.button>
        </div>
      </div>
      
      {/* Ticket Status Summary with progress bars */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Nouveaux', count: ticketData.filter(t => t.status === 'Nouveau').length, color: 'blue' },
          { label: 'En cours', count: ticketData.filter(t => t.status === 'En cours').length, color: 'amber' },
          { label: 'En attente', count: ticketData.filter(t => t.status === 'En attente' || t.status === 'Planifié').length, color: 'purple' },
          { label: 'Résolus', count: ticketData.filter(t => t.status === 'Résolu').length, color: 'green' }
        ].map((status, index) => (
          <motion.div 
            key={index}
            whileHover={{ y: -3 }}
            className={`p-3 rounded-xl ${
              darkMode 
                ? `bg-${status.color}-900/20 border border-${status.color}-800/30` 
                : `bg-${status.color}-50 border border-${status.color}-100`
            }`}
          >
            <div className={`flex items-center gap-2 mb-1.5`}>
              <div className={`w-2 h-2 rounded-full bg-${status.color}-${darkMode ? '400' : '500'}`}></div>
              <div className={`text-xs font-medium ${darkMode ? `text-${status.color}-400` : `text-${status.color}-700`}`}>
                {status.label}
              </div>
            </div>
            <div className={`text-xl font-bold ${darkMode ? 'text-white' : `text-${status.color}-700`}`}>
              {status.count}
            </div>
            <div className={`w-full h-1.5 rounded-full mt-2 overflow-hidden ${
              darkMode ? `bg-${status.color}-900/30` : `bg-${status.color}-100`
            }`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(status.count / totalTickets) * 100}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className={`h-full rounded-full bg-${status.color}-${darkMode ? '400' : '500'}`}
              />
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Enhanced Priority Tickets with more details */}
      <div className="flex-grow">
        <h4 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
          <FiAlertCircle className="w-4 h-4 text-red-500" />
          Tickets prioritaires
        </h4>
        
        <div className="space-y-4">
          {priorityTickets
            .filter(ticket => ticket.status !== 'Résolu') // Filter out resolved tickets
            .map((ticket, index) => {
              // Calculate days until SLA deadline
              const slaHours = parseInt(ticket.sla);
              const createdDate = new Date(ticket.created);
              const deadlineDate = new Date(createdDate.getTime() + slaHours * 60 * 60 * 1000);
              const currentDate = new Date();
              const timeDifferenceMs = deadlineDate.getTime() - currentDate.getTime();
              const hoursRemaining = Math.max(0, Math.floor(timeDifferenceMs / (1000 * 60 * 60)));
              
              // Expand ticket data with more details
              const expandedTicket = {
                ...ticket,
                company: ticket.client,
                fullName: ticket.client === 'Acme Corp' ? 'Jean Dupont' : 
                          ticket.client === 'Nexus Technologies' ? 'Marie Laurent' : 
                          ticket.client === 'Zenith Industries' ? 'Alexandre Martin' : 
                          ticket.client === 'Global Systems' ? 'Sophie Bernard' : 'Thomas Petit',
                phoneNumber: ticket.client === 'Acme Corp' ? '01 23 45 67 89' : 
                              ticket.client === 'Nexus Technologies' ? '01 98 76 54 32' : 
                              ticket.client === 'Zenith Industries' ? '06 12 34 56 78' : 
                              ticket.client === 'Global Systems' ? '07 65 43 21 09' : '01 45 67 89 01',
                address: ticket.client === 'Acme Corp' ? '123 Avenue des Champs-Élysées, 75008 Paris' : 
                          ticket.client === 'Nexus Technologies' ? '45 Rue de la République, 69002 Lyon' : 
                          ticket.client === 'Zenith Industries' ? '78 Boulevard Haussmann, 75009 Paris' : 
                          ticket.client === 'Global Systems' ? '15 Rue du Commerce, 33000 Bordeaux' : '67 Rue de la Paix, 44000 Nantes',
                description: ticket.subject === 'Problème de configuration PBX' ? 'Le client signale que la configuration du PBX ne permet pas de transférer les appels entre les différents services. Les règles de routage semblent incorrectes.' : 
                              ticket.subject === 'Intégration CRM échouée' ? 'L\'intégration entre le système téléphonique et le CRM du client a échoué. Les appels ne sont pas enregistrés dans l\'historique des contacts.' : 
                              ticket.subject === 'Mise à jour logicielle' ? 'Le client souhaite mettre à jour son système vers la dernière version disponible, mais rencontre des erreurs lors de la procédure de mise à jour.' : 
                              ticket.subject === 'Formation utilisateur requise' ? 'Nouvelle équipe recrutée nécessitant une formation complète sur l\'utilisation du système de téléphonie. 15 personnes à former.' : 
                              'Les appels présentent des problèmes de qualité audio (écho, coupures) qui perturbent les communications avec les clients.'
              };
              
              // Create unique IDs for the elements we need to manipulate
              const cardId = `ticket-card-${expandedTicket.id}`;
              const statusBadgeId = `status-badge-${expandedTicket.id}`;
              const inProgressBtnId = `in-progress-btn-${expandedTicket.id}`;
              const resolveBtnId = `resolve-btn-${expandedTicket.id}`;
              const onHoldBtnId = `on-hold-btn-${expandedTicket.id}`;
              
              return (
                <motion.div
                  id={cardId}
                  key={expandedTicket.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ 
                    x: 3, 
                    backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.5)' : 'rgba(248, 250, 252, 0.8)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                  }}
                  className={`p-4 rounded-xl cursor-pointer transition-all relative overflow-hidden ${
                    darkMode 
                      ? 'bg-gray-800 border border-gray-700 hover:border-gray-600' 
                      : 'bg-white border border-gray-100 hover:border-gray-200'
                  }`}
                >
                  {/* Progress bar at top */}
                  <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500"
                      style={{ width: `${Number(ticket.progress) || 0}%` }}>
                  </div>
                  
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                        darkMode 
                          ? 'bg-purple-900/30 text-purple-400 border border-purple-800/30' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {expandedTicket.id}
                      </span>
                      <span 
                        id={statusBadgeId}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium shadow-sm ${
                          expandedTicket.status === 'Nouveau' 
                            ? darkMode ? 'text-blue-700 bg-blue-50/30 border border-blue-200/30' : 'text-blue-700 bg-blue-50 border border-blue-200'
                            : expandedTicket.status === 'En cours' 
                            ? darkMode ? 'text-amber-700 bg-amber-50/30 border border-amber-200/30' : 'text-amber-700 bg-amber-50 border border-amber-200'
                            : expandedTicket.status === 'En attente' || expandedTicket.status === 'Planifié'
                            ? darkMode ? 'text-purple-700 bg-purple-50/30 border border-purple-200/30' : 'text-purple-700 bg-purple-50 border border-purple-200'
                            : darkMode ? 'text-green-700 bg-green-50/30 border border-green-200/30' : 'text-green-700 bg-green-50 border border-green-200'
                        }`}
                      >
                        {expandedTicket.status === 'Nouveau' ? (
                          <><FiAlertCircle className="w-3 h-3" /> {expandedTicket.status}</>
                        ) : expandedTicket.status === 'En cours' ? (
                          <><FiActivity className="w-3 h-3" /> {expandedTicket.status}</>
                        ) : expandedTicket.status === 'En attente' || expandedTicket.status === 'Planifié' ? (
                          <><FiClock className="w-3 h-3" /> {expandedTicket.status}</>
                        ) : (
                          <><FiCheckCircle className="w-3 h-3" /> {expandedTicket.status}</>
                        )}
                      </span>
                    </div>
                    <PriorityBadge priority={expandedTicket.priority} />
                  </div>
                  
                  <h4 className={`font-medium text-sm mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {expandedTicket.subject}
                  </h4>
                  
                  {/* Description section */}
                  <div className={`text-xs mb-3 p-2 rounded-lg ${
                    darkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-50 text-gray-600'
                  }`} style={{ maxHeight: '60px', overflow: 'auto' }}>
                    {expandedTicket.description}
                  </div>
                  
                  {/* Client details grid */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
                    <div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Entreprise
                      </div>
                      <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {expandedTicket.company}
                      </div>
                    </div>
                    
                    <div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Contact
                      </div>
                      <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {expandedTicket.fullName}
                      </div>
                    </div>
                    
                    <div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Téléphone
                      </div>
                      <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {expandedTicket.phoneNumber}
                      </div>
                    </div>
                    
                    <div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Créé le
                      </div>
                      <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {new Date(expandedTicket.created).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                  
                  {/* Address */}
                  <div className="mb-3">
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Adresse
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-white' : 'text-gray-800'} truncate`} title={expandedTicket.address}>
                      {expandedTicket.address}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs mb-3">
                    <span className={`flex items-center gap-1 p-1.5 rounded ${
                      hoursRemaining < 3 
                        ? darkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-700' 
                        : hoursRemaining < 12 
                        ? darkMode ? 'bg-amber-900/20 text-amber-400' : 'bg-amber-50 text-amber-700'
                        : darkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-700'
                    }`}>
                      <FiClock className="w-3 h-3" />
                      {hoursRemaining <= 0 
                        ? 'SLA dépassé' 
                        : `Résolution avant: ${hoursRemaining}h`}
                    </span>
                    <span className={`flex items-center gap-1 ${
                      expandedTicket.priority === 'Critique' || expandedTicket.priority === 'Haute' 
                        ? darkMode ? 'text-red-400' : 'text-red-700' 
                        : darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Mis à jour: {new Date(expandedTicket.updated).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  
                  <div className={`flex justify-between items-center pt-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <span className={`text-xs flex items-center gap-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {expandedTicket.agent === 'Non assigné' ? (
                        <span className={`${darkMode ? 'text-amber-400' : 'text-amber-600'} font-medium`}>
                          Non assigné
                        </span>
                      ) : (
                        <>
                          <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center text-[10px] text-purple-700 font-bold">
                            {expandedTicket.agent.charAt(0)}
                          </div>
                          <span className="ml-1">{expandedTicket.agent}</span>
                        </>
                      )}
                    </span>

                    <div className="flex gap-1.5">
                      {expandedTicket.status !== 'En cours' && (
                        <motion.button
                          id={inProgressBtnId}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={`p-1.5 rounded transition-colors ${
                            darkMode 
                              ? 'bg-amber-800/30 text-amber-400 hover:bg-amber-800/50' 
                              : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                          }`}
                          onClick={() => {
                            // Set ticket to "En cours" status
                            // 1. Update the status badge
                            const statusBadge = document.getElementById(statusBadgeId);
                            if (statusBadge) {
                              // Update appearance
                              statusBadge.className = darkMode 
                                ? 'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium shadow-sm text-amber-700 bg-amber-50/30 border border-amber-200/30'
                                : 'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium shadow-sm text-amber-700 bg-amber-50 border border-amber-200';
                                
                              // Update content
                              statusBadge.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg> En cours';
                            }
                            
                            // 2. Add visual feedback to button
                            const button = document.getElementById(inProgressBtnId);
                            if (button) {
                              // Flash the button
                              button.classList.add('animate-pulse');
                              setTimeout(() => {
                                button.classList.remove('animate-pulse');
                              }, 1000);
                            }
                            
                            // 3. In a real app, this would update the ticket in state/database
                            console.log(`Ticket ${expandedTicket.id} set to En cours`);
                          }}
                        >
                          <FiActivity className="w-3.5 h-3.5" />
                        </motion.button>
                      )}
                      
                      <motion.button
                        id={resolveBtnId}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-1.5 rounded transition-colors ${
                          darkMode 
                            ? 'bg-green-800/30 text-green-400 hover:bg-green-800/50' 
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                        onClick={() => {
                          // Mark as resolved with animation
                          // 1. Get the DOM elements
                          const button = document.getElementById(resolveBtnId);
                          const card = document.getElementById(cardId);
                          
                          if (button && card) {
                            // 2. Update button appearance
                            button.innerHTML = '✓';
                            button.classList.add(darkMode ? 'bg-green-600/50' : 'bg-green-500/30');
                            
                            // 3. Animate the card
                            // Add transition
                            card.style.transition = 'all 0.5s ease-out';
                            // Add a green border glow
                            card.style.borderColor = darkMode ? 'rgba(134, 239, 172, 0.5)' : 'rgba(34, 197, 94, 0.5)';
                            card.style.boxShadow = '0 0 15px rgba(34, 197, 94, 0.3)';
                            
                            // Fade out and slide away
                            setTimeout(() => {
                              card.style.opacity = '0';
                              card.style.transform = 'translateX(50px)';
                              
                              // Collapse the card
                              setTimeout(() => {
                                card.style.maxHeight = '0';
                                card.style.margin = '0';
                                card.style.padding = '0';
                                card.style.overflow = 'hidden';
                                
                                // 4. In a real app, this would update the ticket in state/database
                                console.log(`Ticket ${expandedTicket.id} marked as resolved`);
                              }, 300);
                            }, 300);
                          }
                        }}
                      >
                        <FiCheck className="w-3.5 h-3.5" />
                      </motion.button>
                      
                      {expandedTicket.status !== 'En attente' && (
                        <motion.button
                          id={onHoldBtnId}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={`p-1.5 rounded transition-colors ${
                            darkMode 
                              ? 'bg-purple-800/30 text-purple-400 hover:bg-purple-800/50' 
                              : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                          }`}
                          onClick={() => {
                            // Set ticket to "En attente" status
                            // 1. Update the status badge
                            const statusBadge = document.getElementById(statusBadgeId);
                            if (statusBadge) {
                              // Update appearance
                              statusBadge.className = darkMode 
                                ? 'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium shadow-sm text-purple-700 bg-purple-50/30 border border-purple-200/30'
                                : 'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium shadow-sm text-purple-700 bg-purple-50 border border-purple-200';
                                
                              // Update content
                              statusBadge.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> En attente';
                            }
                            
                            // 2. Add visual feedback to button
                            const button = document.getElementById(onHoldBtnId);
                            if (button) {
                              // Flash the button
                              button.classList.add('animate-pulse');
                              setTimeout(() => {
                                button.classList.remove('animate-pulse');
                              }, 1000);
                            }
                            
                            // 3. In a real app, this would update the ticket in state/database
                            console.log(`Ticket ${expandedTicket.id} set to En attente`);
                          }}
                        >
                          <FiClock className="w-3.5 h-3.5" />
                        </motion.button>
                      )}
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-1.5 rounded transition-colors ${
                          darkMode 
                            ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <FiAlertCircle className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>

      {/* View all tickets button */}
      <div className={`mt-4 pt-3 border-t flex justify-end ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
        <motion.button
          whileHover={{ x: 5 }}
          whileTap={{ x: -2 }}
          className={`text-xs font-medium flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity ${
            darkMode ? 'text-purple-400' : 'text-purple-600'
          }`}
        >
          Voir tous les tickets <FiChevronRight className="w-3 h-3" />
        </motion.button>
      </div>
    </AnimatedCard>
  );
};

export default TicketsSAVSection;