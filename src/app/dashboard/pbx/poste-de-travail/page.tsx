'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiClock,
  FiUserPlus,
  FiPauseCircle,
  FiList,
  FiXCircle,
  FiPhone,
  FiMic,
  FiMicOff,
  FiVolume2,
  FiVolumeX,
  // FiUser,
  // FiMessageSquare,
  // FiPlus,
  FiCalendar,
  FiStar,
  // FiChevronsRight,
  // FiChevronDown,
  // FiChevronUp,
  // FiBell,
  // FiGrid,
  FiInfo,
  FiPhoneCall,
  FiPhoneOff,
  FiCpu,
  FiBarChart2,
  // FiCheckCircle,
  FiPhoneIncoming,
  FiPhoneOutgoing,
  FiPhoneMissed,
  FiMinimize2,
  FiMaximize2,
  FiCopy,
  // FiCreditCard,
  FiFile,
  FiUploadCloud,
  // FiDownload,
  FiHash,
  // FiAlertCircle,
  FiX,
  FiSearch,
} from 'react-icons/fi';
import Link from 'next/link';

// Types and interfaces
interface Contact {
  id: string;
  name: string;
  company?: string;
  avatar?: string;
  favorite: boolean;
  number: string;
}

interface CallHistoryItem {
  id: string;
  name: string;
  number: string;
  timestamp: string;
  duration: string;
  type: 'incoming' | 'outgoing' | 'missed';
}

// Sample Data
const sampleContacts: Contact[] = [
  { 
    id: '1', 
    name: 'Sophie Martin', 
    company: 'Acme Corp', 
    avatar: 'SM',
    favorite: true, 
    number: '+33 1 23 45 67 89' 
  },
  { 
    id: '2', 
    name: 'Thomas Dubois', 
    company: 'XYZ Industries', 
    avatar: 'TD',
    favorite: true, 
    number: '+33 6 12 34 56 78' 
  },
  { 
    id: '3', 
    name: 'Julie Leroy', 
    company: 'ABC Services', 
    avatar: 'JL',
    favorite: false, 
    number: '+33 1 98 76 54 32' 
  },
  { 
    id: '4', 
    name: 'Marc Petit', 
    company: 'Tech Solutions', 
    avatar: 'MP',
    favorite: false, 
    number: '+33 6 98 76 54 32' 
  },
  { 
    id: '5', 
    name: 'Claire Bernard', 
    company: 'Global Partners', 
    avatar: 'CB',
    favorite: true, 
    number: '+33 1 45 67 89 10' 
  }
];

const sampleCallHistory: CallHistoryItem[] = [
  {
    id: '1',
    name: 'Sophie Martin',
    number: '+33 1 23 45 67 89',
    timestamp: '10:32',
    duration: '05:42',
    type: 'incoming'
  },
  {
    id: '2',
    name: 'Support Technique',
    number: '+33 8 00 12 34 56',
    timestamp: 'Hier',
    duration: '12:15',
    type: 'outgoing'
  },
  {
    id: '3',
    name: 'Numéro Inconnu',
    number: '+33 7 12 34 56 78',
    timestamp: 'Hier',
    duration: '-',
    type: 'missed'
  },
  {
    id: '4',
    name: 'Thomas Dubois',
    number: '+33 6 12 34 56 78',
    timestamp: '12/10',
    duration: '03:27',
    type: 'incoming'
  }
];

// Icon for call type
const CallTypeIcon = ({ type }: { type: 'incoming' | 'outgoing' | 'missed' }) => {
  switch (type) {
    case 'incoming':
      return <FiPhoneIncoming className="text-green-500" />;
    case 'outgoing':
      return <FiPhoneOutgoing className="text-blue-500" />;
    case 'missed':
      return <FiPhoneMissed className="text-red-500" />;
  }
};

