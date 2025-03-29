import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiCalendar, 
  FiPhoneCall, 
  FiClipboard, 
  FiClock, 
  FiPlusCircle,
  FiChevronRight,
  FiCheck,
  FiAlertCircle,
  FiMapPin,
  FiUser,
  FiInfo,
  FiFileText,
  FiBriefcase,
  FiUsers,
  // FiMail,
  FiActivity,
  FiTarget
} from 'react-icons/fi';

// Define a type for subtasks
type Subtask = string;

// Define interface for event data
interface EventData {
  id: number;
  type: 'Appel' | 'Tâche' | 'Rendez-vous' | 'Rappel';
  time: string;
  contact: string;
  status: string;
  priority: 'Haute' | 'Moyenne' | 'Basse';
  description: string;
  assignedTo: string;
  company: string;
  
  // Properties specific to type Appel
  phoneNumber?: string;
  notes?: string;
  leadSource?: string;
  interests?: string;
  followUpAction?: string;
  
  // Properties specific to type Tâche
  dueDate?: string;
  subtasks?: Subtask[];
  progress?: number;
  deadline?: string;
  resources?: string[];
  
  // Properties specific to type Rendez-vous
  location?: string;
  duration?: string;
  participants?: string[];
  materials?: string;
  clientInfo?: string;
  meetingAgenda?: string[];
}

// Enhanced event data with more details
const eventsData: EventData[] = [
  { 
    id: 1,
    type: 'Appel', 
    time: '09:30', 
    contact: 'Marie Dupont', 
    status: 'À venir', 
    priority: 'Haute',
    description: 'Suivi de la proposition commerciale récemment envoyée. Discuter des points spécifiques concernant la tarification.',
    assignedTo: 'Thomas',
    phoneNumber: '+33 6 12 34 56 78',
    company: 'Acme Corp',
    notes: 'La cliente a demandé des précisions sur nos services premium',
    leadSource: 'Recommandation client existant',
    interests: 'Module de gestion des stocks, analytique avancée',
    followUpAction: 'Envoyer une proposition révisée après l\'appel'
  },
  { 
    id: 2,
    type: 'Tâche', 
    time: '11:00', 
    contact: 'Jean Martin', 
    status: 'À venir', 
    priority: 'Moyenne',
    description: 'Préparer et envoyer la documentation technique pour le nouveau produit',
    assignedTo: 'Sophie',
    dueDate: '28/03/2025',
    deadline: '29/03/2025 18:00',
    progress: 25,
    subtasks: [
      'Finaliser les spécifications techniques',
      'Créer les PDF de présentation',
      'Envoyer par email avec suivi de lecture',
      'Vérifier la réception et planifier une réunion de suivi'
    ],
    company: 'Nexus Tech',
    resources: ['Template de documentation', 'Accès aux specs produit', 'Brand guidelines']
  },
  { 
    id: 3,
    type: 'Rendez-vous', 
    time: '14:30', 
    contact: 'Sophie Leclerc', 
    status: 'À venir', 
    priority: 'Haute',
    description: 'Présentation du prototype et démonstration des nouvelles fonctionnalités',
    assignedTo: 'Marc',
    location: '15 Rue de la Paix, 75002 Paris',
    duration: '1h30',
    participants: ['Marc', 'Julie', 'Sophie Leclerc', 'Alexandre Leclerc'],
    company: 'Zenith SA',
    materials: 'Ordinateur portable, projecteur, documents imprimés',
    clientInfo: 'Directrice des opérations, intéressée par notre solution enterprise',
    meetingAgenda: [
      'Introduction et présentation des participants (5 min)',
      'Démonstration du prototype (30 min)',
      'Questions et discussion (30 min)',
      'Prochaines étapes et planification (15 min)'
    ]
  },
  { 
    id: 4,
    type: 'Rappel', 
    time: '16:00', 
    contact: 'Thomas Bernard', 
    status: 'À venir', 
    priority: 'Basse',
    description: 'Rappeler pour vérifier l\'intérêt suite à la demande d\'information via notre site web',
    assignedTo: 'Léa',
    phoneNumber: '+33 7 98 76 54 32',
    company: 'Startup Innovante',
    leadSource: 'Formulaire de contact site web',
    interests: 'Solution de gestion pour petite entreprise',
    notes: 'A mentionné un budget limité - proposer notre forfait startup'
  },
];

