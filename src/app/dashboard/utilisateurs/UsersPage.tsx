'use client';
import { useState, useRef, useEffect, JSX } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUsers,
  FiUserPlus,
  FiUserCheck,
  FiArrowUp,
  FiUser,
  FiEdit,
  FiCheck,
  FiEye,
  FiSearch,
  FiFilter,
  FiChevronLeft,
  FiMail,
  FiPhone,
  FiPhoneIncoming,
  FiGlobe,
  FiShield,
  FiLock,
  FiList,
  FiGrid,
  FiArrowDown,
  // FiPhoneCall,
  // FiUserX,
  // FiUserCheck,
  // FiEdit2,
  FiArrowRight,
  FiSettings,
  FiAlertTriangle,
  FiClock,
  FiCalendar,
  FiBarChart2,
  FiRefreshCw,
  FiPlus,
  FiKey,
  FiMapPin,
  // FiToggleRight,
  // FiToggleLeft,
  FiSend,
  FiXCircle,
  FiChevronRight,
  FiStar,
  FiInfo,
  // FiMoreVertical,
  // FiCheck,
  FiLogOut,
  FiTrash2,
  FiCheckCircle,
  FiHome,
  FiPhoneCall,
  FiSmartphone,
  FiActivity,
  FiMonitor,
  FiPhoneOutgoing,
  FiUpload,
  FiBox,
  FiFileText,
  FiFile,
  FiClipboard,
  FiTool,
  FiHash,
  FiImage,
  FiCreditCard,
  FiPercent,
  FiMessageSquare,
  FiPlusCircle,
  FiUserX,
  FiSlash,
  // FiDownload,
  FiCornerUpRight,
  FiExternalLink,
  FiCopy
} from 'react-icons/fi';
import { FaEuroSign } from 'react-icons/fa';
import { CiChat1 } from 'react-icons/ci';
import { PiToolbox } from 'react-icons/pi';

// Define interfaces for our data structures
interface UserNotifications {
  email: boolean;
  sms: boolean;
  application: boolean;
}

interface User {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  role: string;
  statut: string;
  dateCreation: string;
  derniereMaj: string;
  derniereConnexion: string;
  adresse: string;
  avatar: string;
  permissions: string[];
  notes: string;
  authMethod: string;
  language: string;
  notifications: UserNotifications;
}

interface Statistic {
  title: string;
  value: string | number;
  icon: JSX.Element;
  change: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

interface PermissionCategories {
  [key: string]: {
    title: string;
    icon: JSX.Element;
    items: PermissionItem[];
  };
}

interface PermissionItem {
  name: string;
  key: string;
  icon: JSX.Element;
  subItems?: PermissionItem[];
}

interface UserPermissions {
  [key: string]: boolean;
}

// Define roles with colors
interface Role {
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
  permissions: string[];
  description: string;
}

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

// const slideRight = {
//   hidden: { x: -20, opacity: 0 },
//   visible: { x: 0, opacity: 1 }
// };

// New breadcrumb component
import Link from 'next/link';

// Updated Breadcrumbs component with navigation
const Breadcrumbs = ({ items }: { items: string[] }) => (
  <div className="flex items-center text-sm text-gray-600 mb-6">
    <FiHome className="mr-2 text-gray-500" />
    {items.map((item, index) => (
      <div key={index} className="flex items-center">
        {index > 0 && <FiChevronRight className="mx-2 text-gray-400" />}
        {index === items.length - 1 ? (
          <span className="text-[#004AC8] font-medium">{item}</span>
        ) : (
          <Link 
            href={item === 'Accueil' ? '/dashboard/accueil' : `/${item.toLowerCase()}`}
            className="hover:text-[#004AC8] transition-colors duration-200"
          >
            {item}
          </Link>
        )}
      </div>
    ))}
  </div>
);

export default function Utilisateurs() {
  // State for active tab and selections
  const [activeTab, setActiveTab] = useState<string>('utilisateurs');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'liste'>('grid'); // Default to grid/box view
  const [ , setEditMode] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalData, setModalData] = useState<User | null>(null);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning'>('success');
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [confirmationAction, setConfirmationAction] = useState<() => void>(() => {});
  const [confirmationMessage, setConfirmationMessage] = useState<string>('');
  
  // For role modal
  const [showRoleModal, setShowRoleModal] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('Tous');
  const [roleFilter, setRoleFilter] = useState<string>('Tous');
  const [lastLoginFilter, setLastLoginFilter] = useState<string>('Tous');

  const [showAddRoleModal, setShowAddRoleModal] = useState<boolean>(false);
  const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false);
  const [ , setEditUserData] = useState<User | null>(null);

  // Add these new refs for the modals
  const addRoleModalRef = useRef<HTMLDivElement>(null);
  const addUserModalRef = useRef<HTMLDivElement>(null);
  
  function initializeTabs() {
    const tabs = ['info', 'lines', 'activity', 'permissions'];
    
    tabs.forEach(tab => {
      const tabButton = document.getElementById(`${tab}-tab`);
      const tabContent = document.getElementById(`${tab}-tab-content`);
      
      if (tabButton && tabContent) {
        tabButton.addEventListener('click', () => {
          // Hide all content
          tabs.forEach(t => {
            const content = document.getElementById(`${t}-tab-content`);
            if (content) {
              content.classList.add('hidden');
            }
            const button = document.getElementById(`${t}-tab`);
            if (button) {
              button.classList.remove('border-b-2', 'border-indigo-500', 'text-indigo-600');
              button.classList.add('text-gray-500');
            }
          });
          
          // Show selected content
          tabContent.classList.remove('hidden');
          tabButton.classList.add('border-b-2', 'border-indigo-500', 'text-indigo-600');
          tabButton.classList.remove('text-gray-500');
        });
      }
    });
  }

  interface StepIndicatorElement extends HTMLElement {
    classList: DOMTokenList;
  }

  interface StepContent extends HTMLElement {
    classList: DOMTokenList;
  }

  interface ProgressBar extends HTMLElement {
    style: CSSStyleDeclaration;
  }

  interface StepIndicatorContainer extends HTMLElement {
    innerHTML: string;
  }

  interface NavigationButton extends HTMLElement {
    classList: DOMTokenList;
    querySelector: (selector: string) => HTMLElement | null;
  }

  interface StepLabels {
    [key: number]: string;
  }

  function navigateStep(stepNumber: number): void {
    const stepLabels: StepLabels = {
      1: 'Informations personnelles',
      2: 'Permissions',
      3: 'Notifications'
    };

    // Update step indicators
    document.querySelectorAll<StepIndicatorElement>('[id^="step-"][id$="-indicator"]').forEach((el, index) => {
      if (index + 1 === stepNumber) {
        el.classList.add('bg-indigo-100', 'text-indigo-700');
        el.classList.remove('bg-gray-100', 'text-gray-600');
      } else if (index + 1 < stepNumber) {
        el.classList.add('bg-green-100', 'text-green-700');
        el.classList.remove('bg-gray-100', 'text-gray-600', 'bg-indigo-100', 'text-indigo-700');
      } else {
        el.classList.add('bg-gray-100', 'text-gray-600');
        el.classList.remove('bg-indigo-100', 'text-indigo-700', 'bg-green-100', 'text-green-700');
      }
    });
    
    // Update progress bar for mobile
    const progressBar = document.getElementById('mobile-progress-bar') as ProgressBar | null;
    if (progressBar) {
      progressBar.style.width = `${(stepNumber / 3) * 100}%`;
    }
    
    // Show/hide content for each step
    for (let i = 1; i <= 3; i++) {
      const content = document.getElementById(`step-${i}-content`) as StepContent | null;
      if (content) {
        if (i === stepNumber) {
          content.classList.remove('hidden');
        } else {
          content.classList.add('hidden');
        }
      }
    }
    
    // Update footer step indicator
    const stepIndicator = document.getElementById('step-indicator') as StepIndicatorContainer | null;
    if (stepIndicator) {
      const label = stepLabels[stepNumber];
      stepIndicator.innerHTML = `<span class="text-indigo-600 font-medium">Étape ${stepNumber}/3:</span> <span class="ml-1 text-gray-600">${label}</span>`;
    }
    
    // Show/hide back button
    const backButton = document.getElementById('back-button') as NavigationButton | null;
    if (backButton) {
      if (stepNumber > 1) {
        backButton.classList.remove('hidden');
      } else {
        backButton.classList.add('hidden');
      }
    }
    
    // Update next button text on final step
    const nextButton = document.getElementById('next-button') as NavigationButton | null;
    if (nextButton) {
      const nextSpan = nextButton.querySelector('span');
      if (nextSpan) {
        nextSpan.textContent = stepNumber === 3 ? 'Créer l\'utilisateur' : 'Suivant';
      }
    }
  }
  
  // Initialize tabs when modal opens
  if (showModal) {
    setTimeout(initializeTabs, 100);
  }

  // Define available roles
  const roles: Role[] = [
    {
      name: 'Administrateur',
      color: 'text-indigo-800',
      bgColor: 'bg-indigo-100',
      borderColor: 'border-indigo-300',
      permissions: ['*'],
      description: 'Accès complet à toutes les fonctionnalités du système'
    },
    {
      name: 'Comptable',
      color: 'text-yellow-800',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-300',
      permissions: ['reglements_comptabilite:*', 'documents_ventes:*', 'parametre_societe:taxes'],
      description: 'Accès aux fonctionnalités comptables et financières'
    },
    {
      name: 'Commercial',
      color: 'text-blue-800',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-300',
      permissions: ['crm:*', 'clients:*', 'produits:*', 'documents_ventes:devis'],
      description: 'Accès aux fonctionnalités de vente et relation client'
    },
    {
      name: 'Support',
      color: 'text-green-800',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-300',
      permissions: ['support:*', 'pbx:journal-appels', 'clients:view'],
      description: 'Accès aux tickets et support client'
    },
    {
      name: 'Technicien',
      color: 'text-purple-800',
      bgColor: 'bg-purple-100',
      borderColor: 'border-purple-300',
      permissions: ['pbx:*', 'support:*'],
      description: 'Accès aux configurations techniques et systèmes'
    },
    {
      name: 'Ressources Humaines',
      color: 'text-pink-800',
      bgColor: 'bg-pink-100',
      borderColor: 'border-pink-300',
      permissions: ['utilisateurs:*'],
      description: 'Gestion des utilisateurs et membres d\'équipe'
    }
  ];
  
  // Sample users data
  const [usersData] = useState<User[]>([
    {
      id: 'USR-001',
      prenom: 'Jean',
      nom: 'Dupont',
      email: 'jean.dupont@example.com',
      telephone: '+33601020304',
      role: 'Administrateur',
      statut: 'Actif',
      dateCreation: '15/01/2023',
      derniereMaj: '05/03/2025',
      derniereConnexion: '05/03/2025 10:25',
      adresse: '123 Rue Principale, 75001 Paris',
      avatar: '/avatars/jean.jpg',
      permissions: ['*'],
      notes: 'Directeur général',
      authMethod: '2FA',
      language: 'fr',
      notifications: {
        email: true,
        sms: false,
        application: true
      }
    },
    {
      id: 'USR-002',
      prenom: 'Marie',
      nom: 'Martin',
      email: 'marie.martin@example.com',
      telephone: '+33607080910',
      role: 'Comptable',
      statut: 'Actif',
      dateCreation: '20/01/2023',
      derniereMaj: '01/03/2025',
      derniereConnexion: '04/03/2025 14:32',
      adresse: '45 Avenue de la Liberté, 69001 Lyon',
      avatar: '/avatars/marie.jpg',
      permissions: ['reglements_comptabilite:*', 'documents_ventes:*', 'parametre_societe:taxes'],
      notes: 'Responsable comptabilité',
      authMethod: 'Standard',
      language: 'fr',
      notifications: {
        email: true,
        sms: true,
        application: true
      }
    },
    {
      id: 'USR-003',
      prenom: 'Pierre',
      nom: 'Dubois',
      email: 'pierre.dubois@example.com',
      telephone: '+33612345678',
      role: 'Commercial',
      statut: 'Actif',
      dateCreation: '05/02/2023',
      derniereMaj: '28/02/2025',
      derniereConnexion: '05/03/2025 09:15',
      adresse: '8 Rue du Commerce, 33000 Bordeaux',
      avatar: '/avatars/pierre.jpg',
      permissions: ['crm:*', 'clients:*', 'produits:*', 'documents_ventes:devis'],
      notes: 'Responsable grands comptes',
      authMethod: 'Standard',
      language: 'fr',
      notifications: {
        email: true,
        sms: true,
        application: false
      }
    },
    {
      id: 'USR-004',
      prenom: 'Sophie',
      nom: 'Lefebvre',
      email: 'sophie.lefebvre@example.com',
      telephone: '+33623456789',
      role: 'Support',
      statut: 'Actif',
      dateCreation: '10/03/2023',
      derniereMaj: '25/02/2025',
      derniereConnexion: '04/03/2025 16:50',
      adresse: '27 Boulevard des Clients, 59000 Lille',
      avatar: '/avatars/sophie.jpg',
      permissions: ['support:*', 'pbx:journal-appels', 'clients:view'],
      notes: 'Support client niveau 2',
      authMethod: 'Standard',
      language: 'fr',
      notifications: {
        email: true,
        sms: false,
        application: true
      }
    },
    {
      id: 'USR-005',
      prenom: 'Thomas',
      nom: 'Bernard',
      email: 'thomas.bernard@example.com',
      telephone: '+33634567890',
      role: 'Technicien',
      statut: 'Inactif',
      dateCreation: '15/04/2023',
      derniereMaj: '15/01/2025',
      derniereConnexion: '15/01/2025 11:20',
      adresse: '92 Rue de la Technique, 44000 Nantes',
      avatar: '/avatars/thomas.jpg',
      permissions: ['pbx:*', 'support:*'],
      notes: 'A quitté l\'entreprise le 15/01/2025',
      authMethod: 'Standard',
      language: 'fr',
      notifications: {
        email: false,
        sms: false,
        application: false
      }
    },
    {
      id: 'USR-006',
      prenom: 'Laura',
      nom: 'Petit',
      email: 'laura.petit@example.com',
      telephone: '+33645678901',
      role: 'Ressources Humaines',
      statut: 'Actif',
      dateCreation: '03/05/2023',
      derniereMaj: '20/02/2025',
      derniereConnexion: '05/03/2025 08:45',
      adresse: '17 Avenue des Employés, 13001 Marseille',
      avatar: '/avatars/laura.jpg',
      permissions: ['utilisateurs:*'],
      notes: 'Directrice des ressources humaines',
      authMethod: '2FA',
      language: 'fr',
      notifications: {
        email: true,
        sms: true,
        application: true
      }
    }
  ]);

  // Reference for closing modal when clicking outside
  const modalRef = useRef<HTMLDivElement>(null);

  // Update the event listeners to include the new refs
useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (
      (modalRef.current && !modalRef.current.contains(event.target as Node)) ||
      (roleModalRef.current && !roleModalRef.current.contains(event.target as Node)) ||
      (addRoleModalRef.current && !addRoleModalRef.current.contains(event.target as Node)) ||
      (addUserModalRef.current && !addUserModalRef.current.contains(event.target as Node))
    ) {
      closeAllModals();
    }
  }
  
  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  // Add a function to close all modals
  const closeAllModals = () => {
    closeModal();
    closeRoleModal();
    setShowAddRoleModal(false);
    setShowAddUserModal(false);
    setEditMode(false);
    setEditUserData(null);
  };

  // Update the existing edit mode handler
const handleEditMode = () => {
  if (modalData) {
    setEditMode(true);
    setEditUserData({...modalData});
  }
};

// Add handler for "Ajouter un rôle" button
const openAddRoleModal = () => {
  setShowAddRoleModal(true);
};

// Add handler for "Ajouter un utilisateur" button
const openAddUserModal = () => {
  setShowAddUserModal(true);
};

// Add these handlers to save changes
// const saveUserChanges = () => {
//   // Here you would normally save changes to the backend
//   showToastMessage("Les modifications ont été enregistrées", "success");
//   setEditMode(false);
//   closeModal();
// };

const saveNewRole = () => {
  // Here you would normally save the new role to the backend
  showToastMessage("Le nouveau rôle a été créé", "success");
  setShowAddRoleModal(false);
};

