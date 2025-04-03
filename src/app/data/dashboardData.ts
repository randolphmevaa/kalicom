// Define TypeScript interfaces for our data
export interface ProspectDataItem {
    name: string;
    prospects: number;
    leads: number;
    clients: number;
  }
  
  export interface CallDataItem {
    date: string;
    heure: string;
    appels: number;
    duree: number;
    taux: number;
    entrants: number;
    sortants: number;
    internes: number;
    manques: number;
  }
  
  export interface TicketData {
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
  
  export interface ChatMessage {
    id: number;
    user: string;
    avatar: string;
    message: string;
    time: string;
    unread: boolean;
    isOnline: boolean;
  }
  
  export interface ActivityData {
    id: number;
    user: string;
    action: string;
    target: string;
    time: string;
    type: string;
    duration?: string;
  }
  
  export interface WeatherData {
    location: string;
    temperature: number;
    condition: string;
    high: number;
    low: number;
  }
  
  // Sample data exports
  export const prospectData: ProspectDataItem[] = [
    { name: 'Jan', prospects: 30, leads: 20, clients: 10 },
    { name: 'Feb', prospects: 45, leads: 28, clients: 15 },
    { name: 'Mar', prospects: 60, leads: 35, clients: 22 },
    { name: 'Apr', prospects: 80, leads: 42, clients: 30 },
    { name: 'May', prospects: 75, leads: 50, clients: 35 },
    { name: 'Jun', prospects: 90, leads: 60, clients: 45 },
  ];
  
  export const callData: CallDataItem[] = [
    { 
      date: '2025-02-20', 
      heure: '08:00', 
      appels: 45, 
      duree: 4.2, 
      taux: 92,
      entrants: 22,
      sortants: 15,
      internes: 5,
      manques: 3
    },
    { 
      date: '2025-02-20', 
      heure: '10:00', 
      appels: 78, 
      duree: 3.8, 
      taux: 89,
      entrants: 35,
      sortants: 28,
      internes: 10,
      manques: 5
    },
    { 
      date: '2025-02-20', 
      heure: '12:00', 
      appels: 62, 
      duree: 4.5, 
      taux: 91,
      entrants: 28,
      sortants: 24,
      internes: 7,
      manques: 3
    },
    { 
      date: '2025-02-20', 
      heure: '14:00', 
      appels: 85, 
      duree: 3.9, 
      taux: 94,
      entrants: 40,
      sortants: 32,
      internes: 9,
      manques: 4
    },
    { 
      date: '2025-02-20', 
      heure: '16:00', 
      appels: 93, 
      duree: 4.8, 
      taux: 90,
      entrants: 45,
      sortants: 35,
      internes: 8,
      manques: 5
    },
    { 
      date: '2025-02-20', 
      heure: '18:00', 
      appels: 55, 
      duree: 4.1, 
      taux: 88,
      entrants: 25,
      sortants: 20,
      internes: 6,
      manques: 4
    },
  ];
  
  export const ticketData: TicketData[] = [
    { id: 'TK-4872', client: 'Acme Corp', subject: 'Problème de configuration PBX', status: 'En cours', priority: 'Haute', created: '2025-03-21', updated: '2025-03-22', agent: 'Marc Dubois', sla: '4h', progress: 65 },
    { id: 'TK-4871', client: 'Nexus Technologies', subject: 'Intégration CRM échouée', status: 'Nouveau', priority: 'Critique', created: '2025-03-22', updated: '2025-03-22', agent: 'Non assigné', sla: '2h', progress: 10 },
    { id: 'TK-4870', client: 'Zenith Industries', subject: 'Mise à jour logicielle', status: 'En attente', priority: 'Moyenne', created: '2025-03-20', updated: '2025-03-21', agent: 'Sophie Martin', sla: '8h', progress: 40 },
    { id: 'TK-4869', client: 'Global Systems', subject: 'Formation utilisateur requise', status: 'Planifié', priority: 'Basse', created: '2025-03-19', updated: '2025-03-21', agent: 'Julien Petit', sla: '24h', progress: 30 },
    { id: 'TK-4868', client: 'Stellar Communications', subject: 'Problème de qualité d\'appel', status: 'Résolu', priority: 'Haute', created: '2025-03-18', updated: '2025-03-20', agent: 'Emma Blanc', sla: '4h', progress: 100 },
  ];
  
  export const chatMessages: ChatMessage[] = [
    { id: 1, user: 'Emma Blanc', avatar: '/api/placeholder/30/30', message: 'Bonjour, pouvez-vous vérifier le statut du ticket TK-4868?', time: '09:32', unread: false, isOnline: true },
    { id: 2, user: 'Marc Dubois', avatar: '/api/placeholder/30/30', message: 'La démo pour Nexus Tech est confirmée pour 15h', time: '09:47', unread: true, isOnline: true },
    { id: 3, user: 'Sophie Martin', avatar: '/api/placeholder/30/30', message: 'J\'ai besoin d\'aide sur le déploiement chez Zenith', time: '10:15', unread: true, isOnline: false },
    { id: 4, user: 'Thomas Bernard', avatar: '/api/placeholder/30/30', message: 'Rapport mensuel terminé, en attente de validation', time: '10:28', unread: false, isOnline: false },
    { id: 5, user: 'Support Kalicom', avatar: '/api/placeholder/30/30', message: 'Bonjour, comment puis-je vous aider aujourd\'hui ?', time: '10:42', unread: true, isOnline: true },
  ];
  
  export const activitiesData: ActivityData[] = [
    { id: 1, user: 'Marc Dubois', action: 'a résolu le ticket', target: 'TK-4868', time: '10:42', type: 'ticket' },
    { id: 2, user: 'Emma Blanc', action: 'a ajouté un nouveau prospect', target: 'Gamma Solutions', time: '10:15', type: 'prospect' },
    { id: 3, user: 'Léa Martin', action: 'a terminé l\'appel avec', target: 'Acme Corp', time: '09:50', type: 'call', duration: '12:35' },
    { id: 4, user: 'Sophie Leroy', action: 'a créé une nouvelle tâche', target: 'Déploiement Zenith', time: '09:30', type: 'task' },
  ];
  
  export const weatherData: WeatherData = {
    location: 'Paris',
    temperature: 18,
    condition: 'Partiellement nuageux',
    high: 21,
    low: 12
  };


  