// Keypad Component
const Keypad = ({ onKeyPress }: { onKeyPress: (key: string) => void }) => {
  const keys = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    '*', '0', '#'
  ];

  return (
    <div className="grid grid-cols-3 gap-3 p-4">
      {keys.map(key => (
        <motion.button
          key={key}
          whileHover={{ scale: 1.1, backgroundColor: '#EBF5FF' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onKeyPress(key)}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-gray-200 text-[#004AC8] font-semibold text-xl shadow-sm hover:shadow"
        >
          {key}
        </motion.button>
      ))}
    </div>
  );
};

// Avatar Component
const Avatar = ({ name, size = 'md' }: { name: string, size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-20 h-20 text-xl'
  };
  
  // Generate initials
  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();
  
  // Generate color based on name
  const getColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = hash % 360;
    return `hsla(${h}, 70%, 50%, 1)`;
  };
  
  return (
    <div 
      className={`${sizes[size]} flex items-center justify-center rounded-full font-semibold`}
      style={{ backgroundColor: getColor(name), color: 'white' }}
    >
      {initials}
    </div>
  );
};

// Call Quality Indicator
const CallQualityIndicator = ({ quality }: { quality: number }) => {
  // Quality from 1-5
  const bars = [
    { height: 'h-1', bg: quality >= 1 ? 'bg-green-500' : 'bg-gray-300' },
    { height: 'h-2', bg: quality >= 2 ? 'bg-green-500' : 'bg-gray-300' },
    { height: 'h-3', bg: quality >= 3 ? 'bg-green-500' : 'bg-gray-300' },
    { height: 'h-4', bg: quality >= 4 ? 'bg-green-500' : 'bg-gray-300' },
    { height: 'h-5', bg: quality >= 5 ? 'bg-green-500' : 'bg-gray-300' }
  ];
  
  return (
    <div className="flex items-end gap-0.5">
      {bars.map((bar, idx) => (
        <div key={idx} className={`w-1 ${bar.height} ${bar.bg} rounded-sm`}></div>
      ))}
    </div>
  );
};

