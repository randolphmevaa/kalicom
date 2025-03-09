'use client';
import {useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiUsers,
  FiUserPlus,
  FiUserCheck,
  // FiUserX,
  // FiUser,
  // FiEdit,
  // FiTrash2,
  // FiEye,
  FiSearch,
  FiFilter,
  // FiMail,
  // FiPhone,
  FiShield,
  // FiLock,
  // FiUnlock,
  // FiCheck,
  // FiX,
  FiList,
  FiGrid,
  // FiStar,
  // FiSettings,
  // FiAlertTriangle,
  FiClock,
  // FiCalendar,
  // FiBarChart2,
  // FiRefreshCw,
  FiPlus,
  // FiTag,
  // FiFileText,
  // FiKey
} from 'react-icons/fi';

export default function Utilisateurs() {
  // State for active tab and selections
  const [activeTab, setActiveTab] = useState('utilisateurs');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('liste');
  const [ , setEditMode] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous');
  const [roleFilter, setRoleFilter] = useState('Tous');
  const [groupFilter, setGroupFilter] = useState('Tous');
  const [lastLoginFilter, setLastLoginFilter] = useState('Tous');
  
  // Sample users data
  const [usersData ] = useState([
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
  const [groupsData ] = useState([
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

  // Statistics for dashboard
  const userStatistics = [
    {
      title: "Utilisateurs actifs",
      value: `${usersData.filter(u => u.statut === 'Actif').length}`,
      icon: <FiUserCheck className="text-green-500" />,
      change: `Sur ${usersData.length} utilisateurs`
    },
    {
      title: "Groupes",
      value: groupsData.length,
      icon: <FiUsers className="text-blue-500" />,
      change: "Groupes d'utilisateurs"
    },
    {
      title: "Connectés aujourd'hui",
      value: usersData.filter(u => u.derniereConnexion && u.derniereConnexion.includes('05/03/2025')).length,
      icon: <FiClock className="text-amber-500" />,
      change: "Utilisateurs"
    },
    {
      title: "Administrateurs",
      value: usersData.filter(u => u.role === 'Administrateur').length,
      icon: <FiShield className="text-indigo-500" />,
      change: "Avec droits étendus"
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
    setSelectedUser(id === selectedUser ? null : id);
    setSelectedGroup(null);
    setEditMode(false);
  };

  const setActiveGroupHandler = (id: string) => {
    setSelectedGroup(id === selectedGroup ? null : id);
    setSelectedUser(null);
    setEditMode(false);
  };

  // const toggleEditMode = () => {
  //   setEditMode(!editMode);
  // };

  // Utility functions to retrieve data
  // const getUserById = (id) => usersData.find(user => user.id === id);
  // const getGroupById = (id) => groupsData.find(group => group.id === id);
  // // const getGroupMembersCount = (groupId) => {
  // //   const group = getGroupById(groupId);
  // //   return group ? group.membres.length : 0;
  // // };
  // const getPermissionsCount = (permissions) => permissions ? permissions.length : 0;
  // const getUserFullName = (userId) => {
  //   const user = getUserById(userId);
  //   return user ? `${user.prenom} ${user.nom}` : 'Utilisateur inconnu';
  // };

  const getFilteredUsers = () => {
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

  const getFilteredGroups = () => {
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
  const getStatusColor = (statut: string) => {
    switch(statut) {
      case 'Actif':
        return 'bg-green-100 text-green-800';
      case 'Inactif':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'Administrateur':
        return 'bg-indigo-100 text-indigo-800';
      case 'Comptable':
        return 'bg-yellow-100 text-yellow-800';
      case 'Commercial':
        return 'bg-blue-100 text-blue-800';
      case 'Support':
        return 'bg-green-100 text-green-800';
      case 'Technicien':
        return 'bg-purple-100 text-purple-800';
      case 'Ressources Humaines':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen bg-gray-100"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center p-6 bg-white rounded-2xl shadow-xl">
          <div>
            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-3xl font-bold text-indigo-700 drop-shadow-md"
            >
              Utilisateurs
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">
              Gérez les utilisateurs et les groupes d&apos;accès
            </p>
          </div>
          <div className="p-2 bg-indigo-100 rounded-lg">
            <FiUsers className="w-6 h-6 text-indigo-600" />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'utilisateurs'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('utilisateurs');
                setSelectedGroup(null);
                setEditMode(false);
              }}
            >
              Utilisateurs
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'groupes'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('groupes');
                setSelectedUser(null);
                setEditMode(false);
              }}
            >
              Groupes
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'permissions'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('permissions');
                setSelectedUser(null);
                setSelectedGroup(null);
                setEditMode(false);
              }}
            >
              Permissions
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'parametres'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('parametres');
                setSelectedUser(null);
                setSelectedGroup(null);
                setEditMode(false);
              }}
            >
              Paramètres
            </button>
          </div>

          {/* Content for Utilisateurs tab */}
          {activeTab === 'utilisateurs' && (
            <div className="p-6">
              {/* Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                {userStatistics.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col"
                  >
                    <div className="flex items-center mb-2">
                      <div className="p-2 bg-indigo-50 rounded-lg mr-3">
                        {stat.icon}
                      </div>
                      <span className="text-sm font-medium text-gray-500">
                        {stat.title}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {stat.change}
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions & Search Bar */}
              <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                {/* Search */}
                <div className="w-full md:w-72 relative mb-4 md:mb-0">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Rechercher un utilisateur..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <button className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                    <FiUserPlus />
                    <span>Ajouter un utilisateur</span>
                  </button>
                  <button
                    onClick={toggleFilters}
                    className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
                  >
                    <FiFilter />
                    <span>
                      {showFilters ? 'Masquer filtres' : 'Afficher filtres'}
                    </span>
                  </button>
                  <button
                    onClick={toggleViewMode}
                    className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
                  >
                    {viewMode === 'liste' ? <FiGrid /> : <FiList />}
                    <span className="hidden md:inline">
                      {viewMode === 'liste' ? 'Vue grille' : 'Vue liste'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Filters */}
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mb-6 p-4 border border-gray-200 rounded-lg overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Statut
                      </label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rôle
                      </label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Groupe
                      </label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dernière connexion
                      </label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
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
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    >
                      Réinitialiser filtres
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Users List */}
              {getFilteredUsers().length > 0 ? (
                <div className={`grid ${viewMode === 'liste' ? 'grid-cols-1' : 'grid-cols-3'} gap-4`}>
                  {getFilteredUsers().map(user => (
                    <div
                      key={user.id}
                      onClick={() => setActiveUserHandler(user.id)}
                      className={`p-4 bg-white rounded shadow cursor-pointer ${
                        selectedUser === user.id ? 'border border-indigo-500' : 'border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={user.avatar}
                          alt={`${user.prenom} ${user.nom}`}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <h3 className="text-lg font-bold">
                            {user.prenom} {user.nom}
                          </h3>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(user.statut)}`}>
                          {user.statut}
                        </span>
                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Aucun utilisateur trouvé.</p>
              )}
            </div>
          )}

          {/* Content for Groupes tab */}
          {activeTab === 'groupes' && (
            <div className="p-6">
              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Groupes</h2>
                  <button className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                    <FiPlus />
                    <span>Ajouter un groupe</span>
                  </button>
                </div>
              </div>
              {getFilteredGroups().length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {getFilteredGroups().map(group => (
                    <div
                      key={group.id}
                      onClick={() => setActiveGroupHandler(group.id)}
                      className={`p-4 bg-white rounded shadow cursor-pointer ${
                        selectedGroup === group.id ? 'border border-indigo-500' : 'border border-gray-200'
                      }`}
                    >
                      <h3 className="text-lg font-bold">{group.nom}</h3>
                      <p className="text-sm text-gray-500">{group.description}</p>
                      <p className="text-xs text-gray-400">Membres: {group.membres.length}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Aucun groupe trouvé.</p>
              )}
            </div>
          )}

          {/* Content for Permissions tab */}
          {activeTab === 'permissions' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Permissions</h2>
              <p className="text-gray-500">Interface de gestion des permissions à venir.</p>
            </div>
          )}

          {/* Content for Paramètres tab */}
          {activeTab === 'parametres' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Paramètres</h2>
              <p className="text-gray-500">Interface des paramètres à venir.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
