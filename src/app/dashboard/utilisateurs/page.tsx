'use client';
import { useState, useRef, useEffect, JSX } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUsers,
  FiUserPlus,
  FiUserCheck,
  FiUser,
  FiEdit,
  FiEye,
  FiSearch,
  FiFilter,
  FiMail,
  FiPhone,
  FiShield,
  FiLock,
  FiList,
  FiGrid,
  FiSettings,
  FiAlertTriangle,
  FiClock,
  FiCalendar,
  FiBarChart2,
  FiRefreshCw,
  FiPlus,
  FiKey,
  FiMapPin,
  FiToggleRight,
  FiToggleLeft,
  FiSend,
  FiXCircle
} from 'react-icons/fi';

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
  groupes: string[];
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

interface Group {
  id: string;
  nom: string;
  description: string;
  membres: string[];
  permissions: string[];
  dateCreation: string;
  derniereMaj: string;
  createdBy: string;
}

interface Statistic {
  title: string;
  value: string | number;
  icon: JSX.Element;
  change: string;
  color: string;
}

interface PermissionCategories {
  [key: string]: string;
}

interface UserPermissions {
  [key: string]: boolean;
}

export default function Utilisateurs() {
  // State for active tab and selections
  const [activeTab, setActiveTab] = useState<string>('utilisateurs');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'liste'>('grid'); // Default to grid/box view
  const [ , setEditMode] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalData, setModalData] = useState<User | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('Tous');
  const [roleFilter, setRoleFilter] = useState<string>('Tous');
  const [groupFilter, setGroupFilter] = useState<string>('Tous');
  const [lastLoginFilter, setLastLoginFilter] = useState<string>('Tous');
  
  // Sample users data
  const [usersData] = useState<User[]>([
    {
      id: 'USR-001',
      prenom: 'Jean',
      nom: 'Dupont',
      email: 'jean.dupont@example.com',
      telephone: '+33601020304',
      role: 'Administrateur',
      groupes: ['Direction', 'Comptabilité'],
      statut: 'Actif',
      dateCreation: '15/01/2023',
      derniereMaj: '05/03/2025',
      derniereConnexion: '05/03/2025 10:25',
      adresse: '123 Rue Principale, 75001 Paris',
      avatar: '/avatars/jean.jpg',
      permissions: ['documents:all', 'users:all', 'settings:all'],
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
      groupes: ['Comptabilité'],
      statut: 'Actif',
      dateCreation: '20/01/2023',
      derniereMaj: '01/03/2025',
      derniereConnexion: '04/03/2025 14:32',
      adresse: '45 Avenue de la Liberté, 69001 Lyon',
      avatar: '/avatars/marie.jpg',
      permissions: ['documents:read', 'documents:create', 'finances:all'],
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
      groupes: ['Ventes'],
      statut: 'Actif',
      dateCreation: '05/02/2023',
      derniereMaj: '28/02/2025',
      derniereConnexion: '05/03/2025 09:15',
      adresse: '8 Rue du Commerce, 33000 Bordeaux',
      avatar: '/avatars/pierre.jpg',
      permissions: ['documents:read', 'documents:create', 'customers:all'],
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
      groupes: ['Support', 'Technique'],
      statut: 'Actif',
      dateCreation: '10/03/2023',
      derniereMaj: '25/02/2025',
      derniereConnexion: '04/03/2025 16:50',
      adresse: '27 Boulevard des Clients, 59000 Lille',
      avatar: '/avatars/sophie.jpg',
      permissions: ['documents:read', 'tickets:all', 'customers:read'],
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
      groupes: ['Technique'],
      statut: 'Inactif',
      dateCreation: '15/04/2023',
      derniereMaj: '15/01/2025',
      derniereConnexion: '15/01/2025 11:20',
      adresse: '92 Rue de la Technique, 44000 Nantes',
      avatar: '/avatars/thomas.jpg',
      permissions: ['documents:read', 'products:all'],
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
      groupes: ['RH', 'Direction'],
      statut: 'Actif',
      dateCreation: '03/05/2023',
      derniereMaj: '20/02/2025',
      derniereConnexion: '05/03/2025 08:45',
      adresse: '17 Avenue des Employés, 13001 Marseille',
      avatar: '/avatars/laura.jpg',
      permissions: ['documents:read', 'documents:create', 'employees:all'],
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

  // Sample groups data
  const [groupsData] = useState<Group[]>([
    {
      id: 'GRP-001',
      nom: 'Direction',
      description: 'Membres de la direction de l\'entreprise',
      membres: ['USR-001', 'USR-006'],
      permissions: ['documents:all', 'settings:all', 'users:all', 'finances:all'],
      dateCreation: '15/01/2023',
      derniereMaj: '05/01/2025',
      createdBy: 'Jean Dupont'
    },
    {
      id: 'GRP-002',
      nom: 'Comptabilité',
      description: 'Service comptabilité',
      membres: ['USR-001', 'USR-002'],
      permissions: ['documents:read', 'documents:create', 'finances:all'],
      dateCreation: '15/01/2023',
      derniereMaj: '01/02/2025',
      createdBy: 'Jean Dupont'
    },
    {
      id: 'GRP-003',
      nom: 'Ventes',
      description: 'Équipe commerciale',
      membres: ['USR-003'],
      permissions: ['documents:read', 'documents:create', 'customers:all', 'products:read'],
      dateCreation: '20/01/2023',
      derniereMaj: '15/02/2025',
      createdBy: 'Jean Dupont'
    },
    {
      id: 'GRP-004',
      nom: 'Support',
      description: 'Service client et support',
      membres: ['USR-004'],
      permissions: ['documents:read', 'tickets:all', 'customers:read'],
      dateCreation: '15/02/2023',
      derniereMaj: '25/02/2025',
      createdBy: 'Jean Dupont'
    },
    {
      id: 'GRP-005',
      nom: 'Technique',
      description: 'Service technique et développement',
      membres: ['USR-004', 'USR-005'],
      permissions: ['documents:read', 'products:all'],
      dateCreation: '15/02/2023',
      derniereMaj: '10/01/2025',
      createdBy: 'Jean Dupont'
    },
    {
      id: 'GRP-006',
      nom: 'RH',
      description: 'Ressources humaines',
      membres: ['USR-006'],
      permissions: ['documents:read', 'documents:create', 'employees:all'],
      dateCreation: '03/05/2023',
      derniereMaj: '20/02/2025',
      createdBy: 'Jean Dupont'
    }
  ]);

  // Reference for closing modal when clicking outside
  const modalRef = useRef<HTMLDivElement>(null);

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

  // Permission categories for organization in modal
  const permissionCategories: PermissionCategories = {
    'documents': 'Documents',
    'users': 'Utilisateurs',
    'settings': 'Paramètres',
    'finances': 'Finances',
    'customers': 'Clients',
    'products': 'Produits',
    'tickets': 'Tickets',
    'employees': 'Employés'
  };

  // New state for permission toggles (for the modal)
  const [userPermissions, setUserPermissions] = useState<UserPermissions>({});

  // Statistics for dashboard
  const userStatistics: Statistic[] = [
    {
      title: "Utilisateurs actifs",
      value: `${usersData.filter(u => u.statut === 'Actif').length}`,
      icon: <FiUserCheck className="text-green-500" />,
      change: `Sur ${usersData.length} utilisateurs`,
      color: "bg-gradient-to-br from-green-50 to-green-100"
    },
    {
      title: "Groupes",
      value: groupsData.length,
      icon: <FiUsers className="text-blue-500" />,
      change: "Groupes d'utilisateurs",
      color: "bg-gradient-to-br from-blue-50 to-blue-100"
    },
    {
      title: "Connectés aujourd'hui",
      value: usersData.filter(u => u.derniereConnexion && u.derniereConnexion.includes('05/03/2025')).length,
      icon: <FiClock className="text-amber-500" />,
      change: "Utilisateurs",
      color: "bg-gradient-to-br from-amber-50 to-amber-100"
    },
    {
      title: "Administrateurs",
      value: usersData.filter(u => u.role === 'Administrateur').length,
      icon: <FiShield className="text-indigo-500" />,
      change: "Avec droits étendus",
      color: "bg-gradient-to-br from-indigo-50 to-indigo-100"
    }
  ];

  // Filter options
  const statusOptions = ['Tous', 'Actif', 'Inactif'];
  const roleOptions = ['Tous', 'Administrateur', 'Comptable', 'Commercial', 'Support', 'Technicien', 'Ressources Humaines'];
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
    setSelectedGroup(null);
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

  const setActiveGroupHandler = (id: string) => {
    setSelectedGroup(id === selectedGroup ? null : id);
    setSelectedUser(null);
    setEditMode(false);
  };

  // const openModal = (user: User) => {
  //   setModalData(user);
  //   setShowModal(true);
  // };

  const closeModal = () => {
    setShowModal(false);
    setModalData(null);
  };

  const togglePermission = (permission: string) => {
    setUserPermissions({
      ...userPermissions,
      [permission]: !userPermissions[permission]
    });
  };

  const sendCredentials = () => {
    // Implement the logic to send credentials
    if (modalData) {
      alert(`Identifiants envoyés à ${modalData.prenom} ${modalData.nom} (${modalData.email})`);
    }
  };

  // Utility functions to retrieve data
  const getUserById = (id: string): User | undefined => usersData.find(user => user.id === id);
  // const getGroupById = (id: string): Group | undefined => groupsData.find(group => group.id === id);
  // const getGroupMembersCount = (groupId: string): number => {
  //   const group = getGroupById(groupId);
  //   return group ? group.membres.length : 0;
  // };
  // const getPermissionsCount = (permissions: string[] | undefined): number => permissions ? permissions.length : 0;
  // const getUserFullName = (userId: string): string => {
  //   const user = getUserById(userId);
  //   return user ? `${user.prenom} ${user.nom}` : 'Utilisateur inconnu';
  // };

  const getFilteredUsers = (): User[] => {
    return usersData.filter(user => {
      const matchesSearch =
        searchTerm === '' ||
        `${user.prenom} ${user.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.telephone.includes(searchTerm);
      const matchesStatus = statusFilter === 'Tous' || user.statut === statusFilter;
      const matchesRole = roleFilter === 'Tous' || user.role === roleFilter;
      const matchesGroup = groupFilter === 'Tous' || user.groupes.includes(groupFilter);
      // For simplicity, the last login filter is not fully implemented
      const matchesLastLogin = lastLoginFilter === 'Tous' || true;
      return matchesSearch && matchesStatus && matchesRole && matchesGroup && matchesLastLogin;
    });
  };

  const getFilteredGroups = (): Group[] => {
    return groupsData.filter(group => {
      const matchesSearch =
        searchTerm === '' ||
        group.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('Tous');
    setRoleFilter('Tous');
    setGroupFilter('Tous');
    setLastLoginFilter('Tous');
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

  const getRoleColor = (role: string): string => {
    switch(role) {
      case 'Administrateur':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'Comptable':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Commercial':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Support':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Technicien':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Ressources Humaines':
        return 'bg-pink-100 text-pink-800 border-pink-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Get user avatar with fallback
  const getUserAvatar = (user: User): JSX.Element => {
    if (!user.avatar || user.avatar.includes('missing')) {
      // Return initials as fallback
      return <div className="w-16 h-16 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-lg font-bold">
        {user.prenom.charAt(0)}{user.nom.charAt(0)}
      </div>;
    }
    
    return <img 
      src={user.avatar} 
      alt={`${user.prenom} ${user.nom}`} 
      className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200" 
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.style.display = 'none';
        // Using optional chaining to safely access parentNode
        const parent = e.currentTarget.parentNode as HTMLElement;
        if (parent) {
          parent.innerHTML = `<div class="w-16 h-16 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-lg font-bold">${user.prenom.charAt(0)}${user.nom.charAt(0)}</div>`;
        }
      }}
    />;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen bg-gray-50"
    >
      <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100"
        >
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400">
              Utilisateurs
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Gérez les utilisateurs et les groupes d&apos;accès
            </p>
          </div>
          <div className="p-3 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg shadow-md">
            <FiUsers className="w-8 h-8 text-indigo-600" />
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'utilisateurs'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => {
                setActiveTab('utilisateurs');
                setSelectedGroup(null);
                setEditMode(false);
              }}
            >
              <div className="flex justify-center items-center space-x-2">
                <FiUser className={activeTab === 'utilisateurs' ? 'text-indigo-600' : 'text-gray-500'} />
                <span>Utilisateurs</span>
              </div>
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'groupes'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => {
                setActiveTab('groupes');
                setSelectedUser(null);
                setEditMode(false);
              }}
            >
              <div className="flex justify-center items-center space-x-2">
                <FiUsers className={activeTab === 'groupes' ? 'text-indigo-600' : 'text-gray-500'} />
                <span>Groupes</span>
              </div>
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'permissions'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => {
                setActiveTab('permissions');
                setSelectedUser(null);
                setSelectedGroup(null);
                setEditMode(false);
              }}
            >
              <div className="flex justify-center items-center space-x-2">
                <FiLock className={activeTab === 'permissions' ? 'text-indigo-600' : 'text-gray-500'} />
                <span>Permissions</span>
              </div>
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'parametres'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => {
                setActiveTab('parametres');
                setSelectedUser(null);
                setSelectedGroup(null);
                setEditMode(false);
              }}
            >
              <div className="flex justify-center items-center space-x-2">
                <FiSettings className={activeTab === 'parametres' ? 'text-indigo-600' : 'text-gray-500'} />
                <span>Paramètres</span>
              </div>
            </button>
          </div>

          {/* Content for Utilisateurs tab */}
          {activeTab === 'utilisateurs' && (
            <div className="p-6">
              {/* Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {userStatistics.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`${stat.color} p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300`}
                  >
                    <div className="flex items-center mb-3">
                      <div className="p-3 bg-white rounded-lg shadow-sm mr-4">
                        {stat.icon}
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-gray-800">
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
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Rechercher un utilisateur..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3">
                  <motion.button 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 shadow-md hover:shadow-lg transition-all font-medium"
                  >
                    <FiUserPlus className="h-5 w-5" />
                    <span>Ajouter un utilisateur</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={toggleFilters}
                    className="flex items-center gap-2 px-4 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition-all font-medium"
                  >
                    <FiFilter className="h-5 w-5" />
                    <span>
                      {showFilters ? 'Masquer filtres' : 'Filtres'}
                    </span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={toggleViewMode}
                    className="flex items-center gap-2 px-4 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition-all font-medium"
                  >
                    {viewMode === 'liste' ? <FiGrid className="h-5 w-5" /> : <FiList className="h-5 w-5" />}
                    <span className="hidden md:inline">
                      {viewMode === 'liste' ? 'Vue grille' : 'Vue liste'}
                    </span>
                  </motion.button>
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
                    className="mb-8 p-6 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Statut
                        </label>
                        <select
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rôle
                        </label>
                        <select
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Groupe
                        </label>
                        <select
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                          value={groupFilter}
                          onChange={(e) => setGroupFilter(e.target.value)}
                        >
                          <option value="Tous">Tous</option>
                          {groupsData.map((group) => (
                            <option key={group.id} value={group.nom}>
                              {group.nom}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dernière connexion
                        </label>
                        <select
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
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
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={resetFilters}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors shadow-sm"
                      >
                        <div className="flex items-center gap-2">
                          <FiRefreshCw className="h-4 w-4" />
                          <span>Réinitialiser</span>
                        </div>
                      </motion.button>
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
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      onClick={() => setActiveUserHandler(user.id)}
                      className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer 
                        ${selectedUser === user.id ? 'ring-2 ring-indigo-500' : 'border border-gray-200'}`}
                    >
                      {viewMode === 'liste' ? (
                        // List view
                        <div className="p-4 flex items-center">
                          <div className="mr-4">
                            {getUserAvatar(user)}
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                  {user.prenom} {user.nom}
                                </h3>
                                <div className="flex items-center text-gray-500">
                                  <FiMail className="mr-1 text-gray-400" size={14} />
                                  <span className="text-sm">{user.email}</span>
                                </div>
                                <div className="flex items-center text-gray-500">
                                  <FiPhone className="mr-1 text-gray-400" size={14} />
                                  <span className="text-sm">{user.telephone}</span>
                                </div>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className={`px-3 py-1 text-xs font-medium rounded-full mb-2 ${getStatusColor(user.statut)}`}>
                                  {user.statut}
                                </span>
                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                                  {user.role}
                                </span>
                              </div>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-1">
                              {user.groupes.map((groupe, idx) => (
                                <span key={idx} className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                  {groupe}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Grid/Box view
                        <div className="p-6">
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
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(user.statut)}`}>
                              {user.statut}
                            </span>
                          </div>
                          
                          <div className="space-y-3">
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
                              <span className="text-sm">Dernière connexion: {user.derniereConnexion.split(' ')[0]}</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex justify-between items-center">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                              {user.role}
                            </span>
                            <div className="flex items-center">
                              <span className="text-xs text-gray-500 mr-2">{user.groupes.length} groupe{user.groupes.length > 1 ? 's' : ''}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveUserHandler(user.id);
                                }}
                                className="p-1 rounded-full hover:bg-gray-100"
                              >
                                <FiEye className="w-4 h-4 text-indigo-500" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-center">
                  <FiSearch className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 text-lg">Aucun utilisateur trouvé.</p>
                  <p className="text-gray-400">Essayez de modifier vos critères de recherche.</p>
                </div>
              )}
            </div>
          )}

          {/* Content for Groupes tab */}
          {activeTab === 'groupes' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Groupes d&apos;accès</h2>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 shadow-md hover:shadow-lg transition-all font-medium"
                >
                  <FiPlus />
                  <span>Ajouter un groupe</span>
                </motion.button>
              </div>
              
              {/* Groups Search */}
              <div className="w-full mb-6 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher un groupe..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Groups List */}
              {getFilteredGroups().length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredGroups().map((group, index) => (
                    <motion.div
                      key={group.id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      onClick={() => setActiveGroupHandler(group.id)}
                      className={`bg-white p-6 rounded-xl cursor-pointer transition-all
                        ${selectedGroup === group.id ? 'ring-2 ring-indigo-500 shadow-md' : 'border border-gray-200 shadow-sm hover:shadow-md'}`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-gray-900">{group.nom}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {group.membres.length} membre{group.membres.length > 1 ? 's' : ''}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{group.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-500 text-sm">
                          <FiCalendar className="mr-2 text-gray-400" />
                          <span>Créé le {group.dateCreation}</span>
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <FiRefreshCw className="mr-2 text-gray-400" />
                          <span>Mis à jour le {group.derniereMaj}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            {group.permissions.length} permission{group.permissions.length > 1 ? 's' : ''}
                          </span>
                          <div className="flex space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // View details
                              }}
                              className="p-1 rounded-full hover:bg-gray-100"
                            >
                              <FiEye className="w-4 h-4 text-blue-500" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Edit
                              }}
                              className="p-1 rounded-full hover:bg-gray-100"
                            >
                              <FiEdit className="w-4 h-4 text-indigo-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-center">
                  <FiSearch className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 text-lg">Aucun groupe trouvé.</p>
                  <p className="text-gray-400">Essayez de modifier vos critères de recherche.</p>
                </div>
              )}
            </div>
          )}

          {/* Content for Permissions tab */}
          {activeTab === 'permissions' && (
            <div className="p-6">
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-lg">
                <div className="flex items-center mb-6">
                  <FiShield className="h-8 w-8 text-indigo-500 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-800">Gestion des permissions</h2>
                </div>
                
                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100 mb-8">
                  <div className="flex items-start">
                    <FiAlertTriangle className="text-indigo-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-indigo-700 text-sm">
                      Cette section permet de définir les permissions globales du système. Pour modifier les permissions d&apos;un utilisateur ou d&apos;un groupe spécifique, veuillez utiliser les sections correspondantes.
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-500 mb-4">
                  L&apos;interface de gestion des permissions sera disponible prochainement.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h3 className="font-medium text-gray-700 mb-2">Permissions des utilisateurs</h3>
                    <p className="text-sm text-gray-500">Configurez les permissions par défaut pour chaque rôle d&apos;utilisateur.</p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h3 className="font-medium text-gray-700 mb-2">Permissions des groupes</h3>
                    <p className="text-sm text-gray-500">Configurez les permissions pour les groupes d&apos;utilisateurs.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content for Paramètres tab */}
          {activeTab === 'parametres' && (
            <div className="p-6">
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-lg">
                <div className="flex items-center mb-6">
                  <FiSettings className="h-8 w-8 text-indigo-500 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-800">Paramètres</h2>
                </div>
                
                <div className="space-y-8">
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Sécurité</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-700">Authentification à deux facteurs</p>
                          <p className="text-sm text-gray-500">Exiger l&apos;authentification à deux facteurs pour tous les utilisateurs</p>
                        </div>
                        <div className="flex items-center">
                          <div className="w-12 h-6 bg-gray-200 rounded-full p-1 duration-300 ease-in-out cursor-pointer">
                            <div className="bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out"></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-700">Durée de session</p>
                          <p className="text-sm text-gray-500">Durée maximale d&apos;une session avant déconnexion automatique</p>
                        </div>
                        <select className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                          <option>30 minutes</option>
                          <option>1 heure</option>
                          <option>4 heures</option>
                          <option>8 heures</option>
                          <option>24 heures</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-700">Email de bienvenue</p>
                          <p className="text-sm text-gray-500">Envoyer un email de bienvenue aux nouveaux utilisateurs</p>
                        </div>
                        <div className="flex items-center">
                          <div className="w-12 h-6 bg-indigo-500 rounded-full p-1 duration-300 ease-in-out cursor-pointer">
                            <div className="bg-white w-4 h-4 rounded-full shadow-md transform translate-x-6 duration-300 ease-in-out"></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-700">Alertes de connexion</p>
                          <p className="text-sm text-gray-500">Notifier les utilisateurs lors d&apos;une nouvelle connexion</p>
                        </div>
                        <div className="flex items-center">
                          <div className="w-12 h-6 bg-indigo-500 rounded-full p-1 duration-300 ease-in-out cursor-pointer">
                            <div className="bg-white w-4 h-4 rounded-full shadow-md transform translate-x-6 duration-300 ease-in-out"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Préférences</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-700">Langue par défaut</p>
                          <p className="text-sm text-gray-500">Langue par défaut pour les nouveaux utilisateurs</p>
                        </div>
                        <select className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                          <option>Français</option>
                          <option>English</option>
                          <option>Español</option>
                          <option>Deutsch</option>
                        </select>
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
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal header */}
              <div className="sticky top-0 bg-white z-10 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Détails de l&apos;utilisateur</h3>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <FiXCircle className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              
              {/* Modal content */}
              <div className="p-6">
                {/* User header info */}
                <div className="flex flex-col md:flex-row md:items-center mb-8 gap-6">
                  <div className="flex-shrink-0">
                    {getUserAvatar(modalData)}
                  </div>
                  
                  <div className="flex-grow">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {modalData.prenom} {modalData.nom}
                    </h2>
                    <p className="text-gray-500 text-sm mb-2">{modalData.id} · {modalData.role}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(modalData.statut)}`}>
                        {modalData.statut}
                      </span>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getRoleColor(modalData.role)}`}>
                        {modalData.role}
                      </span>
                      {modalData.authMethod === '2FA' && (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                          2FA Activé
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm transition-all flex items-center gap-2"
                      onClick={() => setEditMode(true)}
                    >
                      <FiEdit className="w-4 h-4" />
                      <span>Modifier</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 shadow-sm transition-all flex items-center gap-2"
                      onClick={sendCredentials}
                    >
                      <FiSend className="w-4 h-4" />
                      <span>Envoyer les identifiants</span>
                    </motion.button>
                  </div>
                </div>
                
                {/* Tabs for user details sections */}
                <div className="border-b border-gray-200 mb-6">
                  <div className="flex space-x-8">
                    <button className="px-1 py-3 border-b-2 border-indigo-500 font-medium text-indigo-600">
                      Informations
                    </button>
                    <button className="px-1 py-3 text-gray-500 hover:text-gray-700">
                      Activité
                    </button>
                    <button className="px-1 py-3 text-gray-500 hover:text-gray-700">
                      Groupes
                    </button>
                  </div>
                </div>
                
                {/* User information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h4 className="text-lg font-medium text-gray-800 mb-4">Coordonnées</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <div className="flex items-center">
                          <FiMail className="text-gray-400 mr-2" />
                          <p className="font-medium">{modalData.email}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Téléphone</p>
                        <div className="flex items-center">
                          <FiPhone className="text-gray-400 mr-2" />
                          <p className="font-medium">{modalData.telephone}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Adresse</p>
                        <div className="flex items-center">
                          <FiMapPin className="text-gray-400 mr-2" />
                          <p className="font-medium">{modalData.adresse}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-gray-800 mb-4">Détails du compte</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Date de création</p>
                        <div className="flex items-center">
                          <FiCalendar className="text-gray-400 mr-2" />
                          <p className="font-medium">{modalData.dateCreation}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Dernière connexion</p>
                        <div className="flex items-center">
                          <FiClock className="text-gray-400 mr-2" />
                          <p className="font-medium">{modalData.derniereConnexion}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Méthode d&apos;authentification</p>
                        <div className="flex items-center">
                          <FiKey className="text-gray-400 mr-2" />
                          <p className="font-medium">{modalData.authMethod}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Groups */}
                <div className="mb-8">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">Groupes</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {modalData.groupes.map((groupe, idx) => {
                      const groupData = groupsData.find(g => g.nom === groupe);
                      return (
                        <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                          <h5 className="font-medium text-gray-800">{groupe}</h5>
                          {groupData && (
                            <p className="text-sm text-gray-500 mt-1">{groupData.description}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Notes */}
                {modalData.notes && (
                  <div className="mb-8">
                    <h4 className="text-lg font-medium text-gray-800 mb-4">Notes</h4>
                    <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                      <p className="text-gray-800">{modalData.notes}</p>
                    </div>
                  </div>
                )}
                
                {/* Permissions */}
                <div>
                  <h4 className="text-lg font-medium text-gray-800 mb-4">Permissions</h4>
                  
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    {Object.keys(permissionCategories).map((category) => {
                      const categoryPermissions = modalData.permissions.filter(p => p.startsWith(`${category}:`));
                      
                      if (categoryPermissions.length === 0) return null;
                      
                      return (
                        <div key={category} className="mb-6 last:mb-0">
                          <h5 className="font-medium text-gray-700 mb-3">{permissionCategories[category]}</h5>
                          <div className="space-y-3">
                            {categoryPermissions.map((permission) => (
                              <div key={permission} className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <span className="text-sm">{permission.split(':')[1]}</span>
                                </div>
                                <div 
                                  className="cursor-pointer"
                                  onClick={() => togglePermission(permission)}
                                >
                                  {userPermissions[permission] ? (
                                    <FiToggleRight className="w-8 h-8 text-indigo-500" />
                                  ) : (
                                    <FiToggleLeft className="w-8 h-8 text-gray-400" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* Modal footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Fermer
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Enregistrer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