interface CircleStatProps {
  icon: React.ReactNode;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  onClick?: () => void;
}

const CircleStat: React.FC<CircleStatProps> = ({
  icon,
  color,
  size = 'md',
  pulse = false,
  onClick,
}) => {
  const sizeClasses: { [key in 'sm' | 'md' | 'lg']: { container: string; icon: string } } = {
    sm: { container: 'w-12 h-12', icon: 'w-5 h-5' },
    md: { container: 'w-16 h-16', icon: 'w-6 h-6' },
    lg: { container: 'w-20 h-20', icon: 'w-8 h-8' },
  };

  return (
    <motion.div
      whileHover={{ scale: 1.08, rotate: 3 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative ${sizeClasses[size].container} rounded-full flex items-center justify-center shadow-md ${
        onClick ? 'cursor-pointer' : ''
      }`}
      style={{
        backgroundColor: `${color}15`,
        border: `2px solid ${color}50`,
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      }}
    >
      <div className={`${sizeClasses[size].icon} flex items-center justify-center`} style={{ color }}>
        {icon}
      </div>
      {pulse && (
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-30 duration-1000"
          style={{ backgroundColor: color, animationDuration: '3s' }}
        ></span>
      )}
    </motion.div>
  );
};

const EventsComponent: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>(eventsData);
  const [expandedEventId, setExpandedEventId] = useState<number | null>(null);
  
  const toggleEventDetails = (id: number): void => {
    setExpandedEventId(expandedEventId === id ? null : id);
  };
  
  const completeEvent = (id: number, e: React.MouseEvent): void => {
    e.stopPropagation();
    setEvents(events.filter(event => event.id !== id));
  };

  const handleAction = (type: string, e: React.MouseEvent): void => {
    e.stopPropagation();
    // In a real app, you would implement the actual action here
    alert(`Action "${type}" clicked`);
  };

  // Function to get icon based on event type
  const getEventIcon = (type: EventData['type']) => {
    switch(type) {
      case 'Appel':
        return <FiPhoneCall className="w-4 h-4 text-indigo-600" />;
      case 'Tâche':
        return <FiClipboard className="w-4 h-4 text-amber-600" />;
      case 'Rendez-vous':
        return <FiCalendar className="w-4 h-4 text-blue-600" />;
      case 'Rappel':
        return <FiClock className="w-4 h-4 text-purple-600" />;
      default:
        return <FiInfo className="w-4 h-4 text-gray-600" />;
    }
  };

  // Function to get background color based on event type
  const getEventBgColor = (type: EventData['type']) => {
    switch(type) {
      case 'Appel':
        return 'bg-indigo-100';
      case 'Tâche':
        return 'bg-amber-100';
      case 'Rendez-vous':
        return 'bg-blue-100';
      case 'Rappel':
        return 'bg-purple-100';
      default:
        return 'bg-gray-100';
    }
  };

  // Function to render preview details based on event type
  const renderPreviewDetails = (event: EventData) => {
    switch(event.type) {
      case 'Rendez-vous':
        return (
          <div className="mt-2 space-y-1">
            {event.location && (
              <div className="flex items-center text-xs text-gray-600">
                <FiMapPin className="w-3 h-3 mr-1 text-blue-500" />
                {event.location}
              </div>
            )}
            {event.duration && (
              <div className="flex items-center text-xs text-gray-600">
                <FiClock className="w-3 h-3 mr-1 text-blue-500" />
                {event.duration}
              </div>
            )}
          </div>
        );
      case 'Tâche':
        return (
          <div className="mt-2">
            {event.deadline && (
              <div className="flex items-center text-xs text-gray-600">
                <FiClock className="w-3 h-3 mr-1 text-amber-500" />
                Échéance: {event.deadline}
              </div>
            )}
            {event.progress !== undefined && (
              <div className="mt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Progression:</span>
                  <span className="font-medium">{event.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1">
                  <div 
                    className="h-full bg-amber-400 rounded-full" 
                    style={{ width: `${event.progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        );
      case 'Appel':
      case 'Rappel':
        return (
          <div className="mt-2">
            {event.phoneNumber && (
              <div className="flex items-center text-xs text-gray-600">
                <FiPhoneCall className="w-3 h-3 mr-1 text-indigo-500" />
                {event.phoneNumber}
              </div>
            )}
            {event.leadSource && (
              <div className="flex items-center text-xs text-gray-600">
                <FiInfo className="w-3 h-3 mr-1 text-indigo-500" />
                Source: {event.leadSource}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl relative overflow-hidden"
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white -z-10"></div>
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)]" 
        style={{ backgroundSize: '20px 20px' }}></div>
      
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-3">
          <CircleStat icon={<FiClock />} color="#3B82F6" size="sm" />
          <div>
            <span className="text-sm font-medium text-gray-700">Événements du jour</span>
            <div className="text-gray-500 text-xs">{events.length} événements programmés</div>
          </div>
        </div>
        
        <motion.button
          type="button"
          onClick={(e) => handleAction('Ajouter', e)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 p-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <FiPlusCircle className="w-3.5 h-3.5" />
          Ajouter
        </motion.button>
      </div>
      
      <div className="mt-4 space-y-3">
        {events.length > 0 ? (
          events.map((event) => (
            <motion.div 
              key={event.id} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * event.id }}
              onClick={() => toggleEventDetails(event.id)}
              className={`flex flex-col p-3 rounded-lg hover:bg-blue-50/50 transition-all border border-gray-100 shadow-sm hover:shadow-md cursor-pointer ${
                expandedEventId === event.id ? 'bg-blue-50/50 border-blue-200' : ''
              }`}
            >
              <div className="flex items-start">
                <div className={`p-2 rounded-lg mr-3 ${getEventBgColor(event.type)}`}>
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-800">{event.type}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{event.time}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        event.priority === 'Haute' ? 'bg-red-100 text-red-700' : 
                        event.priority === 'Moyenne' ? 'bg-amber-100 text-amber-700' : 
                        'bg-green-100 text-green-700'
                      }`}>
                        {event.priority}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-700 mt-1 font-medium">{event.contact}</p>
                  
                  {/* Badge for assigned staff and company */}
                  <div className="flex items-center flex-wrap gap-1 mt-2">
                    <div className="flex items-center bg-gray-100 rounded-full px-2 py-0.5">
                      <FiUser className="w-3 h-3 text-gray-500 mr-1" />
                      <span className="text-xs text-gray-600">{event.assignedTo}</span>
                    </div>
                    {event.company && (
                      <div className="flex items-center bg-gray-100 rounded-full px-2 py-0.5">
                        <FiBriefcase className="w-3 h-3 text-gray-500 mr-1" />
                        <span className="text-xs text-gray-600">{event.company}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Short description preview */}
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                    {event.description.substring(0, 80)}
                    {event.description.length > 80 ? '...' : ''}
                  </p>

                  {/* Preview details based on event type */}
                  {renderPreviewDetails(event)}
                  
                  <div className="flex justify-between mt-3">
                    <motion.button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); 
                        toggleEventDetails(event.id);
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-xs flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      {expandedEventId === event.id ? 'Masquer détails' : 'Voir détails'}
                    </motion.button>
                    
                    <div className="flex gap-2">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => completeEvent(event.id, e)}
                        className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors"
                      >
                        <FiCheck className="w-3.5 h-3.5" />
                      </motion.button>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e: React.MouseEvent) => handleAction('Alerte', e)}
                        className="p-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                      >
                        <FiAlertCircle className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Expanded details section */}
              {expandedEventId === event.id && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 pt-3 border-t border-gray-200"
                >
                  <div className="text-xs text-gray-700 space-y-2 px-2">
                    {/* Description for all event types */}
                    <div className="flex items-start gap-2">
                      <FiInfo className="w-3.5 h-3.5 text-blue-500 mt-0.5" />
                      <div className="flex-1">
                        <span className="font-medium text-gray-700">Description:</span>
                        <p className="mt-1 text-gray-600">{event.description}</p>
                      </div>
                    </div>
                    
                    {/* Phone/Rappel-specific information */}
                    {(event.type === 'Appel' || event.type === 'Rappel') && (
                      <>
                        {event.phoneNumber && (
                          <div className="flex items-start gap-2">
                            <FiPhoneCall className="w-3.5 h-3.5 text-indigo-500 mt-0.5" />
                            <div className="flex-1">
                              <span className="font-medium text-gray-700">Numéro de téléphone:</span>
                              <p className="mt-1 text-gray-600">{event.phoneNumber}</p>
                            </div>
                          </div>
                        )}
                        
                        {event.leadSource && (
                          <div className="flex items-start gap-2">
                            <FiInfo className="w-3.5 h-3.5 text-indigo-500 mt-0.5" />
                            <div className="flex-1">
                              <span className="font-medium text-gray-700">Source du lead:</span>
                              <p className="mt-1 text-gray-600">{event.leadSource}</p>
                            </div>
                          </div>
                        )}
                        
                        {event.interests && (
                          <div className="flex items-start gap-2">
                            <FiTarget className="w-3.5 h-3.5 text-indigo-500 mt-0.5" />
                            <div className="flex-1">
                              <span className="font-medium text-gray-700">Intérêts:</span>
                              <p className="mt-1 text-gray-600">{event.interests}</p>
                            </div>
                          </div>
                        )}
                        
                        {event.followUpAction && (
                          <div className="flex items-start gap-2">
                            <FiClipboard className="w-3.5 h-3.5 text-indigo-500 mt-0.5" />
                            <div className="flex-1">
                              <span className="font-medium text-gray-700">Action de suivi:</span>
                              <p className="mt-1 text-gray-600">{event.followUpAction}</p>
                            </div>
                          </div>
                        )}
                        
                        {event.notes && (
                          <div className="flex items-start gap-2">
                            <FiFileText className="w-3.5 h-3.5 text-gray-500 mt-0.5" />
                            <div className="flex-1">
                              <span className="font-medium text-gray-700">Notes:</span>
                              <p className="mt-1 text-gray-600">{event.notes}</p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    
                    {/* Task-specific information */}
                    {event.type === 'Tâche' && (
                      <>
                        {event.dueDate && (
                          <div className="flex items-start gap-2">
                            <FiClock className="w-3.5 h-3.5 text-amber-500 mt-0.5" />
                            <div className="flex-1">
                              <span className="font-medium text-gray-700">Date d&apos;échéance:</span>
                              <p className="mt-1 text-gray-600">{event.dueDate}</p>
                            </div>
                          </div>
                        )}
                        
                        {event.deadline && (
                          <div className="flex items-start gap-2">
                            <FiClock className="w-3.5 h-3.5 text-red-500 mt-0.5" />
                            <div className="flex-1">
                              <span className="font-medium text-gray-700">Date limite:</span>
                              <p className="mt-1 text-gray-600">{event.deadline}</p>
                            </div>
                          </div>
                        )}
                        
                        {event.progress !== undefined && (
                          <div className="flex items-start gap-2">
                            <FiActivity className="w-3.5 h-3.5 text-blue-500 mt-0.5" />
                            <div className="flex-1">
                              <span className="font-medium text-gray-700">Progression: {event.progress}%</span>
                              <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1">
                                <div 
                                  className="h-full bg-blue-500 rounded-full" 
                                  style={{ width: `${event.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {event.subtasks && event.subtasks.length > 0 && (
                          <div className="flex items-start gap-2">
                            <FiClipboard className="w-3.5 h-3.5 text-amber-500 mt-0.5" />
                            <div className="flex-1">
                              <span className="font-medium text-gray-700">Sous-tâches:</span>
                              <ul className="mt-1 pl-4 list-disc space-y-1">
                                {event.subtasks.map((task, idx) => (
                                  <li key={idx} className="text-gray-600">{task}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                        
                        {event.resources && event.resources.length > 0 && (
                          <div className="flex items-start gap-2">
                            <FiBriefcase className="w-3.5 h-3.5 text-amber-500 mt-0.5" />
                            <div className="flex-1">
                              <span className="font-medium text-gray-700">Ressources nécessaires:</span>
                              <ul className="mt-1 pl-4 list-disc space-y-1">
                                {event.resources.map((resource, idx) => (
                                  <li key={idx} className="text-gray-600">{resource}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    
                    {/* Meeting-specific information */}
                    {event.type === 'Rendez-vous' && (
                      <>
                        {event.location && (
                          <div className="flex items-start gap-2">
                            <FiMapPin className="w-3.5 h-3.5 text-blue-500 mt-0.5" />
                            <div className="flex-1">
                              <span className="font-medium text-gray-700">Adresse:</span>
                              <p className="mt-1 text-gray-600">{event.location}</p>
                            </div>
                          </div>
                        )}
                        
                        {event.duration && (
                          <div className="flex items-start gap-2">
                            <FiClock className="w-3.5 h-3.5 text-blue-500 mt-0.5" />
                            <div className="flex-1">
                              <span className="font-medium text-gray-700">Durée:</span>
                              <p className="mt-1 text-gray-600">{event.duration}</p>
                            </div>
                          </div>
                        )}
                        
                        {event.participants && event.participants.length > 0 && (
                          <div className="flex items-start gap-2">
                            <FiUsers className="w-3.5 h-3.5 text-blue-500 mt-0.5" />
                            <div className="flex-1">
                              <span className="font-medium text-gray-700">Participants:</span>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {event.participants.map((participant, idx) => (
                                  <div key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs flex items-center">
                                    <span className="w-4 h-4 mr-1 rounded-full bg-blue-200 flex items-center justify-center">
                                      {participant.charAt(0)}
                                    </span>
                                    {participant}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {event.clientInfo && (
                          <div className="flex items-start gap-2">
                            <FiInfo className="w-3.5 h-3.5 text-blue-500 mt-0.5" />
                            <div className="flex-1">
                              <span className="font-medium text-gray-700">Info client:</span>
                              <p className="mt-1 text-gray-600">{event.clientInfo}</p>
                            </div>
                          </div>
                        )}
                        
                        {event.materials && (
                          <div className="flex items-start gap-2">
                            <FiBriefcase className="w-3.5 h-3.5 text-blue-500 mt-0.5" />
                            <div className="flex-1">
                              <span className="font-medium text-gray-700">Matériel nécessaire:</span>
                              <p className="mt-1 text-gray-600">{event.materials}</p>
                            </div>
                          </div>
                        )}
                        
                        {event.meetingAgenda && event.meetingAgenda.length > 0 && (
                          <div className="flex items-start gap-2">
                            <FiClipboard className="w-3.5 h-3.5 text-blue-500 mt-0.5" />
                            <div className="flex-1">
                              <span className="font-medium text-gray-700">Agenda:</span>
                              <ol className="mt-1 pl-4 list-decimal space-y-1">
                                {event.meetingAgenda.map((item, idx) => (
                                  <li key={idx} className="text-gray-600">{item}</li>
                                ))}
                              </ol>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    
                    {/* Action buttons in the expanded view */}
<div className="flex justify-end mt-3 pt-2 border-t border-gray-100">
  {event.type === 'Appel' || event.type === 'Rappel' ? (
    <motion.button
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={(e) => handleAction('Appeler', e)}
      className="flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium"
    >
      <FiPhoneCall className="w-3 h-3" />
      Appeler maintenant
    </motion.button>
  ) : event.type === 'Tâche' ? (
    <motion.button
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={(e) => handleAction('MiseÀJour', e)}
      className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium"
    >
      <FiClipboard className="w-3 h-3" />
      Mettre à jour tâche
    </motion.button>
  ) : (
    <motion.button
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={(e) => handleAction('AjouterCalendrier', e)}
      className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium"
    >
      <FiCalendar className="w-3 h-3" />
      Ajouter au calendrier
    </motion.button>
  )}
</div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-8 text-center text-gray-500"
          >
            <FiCalendar className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-sm">Aucun événement pour aujourd&apos;hui</p>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => handleAction('AjouterNouveau', e)}
              className="mt-4 flex items-center gap-2 px-4 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <FiPlusCircle className="w-3.5 h-3.5" />
              Ajouter un événement
            </motion.button>
          </motion.div>
        )}
      </div>
      
      {/* Add subtle divider */}
      {events.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
          <motion.button
            type="button"
            whileHover={{ x: 5 }}
            whileTap={{ x: -2 }}
            onClick={(e) => handleAction('VoirTous', e)}
            className="text-xs text-blue-600 font-medium flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity"
          >
            Voir tous les événements <FiChevronRight className="w-3 h-3" />
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default EventsComponent;