// Main Component
export default function PosteDeTravail() {
  // Expanded states for different sections
  const [expandedSection, setExpandedSection] = useState<'none' | 'keypad' | 'contacts' | 'recent'>('none');
  
  // Call states
  const [extensionName] = useState('poste 101 (Alice Martin)');
  const [callStatus, setCallStatus] = useState<'active' | 'ended' | 'none' | 'incoming'>('active');
  const [callDuration, setCallDuration] = useState(123); // in seconds
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callQuality ] = useState(4); // 1-5 scale
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  
  // Contact info for current call
  const [currentCall ] = useState({
    name: 'Sophie Martin',
    number: '+33 1 23 45 67 89',
    company: 'Acme Corp',
    avatar: 'SM',
    notes: ''
  });
  
  // Notes state
  const [callNotes, setCallNotes] = useState('');

  // Animation controls
  // const callPanelControls = useAnimation();
  const pendingCallRef = useRef<HTMLAudioElement>(null);
  
  // Increment timer if call is active
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (callStatus === 'active') {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [callStatus]);

  // Convert callDuration to mm:ss
  const formatDuration = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };
  
  // Notification sound effect for incoming call
  useEffect(() => {
    if (callStatus === 'incoming' && pendingCallRef.current) {
      pendingCallRef.current.play();
      pendingCallRef.current.loop = true;
    } else if (pendingCallRef.current) {
      pendingCallRef.current.pause();
      pendingCallRef.current.currentTime = 0;
    }
  }, [callStatus]);

  // Handlers for phone bar actions
  const handleTransfer = () => {
    // Toggle contacts section
    setExpandedSection(expandedSection === 'contacts' ? 'none' : 'contacts');
  };
  
  const handleHold = () => {
    console.log('Put on hold pressed');
    // Toggle hold state
    setIsMuted(!isMuted);
  };
  
  const handleRecents = () => {
    // Toggle recent calls section
    setExpandedSection(expandedSection === 'recent' ? 'none' : 'recent');
  };
  
  const handleEndCall = () => {
    setCallStatus('ended');
    // Reset call panel
    setTimeout(() => {
      setCallStatus('none');
      setCallDuration(0);
      setCallNotes('');
    }, 3000);
  };
  
  const handleKeypadToggle = () => {
    setExpandedSection(expandedSection === 'keypad' ? 'none' : 'keypad');
  };
  
  const handleKeyPress = (key: string) => {
    console.log(`Key pressed: ${key}`);
    // Play DTMF tone if needed
  };
  
  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };
  
  const handleSpeakerToggle = () => {
    setIsSpeakerOn(!isSpeakerOn);
  };
  
  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCallNotes(e.target.value);
  };
  
  const handleContactClick = (id: string) => {
    setActiveContactId(id === activeContactId ? null : id);
  };
  
  const handleIncomingCallAccept = () => {
    setCallStatus('active');
  };
  
  const handleIncomingCallReject = () => {
    setCallStatus('none');
  };
  
  const callIncomingUser = () => {
    setCallStatus('incoming');
    
    // Auto-accept after 10 seconds if not answered
    setTimeout(() => {
      if (callStatus === 'incoming') {
        handleIncomingCallAccept();
      }
    }, 10000);
  };
  
  // Animate the bar container
  const phoneBarVariants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
    hover: {
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)',
      transition: { duration: 0.2 },
    },
    maximized: {
      height: 'auto',
      transition: { duration: 0.4 }
    },
    minimized: {
      height: 'auto',
      transition: { duration: 0.4 }
    }
  };
  
  const expandedSectionVariants = {
    hidden: { opacity: 0, height: 0, overflow: 'hidden' },
    visible: { 
      opacity: 1, 
      height: 'auto', 
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen pb-10"
    >
      {/* Hidden audio for incoming call sound */}
      <audio ref={pendingCallRef} src="/sounds/incoming-call.mp3" />
      
      <div className="max-w-7xl mx-auto space-y-6 px-4 md:px-0">
        {/* ---------- ENHANCED HEADER ---------- */}
        <div className="relative mb-8 overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100">
          {/* Enhanced gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#004AC8]/10 via-[#4056F4]/5 to-[#4BB2F6]/10 rounded-3xl pointer-events-none" />
          
          {/* Decorative elements */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-indigo-400/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-sky-300/20 rounded-full blur-3xl transform -translate-y-1/2"></div>
          
          <div className="relative py-8 px-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="hidden md:block">
                  <div className="relative">
                    <Avatar name="Alice Martin" size="lg" />
                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                </div>
                
                {/* Extension details */}
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                      <FiPhoneCall className="w-5 h-5" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#1B0353] to-[#4056F4] capitalize">
                      Poste de travail
                    </h1>
                    <div className="hidden md:flex px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      En ligne
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <p className="text-gray-700 font-medium">{extensionName}</p>
                    <p className="text-sm text-gray-600">Gérez vos appels, consultez l&apos;historique et accédez à vos contacts.</p>
                  </div>
                </div>
              </div>
              
              {/* Right side actions */}
              <div className="flex flex-wrap items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => callIncomingUser()}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl font-medium hover:bg-blue-100 transition-colors"
                >
                  <FiPhoneIncoming className="w-4 h-4" />
                  <span className="hidden sm:inline">Simuler appel entrant</span>
                </motion.button>
                
                <Link
                  href="/dashboard/pbx/journal-appels"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#004AC8] text-white rounded-xl font-medium hover:bg-[#003DA8] transition-colors shadow-md shadow-blue-300/20"
                >
                  <FiList className="w-4 h-4" />
                  Historique d&apos;appel
                </Link>
              </div>
            </div>
            
            {/* Status bar */}
            <div className="hidden md:flex mt-6 bg-white/70 backdrop-blur-sm rounded-xl p-3 border border-gray-100 justify-between">
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <FiCpu className="w-4 h-4 text-blue-700" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Statut SIP</div>
                    <div className="text-sm font-medium text-gray-800">Enregistré</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-green-100 rounded-lg">
                    <FiBarChart2 className="w-4 h-4 text-green-700" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Qualité</div>
                    <div className="text-sm font-medium text-gray-800">Excellente</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-purple-100 rounded-lg">
                    <FiClock className="w-4 h-4 text-purple-700" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Dernier appel</div>
                    <div className="text-sm font-medium text-gray-800">Il y a 32 min</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <FiInfo className="w-4 h-4" />
                  <span>Version: 2.3.1</span>
                </div>
                <div className="text-xs px-2 py-1 bg-blue-500 text-white rounded-md font-medium">PRO</div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- CALL SECTION ---------- */}
        <div className="relative">
          {/* Animated background glow for active/incoming calls */}
          <AnimatePresence>
            {(callStatus === 'active' || callStatus === 'incoming') && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 0.15,
                  scale: 1,
                  transition: { duration: 1 },
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute -inset-2 flex items-center justify-center"
              >
                <div
                  className={`w-full h-full rounded-3xl ${
                    callStatus === 'incoming'
                      ? 'bg-gradient-to-r from-violet-500 to-purple-600 animate-pulse'
                      : 'bg-gradient-to-r from-[#004AC8] to-[#4BB2F6]'
                  }`}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Call section container */}
          <motion.div
            variants={phoneBarVariants}
            initial="initial"
            animate={[
              "animate", 
              isMaximized ? "maximized" : "minimized"
            ]}
            whileHover="hover"
            className="relative bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden"
          >
            {/* Subtle pattern + gradient overlay */}
            <div
              className="absolute inset-0 opacity-5 bg-center bg-cover pointer-events-none"
              style={{
                backgroundImage:
                  "url('data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000000' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E')",
              }}
            />
            
            {/* Status bar */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                {callStatus === 'active' ? (
                  <>
                    <div className="flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      <span className="text-xs font-medium text-green-700">Appel en cours</span>
                    </div>
                    
                    <div className="h-3 w-px bg-gray-300 mx-2"></div>
                    
                    <div className="flex items-center gap-1.5">
                      <FiClock className="w-3 h-3 text-gray-500" />
                      <span className="text-xs font-medium text-gray-700">{formatDuration(callDuration)}</span>
                    </div>
                  </>
                ) : callStatus === 'incoming' ? (
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                    </span>
                    <span className="text-xs font-medium text-purple-700">Appel entrant</span>
                  </div>
                ) : callStatus === 'ended' ? (
                  <div className="flex items-center gap-1.5">
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    <span className="text-xs font-medium text-red-700">Appel terminé</span>
                    <span className="text-xs text-gray-500 ml-1.5">{formatDuration(callDuration)}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-400"></span>
                    <span className="text-xs font-medium text-gray-700">Aucun appel actif</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {callStatus === 'active' && (
                  <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-blue-50 rounded-full">
                    <CallQualityIndicator quality={callQuality} />
                    <span className="text-xs text-blue-700">Excellente qualité</span>
                  </div>
                )}
                
                <button 
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {isMaximized ? 
                    <FiMinimize2 className="w-4 h-4 text-gray-500" /> : 
                    <FiMaximize2 className="w-4 h-4 text-gray-500" />
                  }
                </button>
              </div>
            </div>

            {/* Call content */}
            <div className="p-6">
              {/* Incoming Call UI */}
              {callStatus === 'incoming' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="flex flex-col items-center py-8"
                >
                  <div className="relative mb-6">
                    <div className="absolute inset-0 animate-ping bg-purple-200 rounded-full opacity-50"></div>
                    <Avatar name={currentCall.name} size="lg" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">{currentCall.name}</h2>
                  {currentCall.company && (
                    <p className="text-gray-500 mb-2">{currentCall.company}</p>
                  )}
                  <p className="text-gray-700 font-mono mb-8">{currentCall.number}</p>
                  
                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleIncomingCallReject}
                      className="w-14 h-14 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 shadow-md"
                    >
                      <FiPhoneOff className="w-6 h-6" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleIncomingCallAccept}
                      className="w-14 h-14 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 shadow-md"
                    >
                      <FiPhoneCall className="w-6 h-6" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Active Call UI */}
              {callStatus === 'active' && (
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left side - Call info and notes */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                      <Avatar name={currentCall.name} size="md" />
                      
                      <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-1">{currentCall.name}</h2>
                        {currentCall.company && (
                          <p className="text-gray-500 mb-1">{currentCall.company}</p>
                        )}
                        <div className="flex items-center gap-2">
                          <p className="text-gray-700 font-mono text-sm">{currentCall.number}</p>
                          <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                            <FiCopy className="w-3.5 h-3.5 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Call notes */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Notes d&apos;appel</label>
                      <textarea
                        value={callNotes}
                        onChange={handleNoteChange}
                        placeholder="Ajoutez des notes pour cet appel..."
                        className="w-full h-36 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
                      ></textarea>
                    </div>
                    
                    {/* Quick actions */}
                    <div className="flex flex-wrap gap-2">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition-colors">
                        <FiFile className="w-3.5 h-3.5" />
                        Créer un ticket
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition-colors">
                        <FiCalendar className="w-3.5 h-3.5" />
                        Planifier
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition-colors">
                        <FiUploadCloud className="w-3.5 h-3.5" />
                        Enregistrer
                      </button>
                    </div>
                  </div>
                  
                  {/* Right side - Call controls */}
                  <div className="min-w-[280px] bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="flex flex-col items-center gap-4 mb-6">
                      {/* Call control actions */}
                      <div className="grid grid-cols-3 gap-3 w-full">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleKeypadToggle}
                          className={`p-3 rounded-xl flex flex-col items-center gap-1.5 ${
                            expandedSection === 'keypad' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-white text-gray-700 hover:bg-gray-100'
                          } transition-colors border border-gray-200`}
                        >
                          <FiHash className="w-5 h-5" />
                          <span className="text-xs font-medium">Clavier</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleMuteToggle}
                          className={`p-3 rounded-xl flex flex-col items-center gap-1.5 ${
                            isMuted 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-white text-gray-700 hover:bg-gray-100'
                          } transition-colors border border-gray-200`}
                        >
                          {isMuted ? <FiMicOff className="w-5 h-5" /> : <FiMic className="w-5 h-5" />}
                          <span className="text-xs font-medium">{isMuted ? 'Muet' : 'Micro'}</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleSpeakerToggle}
                          className={`p-3 rounded-xl flex flex-col items-center gap-1.5 ${
                            isSpeakerOn 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-white text-gray-700 hover:bg-gray-100'
                          } transition-colors border border-gray-200`}
                        >
                          {isSpeakerOn ? <FiVolume2 className="w-5 h-5" /> : <FiVolumeX className="w-5 h-5" />}
                          <span className="text-xs font-medium">Haut-parleur</span>
                        </motion.button>
                      </div>
                      
                      {/* Additional controls */}
                      <div className="grid grid-cols-2 gap-3 w-full">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleHold}
                          className={`p-3 rounded-xl flex items-center justify-center gap-2 ${
                            isMuted 
                              ? 'bg-amber-100 text-amber-700' 
                              : 'bg-white text-gray-700 hover:bg-gray-100'
                          } transition-colors border border-gray-200`}
                        >
                          <FiPauseCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">Attente</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleTransfer}
                          className={`p-3 rounded-xl flex items-center justify-center gap-2 ${
                            expandedSection === 'contacts' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-white text-gray-700 hover:bg-gray-100'
                          } transition-colors border border-gray-200`}
                        >
                          <FiUserPlus className="w-5 h-5" />
                          <span className="text-sm font-medium">Transfert</span>
                        </motion.button>
                      </div>
                    </div>
                    
                    {/* End call button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleEndCall}
                      className="w-full py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-md flex items-center justify-center gap-2"
                    >
                      <FiXCircle className="w-5 h-5" />
                      Terminer l&apos;appel
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Ended Call UI */}
              {callStatus === 'ended' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center py-8 text-center"
                >
                  <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                    <FiPhoneOff className="w-8 h-8" />
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-800 mb-1">Appel terminé</h2>
                  <p className="text-gray-600 mb-2">
                    Appel avec {currentCall.name} • {formatDuration(callDuration)}
                  </p>
                  
                  <div className="max-w-md text-center mt-4">
                    <h3 className="font-medium text-gray-700 mb-2">Notes d&apos;appel</h3>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
                      {callNotes || "Aucune note pour cet appel."}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* No Call UI */}
              {callStatus === 'none' && (
                <div className="flex flex-col md:flex-row gap-6 items-start py-4">
                  {/* Left side - Dial pad */}
                  <div className="flex-1 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex flex-col gap-4">
                      <input
                        type="text"
                        placeholder="Entrez un numéro de téléphone..."
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-center font-mono text-lg"
                      />
                      
                      <Keypad onKeyPress={handleKeyPress} />
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-md flex items-center justify-center gap-2"
                      >
                        <FiPhone className="w-5 h-5" />
                        Appeler
                      </motion.button>
                    </div>
                  </div>
                  
                  {/* Right side - Quick actions */}
                  <div className="w-full md:w-auto md:min-w-[300px]">
                    {/* Recent calls preview */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-800">Appels récents</h3>
                        <button 
                          onClick={handleRecents}
                          className="text-blue-600 text-sm hover:text-blue-800 font-medium"
                        >
                          Voir tous
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        {sampleCallHistory.slice(0, 3).map(call => (
                          <div 
                            key={call.id}
                            className="flex items-center justify-between gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <CallTypeIcon type={call.type} />
                              </div>
                              <div>
                                <div className="font-medium text-gray-800">{call.name}</div>
                                <div className="text-xs text-gray-500">{call.timestamp}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-600">{call.duration}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Favorites */}
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">Favoris</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {sampleContacts.filter(c => c.favorite).map(contact => (
                          <motion.div
                            key={contact.id}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className="p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all cursor-pointer flex flex-col items-center gap-2"
                          >
                            <Avatar name={contact.name} size="sm" />
                            <div className="text-center">
                              <div className="font-medium text-gray-800 text-sm">{contact.name}</div>
                              <div className="text-xs text-gray-500 truncate w-full">{contact.company}</div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Expandable Sections: Keypad, Contacts, Recent Calls */}
              <AnimatePresence>
                {expandedSection === 'keypad' && (
                  <motion.div
                    variants={expandedSectionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="mt-6 border-t border-gray-200 pt-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-800">Clavier numérique</h3>
                      <button 
                        onClick={() => setExpandedSection('none')}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <input
                        type="text"
                        placeholder="Entrez les chiffres..."
                        className="w-full max-w-xs px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-center font-mono mb-4"
                      />
                      
                      <Keypad onKeyPress={handleKeyPress} />
                    </div>
                  </motion.div>
                )}
                
                {expandedSection === 'contacts' && (
                  <motion.div
                    variants={expandedSectionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="mt-6 border-t border-gray-200 pt-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-800">Contacts</h3>
                      <button 
                        onClick={() => setExpandedSection('none')}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="flex flex-col">
                      <div className="relative mb-4">
                        <input
                          type="text"
                          placeholder="Rechercher un contact..."
                          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        />
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {sampleContacts.map(contact => (
                          <motion.div
                            key={contact.id}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => handleContactClick(contact.id)}
                            className={`p-4 border rounded-xl cursor-pointer transition-all ${
                              activeContactId === contact.id 
                                ? 'border-blue-300 bg-blue-50' 
                                : 'border-gray-200 bg-white hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Avatar name={contact.name} size="sm" />
                              <div>
                                <div className="font-medium text-gray-800">{contact.name}</div>
                                {contact.company && (
                                  <div className="text-xs text-gray-500">{contact.company}</div>
                                )}
                              </div>
                            </div>
                            
                            <div className="mt-3 flex items-center justify-between">
                              <div className="text-sm font-mono text-gray-600">{contact.number}</div>
                              <div className="flex gap-2">
                                {activeContactId === contact.id && (
                                  <>
                                    <motion.button
                                      initial={{ scale: 0, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      className="p-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                                    >
                                      <FiPhone className="w-4 h-4" />
                                    </motion.button>
                                    <motion.button
                                      initial={{ scale: 0, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1, transition: { delay: 0.1 } }}
                                      className="p-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                                    >
                                      <FiUserPlus className="w-4 h-4" />
                                    </motion.button>
                                  </>
                                )}
                                {contact.favorite && (
                                  <div className="p-1.5 text-amber-500">
                                    <FiStar className="w-4 h-4 fill-current" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {expandedSection === 'recent' && (
                  <motion.div
                    variants={expandedSectionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="mt-6 border-t border-gray-200 pt-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-800">Appels récents</h3>
                      <button 
                        onClick={() => setExpandedSection('none')}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="overflow-hidden rounded-xl border border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Type
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Contact
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Heure
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Durée
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                              <span className="sr-only">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {sampleCallHistory.map((call) => (
                            <tr key={call.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                  <CallTypeIcon type={call.type} />
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="font-medium text-gray-800">{call.name}</div>
                                <div className="text-xs text-gray-500">{call.number}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {call.timestamp}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {call.duration}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-blue-600 hover:text-blue-800 mr-3">
                                  <FiPhone className="w-4 h-4" />
                                </button>
                                <button className="text-gray-500 hover:text-gray-700">
                                  <FiInfo className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
        
        {/* Info Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3"
        >
          <div className="p-1.5 bg-blue-100 rounded-lg flex-shrink-0">
            <FiInfo className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-700">Information</h3>
            <p className="text-sm text-blue-600 mt-1">
              Cette interface vous permet de gérer vos appels directement depuis votre navigateur. 
              Utilisez les boutons pour transférer, mettre en attente ou terminer les appels.
              Vous pouvez également consulter votre historique d&apos;appels récents.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