const saveNewUser = () => {
  // Here you would normally save the new user to the backend
  showToastMessage("Le nouvel utilisateur a été créé", "success");
  setShowAddUserModal(false);
};

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Reference for role modal
  const roleModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (roleModalRef.current && !roleModalRef.current.contains(event.target as Node)) {
        closeRoleModal();
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Permission categories for organization in modal
  const permissionCategories: PermissionCategories = {
    'pbx': {
      title: 'PBX',
      icon: <FiPhoneCall size={20} className="text-indigo-600" />,
      items: [
        { name: 'Tableau de bord', key: 'dashboard', icon: <FiHome size={18} className="text-gray-500" /> },
        { name: 'Mes lignes', key: 'mes-lignes', icon: <FiPhoneOutgoing size={18} className="text-gray-500" /> },
        { name: 'Mes numéros', key: 'mes-numeros', icon: <FiSmartphone size={18} className="text-gray-500" /> },
        { name: 'Applications', key: 'application', icon: <FiMail size={18} className="text-gray-500" /> },
        { name: "Journal d'appels & Enregistrements", key: 'journal-appels', icon: <FiPhoneCall size={18} className="text-gray-500" /> },
        { name: 'Statistiques', key: 'statistique', icon: <FiBarChart2 size={18} className="text-gray-500" /> },
        { name: 'Parc téléphonique', key: 'parc-telephone', icon: <FiMonitor size={18} className="text-gray-500" /> },
        { name: 'Statut système', key: 'statut', icon: <FiActivity size={18} className="text-gray-500" /> },
        { name: 'Postes de travail', key: 'poste-de-travail', icon: <FiUsers size={18} className="text-gray-500" /> }
      ]
    },
    'crm': {
      title: 'CRM',
      icon: <FiMail size={20} className="text-indigo-600" />,
      items: [
        { name: 'Tableau de bord', key: 'tableau-de-bord', icon: <FiHome size={18} className="text-gray-500" /> },
        { name: 'Prospects', key: 'prospects', icon: <FiUser size={18} className="text-gray-500" /> },
        { name: 'Importer prospects', key: 'importer-prospects', icon: <FiUpload size={18} className="text-gray-500" /> },
        { name: 'Calendrier', key: 'calendrier', icon: <FiCalendar size={18} className="text-gray-500" /> },
        { name: 'Chat', key: 'chat', icon: <CiChat1 size={18} className="text-gray-500" /> }
      ]
    },
    'clients': {
      title: 'Clients',
      icon: <FiUsers size={20} className="text-indigo-600" />,
      items: [
        { name: 'Clients', key: 'view', icon: <FiUsers size={18} className="text-gray-500" /> }
      ]
    },
    'produits': {
      title: 'Produits',
      icon: <FiBox size={20} className="text-indigo-600" />,
      items: [
        { name: 'Produits', key: 'view', icon: <FiBox size={18} className="text-gray-500" /> }
      ]
    },
    'documents_ventes': {
      title: 'Documents de ventes',
      icon: <FiFileText size={20} className="text-indigo-600" />,
      items: [
        { name: 'Devis', key: 'devis', icon: <FiFileText size={18} className="text-gray-500" /> },
        { name: 'Factures', key: 'factures', icon: <FiFile size={18} className="text-gray-500" /> },
        { name: 'Avoirs', key: 'avoirs', icon: <FiClipboard size={18} className="text-gray-500" /> },
        { name: "Factures d'acompte", key: 'factures-acompte', icon: <FiFileText size={18} className="text-gray-500" /> },
        { name: "Avoir d'acompte", key: 'avoirs-acompte', icon: <FiFile size={18} className="text-gray-500" /> }
      ]
    },
    'reglements_comptabilite': {
      title: 'Règlements & Comptabilité',
      icon: <FaEuroSign size={20} className="text-indigo-600" />,
      items: [
        { name: 'Règlements & Comptabilité', key: 'view', icon: <FaEuroSign size={18} className="text-gray-500" /> }
      ]
    },
    'parametre_societe': {
      title: 'Paramètres société',
      icon: <FiTool size={20} className="text-indigo-600" />,
      items: [
        { name: 'Coordonnées', key: 'coordonners', icon: <FiMapPin size={18} className="text-gray-500" /> },
        { 
          name: 'Identification', 
          key: 'identification',
          icon: <FiUser size={18} className="text-gray-500" />,
          subItems: [
            { name: 'Informations administratives', key: 'infos-administratives', icon: <FiInfo size={16} className="text-gray-500" /> },
            { name: 'Informations TVA', key: 'informations-tva', icon: <FiPercent size={16} className="text-gray-500" /> }
          ]
        },
        { name: 'Logo', key: 'logo', icon: <FiImage size={18} className="text-gray-500" /> },
        { name: 'Numerotation', key: 'numerotation', icon: <FiHash size={18} className="text-gray-500" /> },
        { name: 'Mentions legales des devis', key: 'mentions-devis', icon: <FiFileText size={18} className="text-gray-500" /> },
        { name: 'Mentions legales des factures', key: 'mentions-factures', icon: <FiFile size={18} className="text-gray-500" /> },
        { name: 'Taxes', key: 'taxes', icon: <FiPercent size={18} className="text-gray-500" /> },
        { name: 'Banque', key: 'banque', icon: <FiCreditCard size={18} className="text-gray-500" /> }
      ]
    },
    'modeles_de_documents': {
      title: 'Modèles de documents',
      icon: <FiFile size={20} className="text-indigo-600" />,
      items: [
        { name: 'Factures', key: 'factures', icon: <FiFile size={18} className="text-gray-500" /> },
        { name: 'Devis', key: 'devis', icon: <FiFileText size={18} className="text-gray-500" /> },
        { name: 'Avoirs', key: 'avoirs', icon: <FiClipboard size={18} className="text-gray-500" /> },
        { name: "Factures d'acompte", key: 'factures-acompte', icon: <FiFileText size={18} className="text-gray-500" /> },
        { name: "Avoir d'acompte", key: 'avoirs-acompte', icon: <FiFile size={18} className="text-gray-500" /> }
      ]
    },
    'modeles': {
      title: 'Modèles',
      icon: <FiMessageSquare size={20} className="text-indigo-600" />,
      items: [
        { name: 'Email', key: 'email', icon: <FiMail size={18} className="text-gray-500" /> },
        { name: 'SMS', key: 'sms', icon: <FiMessageSquare size={18} className="text-gray-500" /> }
      ]
    },
    'utilisateurs': {
      title: 'Utilisateurs',
      icon: <FiUsers size={20} className="text-indigo-600" />,
      items: [
        { name: 'Gestion des utilisateurs', key: 'view', icon: <FiUsers size={18} className="text-gray-500" /> },
        { name: 'Ajouter un utilisateur', key: 'add', icon: <FiUserPlus size={18} className="text-gray-500" /> },
        { name: 'Modifier un utilisateur', key: 'edit', icon: <FiEdit size={18} className="text-gray-500" /> },
        { name: 'Supprimer un utilisateur', key: 'delete', icon: <FiUserX size={18} className="text-gray-500" /> }
      ]
    },
    'support': {
      title: 'Support & Tickets',
      icon: <PiToolbox size={20} className="text-indigo-600" />,
      items: [
        { name: 'Support & Tickets', key: 'view', icon: <PiToolbox size={18} className="text-gray-500" /> }
      ]
    }
  };

  // New state for permission toggles (for the modal)
  const [ , setUserPermissions] = useState<UserPermissions>({});

  // Toast timers
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Statistics for dashboard
  const userStatistics: Statistic[] = [
    {
      title: "Utilisateurs actifs",
      value: `${usersData.filter(u => u.statut === 'Actif').length}`,
      icon: <FiUserCheck size={20} className="text-green-600" />,
      change: `Sur ${usersData.length} utilisateurs`,
      color: "text-green-600",
      bgColor: "bg-gradient-to-br from-green-50 to-green-100",
      borderColor: "border-green-200"
    },
    {
      title: "Rôles définis",
      value: roles.length,
      icon: <FiShield size={20} className="text-blue-600" />,
      change: "Types d'accès",
      color: "text-blue-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      borderColor: "border-blue-200"
    },
    {
      title: "Connectés aujourd'hui",
      value: usersData.filter(u => u.derniereConnexion && u.derniereConnexion.includes('05/03/2025')).length,
      icon: <FiClock size={20} className="text-amber-600" />,
      change: "Utilisateurs",
      color: "text-amber-600",
      bgColor: "bg-gradient-to-br from-amber-50 to-amber-100",
      borderColor: "border-amber-200"
    },
    {
      title: "Administrateurs",
      value: usersData.filter(u => u.role === 'Administrateur').length,
      icon: <FiShield size={20} className="text-indigo-600" />,
      change: "Avec droits étendus",
      color: "text-indigo-600",
      bgColor: "bg-gradient-to-br from-indigo-50 to-indigo-100",
      borderColor: "border-indigo-200"
    }
  ];

  // Filter options
  const statusOptions = ['Tous', 'Actif', 'Inactif'];
  const roleOptions = ['Tous', ...roles.map(r => r.name)];
  const lastLoginOptions = ['Tous', 'Aujourd\'hui', 'Cette semaine', 'Ce mois', '> 30 jours', 'Jamais'];

  // Handlers for toggling UI states
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'liste' ? 'grid' : 'liste');
  };

  const setActiveUserHandler = (id: string) => {
    const user = getUserById(id);
    setSelectedUser(id === selectedUser ? null : id);
    setEditMode(false);
    
    // Setup for modal
    if (user) {
      setModalData(user);
      
      // Prepare permission toggles
      const permToggles: UserPermissions = {};
      user.permissions.forEach(perm => {
        permToggles[perm] = true;
      });
      setUserPermissions(permToggles);
      setShowModal(true);
    }
  };

  const openRoleModal = (roleName: string) => {
    setSelectedRole(roleName);
    setShowRoleModal(true);
  };

  const closeRoleModal = () => {
    setShowRoleModal(false);
    setSelectedRole(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalData(null);
  };

  // Show toast message
  const showToastMessage = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  // Show confirmation dialog
  const showConfirmDialog = (message: string, action: () => void) => {
    setConfirmationMessage(message);
    setConfirmationAction(() => action);
    setShowConfirmation(true);
  };

  // Cancel confirmation
  const cancelConfirmation = () => {
    setShowConfirmation(false);
  };

  // Execute confirmation action
  const confirmAction = () => {
    confirmationAction();
    setShowConfirmation(false);
  };

  // const togglePermission = (permission: string) => {
  //   setUserPermissions({
  //     ...userPermissions,
  //     [permission]: !userPermissions[permission]
  //   });
  // };

  const sendCredentials = () => {
    // Implement the logic to send credentials
    if (modalData) {
      showToastMessage(`Identifiants envoyés à ${modalData.prenom} ${modalData.nom}`);
    }
  };

  const deactivateUser = () => {
    showConfirmDialog(
      "Êtes-vous sûr de vouloir désactiver cet utilisateur ? Il ne pourra plus se connecter au système.",
      () => {
        // Logic to deactivate user would go here
        showToastMessage("L'utilisateur a été désactivé");
        closeModal();
      }
    );
  };

  // Utility functions to retrieve data
  const getUserById = (id: string): User | undefined => usersData.find(user => user.id === id);
  const getRoleByName = (name: string): Role | undefined => roles.find(role => role.name === name);

  const getFilteredUsers = (): User[] => {
    return usersData.filter(user => {
      const matchesSearch =
        searchTerm === '' ||
        `${user.prenom} ${user.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.telephone.includes(searchTerm);
      const matchesStatus = statusFilter === 'Tous' || user.statut === statusFilter;
      const matchesRole = roleFilter === 'Tous' || user.role === roleFilter;
      // For simplicity, the last login filter is not fully implemented
      const matchesLastLogin = lastLoginFilter === 'Tous' || true;
      return matchesSearch && matchesStatus && matchesRole && matchesLastLogin;
    });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('Tous');
    setRoleFilter('Tous');
    setLastLoginFilter('Tous');
    showToastMessage("Filtres réinitialisés");
  };

  // Functions to get color classes based on status/role
  const getStatusColor = (statut: string): string => {
    switch(statut) {
      case 'Actif':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Inactif':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRoleColor = (roleName: string): string => {
    const role = getRoleByName(roleName);
    if (role) {
      return `${role.bgColor} ${role.color} ${role.borderColor}`;
    }
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  // Get user avatar with fallback
  const getUserAvatar = (user: User): JSX.Element => {
    if (!user.avatar || user.avatar.includes('missing')) {
      // Return initials as fallback
      return (
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-white text-lg font-bold shadow-md border-2 border-white">
          {user.prenom.charAt(0)}{user.nom.charAt(0)}
        </div>
      );
    }
    
    return (
      <div className="relative">
        <img 
          src={user.avatar} 
          alt={`${user.prenom} ${user.nom}`} 
          className="w-16 h-16 rounded-full object-cover shadow-md border-2 border-white" 
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.style.display = 'none';
            // Using optional chaining to safely access parentNode
            const parent = e.currentTarget.parentNode as HTMLElement;
            if (parent) {
              parent.innerHTML = `<div class="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-white text-lg font-bold shadow-md border-2 border-white">${user.prenom.charAt(0)}${user.nom.charAt(0)}</div>`;
            }
          }}
        />
        {user.statut === 'Actif' && (
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
        )}
      </div>
    );
  };

  // Custom button component for consistent styling
  const Button = ({ 
    children, 
    onClick, 
    variant = 'primary',
    size = 'md',
    className = '',
    ...props 
  }: {
    children: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    // [key: string]: any;
  }) => {
    const baseClasses = "flex items-center justify-center gap-2 rounded-xl font-medium transition-all shadow-sm";
    
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2.5",
      lg: "px-6 py-3 text-lg"
    };
    
    const variantClasses = {
      primary: "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white hover:shadow-md",
      secondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:shadow-md",
      outline: "bg-transparent border border-indigo-500 text-indigo-600 hover:bg-indigo-50",
      danger: "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white hover:shadow-md",
      success: "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white hover:shadow-md"
    };
    
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {children}
      </motion.button>
    );
  };

  // Get icon for toast notifications
  const getToastIcon = (type: 'success' | 'error' | 'warning') => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <FiXCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <FiAlertTriangle className="w-5 h-5 text-amber-600" />;
    }
  };

  // Get background color for toast notifications
  const getToastBgColor = (type: 'success' | 'error' | 'warning') => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-200';
      case 'error':
        return 'bg-red-100 border-red-200';
      case 'warning':
        return 'bg-amber-100 border-amber-200';
    }
  };
  
  // Animation variants for new header
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { ease: 'easeOut', duration: 0.6 },
    },
  };

  // Container variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="pt-20 min-h-screen bg-gray-50"
    >
      <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6">
        {/* Breadcrumbs */}
        <Breadcrumbs items={['Accueil', 'Utilisateurs']} />
        
        {/* New Header/Hero section styled like Statistiques page */}
        <motion.div
          variants={headerVariants}
          className="relative mb-8 overflow-hidden backdrop-blur-sm bg-white/80 rounded-3xl shadow-2xl border border-gray-100"
        >
          {/* Background gradient with pattern */}
          <div 
            className="absolute inset-0 opacity-5 mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '30px 30px'
            }}
          />
          
          {/* Blurred circles for decoration */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#004AC8]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#4BB2F6]/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="absolute inset-0 bg-gradient-to-br from-[#004AC8]/10 via-white/70 to-[#4BB2F6]/10 rounded-3xl pointer-events-none" />

          <div className="relative p-8 z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
              <div className="max-w-2xl">
                {/* Title with decorative elements */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#004AC8]/10 rounded-lg">
                    <FiUsers className="w-6 h-6 text-[#004AC8]" />
                  </div>
                  <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#1B0353] to-[#4BB2F6]">
                    Utilisateurs
                  </h1>
                  <span className="px-2 py-1 text-xs font-medium text-[#004AC8] bg-[#004AC8]/10 rounded-full">
                    {usersData.length} comptes
                  </span>
                </div>
                
                <p className="text-base text-gray-600 leading-relaxed">
                  Gérez les utilisateurs et les rôles d&apos;accès. Contrôlez les permissions et les autorisations 
                  d&apos;accès aux différentes fonctionnalités du système.
                </p>
              </div>
              
              <div className="flex space-x-4">
                <Button
                  variant="primary"
                  size="md"
                  onClick={openAddUserModal}
                  className="bg-gradient-to-r from-[#004AC8] to-[#4BB2F6]"
                >
                  <FiUserPlus className="h-5 w-5" />
                  <span>Ajouter un utilisateur</span>
                </Button>
              </div>
            </div>
            
            {/* Quick tip */}
            <div className="mt-6 flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl text-sm">
              <FiInfo className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-amber-700">Astuce :</span>{' '}
                <span className="text-amber-700">
                  Un utilisateur désactivé ne peut pas se connecter au système mais ses données restent accessibles. 
                  Pour une suppression définitive, utilisez l&apos;option &quot;Supprimer&quot;.
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="flex border-b">
            <button
              className={`flex-1 py-5 text-center transition duration-200 ${
                activeTab === 'utilisateurs'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50 font-semibold'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 font-medium'
              }`}
              onClick={() => setActiveTab('utilisateurs')}
            >
              <div className="flex justify-center items-center space-x-2">
                <FiUser className={`${activeTab === 'utilisateurs' ? 'text-indigo-600' : 'text-gray-500'} w-5 h-5`} />
                <span>Utilisateurs</span>
              </div>
            </button>
            <button
              className={`flex-1 py-5 text-center transition duration-200 ${
                activeTab === 'roles'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50 font-semibold'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 font-medium'
              }`}
              onClick={() => setActiveTab('roles')}
            >
              <div className="flex justify-center items-center space-x-2">
                <FiShield className={`${activeTab === 'roles' ? 'text-indigo-600' : 'text-gray-500'} w-5 h-5`} />
                <span>Rôles</span>
              </div>
            </button>
            {/* <button
              className={`flex-1 py-5 text-center transition duration-200 ${
                activeTab === 'permissions'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50 font-semibold'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 font-medium'
              }`}
              onClick={() => setActiveTab('permissions')}
            >
              <div className="flex justify-center items-center space-x-2">
                <FiLock className={`${activeTab === 'permissions' ? 'text-indigo-600' : 'text-gray-500'} w-5 h-5`} />
                <span>Permissions</span>
              </div>
            </button> */}
            <button
              className={`flex-1 py-5 text-center transition duration-200 ${
                activeTab === 'parametres'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50 font-semibold'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 font-medium'
              }`}
              onClick={() => setActiveTab('parametres')}
            >
              <div className="flex justify-center items-center space-x-2">
                <FiSettings className={`${activeTab === 'parametres' ? 'text-indigo-600' : 'text-gray-500'} w-5 h-5`} />
                <span>Paramètres</span>
              </div>
            </button>
          </div>

          {/* Content for Utilisateurs tab */}
          {activeTab === 'utilisateurs' && (
            <div className="p-8">
              {/* Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {userStatistics.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial="hidden"
                    animate="visible"
                    variants={slideUp}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`${stat.bgColor} p-6 rounded-xl border ${stat.borderColor} shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden group`}
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mt-8 -mr-8 group-hover:scale-110 transition-transform duration-500" />
                    <div className="flex items-center mb-3">
                      <div className="p-3 bg-white rounded-lg shadow-sm mr-4">
                        {stat.icon}
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        {stat.title}
                      </span>
                    </div>
                    <div className={`text-3xl font-bold ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-500 mt-2 flex items-center">
                      <FiBarChart2 className="mr-1" />
                      {stat.change}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Actions & Search Bar */}
              <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                {/* Search */}
                <div className="w-full md:w-96 relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Rechercher un utilisateur..."
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-gray-700"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    variant="secondary"
                    onClick={toggleFilters}
                  >
                    <FiFilter className="h-5 w-5" />
                    <span>
                      {showFilters ? 'Masquer filtres' : 'Filtres'}
                    </span>
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={toggleViewMode}
                  >
                    {viewMode === 'liste' ? <FiGrid className="h-5 w-5" /> : <FiList className="h-5 w-5" />}
                    <span className="hidden md:inline">
                      {viewMode === 'liste' ? 'Vue grille' : 'Vue liste'}
                    </span>
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-10 p-6 bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Statut
                        </label>
                        <select
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-700"
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                        >
                          {statusOptions.map((option, index) => (
                            <option key={index} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Rôle
                        </label>
                        <select
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-700"
                          value={roleFilter}
                          onChange={(e) => setRoleFilter(e.target.value)}
                        >
                          {roleOptions.map((option, index) => (
                            <option key={index} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Dernière connexion
                        </label>
                        <select
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-700"
                          value={lastLoginFilter}
                          onChange={(e) => setLastLoginFilter(e.target.value)}
                        >
                          {lastLoginOptions.map((option, index) => (
                            <option key={index} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <Button
                        variant="secondary"
                        onClick={resetFilters}
                        size="sm"
                      >
                        <FiRefreshCw className="h-4 w-4" />
                        <span>Réinitialiser</span>
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Users List */}
              {getFilteredUsers().length > 0 ? (
                <div className={`grid ${viewMode === 'liste' ? 'grid-cols-1 gap-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
                  {getFilteredUsers().map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial="hidden"
                      animate="visible"
                      variants={slideUp}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      onClick={() => setActiveUserHandler(user.id)}
                      className={`bg-white rounded-xl hover:shadow-lg transition-all cursor-pointer 
                        ${selectedUser === user.id ? 'ring-2 ring-indigo-500 shadow-md' : 'border border-gray-200 shadow-sm'}`}
                    >
                      {viewMode === 'liste' ? (
                        // List view
                        <div className="p-5 flex items-center relative overflow-hidden group">
                          <div className="absolute right-0 top-0 h-full w-2 bg-gradient-to-b from-indigo-500 to-indigo-700 opacity-0 transition-opacity duration-300 rounded-r-xl group-hover:opacity-40" 
                               style={{ opacity: selectedUser === user.id ? 1 : 0 }} />
                          <div className="mr-5">
                            {getUserAvatar(user)}
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">
                                  {user.prenom} {user.nom}
                                </h3>
                                <div className="flex items-center text-gray-500 mb-1">
                                  <FiMail className="mr-2 text-gray-400" size={14} />
                                  <span className="text-sm">{user.email}</span>
                                </div>
                                <div className="flex items-center text-gray-500">
                                  <FiPhone className="mr-2 text-gray-400" size={14} />
                                  <span className="text-sm">{user.telephone}</span>
                                </div>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full mb-2 border ${getStatusColor(user.statut)}`}>
                                  {user.statut}
                                </span>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getRoleColor(user.role)}`}>
                                  {user.role}
                                </span>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center text-gray-500">
                              <FiClock className="mr-2 text-gray-400" size={14} />
                              <span className="text-sm">Dernière connexion: {user.derniereConnexion}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Grid/Box view
                        <div className="p-6 relative overflow-hidden group">
                          <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-indigo-500 to-indigo-700 opacity-0 transition-opacity duration-300 group-hover:opacity-40" 
                              style={{ opacity: selectedUser === user.id ? 1 : 0 }} />
                          
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center">
                              {getUserAvatar(user)}
                              <div className="ml-3">
                                <h3 className="text-lg font-bold text-gray-900">
                                  {user.prenom} {user.nom}
                                </h3>
                                <p className="text-sm text-gray-500">{user.id}</p>
                              </div>
                            </div>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(user.statut)}`}>
                              {user.statut}
                            </span>
                          </div>
                          
                          <div className="space-y-3 mb-4">
                            <div className="flex items-center text-gray-600">
                              <FiMail className="mr-2 text-gray-400" />
                              <span className="text-sm truncate">{user.email}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <FiPhone className="mr-2 text-gray-400" />
                              <span className="text-sm">{user.telephone}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <FiClock className="mr-2 text-gray-400" />
                              <span className="text-sm">Connexion: {user.derniereConnexion.split(' ')[0]}</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getRoleColor(user.role)}`}>
                              {user.role}
                            </span>
                            <div className="flex items-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveUserHandler(user.id);
                                }}
                                className="p-1.5 rounded-full hover:bg-indigo-100 hover:text-indigo-600 transition-colors group-hover:text-indigo-600"
                              >
                                <FiEye className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  className="bg-white p-10 rounded-xl border border-gray-200 shadow-md text-center"
                >
                  <FiSearch className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                  <p className="text-gray-600 text-lg font-medium mb-2">Aucun utilisateur trouvé.</p>
                  <p className="text-gray-400">Essayez de modifier vos critères de recherche.</p>
                </motion.div>
              )}
            </div>
          )}

          {/* Content for Roles tab */}
          {activeTab === 'roles' && (
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Rôles d&apos;accès</h2>
                  <p className="text-sm text-gray-500">
                    Gérez les rôles et leurs permissions associées
                  </p>
                </div>
                <Button
                  variant="primary"
                  onClick={openAddRoleModal}
                >
                  <FiPlus />
                  <span>Ajouter un rôle</span>
                </Button>
              </div>
              
              {/* Roles Search */}
              <div className="w-full mb-8 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher un rôle..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-gray-700"
                />
              </div>
              
              {/* Roles List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map((role, index) => (
                  <motion.div
                    key={role.name}
                    initial="hidden"
                    animate="visible"
                    variants={slideUp}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    onClick={() => openRoleModal(role.name)}
                    className={`group bg-white p-6 rounded-xl cursor-pointer transition-all relative overflow-hidden
                      ${'border border-gray-200 shadow-sm hover:shadow-lg'}`}
                  >
                    <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-indigo-500 to-indigo-700 opacity-0 transition-opacity duration-300 group-hover:opacity-60" />
                        
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${role.bgColor} ${role.borderColor} mr-3`}>
                          <FiShield className={`${role.color}`} size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{role.name}</h3>
                      </div>
                      <div className="flex space-x-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openRoleModal(role.name);
                          }}
                          className="p-1.5 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4">{role.description}</p>
                    
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 font-medium">
                          {role.permissions.length} permission{role.permissions.length > 1 ? 's' : ''}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="group-hover:bg-indigo-50"
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation();
                            openRoleModal(role.name);
                          }}
                        >
                          <span>Détails</span>
                          <FiChevronRight className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Content for Permissions tab */}
          {/* {activeTab === 'permissions' && (
            <div className="p-8">
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg shadow-sm mr-4">
                    <FiShield className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Gestion des permissions</h2>
                    <p className="text-sm text-gray-500 mt-1">Configurez les autorisations pour les différents modules</p>
                  </div>
                </div>
                
                <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100 mb-8">
                  <div className="flex items-start">
                    <FiInfo className="text-indigo-600 mt-1 mr-3 flex-shrink-0" size={20} />
                    <p className="text-indigo-700 text-sm font-medium">
                      Cette section permet de visualiser les permissions disponibles. Pour attribuer ces permissions à un rôle ou un utilisateur, utilisez les sections correspondantes.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-8">
                  {Object.entries(permissionCategories).map(([key, category], index) => (
                    <motion.div
                      key={key}
                      initial="hidden"
                      animate="visible"
                      variants={slideRight}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border border-gray-200 rounded-xl overflow-hidden"
                    >
                      <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center">
                        <div className="p-2 bg-white rounded-lg shadow-sm mr-3">
                          {category.icon}
                        </div>
                        <h3 className="font-semibold text-gray-800">{category.title}</h3>
                      </div>
                      <div className="p-4 bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {category.items.map((item) => (
                            <div key={item.key} className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                              <div className="flex items-center">
                                <div className="mr-3">{item.icon}</div>
                                <div>
                                  <p className="font-medium text-gray-700">{item.name}</p>
                                  <p className="text-xs text-gray-500">{key}:{item.key}</p>
                                </div>
                              </div>
                              {item.subItems && item.subItems.length > 0 && (
                                <div className="mt-2 pl-8 border-l border-gray-100 space-y-2">
                                  {item.subItems.map((subItem) => (
                                    <div key={subItem.key} className="flex items-center text-sm">
                                      <div className="mr-2">{subItem.icon}</div>
                                      <p className="text-gray-600">{subItem.name}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )} */}

          {/* Content for Paramètres tab */}
          {activeTab === 'parametres' && (
            <div className="p-8">
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-lg">
                <div className="flex items-center mb-8">
                  <div className="p-3 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg shadow-sm mr-4">
                    <FiSettings className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Paramètres</h2>
                    <p className="text-sm text-gray-500 mt-1">Configuration du système et des préférences</p>
                  </div>
                </div>
                
                <div className="space-y-10">
                  <div className="border-b border-gray-200 pb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                      <FiShield className="mr-2 text-indigo-500" />
                      Sécurité
                    </h3>
                    <div className="space-y-6">
                      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                        <div>
                          <p className="font-semibold text-gray-700 mb-1">Authentification à deux facteurs</p>
                          <p className="text-sm text-gray-500">Exiger l&apos;authentification à deux facteurs pour tous les utilisateurs</p>
                        </div>
                        <div className="flex items-center">
                          <div className="w-14 h-8 flex items-center bg-indigo-100 rounded-full px-1 duration-300 ease-in-out cursor-pointer">
                            <motion.div 
                              initial={false}
                              animate={{ 
                                x: 0, 
                                backgroundColor: "#CBD5E1"
                              }}
                              className="bg-white w-6 h-6 rounded-full shadow-md"
                            ></motion.div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                        <div>
                          <p className="font-semibold text-gray-700 mb-1">Durée de session</p>
                          <p className="text-sm text-gray-500">Durée maximale d&apos;une session avant déconnexion automatique</p>
                        </div>
                        <select className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 font-medium">
                          <option>30 minutes</option>
                          <option>1 heure</option>
                          <option>4 heures</option>
                          <option>8 heures</option>
                          <option>24 heures</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-b border-gray-200 pb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                      <FiMail className="mr-2 text-indigo-500" />
                      Notifications
                    </h3>
                    <div className="space-y-6">
                      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                        <div>
                          <p className="font-semibold text-gray-700 mb-1">Email de bienvenue</p>
                          <p className="text-sm text-gray-500">Envoyer un email de bienvenue aux nouveaux utilisateurs</p>
                        </div>
                        <div className="flex items-center">
                          <div className="w-14 h-8 flex items-center bg-indigo-500 rounded-full px-1 duration-300 ease-in-out cursor-pointer">
                            <motion.div 
                              initial={false}
                              animate={{ 
                                x: 24,
                                backgroundColor: "#FFFFFF" 
                              }}
                              className="bg-white w-6 h-6 rounded-full shadow-md"
                            ></motion.div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                        <div>
                          <p className="font-semibold text-gray-700 mb-1">Alertes de connexion</p>
                          <p className="text-sm text-gray-500">Notifier les utilisateurs lors d&apos;une nouvelle connexion</p>
                        </div>
                        <div className="flex items-center">
                          <div className="w-14 h-8 flex items-center bg-indigo-500 rounded-full px-1 duration-300 ease-in-out cursor-pointer">
                            <motion.div 
                              initial={false}
                              animate={{ 
                                x: 24,
                                backgroundColor: "#FFFFFF" 
                              }}
                              className="bg-white w-6 h-6 rounded-full shadow-md"
                            ></motion.div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                      <FiSettings className="mr-2 text-indigo-500" />
                      Préférences
                    </h3>
                    <div className="space-y-6">
                      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                        <div>
                          <p className="font-semibold text-gray-700 mb-1">Langue par défaut</p>
                          <p className="text-sm text-gray-500">Langue par défaut pour les nouveaux utilisateurs</p>
                        </div>
                        <select className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 font-medium">
                          <option>Français</option>
                          <option>Anglais</option>
                          <option>Espagnol</option>
                          <option>Hébreu</option>
                          <option>Russe</option>
                        </select>
                      </div>
                      
                      {/* New addition: Timezone setting */}
                      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                        <div>
                          <p className="font-semibold text-gray-700 mb-1">Fuseau horaire</p>
                          <p className="text-sm text-gray-500">Fuseau horaire par défaut pour les dates et heures</p>
                        </div>
                        <select className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 font-medium">
                          <option>(GMT+01:00) Paris</option>
                          <option>(GMT+00:00) Londres</option>
                          <option>(GMT+02:00) Jérusalem</option>
                          <option>(GMT+03:00) Moscou</option>
                          <option>(GMT-05:00) New York</option>
                        </select>
                      </div>
                      
                      {/* New addition: Date format setting */}
                      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                        <div>
                          <p className="font-semibold text-gray-700 mb-1">Format de date</p>
                          <p className="text-sm text-gray-500">Format d&apos;affichage des dates dans l&apos;application</p>
                        </div>
                        <select className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 font-medium">
                          <option>DD/MM/YYYY (31/12/2025)</option>
                          <option>MM/DD/YYYY (12/31/2025)</option>
                          <option>YYYY-MM-DD (2025-12-31)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* New section: Export and import */}
                  <div className="border-t border-gray-200 pt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                      <FiUpload className="mr-2 text-indigo-500" />
                      Export et importation
                    </h3>
                    <div className="space-y-6">
                      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                        <div className="mb-3">
                          <p className="font-semibold text-gray-700 mb-1">Exportation des données</p>
                          <p className="text-sm text-gray-500">Téléchargez les données de l&apos;application au format CSV</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                          >
                            <FiUsers className="w-4 h-4 mr-2" />
                            <span>Utilisateurs</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                          >
                            <FiShield className="w-4 h-4 mr-2" />
                            <span>Rôles</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                          >
                            <FiFile className="w-4 h-4 mr-2" />
                            <span>Journaux d&apos;activité</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
<AnimatePresence>
  {showModal && modalData && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
    >
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
      >
        {/* Modal header */}
        <div className="sticky top-0 bg-white z-10 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg mr-3">
              <FiUser className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Détails de l&apos;utilisateur</h3>
          </div>
          <button
            onClick={closeModal}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Fermer"
          >
            <FiXCircle className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        
        {/* Modal content */}
        <div className="p-6">
          {/* User header info */}
          <div className="flex flex-col md:flex-row md:items-center mb-8 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
            <div className="flex-shrink-0">
              {getUserAvatar(modalData)}
            </div>
            
            <div className="flex-grow">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {modalData.prenom} {modalData.nom}
              </h2>
              <div className="flex items-center text-gray-500 text-sm mb-2">
                <span className="font-medium text-gray-600 mr-2">{modalData.id}</span>
                <span className="flex items-center">
                  <FiCalendar className="w-3.5 h-3.5 mr-1" />
                  Créé le {modalData.dateCreation}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(modalData.statut)}`}>
                  {modalData.statut}
                </span>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getRoleColor(modalData.role)}`}>
                  {modalData.role}
                </span>
                {modalData.authMethod === '2FA' && (
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                    2FA Activé
                  </span>
                )}
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200 flex items-center">
                  <FiSmartphone className="mr-1 w-3 h-3" />
                  1 ligne attribuée
                </span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant="primary"
                onClick={handleEditMode}
              >
                <FiEdit className="w-4 h-4" />
                <span>Modifier</span>
              </Button>
              
              <Button
                variant="secondary"
                onClick={sendCredentials}
              >
                <FiSend className="w-4 h-4" />
                <span>Envoyer identifiants</span>
              </Button>
            </div>
          </div>
          
          {/* Tabs for user details sections */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex flex-wrap space-x-8">
              <button id="info-tab" className="px-1 py-3 border-b-2 border-indigo-500 font-medium text-indigo-600">
                Informations
              </button>
              <button id="lines-tab" className="px-1 py-3 text-gray-500 hover:text-gray-700 font-medium">
                Lignes téléphoniques
              </button>
              <button id="activity-tab" className="px-1 py-3 text-gray-500 hover:text-gray-700 font-medium">
                Activité
              </button>
              <button id="permissions-tab" className="px-1 py-3 text-gray-500 hover:text-gray-700 font-medium">
                Permissions
              </button>
            </div>
          </div>
          
          {/* Tab content - Informations */}
          <div id="info-tab-content">
            {/* User information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FiUser className="mr-2 text-indigo-500" />
                  Coordonnées
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <div className="flex items-center mt-1 group">
                      <FiMail className="text-gray-400 mr-2 group-hover:text-indigo-500" />
                      <p className="font-medium text-gray-700">{modalData.email}</p>
                      <button className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded-full">
                        <FiCopy className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Téléphone</p>
                    <div className="flex items-center mt-1 group">
                      <FiPhone className="text-gray-400 mr-2 group-hover:text-indigo-500" />
                      <p className="font-medium text-gray-700">{modalData.telephone}</p>
                      <button className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded-full">
                        <FiCopy className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Adresse</p>
                    <div className="flex items-start mt-1">
                      <FiMapPin className="text-gray-400 mr-2 mt-0.5" />
                      <p className="font-medium text-gray-700">{modalData.adresse}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FiInfo className="mr-2 text-indigo-500" />
                  Détails du compte
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date de création</p>
                    <div className="flex items-center mt-1">
                      <FiCalendar className="text-gray-400 mr-2" />
                      <p className="font-medium text-gray-700">{modalData.dateCreation}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Dernière mise à jour</p>
                    <div className="flex items-center mt-1">
                      <FiRefreshCw className="text-gray-400 mr-2" />
                      <p className="font-medium text-gray-700">{modalData.derniereMaj}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Dernière connexion</p>
                    <div className="flex items-center mt-1">
                      <FiClock className="text-gray-400 mr-2" />
                      <p className="font-medium text-gray-700">{modalData.derniereConnexion}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Méthode d&apos;authentification</p>
                    <div className="flex items-center mt-1">
                      <FiKey className="text-gray-400 mr-2" />
                      <p className="font-medium text-gray-700">{modalData.authMethod}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Langue</p>
                    <div className="flex items-center mt-1">
                      <FiGlobe className="text-gray-400 mr-2" />
                      <p className="font-medium text-gray-700">{
                        modalData.language === 'fr' ? 'Français' :
                        modalData.language === 'en' ? 'Anglais' :
                        modalData.language === 'es' ? 'Espagnol' :
                        modalData.language === 'he' ? 'Hébreu' :
                        modalData.language === 'ru' ? 'Russe' :
                        modalData.language
                      }</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Notes */}
            {modalData.notes && (
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FiStar className="mr-2 text-indigo-500" />
                  Notes
                </h4>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <p className="text-gray-800">{modalData.notes}</p>
                </div>
              </div>
            )}
            
            {/* Role info */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FiShield className="mr-2 text-indigo-500" />
                Rôle
              </h4>
              
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  {getRoleByName(modalData.role) && (
                    <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${getRoleByName(modalData.role)?.bgColor} ${getRoleByName(modalData.role)?.borderColor} mr-3`}>
                      <FiShield className={getRoleByName(modalData.role)?.color} size={20} />
                    </div>
                  )}
                  <div>
                    <h5 className="font-semibold text-gray-800">{modalData.role}</h5>
                    <p className="text-sm text-gray-500">{getRoleByName(modalData.role)?.description}</p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (modalData.role) {
                        closeModal();
                        openRoleModal(modalData.role);
                      }
                    }}
                  >
                    <span>Détails du rôle</span>
                    <FiExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tab content - Lignes téléphoniques (initially hidden) */}
          <div id="lines-tab-content" className="hidden">
            <div className="mb-6 flex justify-between items-center">
              <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                <FiPhoneCall className="mr-2 text-indigo-500" />
                Lignes téléphoniques attribuées
              </h4>
              
              <Button
                variant="outline"
                size="sm"
              >
                <FiPlusCircle className="w-4 h-4 mr-2" />
                <span>Attribuer une ligne</span>
              </Button>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numéro</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appareil</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FiPhone className="text-gray-400 mr-2" />
                          <div className="font-medium text-gray-900">+33 1 23 45 67 89</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Fixe</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">IP Phone XR-400</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Actif
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900 p-1">
                            <FiSettings className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900 p-1">
                            <FiSlash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-gray-500">
                          <FiPlus className="text-gray-400 mr-2" />
                          <div className="italic">Aucune autre ligne attribuée</div>
                        </div>
                      </td>
                      <td colSpan={4} className="px-6 py-4 whitespace-nowrap"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FiActivity className="mr-2 text-indigo-500" />
                Statistiques d&apos;appels (30 derniers jours)
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">Appels sortants</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">42</p>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FiPhoneOutgoing className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 flex items-center">
                    <FiArrowUp className="w-3 h-3 text-green-500 mr-1" />
                    <span className="text-green-600 font-medium">+8%</span>
                    <span className="ml-1">vs mois précédent</span>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">Appels entrants</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">37</p>
                    </div>
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <FiPhoneIncoming className="w-5 h-5 text-indigo-600" />
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 flex items-center">
                    <FiArrowDown className="w-3 h-3 text-red-500 mr-1" />
                    <span className="text-red-600 font-medium">-3%</span>
                    <span className="ml-1">vs mois précédent</span>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">Durée moyenne</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">3m 27s</p>
                    </div>
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FiClock className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 flex items-center">
                    <FiArrowUp className="w-3 h-3 text-green-500 mr-1" />
                    <span className="text-green-600 font-medium">+12%</span>
                    <span className="ml-1">vs mois précédent</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tab content - Activity (initially hidden) */}
          <div id="activity-tab-content" className="hidden">
            <div className="mb-6 flex justify-between items-center">
              <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                <FiActivity className="mr-2 text-indigo-500" />
                Activité récente
              </h4>
              
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">Filtrer:</span>
                <select className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>Toutes les activités</option>
                  <option>Connexions</option>
                  <option>Modifications</option>
                  <option>Appels</option>
                </select>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
              <div className="space-y-6">
                <div className="relative pl-8 pb-6 border-l-2 border-indigo-200">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-indigo-500"></div>
                  <div className="flex justify-between">
                    <p className="font-medium text-gray-800">Connexion au système</p>
                    <span className="text-xs text-gray-500">Aujourd&apos;hui à 10:25</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Connexion réussie depuis l&apos;appareil Windows Chrome</p>
                  <p className="text-xs text-gray-500 mt-0.5">IP: 83.142.xx.xx · Paris, France</p>
                </div>
                
                <div className="relative pl-8 pb-6 border-l-2 border-green-200">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-green-500"></div>
                  <div className="flex justify-between">
                    <p className="font-medium text-gray-800">Modification du profil</p>
                    <span className="text-xs text-gray-500">Hier à 14:32</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Numéro de téléphone mis à jour</p>
                  <div className="text-xs text-gray-500 mt-0.5 flex">
                    <span className="inline-block line-through">+33601020304</span>
                    <FiArrowRight className="mx-1" />
                    <span className="inline-block">{modalData.telephone}</span>
                  </div>
                </div>
                
                <div className="relative pl-8 pb-6 border-l-2 border-blue-200">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-blue-500"></div>
                  <div className="flex justify-between">
                    <p className="font-medium text-gray-800">Attribution d&apos;une ligne</p>
                    <span className="text-xs text-gray-500">02/03/2025 à 09:15</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Ligne téléphonique attribuée: +33 1 23 45 67 89</p>
                  <p className="text-xs text-gray-500 mt-0.5">Attribuée par: Admin (Jean Dupont)</p>
                </div>
                
                <div className="relative pl-8 pb-0">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-gray-300"></div>
                  <div className="flex justify-between">
                    <p className="font-medium text-gray-800">Compte créé</p>
                    <span className="text-xs text-gray-500">{modalData.dateCreation}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Utilisateur ajouté au système</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tab content - Permissions (initially hidden) */}
          <div id="permissions-tab-content" className="hidden">
            {/* Permissions */}
            <div>
              <div className="mb-6 flex justify-between items-center">
                <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                  <FiLock className="mr-2 text-indigo-500" />
                  Permissions personnalisées
                </h4>
                
                <Button
                  variant="outline"
                  size="sm"
                >
                  <FiPlusCircle className="w-4 h-4 mr-2" />
                  <span>Ajouter une permission</span>
                </Button>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
                <div className="mb-4 flex items-center">
                  <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                    <FiShield className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800">Permissions héritées du rôle</h5>
                    <p className="text-sm text-gray-500">Ces permissions sont attribuées automatiquement via le rôle {modalData.role}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mt-4 border border-gray-100">
                  {modalData.permissions.some(p => p === '*') ? (
                    <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100 flex items-center justify-between">
                      <div className="flex items-center">
                        <FiCheckCircle className="text-indigo-500 mr-2" />
                        <span className="font-medium text-indigo-700">Accès complet à toutes les fonctionnalités</span>
                      </div>
                      <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full font-medium">Admin</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {Object.entries(permissionCategories).map(([categoryKey, category]) => {
                        const categoryPermissions = modalData.permissions.filter(
                          p => p.startsWith(categoryKey + ':')
                        );
                        
                        if (categoryPermissions.length === 0) return null;
                        
                        const hasAllInCategory = categoryPermissions.some(
                          p => p.split(':')[1] === '*'
                        );
                        
                        return (
                          <div key={categoryKey} className="p-3 bg-white hover:bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                {category.icon}
                                <div className="ml-2">
                                  <span className="font-medium text-gray-700">{category.title}</span>
                                  {hasAllInCategory ? (
                                    <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                      Toutes les permissions
                                    </span>
                                  ) : (
                                    <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                      {categoryPermissions.length} permission{categoryPermissions.length > 1 ? 's' : ''}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <button className="p-1.5 hover:bg-indigo-100 rounded text-gray-500 hover:text-indigo-600">
                                <FiChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="mb-4 flex justify-between items-center">
                  <div>
                    <h5 className="font-semibold text-gray-800">Permissions supplémentaires</h5>
                    <p className="text-sm text-gray-500">Permissions ajoutées en supplément du rôle</p>
                  </div>
                </div>
                
                {/* Here we would list any additional permissions beyond the role */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="text-center py-8">
                    <FiLock className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                    <p className="text-gray-500 text-sm">Aucune permission supplémentaire</p>
                    <button className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors inline-flex items-center">
                      <FiPlusCircle className="mr-2 h-4 w-4" />
                      Ajouter une permission
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Danger zone */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-lg font-semibold text-red-600 mb-4 flex items-center">
              <FiAlertTriangle className="mr-2" />
              Zone de danger
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex flex-col space-y-3">
                  <div>
                    <p className="font-medium text-red-700 mb-1">Désactiver l&apos;utilisateur</p>
                    <p className="text-sm text-red-600">L&apos;utilisateur ne pourra plus se connecter mais ses données seront conservées.</p>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={deactivateUser}
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span>Désactiver</span>
                  </Button>
                </div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex flex-col space-y-3">
                  <div>
                    <p className="font-medium text-red-700 mb-1">Supprimer l&apos;utilisateur</p>
                    <p className="text-sm text-red-600">Suppression définitive de l&apos;utilisateur et de toutes ses données.</p>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      showConfirmDialog(
                        "Êtes-vous sûr de vouloir supprimer définitivement cet utilisateur ? Cette action est irréversible.",
                        () => {
                          showToastMessage("L'utilisateur a été supprimé", "success");
                          closeModal();
                        }
                      );
                    }}
                  >
                    <FiTrash2 className="w-4 h-4" />
                    <span>Supprimer</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Modal footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={closeModal}
          >
            Fermer
          </Button>
          <Button
            variant="primary"
          >
            Enregistrer
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

      {/* Role Details Modal */}
      <AnimatePresence>
        {showRoleModal && selectedRole && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              ref={roleModalRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal header */}
              <div className="sticky top-0 bg-white z-10 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Détails du rôle</h3>
                <button
                  onClick={closeRoleModal}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <FiXCircle className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              
              {/* Modal content */}
              <div className="p-6">
                {/* Role header info */}
                {getRoleByName(selectedRole) && (
                  <div className="flex flex-col md:flex-row md:items-center mb-8 gap-6">
                    <div className="flex-shrink-0">
                      <div className={`w-16 h-16 flex items-center justify-center rounded-xl ${getRoleByName(selectedRole)?.bgColor} ${getRoleByName(selectedRole)?.borderColor} shadow-md`}>
                        <FiShield className={`${getRoleByName(selectedRole)?.color} w-8 h-8`} />
                      </div>
                    </div>
                    
                    <div className="flex-grow">
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        {selectedRole}
                      </h2>
                      <p className="text-gray-600">{getRoleByName(selectedRole)?.description}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="primary"
                      >
                        <FiEdit className="w-4 h-4" />
                        <span>Modifier</span>
                      </Button>
                      
                      <Button
                        variant="outline"
                      >
                        <FiCopy className="w-4 h-4" />
                        <span>Dupliquer</span>
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Permissions section */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                      <FiLock className="mr-2 text-indigo-500" />
                      Permissions associées
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      <FiPlusCircle className="w-4 h-4" />
                      <span>Ajouter</span>
                    </Button>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    {getRoleByName(selectedRole)?.permissions.includes('*') ? (
                      <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100 flex items-center justify-between">
                        <div className="flex items-center">
                          <FiCheckCircle className="text-indigo-500 mr-2" />
                          <span className="font-medium text-indigo-700">Accès complet à toutes les fonctionnalités</span>
                        </div>
                        <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full font-medium">Admin</span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {getRoleByName(selectedRole)?.permissions.map((permission, idx) => {
                          const [category, key] = permission.split(':');
                          const categoryInfo = permissionCategories[category];
                          const isWildcard = key === '*';
                          
                          return (
                            <div key={idx} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-between">
                              <div className="flex items-center">
                                {categoryInfo && categoryInfo.icon}
                                <span className="ml-2 font-medium text-gray-700">
                                  {categoryInfo ? categoryInfo.title : category} {isWildcard ? '(Tous)' : `: ${key}`}
                                </span>
                              </div>
                              <div className="flex space-x-1">
                                <button className="p-1.5 hover:bg-gray-200 rounded-full">
                                  <FiSlash className="w-4 h-4 text-gray-500" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Users with this role */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <FiUsers className="mr-2 text-indigo-500" />
                    Utilisateurs avec ce rôle
                  </h4>
                  
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="space-y-2">
                      {usersData
                        .filter(user => user.role === selectedRole)
                        .map((user, idx) => (
                          <div key={idx} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full overflow-hidden mr-3 bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                                {user.prenom.charAt(0)}{user.nom.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{user.prenom} {user.nom}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                closeRoleModal();
                                setActiveUserHandler(user.id);
                              }}
                            >
                              <span>Voir</span>
                              <FiCornerUpRight className="w-3 h-3 ml-1" />
                            </Button>
                          </div>
                        ))}
                    </div>
                    
                    {usersData.filter(user => user.role === selectedRole).length === 0 && (
                      <div className="text-center p-4">
                        <p className="text-gray-500">Aucun utilisateur n&apos;a ce rôle</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Danger zone for roles */}
                {selectedRole !== 'Administrateur' && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="text-lg font-semibold text-red-600 mb-4 flex items-center">
                      <FiAlertTriangle className="mr-2" />
                      Zone de danger
                    </h4>
                    
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                          <p className="font-medium text-red-700 mb-1">Supprimer ce rôle</p>
                          <p className="text-sm text-red-600">La suppression d&apos;un rôle affectera tous les utilisateurs qui y sont assignés.</p>
                        </div>
                        <Button
                          variant="danger"
                          className="mt-3 md:mt-0"
                          onClick={() => {
                            showConfirmDialog(
                              "Êtes-vous sûr de vouloir supprimer ce rôle ? Cette action affectera tous les utilisateurs associés.",
                              () => {
                                showToastMessage("Le rôle a été supprimé", "success");
                                closeRoleModal();
                              }
                            );
                          }}
                        >
                          <FiTrash2 className="w-4 h-4" />
                          <span>Supprimer</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Modal footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
                <Button
                  variant="secondary"
                  onClick={closeRoleModal}
                >
                  Fermer
                </Button>
                <Button
                  variant="primary"
                >
                  Enregistrer
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-5 right-5 ${getToastBgColor(toastType)} rounded-xl p-4 shadow-lg max-w-md z-50 flex items-center border`}
          >
            <div className="flex-shrink-0 mr-3">
              {getToastIcon(toastType)}
            </div>
            <div>
              <p className="font-medium text-gray-800">{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100 mb-4">
                  <FiAlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Confirmation</h3>
                <p className="text-gray-600 mb-6">{confirmationMessage}</p>
                
                <div className="flex justify-center gap-3">
                  <Button
                    variant="secondary"
                    onClick={cancelConfirmation}
                  >
                    Annuler
                  </Button>
                  <Button
                    variant="danger"
                    onClick={confirmAction}
                  >
                    Confirmer
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Role Modal */}
      <AnimatePresence>
        {showAddRoleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              ref={addRoleModalRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal header */}
              <div className="sticky top-0 bg-white z-10 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                    <FiShield className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Ajouter un nouveau rôle</h3>
                </div>
                <button
                  onClick={() => setShowAddRoleModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Fermer"
                >
                  <FiXCircle className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              
              {/* Modal content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nom du rôle <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Manager"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-700"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Couleur du rôle <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-7 gap-2">
                      {['indigo', 'blue', 'green', 'yellow', 'purple', 'pink', 'red'].map(color => (
                        <div key={color} className="relative">
                          <input 
                            type="radio" 
                            name="roleColor" 
                            id={`color-${color}`} 
                            value={color} 
                            className="sr-only"
                            defaultChecked={color === 'indigo'} 
                          />
                          <label 
                            htmlFor={`color-${color}`}
                            className={`flex items-center justify-center w-full h-10 rounded-lg cursor-pointer border-2 transition-all hover:opacity-90 bg-${color}-100 ${
                              color === 'indigo' ? `border-${color}-700 ring-2 ring-${color}-200` : 'border-transparent'
                            }`}
                          >
                            {color === 'indigo' && <FiCheck className={`text-${color}-700 w-5 h-5`} />}
                          </label>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2">
                      <div className="p-2 rounded-lg bg-indigo-100 text-indigo-800 text-sm inline-block">
                        Aperçu
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Décrivez les responsabilités de ce rôle..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-700 h-24"
                  ></textarea>
                </div>
                
                {/* Permissions section */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                        <FiLock className="w-5 h-5 text-indigo-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800">Permissions</h4>
                    </div>
                    
                    <div className="flex space-x-3">
                      {/* Admin toggle */}
                      <label className="flex items-center p-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm cursor-pointer hover:bg-indigo-100">
                        <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded border-indigo-300 mr-2 focus:ring-indigo-500" />
                        <span className="font-medium">Accès administrateur (*)</span>
                      </label>
                      
                      {/* Search */}
                      <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input 
                          type="text" 
                          placeholder="Rechercher..." 
                          className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm w-56"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Permissions list */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 max-h-96 overflow-y-auto">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <button className="px-3 py-1.5 bg-white text-gray-700 text-xs font-medium rounded-full border border-gray-200 hover:bg-gray-50 active:bg-gray-100">
                        Tout sélectionner
                      </button>
                      <button className="px-3 py-1.5 bg-white text-gray-700 text-xs font-medium rounded-full border border-gray-200 hover:bg-gray-50 active:bg-gray-100">
                        Tout désélectionner
                      </button>
                      {Object.keys(permissionCategories).map(category => (
                        <button 
                          key={category}
                          className="px-3 py-1.5 bg-white text-gray-700 text-xs font-medium rounded-full border border-gray-200 hover:bg-gray-50 active:bg-gray-100 flex items-center"
                        >
                          {permissionCategories[category].icon}
                          <span className="ml-1">{permissionCategories[category].title}</span>
                        </button>
                      ))}
                    </div>
                    
                    <div className="space-y-6">
                      {Object.entries(permissionCategories).map(([categoryKey, category]) => (
                        <div key={categoryKey} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                          <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                            <div className="flex items-center">
                              <div className="p-2 bg-white rounded-lg shadow-sm mr-3">
                                {category.icon}
                              </div>
                              <div>
                                <h5 className="font-semibold text-gray-800">{category.title}</h5>
                                <p className="text-xs text-gray-500">{categoryKey}</p>
                              </div>
                            </div>
                            <label className="flex items-center">
                              <input 
                                type="checkbox" 
                                className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer" 
                                onChange={(e) => {
                                  // This would select/deselect all permissions in this category
                                  const checkboxes = document.querySelectorAll(`input[data-category="${categoryKey}"]`);
                                  checkboxes.forEach(checkbox => {
                                    (checkbox as HTMLInputElement).checked = e.target.checked;
                                  });
                                }}
                              />
                              <span className="ml-2 text-sm font-medium text-gray-700">Tout sélectionner</span>
                            </label>
                          </div>
                          
                          <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-1">
                            {category.items.map((item) => (
                              <div key={`${categoryKey}-${item.key}`}>
                                <label className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    data-category={categoryKey}
                                    data-permission={`${categoryKey}:${item.key}`}
                                    className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 mr-3" 
                                  />
                                  <div>
                                    <div className="flex items-center">
                                      {item.icon}
                                      <p className="ml-2 text-sm font-medium text-gray-700">{item.name}</p>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5">{categoryKey}:{item.key}</p>
                                  </div>
                                </label>
                                
                                {item.subItems && item.subItems.length > 0 && (
                                  <div className="ml-10 border-l-2 border-gray-100 pl-2 mt-1">
                                    {item.subItems.map(subItem => (
                                      <label key={`${categoryKey}-${item.key}-${subItem.key}`} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                                        <input 
                                          type="checkbox" 
                                          data-category={categoryKey}
                                          data-permission={`${categoryKey}:${item.key}:${subItem.key}`}
                                          className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 mr-3" 
                                        />
                                        <div>
                                          <div className="flex items-center">
                                            {subItem.icon}
                                            <p className="ml-2 text-xs text-gray-700">{subItem.name}</p>
                                          </div>
                                          <p className="text-xs text-gray-500 mt-0.5">{categoryKey}:{item.key}:{subItem.key}</p>
                                        </div>
                                      </label>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-3 text-xs text-gray-500 flex items-center">
                    <FiInfo className="w-4 h-4 mr-1 text-gray-400" />
                    <span>Le symbole (*) correspond à un accès complet à toutes les fonctionnalités.</span>
                  </div>
                </div>
              </div>
              
              {/* Modal footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center text-sm">
                  <span className="text-indigo-600 mr-2">
                    <span className="font-medium">6</span> permissions sélectionnées
                  </span>
                  <span className="text-gray-500">sur 42 disponibles</span>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => setShowAddRoleModal(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    variant="primary"
                    onClick={saveNewRole}
                  >
                    Créer le rôle
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add User Modal */}
      <AnimatePresence>
        {showAddUserModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              ref={addUserModalRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal header with step indicator */}
              <div className="sticky top-0 bg-white z-10 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center">
                  <h3 className="text-xl font-bold text-gray-900 mr-4">Ajouter un nouvel utilisateur</h3>
                  <div className="hidden sm:flex items-center space-x-1 text-xs text-gray-500">
                    <span id="step-1-indicator" className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium">1. Infos de base</span>
                    <FiChevronRight className="text-gray-400" />
                    <span id="step-2-indicator" className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">2. Permissions</span>
                    <FiChevronRight className="text-gray-400" />
                    <span id="step-3-indicator" className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">3. Notifications</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Fermer"
                >
                  <FiXCircle className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              
              {/* Modal content with step-based rendering */}
              <div className="p-6">
                {/* Progress indicator for mobile */}
                <div className="block sm:hidden mb-6">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div id="mobile-progress-bar" className="bg-indigo-600 h-2.5 rounded-full w-1/3"></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>Infos</span>
                    <span>Permissions</span>
                    <span>Notifications</span>
                  </div>
                </div>

                {/* Step 1: Basic information form */}
                <div id="step-1-content" className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                      <FiUser className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800">Informations personnelles</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Prénom <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Prénom"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-700"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nom <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Nom"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-700"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="nom@exemple.com"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-700"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Téléphone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="+33 X XX XX XX XX"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-700"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <div className="flex items-start justify-between">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Adresse
                        </label>
                        <span className="text-xs text-gray-500 italic">(optionnel)</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Adresse complète"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-700"
                      />
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                        <FiShield className="w-5 h-5 text-indigo-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800">Rôle et accès système</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Rôle <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-700 appearance-none pr-10"
                            required
                          >
                            <option value="">Sélectionner un rôle</option>
                            {roles.map(role => (
                              <option key={role.name} value={role.name}>{role.name}</option>
                            ))}
                          </select>
                          <FiChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400" />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Le rôle détermine les permissions de base de l&apos;utilisateur</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Statut <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-700 appearance-none pr-10"
                            defaultValue="Actif"
                            required
                          >
                            <option value="Actif">Actif</option>
                            <option value="Inactif">Inactif</option>
                          </select>
                          <FiChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400" />
                        </div>
                      </div>

                      {/* Attribution de ligne */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Attribution de ligne
                        </label>
                        <div className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-1">Attribuer une ligne téléphonique</p>
                              <p className="text-xs text-gray-500">Sélectionnez une ligne à assigner à cet utilisateur</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="shrink-0"
                            >
                              <FiPhoneCall className="w-4 h-4 mr-2" />
                              <span>Attribuer une ligne</span>
                            </Button>
                          </div>
                          
                          <div className="mt-3 flex items-center p-3 bg-white border border-indigo-100 rounded-lg">
                            <div className="p-2 bg-indigo-100 rounded-full mr-3">
                              <FiPhone className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">Aucune ligne attribuée</p>
                              <p className="text-xs text-gray-500">Cliquez sur le bouton pour attribuer une ligne</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Langue <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-700 appearance-none pr-10"
                            defaultValue="fr"
                            required
                          >
                            <option value="fr">Français</option>
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="de">Deutsch</option>
                          </select>
                          <FiChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400" />
                        </div>
                      </div>
                      
                      <div className="md:col-span-2">
                        <div className="flex items-start justify-between">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Notes
                          </label>
                          <span className="text-xs text-gray-500 italic">(optionnel)</span>
                        </div>
                        <textarea
                          placeholder="Informations supplémentaires..."
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-700 h-24"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Step 2: Permissions section (initially hidden) */}
                <div id="step-2-content" className="hidden">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                      <FiLock className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800">Permissions</h4>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Permissions héritées du rôle</p>
                        <p className="text-xs text-gray-500 mt-1">Ces permissions sont automatiquement assignées selon le rôle choisi</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
                      <div className="space-y-2">
                        {Object.entries(permissionCategories).slice(0, 3).map(([key, category]) => (
                          <div key={key} className="p-3 bg-white border border-gray-200 rounded-lg">
                            <div className="flex items-center">
                              <div className="p-2 bg-indigo-50 rounded-lg mr-3">
                                {category.icon}
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{category.title}</p>
                                <p className="text-xs text-gray-500 mt-1">Accès complet</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Permissions supplémentaires</p>
                        <p className="text-xs text-gray-500 mt-1">Ces permissions s&apos;ajoutent à celles du rôle</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // This would toggle visibility of the permissions list
                          const permissionsList = document.getElementById('permissions-list');
                          if (permissionsList) {
                            permissionsList.classList.toggle('hidden');
                          }
                        }}
                      >
                        <FiPlusCircle className="w-4 h-4 mr-2" />
                        <span>Ajouter</span>
                      </Button>
                    </div>
                    
                    {/* Initially hidden list of available permissions */}
                    <div id="permissions-list" className="hidden mb-6">
                      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                          <p className="font-medium text-gray-800">Sélectionner des permissions</p>
                          <div className="relative w-64">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input 
                              type="text" 
                              placeholder="Rechercher..." 
                              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-3 max-h-72 overflow-y-auto p-1">
                          {Object.entries(permissionCategories).map(([key, category]) => (
                            <div key={key} className="border border-gray-100 rounded-lg overflow-hidden">
                              <div className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100">
                                <div className="flex items-center">
                                  {category.icon}
                                  <span className="ml-2 font-medium text-gray-700">{category.title}</span>
                                </div>
                                <FiChevronRight className="text-gray-400" />
                              </div>
                              <div className="p-2 space-y-1">
                                {category.items.map((item) => (
                                  <label key={item.key} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 mr-3" />
                                    <div>
                                      <p className="text-sm text-gray-700">{item.name}</p>
                                      <p className="text-xs text-gray-500">{key}:{item.key}</p>
                                    </div>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex justify-end mt-4 gap-2">
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={() => {
                              const permissionsList = document.getElementById('permissions-list');
                              if (permissionsList) {
                                permissionsList.classList.add('hidden');
                              }
                            }}
                          >
                            Annuler
                          </Button>
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => {
                              const permissionsList = document.getElementById('permissions-list');
                              if (permissionsList) {
                                permissionsList.classList.add('hidden');
                                // Show the added permissions UI
                                const addedPermissions = document.getElementById('added-permissions');
                                if (addedPermissions) {
                                  addedPermissions.classList.remove('hidden');
                                }
                              }
                            }}
                          >
                            Ajouter la sélection
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* UI for when permissions are added (initially hidden) */}
                    <div id="added-permissions" className="hidden">
                      <div className="space-y-2">
                        <div className="p-3 bg-white border border-gray-200 rounded-lg flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="p-1.5 bg-indigo-50 rounded mr-3">
                              <FiMail className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">Modèles : Email</p>
                              <p className="text-xs text-gray-500">modeles:email</p>
                            </div>
                          </div>
                          <button className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50">
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="p-3 bg-white border border-gray-200 rounded-lg flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="p-1.5 bg-indigo-50 rounded mr-3">
                              <FiPhoneCall className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">PBX : Journal d&apos;appels</p>
                              <p className="text-xs text-gray-500">pbx:journal-appels</p>
                            </div>
                          </div>
                          <button className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50">
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Empty state when no permissions added */}
                    <div id="empty-permissions" className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <div className="text-center text-gray-500 py-6">
                        <FiLock className="mx-auto w-10 h-10 mb-2 text-gray-300" />
                        <p className="text-sm mb-1">Aucune permission supplémentaire</p>
                        <p className="text-xs">Cliquez sur &quot;Ajouter&quot; pour attribuer des permissions supplémentaires</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Step 3: Notifications section (initially hidden) */}
                <div id="step-3-content" className="hidden">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                      <FiMail className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800">Notifications</h4>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-4">Configuration des notifications pour cet utilisateur</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center">
                          <FiMail className="w-5 h-5 text-gray-400 mr-3" />
                          <span className="text-sm text-gray-700">Notifications par email</span>
                        </div>
                        <div className="w-14 h-8 flex items-center bg-indigo-500 rounded-full px-1 duration-300 ease-in-out cursor-pointer">
                          <motion.div 
                            initial={false}
                            animate={{ 
                              x: 24,
                              backgroundColor: "#FFFFFF" 
                            }}
                            className="bg-white w-6 h-6 rounded-full shadow-md"
                          ></motion.div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center">
                          <FiMessageSquare className="w-5 h-5 text-gray-400 mr-3" />
                          <span className="text-sm text-gray-700">Notifications SMS</span>
                        </div>
                        <div className="w-14 h-8 flex items-center bg-gray-200 rounded-full px-1 duration-300 ease-in-out cursor-pointer">
                          <motion.div 
                            initial={false}
                            animate={{ 
                              x: 0,
                              backgroundColor: "#FFFFFF" 
                            }}
                            className="bg-white w-6 h-6 rounded-full shadow-md"
                          ></motion.div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center">
                          <FiSmartphone className="w-5 h-5 text-gray-400 mr-3" />
                          <span className="text-sm text-gray-700">Notifications application</span>
                        </div>
                        <div className="w-14 h-8 flex items-center bg-indigo-500 rounded-full px-1 duration-300 ease-in-out cursor-pointer">
                          <motion.div 
                            initial={false}
                            animate={{ 
                              x: 24,
                              backgroundColor: "#FFFFFF" 
                            }}
                            className="bg-white w-6 h-6 rounded-full shadow-md"
                          ></motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                        <FiMessageSquare className="w-5 h-5 text-indigo-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800">Préférences des notifications</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-white border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-800 mb-2">Fréquence</h5>
                        <div className="space-y-2">
                          <label className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                            <input type="radio" name="frequency" className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 mr-3" defaultChecked />
                            <span className="text-sm text-gray-700">Immédiat</span>
                          </label>
                          <label className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                            <input type="radio" name="frequency" className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 mr-3" />
                            <span className="text-sm text-gray-700">Résumé quotidien</span>
                          </label>
                          <label className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                            <input type="radio" name="frequency" className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 mr-3" />
                            <span className="text-sm text-gray-700">Résumé hebdomadaire</span>
                          </label>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-white border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-800 mb-2">Événements à notifier</h5>
                        <div className="space-y-2">
                          <label className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 mr-3" defaultChecked />
                            <span className="text-sm text-gray-700">Connexions à la plateforme</span>
                          </label>
                          <label className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 mr-3" defaultChecked />
                            <span className="text-sm text-gray-700">Activités importantes</span>
                          </label>
                          <label className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 mr-3" />
                            <span className="text-sm text-gray-700">Mises à jour du système</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Modal footer with progression buttons */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 px-6 py-4 flex justify-between items-center">
                <div id="step-indicator" className="flex items-center text-sm">
                  <span className="text-indigo-600 font-medium">Étape 1/3:</span>
                  <span className="ml-1 text-gray-600">Informations personnelles</span>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    className="hidden back-button"
                    onClick={() => {
                      // Handle back navigation between steps
                      const currentStep = parseInt(document.getElementById('step-indicator')?.querySelector('span')?.textContent?.split('/')[0].replace('Étape ', '') || "1");
                      if (currentStep > 1) {
                        navigateStep(currentStep - 1);
                      }
                    }}
                  >
                    <FiChevronLeft className="mr-1 w-4 h-4" />
                    <span>Précédent</span>
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowAddUserModal(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    variant="primary"
                    className="next-button"
                    onClick={() => {
                      // Handle forward navigation between steps
                      const currentStep = parseInt(document.getElementById('step-indicator')?.querySelector('span')?.textContent?.split('/')[0].replace('Étape ', '') || "1");
                      if (currentStep < 3) {
                        navigateStep(currentStep + 1);
                      } else {
                        // Final step, save user
                        saveNewUser();
                      }
                    }}
                  >
                    <span>Suivant</span>
                    <FiChevronRight className="ml-1 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
