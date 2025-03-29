'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  // FiArrowLeft,
  FiPhone,
  FiMail,
  FiMapPin,
  FiCalendar,
  // FiTag,
  FiUserCheck,
  FiEdit,
  // FiTrash2,
  FiMessageCircle,
  FiBarChart2,
  // FiExternalLink,
  // FiFile,
  FiClock,
  // FiTrendingUp,
  // FiDollarSign,
  // FiCheckSquare,
  // FiChevronDown,
  // FiChevronRight,
  // FiInfo,
  FiUser,
  // FiBriefcase,
  // FiLayers,
  // FiGlobe,
  // FiList,
  // FiDownload,
  // FiHelpCircle,
  // FiClipboard,
  // FiCheck,
  // FiUsers,
  // FiPlus,
  FiHeadphones,
  FiMic,
  FiPhoneCall,
  FiPhoneIncoming,
  FiPhoneOff,
  FiPhoneOutgoing,
  FiActivity,
  FiMessageSquare,
  // FiSettings,
  FiStar,
  FiVolume2,
  FiWifi,
  FiCloud,
  FiCloudRain,
  FiCloudSnow,
  FiSun,
  FiWind,
  // FiSquare,
  // FiTrash2,
  // FiBookmark,
  // FiDatabase,
  // FiTruck,
  // FiHome
} from 'react-icons/fi';
import ProspectOverview from './ProspectOverview';
import FacturationTab from './FacturationTab';
import ReglementsSolvabiliteTab from './ReglementsSolvabiliteTab';
import ComptabiliteTab from './ComptabiliteTab';
import FactureElectroniqueTab from './FactureElectroniqueTab';
import ParametresTab from './ParametresTab';

// Define TypeScript interfaces
interface Prospect {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  companyName: string;
  zipCode: string;
  address: string;
  description: string;
  email: string;
  mobilePhoneNumber: string;
  city: string;
  country: string;
  tags: string[];
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  lastContactDate: string;
  status?: string;
  
  // Extended fields for detailed view
  website?: string;
  industry?: string;
  revenueEstimate?: string;
  employeeCount?: number;
  linkedIn?: string;
  twitter?: string;
  notes?: Note[];
  activities?: Activity[];
  opportunities?: Opportunity[];
  documents?: Document[];
  
  // New fields for billing address
  addressAdditional1?: string;
  addressAdditional2?: string;
  addressAdditional3?: string;
  department?: string;
  
  // Shipping address
  shippingTitle?: string;
  shippingName?: string;
  shippingAddress?: string;
  shippingAddressAdditional1?: string;
  shippingAddressAdditional2?: string;
  shippingAddressAdditional3?: string;
  shippingZipCode?: string;
  shippingCity?: string;
  shippingDepartment?: string;
  shippingCountry?: string;
  shippingWebsite?: string;
  
  // Headquarters info
  companyLegalName?: string;
  headquartersAddress?: string;
  headquartersAddressAdditional1?: string;
  headquartersAddressAdditional2?: string;
  headquartersAddressAdditional3?: string;
  headquartersZipCode?: string;
  headquartersCity?: string;
  headquartersDepartment?: string;
  headquartersCountry?: string;
  headquartersWebsite?: string;
  
  // Billing contact
  billingContactTitle?: string;
  billingContactLastName?: string;
  billingContactFirstName?: string;
  billingContactRole?: string;
  billingContactDepartment?: string;
  billingContactEmail?: string;
  billingContactPhone?: string;
  billingContactMobile?: string;
  billingContactFax?: string;
  
  // Registration info
  siren?: string;
  territoriality?: string;
  naf?: string;
  vatNumber?: string;
  documentNote?: string;
  
  // Address book entries
  addressBook?: AddressBookEntry[];
  
  // Contact list
  contacts?: Contact[];
}

interface Note {
  id: string;
  content: string;
  createdBy: string;
  createdAt: string;
}

interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'task';
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
  performer: string;
}

interface Opportunity {
  id: string;
  title: string;
  value: number;
  stage: string;
  probability: number;
  expectedCloseDate: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
}

interface AddressBookEntry {
  id: string;
  description: string;
  npai: boolean;
  billingType: string;
  primaryBilling: boolean;
  shippingType: string;
  primaryShipping: boolean;
  title: string;
  name: string;
  address1: string;
  address2: string;
  address3: string;
  address4: string;
  zipCode: string;
  city: string;
  department: string;
  country: string;
  website: string;
}

interface Contact {
  id: string;
  lastName: string;
  firstName: string;
  role: string;
  mobilePhone: string;
  phone: string;
  email: string;
  address: string;
  primaryBilling: boolean;
  primaryShipping: boolean;
  dataReuseConsent: boolean;
}

// Sample data
const sampleProspects: Prospect[] = [
  {
    id: "LD-12345",
    firstName: "Marie",
    lastName: "Dupont",
    phoneNumber: "06 12 34 56 78",
    companyName: "Nexus Tech",
    zipCode: "75001",
    address: "10 Rue de Rivoli",
    description: "Intéressé par notre offre premium pour améliorer leur productivité. Souhaite une démonstration personnalisée pour leur équipe de direction.",
    email: "marie.dupont@nexustech.fr",
    mobilePhoneNumber: "06 12 34 56 78",
    city: "Paris",
    country: "France",
    tags: ["VIP", "Premium", "Tech"],
    assignedTo: "Emma Laurent",
    createdAt: "2023-09-15",
    updatedAt: "2023-10-01",
    lastContactDate: "2023-10-12",
    status: "Qualifié",
    website: "https://nexustech.fr",
    industry: "Technologies",
    revenueEstimate: "5M€ - 10M€",
    employeeCount: 85,
    linkedIn: "linkedin.com/company/nexustech",
    twitter: "@nexustech",
    
    // Additional fields for new sections
    addressAdditional1: "Bâtiment A, 3ème étage",
    addressAdditional2: "Zone Commerciale Est",
    addressAdditional3: "",
    department: "Paris",
    
    // Shipping address
    shippingTitle: "Mme",
    shippingName: "Dupont",
    shippingAddress: "15 Boulevard Haussmann",
    shippingAddressAdditional1: "Service Logistique",
    shippingAddressAdditional2: "Quai de livraison n°3",
    shippingAddressAdditional3: "",
    shippingZipCode: "75009",
    shippingCity: "Paris",
    shippingDepartment: "Paris",
    shippingCountry: "France",
    shippingWebsite: "https://nexustech.fr/logistics",
    
    // Headquarters info
    companyLegalName: "Nexus Technologies SAS",
    headquartersAddress: "25 Avenue des Champs-Élysées",
    headquartersAddressAdditional1: "Tour Cristal, 12ème étage",
    headquartersAddressAdditional2: "",
    headquartersAddressAdditional3: "",
    headquartersZipCode: "75008",
    headquartersCity: "Paris",
    headquartersDepartment: "Paris",
    headquartersCountry: "France",
    headquartersWebsite: "https://nexustech-group.com",
    
    // Billing contact
    billingContactTitle: "Mme",
    billingContactLastName: "Renaud",
    billingContactFirstName: "Sophie",
    billingContactRole: "Responsable Comptabilité",
    billingContactDepartment: "Finance",
    billingContactEmail: "s.renaud@nexustech.fr",
    billingContactPhone: "01 42 65 78 90",
    billingContactMobile: "07 65 43 21 09",
    billingContactFax: "01 42 65 78 91",
    
    // Registration info
    siren: "512 965 874 00025",
    territoriality: "France",
    naf: "6201Z",
    vatNumber: "FR 34 512965874",
    documentNote: "Référence client à mentionner: NEX-2023",
    
    // Address book
    addressBook: [
      {
        id: "addr1",
        description: "Siège social",
        npai: false,
        billingType: "Principal",
        primaryBilling: true,
        shippingType: "Secondaire",
        primaryShipping: false,
        title: "",
        name: "Nexus Technologies SAS",
        address1: "25 Avenue des Champs-Élysées",
        address2: "Tour Cristal, 12ème étage",
        address3: "",
        address4: "",
        zipCode: "75008",
        city: "Paris",
        department: "Paris",
        country: "France",
        website: "https://nexustech-group.com"
      },
      {
        id: "addr2",
        description: "Bureau principal",
        npai: false,
        billingType: "Secondaire",
        primaryBilling: false,
        shippingType: "Principal",
        primaryShipping: true,
        title: "",
        name: "Nexus Tech",
        address1: "10 Rue de Rivoli",
        address2: "Bâtiment A, 3ème étage",
        address3: "Zone Commerciale Est",
        address4: "",
        zipCode: "75001",
        city: "Paris",
        department: "Paris",
        country: "France",
        website: "https://nexustech.fr"
      },
      {
        id: "addr3",
        description: "Centre logistique",
        npai: false,
        billingType: "Non",
        primaryBilling: false,
        shippingType: "Secondaire",
        primaryShipping: false,
        title: "",
        name: "Nexus Tech Logistique",
        address1: "15 Boulevard Haussmann",
        address2: "Service Logistique",
        address3: "Quai de livraison n°3",
        address4: "",
        zipCode: "75009",
        city: "Paris",
        department: "Paris",
        country: "France",
        website: "https://nexustech.fr/logistics"
      }
    ],
    
    // Contacts
    contacts: [
      {
        id: "cont1",
        lastName: "Dupont",
        firstName: "Marie",
        role: "Directrice Générale",
        mobilePhone: "06 12 34 56 78",
        phone: "01 42 65 78 92",
        email: "marie.dupont@nexustech.fr",
        address: "10 Rue de Rivoli, 75001 Paris",
        primaryBilling: false,
        primaryShipping: false,
        dataReuseConsent: true
      },
      {
        id: "cont2",
        lastName: "Renaud",
        firstName: "Sophie",
        role: "Responsable Comptabilité",
        mobilePhone: "07 65 43 21 09",
        phone: "01 42 65 78 90",
        email: "s.renaud@nexustech.fr",
        address: "10 Rue de Rivoli, 75001 Paris",
        primaryBilling: true,
        primaryShipping: false,
        dataReuseConsent: true
      },
      {
        id: "cont3",
        lastName: "Martin",
        firstName: "Pierre",
        role: "Responsable Logistique",
        mobilePhone: "06 98 76 54 32",
        phone: "01 42 65 78 93",
        email: "p.martin@nexustech.fr",
        address: "15 Boulevard Haussmann, 75009 Paris",
        primaryBilling: false,
        primaryShipping: true,
        dataReuseConsent: true
      }
    ],
    
    // Keep existing data
    notes: [
      {
        id: "n1",
        content: "Marie semble très intéressée par notre solution de gestion de projet. Elle souhaite améliorer la collaboration entre ses équipes qui sont parfois en télétravail.",
        createdBy: "Emma Laurent",
        createdAt: "2023-09-20"
      },
      {
        id: "n2",
        content: "Appel de suivi effectué. Marie a discuté avec son équipe IT et ils ont quelques questions techniques. J'ai programmé une réunion avec notre expert technique.",
        createdBy: "Emma Laurent",
        createdAt: "2023-09-28"
      },
      {
        id: "n3",
        content: "Démonstration réalisée aujourd'hui. Très bon retour de toute l'équipe. Marie va présenter au comité de direction la semaine prochaine.",
        createdBy: "Lucas Martin",
        createdAt: "2023-10-05"
      }
    ],
    activities: [
      {
        id: "a1",
        type: "call",
        title: "Appel de découverte",
        description: "Premier contact pour comprendre leurs besoins",
        date: "2023-09-15",
        status: "completed",
        performer: "Emma Laurent"
      },
      {
        id: "a2",
        type: "email",
        title: "Envoi de documentation",
        description: "Suite à notre appel, envoi des brochures produits et tarifs",
        date: "2023-09-16",
        status: "completed",
        performer: "Emma Laurent"
      },
      {
        id: "a3",
        type: "meeting",
        title: "Démonstration produit",
        description: "Présentation complète de notre solution",
        date: "2023-10-05",
        status: "completed",
        performer: "Lucas Martin"
      },
      {
        id: "a4",
        type: "meeting",
        title: "Réunion de suivi",
        description: "Discussion des prochaines étapes",
        date: "2023-10-20",
        status: "pending",
        performer: "Emma Laurent"
      }
    ],
    opportunities: [
      {
        id: "o1",
        title: "Abonnement Premium - 20 utilisateurs",
        value: 12000,
        stage: "Proposition",
        probability: 70,
        expectedCloseDate: "2023-11-15"
      }
    ],
    documents: [
      {
        id: "d1",
        name: "Proposition commerciale Nexus Tech.pdf",
        type: "PDF",
        size: "2.4 MB",
        uploadedAt: "2023-10-02",
        uploadedBy: "Emma Laurent"
      },
      {
        id: "d2",
        name: "NDA signé.pdf",
        type: "PDF",
        size: "1.1 MB",
        uploadedAt: "2023-09-18",
        uploadedBy: "Julie Dubois"
      }
    ]
  },
  {
    id: "LD-12346",
    firstName: "Thomas",
    lastName: "Bernard",
    phoneNumber: "06 23 45 67 89",
    companyName: "Global Solutions",
    zipCode: "69001",
    address: "25 Rue de la République",
    description: "A contacté via le site web suite à une campagne marketing. Intéressé par notre offre standard pour son équipe de vente.",
    email: "thomas.bernard@globalsolutions.fr",
    mobilePhoneNumber: "06 23 45 67 89",
    city: "Lyon",
    country: "France",
    tags: ["Nouveau", "Marketing"],
    assignedTo: "Lucas Martin",
    createdAt: "2023-09-18",
    updatedAt: "2023-09-25",
    lastContactDate: "2023-10-05",
    status: "Prospect",
    website: "https://globalsolutions.fr",
    industry: "Conseil",
    revenueEstimate: "2M€ - 5M€",
    employeeCount: 35,
    linkedIn: "linkedin.com/company/globalsolutions",
    
    // Additional fields for new sections
    addressAdditional1: "Entrée B",
    addressAdditional2: "",
    addressAdditional3: "",
    department: "Rhône",
    
    // Shipping address (same as billing)
    shippingTitle: "M",
    shippingName: "Bernard",
    shippingAddress: "25 Rue de la République",
    shippingAddressAdditional1: "Entrée B",
    shippingAddressAdditional2: "",
    shippingAddressAdditional3: "",
    shippingZipCode: "69001",
    shippingCity: "Lyon",
    shippingDepartment: "Rhône",
    shippingCountry: "France",
    shippingWebsite: "https://globalsolutions.fr",
    
    // Headquarters info (same as billing)
    companyLegalName: "Global Solutions Consulting SARL",
    headquartersAddress: "25 Rue de la République",
    headquartersAddressAdditional1: "Entrée B",
    headquartersAddressAdditional2: "",
    headquartersAddressAdditional3: "",
    headquartersZipCode: "69001",
    headquartersCity: "Lyon",
    headquartersDepartment: "Rhône",
    headquartersCountry: "France",
    headquartersWebsite: "https://globalsolutions.fr",
    
    // Billing contact
    billingContactTitle: "M",
    billingContactLastName: "Bernard",
    billingContactFirstName: "Thomas",
    billingContactRole: "Directeur Commercial",
    billingContactDepartment: "Ventes",
    billingContactEmail: "thomas.bernard@globalsolutions.fr",
    billingContactPhone: "04 78 12 34 56",
    billingContactMobile: "06 23 45 67 89",
    billingContactFax: "04 78 12 34 57",
    
    // Registration info
    siren: "439 716 531 00011",
    territoriality: "France",
    naf: "7022Z",
    vatNumber: "FR 73 439716531",
    documentNote: "Bon de commande obligatoire",
    
    // Address book
    addressBook: [
      {
        id: "addr1",
        description: "Adresse principale",
        npai: false,
        billingType: "Principal",
        primaryBilling: true,
        shippingType: "Principal",
        primaryShipping: true,
        title: "",
        name: "Global Solutions Consulting SARL",
        address1: "25 Rue de la République",
        address2: "Entrée B",
        address3: "",
        address4: "",
        zipCode: "69001",
        city: "Lyon",
        department: "Rhône",
        country: "France",
        website: "https://globalsolutions.fr"
      }
    ],
    
    // Contacts
    contacts: [
      {
        id: "cont1",
        lastName: "Bernard",
        firstName: "Thomas",
        role: "Directeur Commercial",
        mobilePhone: "06 23 45 67 89",
        phone: "04 78 12 34 56",
        email: "thomas.bernard@globalsolutions.fr",
        address: "25 Rue de la République, 69001 Lyon",
        primaryBilling: true,
        primaryShipping: true,
        dataReuseConsent: true
      },
      {
        id: "cont2",
        lastName: "Leclerc",
        firstName: "Hélène",
        role: "Assistante Administrative",
        mobilePhone: "06 34 56 78 90",
        phone: "04 78 12 34 58",
        email: "helene.leclerc@globalsolutions.fr",
        address: "25 Rue de la République, 69001 Lyon",
        primaryBilling: false,
        primaryShipping: false,
        dataReuseConsent: true
      }
    ],
    
    // Keep existing data
    notes: [
      {
        id: "n1",
        content: "Thomas a rempli un formulaire sur notre site web après avoir vu notre publicité LinkedIn. Il cherche une solution pour son équipe commerciale.",
        createdBy: "Lucas Martin",
        createdAt: "2023-09-18"
      },
      {
        id: "n2",
        content: "Premier appel positif. Thomas est responsable commercial et cherche à améliorer le suivi client. Budget limité mais réel besoin.",
        createdBy: "Lucas Martin",
        createdAt: "2023-09-22"
      }
    ],
    activities: [
      {
        id: "a1",
        type: "email",
        title: "Email automatique suite formulaire",
        description: "Email de bienvenue avec documentation",
        date: "2023-09-18",
        status: "completed",
        performer: "Système"
      },
      {
        id: "a2",
        type: "call",
        title: "Appel de qualification",
        description: "Comprendre les besoins et le budget",
        date: "2023-09-22",
        status: "completed",
        performer: "Lucas Martin"
      },
      {
        id: "a3",
        type: "email",
        title: "Envoi de proposition",
        description: "Proposition adaptée à leur budget",
        date: "2023-10-02",
        status: "completed",
        performer: "Lucas Martin"
      }
    ],
    opportunities: [
      {
        id: "o1",
        title: "Abonnement Standard - 10 utilisateurs",
        value: 4800,
        stage: "Découverte",
        probability: 40,
        expectedCloseDate: "2023-12-10"
      }
    ],
    documents: [
      {
        id: "d1",
        name: "Proposition Global Solutions.pdf",
        type: "PDF",
        size: "1.8 MB",
        uploadedAt: "2023-10-02",
        uploadedBy: "Lucas Martin"
      }
    ]
  }
];

// Tag color mapping with brand colors
const tagColors: { [key: string]: string } = {
  "VIP": "#1B0353",
  "Premium": "#004AC8",
  "Nouveau": "#4BB2F6",
  "Démonstration": "#004AC8",
  "Tech": "#1B0353",
  "Événement": "#4BB2F6",
  "Priorité": "#1B0353",
  "Référence": "#004AC8",
  "Marketing": "#0077B6",
  // Default color for any other tags
  "default": "#4BB2F6"
};

// Status color mapping
// const statusColors: { [key: string]: string } = {
//   "Prospect": "#4BB2F6", // Light blue
//   "Qualifié": "#004AC8", // Medium blue
//   "Proposition": "#1B0353", // Dark blue
//   "Négociation": "#FF9500", // Orange
//   "Gagné": "#00C48C", // Green
//   "Perdu": "#FF3B30", // Red
//   // Default
//   "default": "#4BB2F6"
// };


const ProspectDetailPage: React.FC = () => {
  // Temporary definition for assignedUser to fix the "cannot find name" error.
  const assignedUser = { firstName: "John", lastName: "Doe", role: "Commercial", phone: "0123456789", email: "john.doe@example.com" };
  const pathname = usePathname();
  
  // Extract ID from the URL path (pathname) instead of using router.query
  const extractIdFromPath = (path: string | null): string => {
    if (!path) return '';
    
    const segments = path.split('/');
    // The ID should be the last segment of the path
    return segments[segments.length - 1];
  };
  
  const id = extractIdFromPath(pathname);
  
  const [prospect, setProspect] = useState<Prospect | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('overview');
  // const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
  //   billingAddress: true,
  //   shippingAddress: true,
  //   headquarters: true,
  //   billingContact: true,
  //   registration: true,
  //   addressBook: true,
  //   contacts: true
  // });

  // New state for managing identical address checkboxes
  // const [sameShippingAddress, setSameShippingAddress] = useState<boolean>(true);
  // const [sameHeadquarters, setSameHeadquarters] = useState<boolean>(true);
  // const [sameBillingContact, setSameBillingContact] = useState<boolean>(true);
  
  // Get initials helper function
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };
  
  // Format currency helper function
  // const formatCurrency = (value: number) => {
  //   return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  // };
  const [lastCallStatus, setLastCallStatus] = useState("completed"); // 'completed', 'missed', 'ongoing'
  const [callHistory, setCallHistory] = useState([
    { 
      id: 1, 
      type: 'outgoing', 
      date: new Date(Date.now() - 86400000), 
      duration: '3:42',
      status: 'completed'
    },
    { 
      id: 2, 
      type: 'incoming', 
      date: new Date(Date.now() - 172800000), 
      duration: '1:05',
      status: 'completed'
    },
    { 
      id: 3, 
      type: 'outgoing', 
      date: new Date(Date.now() - 345600000), 
      duration: '0:32',
      status: 'missed'
    }
  ]);
  
  const [voipCredentials ] = useState({
    extension: "237",
    username: "user_" + (prospect ? prospect.id : ""),
    did: "+33 1 64 28 34 35"
  });
  const [voipStatus ] = useState('connected'); // connected, disconnected, connecting
  const [callQuality, setCallQuality] = useState(95); // 0-100%
  const [lastActivity ] = useState({
    type: 'outgoing',
    time: new Date(Date.now() - 35 * 60000), // 35 minutes ago
    duration: '4:22'
  });
  
  const [callStats ] = useState({
    today: { incoming: 3, outgoing: 5, missed: 1, total: 9 },
    week: { incoming: 18, outgoing: 23, missed: 4, total: 45 },
    avgDuration: '3:47'
  });
  
  // const [favoriteContacts, setFavoriteContacts] = useState([
  //   { id: 1, name: 'Jean Martin', role: 'Directeur', phone: '06 12 34 56 78', lastCall: new Date(Date.now() - 2 * 86400000) },
  //   { id: 2, name: 'Sophie Bernard', role: 'Commerciale', phone: '06 23 45 67 89', lastCall: new Date(Date.now() - 5 * 86400000) },
  //   { id: 3, name: 'Paul Dubois', role: 'Technique', phone: '06 34 56 78 90', lastCall: new Date(Date.now() - 1 * 86400000) }
  // ]);

  const [weather ] = useState({
    location: 'Paris, France',
    temperature: 18,
    condition: 'Partiellement nuageux',
    high: 22,
    low: 14,
    rainChance: 20,
    humidity: 65,
    wind: 12
  });

  // Address suggestions for autocomplete
  // const [addressSuggestions] = useState([
  //   "10 Rue de Rivoli, 75001 Paris",
  //   "25 Avenue des Champs-Élysées, 75008 Paris",
  //   "15 Boulevard Haussmann, 75009 Paris",
  //   "25 Rue de la République, 69001 Lyon",
  //   "5 Cours de l'Intendance, 33000 Bordeaux"
  // ]);
  
  // SIREN/SIRET suggestions for autocomplete
  // const [sirenSuggestions] = useState([
  //   "512 965 874 00025 - Nexus Technologies SAS",
  //   "439 716 531 00011 - Global Solutions Consulting SARL",
  //   "432 123 456 00018 - Innovate Design SARL"
  // ]);
  
  // Simulates VoIP connection changes
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update connection quality between 85-100
      setCallQuality(85 + Math.floor(Math.random() * 15));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Format time ago
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) return `il y a ${diffMins} min`;
    if (diffHours < 24) return `il y a ${diffHours}h`;
    return `il y a ${diffDays}j`;
  };
  
  // Format date
  // const formatDate = (date) => {
  //   return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  // };

  // Get weather icon based on condition
const getWeatherIcon = (condition: string) => {
  const lowerCondition = condition.toLowerCase();
  if (lowerCondition.includes('soleil') || lowerCondition.includes('clair')) return <FiSun className="text-yellow-400" size={28} />;
  if (lowerCondition.includes('nuag')) return <FiCloud className="text-gray-400" size={28} />;
  if (lowerCondition.includes('pluie')) return <FiCloudRain className="text-blue-400" size={28} />;
  if (lowerCondition.includes('neige')) return <FiCloudSnow className="text-blue-200" size={28} />;
  return <FiSun className="text-yellow-400" size={28} />;
};
  
  // Format date for call history
  const formatCallDate = (date: Date): string => {
    const now: Date = new Date();
    const diffDays: number = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return (
        "Aujourd'hui " +
        date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' } as Intl.DateTimeFormatOptions)
      );
    } else if (diffDays === 1) {
      return (
        "Hier " +
        date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' } as Intl.DateTimeFormatOptions)
      );
    } else {
      return (
        date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' } as Intl.DateTimeFormatOptions) +
        ' ' +
        date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' } as Intl.DateTimeFormatOptions)
      );
    }
  };
  
  // Simulate an incoming call
  const simulateIncomingCall = () => {
    setLastCallStatus('ongoing');
    // After 5 seconds, set the call to completed
    setTimeout(() => {
      setLastCallStatus('completed');
      const newCall = { 
        id: callHistory.length + 1, 
        type: 'incoming', 
        date: new Date(), 
        duration: '0:48',
        status: 'completed'
      };
      setCallHistory([newCall, ...callHistory]);
    }, 5000);
  };
  
  // Format date helper function
  // const formatDate = (dateString: string) => {
  //   return new Date(dateString).toLocaleDateString('fr-FR', {
  //     year: 'numeric',
  //     month: 'long',
  //     day: 'numeric'
  //   });
  // };
  
  // Get tag color
  const getTagColor = (tag: string) => {
    return tagColors[tag] || tagColors.default;
  };
  
  // Get status color
  // const getStatusColor = (status: string) => {
  //   return statusColors[status] || statusColors.default;
  // };
  
  // Toggle section expansion
  // const toggleSection = (section: string) => {
  //   setExpandedSections({
  //     ...expandedSections,
  //     [section]: !expandedSections[section]
  //   });
  // };
  
  // Fetch prospect data
  useEffect(() => {
    if (id) {
      setLoading(true);
      
      // In a real app, this would be an API call
      // For demo purposes, we'll use the sample data or simulate not found
      const foundProspect = sampleProspects.find(p => p.id === id);
      
      // Simulate API delay
      setTimeout(() => {
        // If ID not found, show any sample prospect to demonstrate the UI
        setProspect(foundProspect || sampleProspects[0]); 
        setLoading(false);
      }, 500);
    } else {
      // If no ID provided yet (on initial render), use the first prospect as demo
      setProspect(sampleProspects[0]);
      setLoading(false);
    }
  }, [id]);
  
  // Handle Convert to Client
  const handleConvertToClient = () => {
    if (!prospect) return;
    
    // In a real app, this would be an API call
    alert(`${prospect.firstName} ${prospect.lastName} a été converti en client avec succès!`);
  };

  // Toggle same address checkboxes
  // const handleToggleSameShippingAddress = () => {
  //   setSameShippingAddress(!sameShippingAddress);
  // };
  
  // const handleToggleSameHeadquarters = () => {
  //   setSameHeadquarters(!sameHeadquarters);
  // };
  
  // const handleToggleSameBillingContact = () => {
  //   setSameBillingContact(!sameBillingContact);
  // };
  
  // If loading, show skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="w-full h-32 bg-gray-200 rounded-xl animate-pulse" />
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="w-full h-96 bg-gray-200 rounded-xl animate-pulse" />
            </div>
            <div className="md:col-span-1">
              <div className="w-full h-96 bg-gray-200 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // If prospect not found, show error
  if (!prospect) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Prospect non trouvé</h1>
          <p className="text-lg text-gray-600 mb-8">Nous n&apos;avons pas pu trouver le prospect que vous recherchez.</p>
          <Link href="/dashboard/crm/prospects" className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition">
            Retour à la liste des prospects
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="p-8 space-y-8">
      <div className="mb-6">
              <Link
                href="/dashboard/crm/prospects"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Retour à la liste des projets
              </Link>
            </div>

        <header>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative rounded-2xl shadow-2xl p-8 md:grid md:grid-cols-[1fr_1.3fr] items-stretch gap-12 bg-[#1B0353] text-white"
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E\")"
            }}
          >
            {/* Left Column – Client Information */}
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                {/* Back Button and Client Name */}
                <div className="flex items-center">

                  <motion.div whileHover={{ x: 2 }} className="flex flex-col space-y-1">
                    <span className="text-xs font-medium text-white/70 uppercase tracking-wider">
                      Profil du prospect
                    </span>
                    <h1 className="text-3xl font-bold text-white">
                      {prospect.firstName} {prospect.lastName}
                    </h1>
                  </motion.div>
                </div>
                
                {/* Prospect Status and Actions */}
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-lg bg-white text-[#1B0353] font-medium flex items-center shadow-md"
                    onClick={() => alert(`Éditer les informations de ${prospect.firstName}`)}
                  >
                    <FiEdit className="mr-2" />
                    <span className="hidden sm:inline">Modifier</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={simulateIncomingCall}
                    className="px-4 py-2 rounded-lg bg-[#1B0353] text-white font-medium flex items-center shadow-md border border-white/20"
                  >
                    <FiPhoneIncoming className="mr-2" />
                    <span className="hidden sm:inline">Appeler</span>
                  </motion.button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 group">
                  <div className="p-2 bg-white/10 rounded-lg group-hover:bg-blue-600/20 transition-colors">
                    <FiMapPin className="w-5 h-5 text-white group-hover:text-blue-300" />
                  </div>
                  <span className="text-white/90 font-medium">
                    {prospect.address}, {prospect.zipCode} {prospect.city}, {prospect.country}
                  </span>
                </div>

                <div className="flex items-center space-x-3 group">
                  <div className="p-2 bg-white/10 rounded-lg group-hover:bg-purple-600/20 transition-colors">
                    <FiPhone className="w-5 h-5 text-white group-hover:text-purple-300" />
                  </div>
                  <span className="text-white/90 font-medium">
                    {prospect.mobilePhoneNumber || prospect.phoneNumber}
                  </span>
                </div>
                
                <div className="flex items-center space-x-3 group">
                  <div className="p-2 bg-white/10 rounded-lg group-hover:bg-indigo-600/20 transition-colors">
                    <FiMail className="w-5 h-5 text-white group-hover:text-indigo-300" />
                  </div>
                  <span className="text-white/90 font-medium">
                    {prospect.email}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  {prospect.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 rounded-full text-white text-sm font-medium"
                      style={{ 
                        backgroundColor: getTagColor(tag),
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 space-y-6 border-t border-gray-100">
                {/* Cloud Telephony Section */}
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white/80">
                      Téléphonie Cloud
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        lastCallStatus === 'ongoing' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-white/20 text-white'
                      }`}>
                        {lastCallStatus === 'ongoing' ? 'En appel' : 'Disponible'}
                      </span>
                    </div>
                  </div>
                  
                  {/* VOIP Info */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2 bg-white/10 px-4 py-2.5 rounded-lg">
                      <FiPhone className="w-5 h-5 text-white/80" />
                      <div className="flex flex-col">
                        <span className="text-xs text-white/60">Extension</span>
                        <span className="font-mono font-medium text-white">{voipCredentials.extension}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/10 px-4 py-2.5 rounded-lg">
                      <FiPhoneCall className="w-5 h-5 text-white/80" />
                      <div className="flex flex-col">
                        <span className="text-xs text-white/60">Numéro DID</span>
                        <span className="font-mono font-medium text-white">{voipCredentials.did}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Call Controls */}
                  <div className="flex items-center justify-between mt-2 p-3 bg-white/10 rounded-lg">
                    {lastCallStatus === 'ongoing' ? (
                      <>
                        <button className="p-2 rounded-full bg-red-600/80 text-white hover:bg-red-500 transition">
                          <FiPhoneOff className="w-5 h-5" />
                        </button>
                        <button className="p-2 rounded-full bg-blue-600/80 text-white hover:bg-blue-500 transition">
                          <FiMic className="w-5 h-5" />
                        </button>
                        <button className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition">
                          <FiHeadphones className="w-5 h-5" />
                        </button>
                        <div className="px-3 py-1 bg-green-600/30 text-white rounded-lg flex items-center">
                          <FiClock className="w-4 h-4 mr-1" />
                          <span className="font-mono">00:42</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <button 
                          className="p-2 rounded-full bg-green-600/80 text-white hover:bg-green-500 transition"
                          onClick={simulateIncomingCall}
                        >
                          <FiPhoneCall className="w-5 h-5" />
                        </button>
                        <button className="p-2 rounded-full bg-blue-600/80 text-white hover:bg-blue-500 transition">
                          <FiMessageCircle className="w-5 h-5" />
                        </button>
                        <button className="p-2 rounded-full bg-indigo-600/80 text-white hover:bg-indigo-500 transition">
                          <FiPhoneIncoming className="w-5 h-5" />
                        </button>
                        <button className="p-2 rounded-full bg-purple-600/80 text-white hover:bg-purple-500 transition">
                          <FiPhoneOutgoing className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Call History Section */}
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white/80">
                      Historique des appels
                    </span>
                    <button className="text-xs text-blue-300 hover:text-blue-200 transition">
                      Voir tout
                    </button>
                  </div>
                  
                  <div className="space-y-1.5 max-h-[120px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">
                    {callHistory.map(call => (
                      <div key={call.id} className="flex items-center justify-between p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className={`p-1.5 rounded-full ${
                            call.type === 'incoming' 
                              ? 'bg-indigo-500/70 text-white' 
                              : 'bg-purple-500/70 text-white'
                          }`}>
                            {call.type === 'incoming' 
                              ? <FiPhoneIncoming className="w-4 h-4" /> 
                              : <FiPhoneOutgoing className="w-4 h-4" />
                            }
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">
                              {call.type === 'incoming' ? 'Appel entrant' : 'Appel sortant'}
                            </div>
                            <div className="text-xs text-white/60">{formatCallDate(call.date)}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`text-xs ${
                            call.status === 'missed' ? 'text-red-300' : 'text-white/80'
                          }`}>
                            {call.status === 'missed' ? 'Manqué' : call.duration}
                          </span>
                          <button className="p-1 rounded-full hover:bg-white/20 transition">
                            <FiPhone className="w-3.5 h-3.5 text-white/80" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Call Metrics */}
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div className="flex flex-col items-center p-2 bg-blue-900/30 rounded-lg border border-blue-500/30">
                      <FiBarChart2 className="w-5 h-5 text-blue-300 mb-1" />
                      <span className="text-xs text-white/60">Temps moyen</span>
                      <span className="text-sm font-medium text-white">2:16</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-green-900/30 rounded-lg border border-green-500/30">
                      <FiPhoneIncoming className="w-5 h-5 text-green-300 mb-1" />
                      <span className="text-xs text-white/60">Entrants</span>
                      <span className="text-sm font-medium text-white">4</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-purple-900/30 rounded-lg border border-purple-500/30">
                      <FiPhoneOutgoing className="w-5 h-5 text-purple-300 mb-1" />
                      <span className="text-xs text-white/60">Sortants</span>
                      <span className="text-sm font-medium text-white">7</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column – Map & Avatar */}
            <div className="flex flex-col md:flex-row md:items-stretch md:space-x-6 mt-6 md:mt-0">
              {/* Map Section */}
              <div className="relative flex-1 rounded-xl overflow-hidden border border-white/20">
                <iframe
                  title="Streetview"
                  className="absolute inset-0 w-full h-full"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    `${prospect.address}, ${prospect.zipCode} ${prospect.city}, ${prospect.country}`
                  )}&t=k&z=18&ie=UTF8&iwloc=&output=embed`}
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: `
                      radial-gradient(
                        circle at center, 
                        rgba(27, 3, 83, 0) 30%, 
                        rgba(27, 3, 83, 0.95) 100%
                      )
                    `,
                  }}
                />

                <div className="absolute bottom-4 left-4 right-4 bg-[#1B0353]/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                  <span className="text-sm font-medium text-white">
                    Localisation du prospect
                  </span>
                  <span className="block text-sm text-white/80 truncate">
                    {prospect.address}, {prospect.city}
                  </span>
                </div>
              </div>

              {/* Avatar and Company Info Section */}
              <div className="flex flex-col items-center justify-between py-4">
                <motion.div whileHover={{ scale: 1.02 }} className="relative group">
                  <div className="absolute inset-0 rounded-full transform transition-all group-hover:scale-105 group-hover:bg-gradient-to-r from-blue-400/30 to-purple-400/30" />
                  <div 
                    className="w-32 h-32 flex items-center justify-center rounded-full border-2 border-white/30"
                    style={{
                      background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent 80%)",
                      boxShadow: "0 8px 16px rgba(0,0,0,0.2), inset 0 0 20px rgba(255,255,255,0.2)"
                    }}
                  >
                    <span className="text-2xl font-bold text-white">
                      {getInitials(prospect.firstName, prospect.lastName)}
                    </span>
                  </div>
                  <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 border-[#1B0353] shadow-sm ${
                    lastCallStatus === 'ongoing' ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                </motion.div>

                <div className="text-center mt-4 space-y-1">
                  <span className="block text-xs font-medium text-white/70 uppercase tracking-wide">
                    Entreprise
                  </span>
                  <span className="text-lg font-semibold text-white">
                    {prospect.companyName}
                  </span>
                  <span className="text-sm text-white/80 block">
                    Assigné à: {prospect.assignedTo}
                  </span>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 w-full px-4 py-2 rounded-lg bg-white text-[#1B0353] font-medium flex items-center justify-center shadow-md"
                  onClick={handleConvertToClient}
                >
                  <FiUserCheck className="mr-2" />
                  <span>Transformer en client</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </header>
      </div>
      
      {/* Main Content */}
      <div className="p-8 space-y-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            <button
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-[#004AC8] text-[#004AC8]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Identification
            </button>
            <button
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'facturation'
                  ? 'border-[#004AC8] text-[#004AC8]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('facturation')}
            >
              Facturation
            </button>
            <button
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reglements'
                  ? 'border-[#004AC8] text-[#004AC8]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('reglements')}
            >
              Règlements/Solvabilité
            </button>
            <button
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'comptabilité'
                  ? 'border-[#004AC8] text-[#004AC8]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('comptabilité')}
            >
              Comptabilité
            </button>
            <button
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'facture-éléctronique'
                  ? 'border-[#004AC8] text-[#004AC8]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('facture-éléctronique')}
            >
              Facture éléctronique
            </button>
            <button
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'paramètres'
                  ? 'border-[#004AC8] text-[#004AC8]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('paramètres')}
            >
              Paramètres
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="flex gap-8">
          {/* Left Column - Main Content */}
          <div className="flex-1 space-y-10">
          {activeTab === 'overview' && (
            <ProspectOverview 
            prospect={prospect} 
            loading={loading}
          />
          )}

            {activeTab === 'facturation' && (
              <FacturationTab loading={loading}/>
            )}
            
            {activeTab === 'reglements' && (
              <ReglementsSolvabiliteTab loading={loading}/>
            )}
            
            {activeTab === 'comptabilité' && (
              <ComptabiliteTab loading={loading}/>
            )}
            
            {activeTab === 'facture-éléctronique' && (
              <FactureElectroniqueTab loading={loading}/>
            )}

            {activeTab === 'paramètres' && (
              <ParametresTab loading={loading}/>
            )}
          </div>
          
          {/* Right Column - Side Info */}
          <div className="w-80 space-y-6 sticky top-10">
            {/* Chargé de compte Card */}
            {assignedUser ? (
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100"
              >
                <div className="h-28 bg-gradient-to-r from-[#1B0353] to-[#004AC8] relative">
                  <div 
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E\")"
                    }}
                  />
                  <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2">
                    <div className="w-20 h-20 rounded-full border-4 border-white bg-gradient-to-br from-[#004AC8] to-[#1B0353] flex items-center justify-center text-white text-xl font-bold shadow-lg">
                      {getInitials(assignedUser.firstName, assignedUser.lastName)}
                    </div>
                  </div>
                </div>
                
                <div className="pt-12 pb-6 px-6">
                  <div className="text-center mb-3">
                    <h3 className="text-xl font-bold text-gray-900">Chargé de compte</h3>
                    <p className="text-blue-600 font-medium">
                      {assignedUser.role || "Commercial"}
                    </p>
                  </div>
                  
                  <div className="space-y-3 mt-5">
                    <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <FiUser className="text-blue-600 w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Nom complet</p>
                        <p className="font-medium text-gray-900">{assignedUser.firstName} {assignedUser.lastName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="p-2 bg-green-100 rounded-full">
                        <FiPhone className="text-green-600 w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Téléphone</p>
                        <p className="font-medium text-gray-900">{assignedUser.phone || "Non disponible"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="p-2 bg-purple-100 rounded-full">
                        <FiMail className="text-purple-600 w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="font-medium text-gray-900 truncate">{assignedUser.email || "Non disponible"}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition">
                      <FiEdit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
              >
                <p className="text-gray-500 text-center">Aucun chargé de compte assigné</p>
                <button className="mt-3 w-full py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition">
                  Assigner un chargé de compte
                </button>
              </motion.div>
            )}
            
            {/* Weather Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-7 shadow-2xl overflow-hidden transition-all duration-300 group"
            >
              {/* Background texture */}
              <div className="absolute inset-0 bg-noise opacity-5 mix-blend-overlay" />
              
              {/* Animated highlight */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10 text-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <FiMapPin className="mr-2 text-white/80" size={16} />
                    <h3 className="text-lg font-semibold">{weather.location}</h3>
                  </div>
                  <span className="text-sm opacity-80">
                    {new Date().toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <div className="text-5xl font-bold">{weather.temperature}°</div>
                    <div className="text-lg mt-1">{weather.condition}</div>
                    <div className="text-sm text-white/80 mt-2">
                      H: {weather.high}° L: {weather.low}°
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
                    {getWeatherIcon(weather.condition)}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-white/20">
                  <div className="flex flex-col items-center">
                    <FiCloudRain className="text-white/80 mb-1" size={18} />
                    <div className="text-sm">{weather.rainChance}%</div>
                    <div className="text-xs text-white/70">Pluie</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <FiWind className="text-white/80 mb-1" size={18} />
                    <div className="text-sm">{weather.wind} km/h</div>
                    <div className="text-xs text-white/70">Vent</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <FiCloud className="text-white/80 mb-1" size={18} />
                    <div className="text-sm">{weather.humidity}%</div>
                    <div className="text-xs text-white/70">Humidité</div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* VoIP Status Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Statut Téléphonie</h3>
                  <div 
                    className={`w-3 h-3 rounded-full ${
                      voipStatus === 'connected' ? 'bg-green-500' :
                      voipStatus === 'connecting' ? 'bg-yellow-500' :
                      'bg-red-500'
                    } ${voipStatus === 'connecting' ? 'animate-pulse' : ''}`} 
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gradient-to-br from-[#1B0353] to-[#004AC8] rounded-lg text-white">
                  <div>
                    <div className="flex items-center gap-2">
                      <FiWifi className="text-white/90" />
                      <span className="font-medium">Qualité du signal</span>
                    </div>
                    <div className="mt-2 text-2xl font-bold">{callQuality}%</div>
                  </div>
                  
                  <div className="flex gap-2">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
                    >
                      <FiMic className="text-white" />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
                    >
                      <FiVolume2 className="text-white" />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
                    >
                      <FiHeadphones className="text-white" />
                    </motion.button>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="text-sm text-gray-500 mb-1">Dernière activité</div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {lastActivity.type === 'outgoing' ? (
                        <FiPhoneOutgoing className="text-blue-600" />
                      ) : (
                        <FiPhoneIncoming className="text-green-600" />
                      )}
                      <span className="font-medium text-gray-900">
                        {lastActivity.type === 'outgoing' ? 'Appel sortant' : 'Appel entrant'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatTimeAgo(lastActivity.time)}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <div className="text-sm text-gray-500">{prospect.firstName} {prospect.lastName}</div>
                    <div className="text-sm font-medium">{lastActivity.duration}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button className="flex items-center justify-center gap-1 py-2 bg-[#1B0353] text-white rounded-lg font-medium hover:bg-[#2c0580] transition">
                    <FiPhoneCall className="w-4 h-4" />
                    <span>Appeler</span>
                  </button>
                  <button className="flex items-center justify-center gap-1 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition">
                    <FiMessageSquare className="w-4 h-4" />
                    <span>Message</span>
                  </button>
                </div>
              </div>
            </motion.div>
            
            {/* Call Analytics Card */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="relative bg-gradient-to-br from-[#004AC8] to-[#1B0353] rounded-2xl p-7 shadow-2xl overflow-hidden transition-all duration-300 group"
            >
              {/* Background pattern */}
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E\")"
                }}
              />
              
              {/* Animated highlight */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-bold text-white">Analyse d&apos;appels</h3>
                  <div className="flex items-center space-x-1 bg-white/20 text-white text-sm rounded-full px-3 py-1">
                    <span>Aujourd&apos;hui</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-5">
                  <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <FiPhoneIncoming className="text-green-300" size={16} />
                      <span className="text-white/80 text-sm">Entrants</span>
                    </div>
                    <p className="text-center text-2xl font-bold text-white">{callStats.today.incoming}</p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <FiPhoneOutgoing className="text-blue-300" size={16} />
                      <span className="text-white/80 text-sm">Sortants</span>
                    </div>
                    <p className="text-center text-2xl font-bold text-white">{callStats.today.outgoing}</p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <FiPhoneOff className="text-red-300" size={16} />
                      <span className="text-white/80 text-sm">Manqués</span>
                    </div>
                    <p className="text-center text-2xl font-bold text-white">{callStats.today.missed}</p>
                  </div>
                </div>
                
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FiBarChart2 className="text-white/80" size={16} />
                      <span className="text-white/80 text-sm">Performance hebdomadaire</span>
                    </div>
                    <span className="text-white font-bold">{callStats.week.total} appels</span>
                  </div>
                  
                  <div className="h-1.5 w-full bg-white/20 rounded-full mb-3 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-white/80">
                    <span>Durée moyenne: {callStats.avgDuration}</span>
                    <span>{Math.round((callStats.week.incoming + callStats.week.outgoing) / 5)} appels/jour</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Heure Locale - Keep this nice card from the original */}
            <motion.div
              whileHover={{ scale: 1.005 }}
              className="relative bg-gradient-to-br from-indigo-600 to-blue-800 rounded-2xl p-8 shadow-2xl overflow-hidden transition-all duration-300 group"
            >
              {/* Background texture */}
              <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay" />
              
              {/* Animated highlight */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10 flex items-center justify-between text-white">
                {/* Time display */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold tracking-widest uppercase opacity-75">
                    Heure Locale
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-extrabold tracking-tight tabular-nums">
                      {new Date().toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="text-lg font-medium opacity-80">
                      {new Date().toLocaleTimeString("fr-FR", {
                        second: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-lg font-medium opacity-90">
                    {new Date().toLocaleDateString("fr-FR", {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    })}
                  </p>
                </div>

                {/* Animated clock icon */}
                <motion.div 
                  className="flex items-center justify-center p-4 bg-white/10 rounded-full backdrop-blur-sm"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <FiClock className="h-12 w-12 text-white/90" />
                </motion.div>
              </div>

              {/* Second indicator */}
              <div className="absolute bottom-6 right-6">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
              </div>
            </motion.div>
            
            {/* Call Actions */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
            >
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Actions rapides</h3>
                <div className="grid grid-cols-3 gap-3">
                  <button className="flex flex-col items-center justify-center py-3 px-1 rounded-xl bg-[#1B0353]/10 text-[#1B0353] hover:bg-[#1B0353]/20 transition">
                    <FiPhoneCall className="h-6 w-6 mb-1" />
                    <span className="text-xs font-medium">Appeler</span>
                  </button>
                  <button className="flex flex-col items-center justify-center py-3 px-1 rounded-xl bg-[#1B0353]/10 text-[#1B0353] hover:bg-[#1B0353]/20 transition">
                    <FiMessageSquare className="h-6 w-6 mb-1" />
                    <span className="text-xs font-medium">Message</span>
                  </button>
                  <button className="flex flex-col items-center justify-center py-3 px-1 rounded-xl bg-[#1B0353]/10 text-[#1B0353] hover:bg-[#1B0353]/20 transition">
                    <FiCalendar className="h-6 w-6 mb-1" />
                    <span className="text-xs font-medium">RDV</span>
                  </button>
                  <button className="flex flex-col items-center justify-center py-3 px-1 rounded-xl bg-[#1B0353]/10 text-[#1B0353] hover:bg-[#1B0353]/20 transition">
                    <FiActivity className="h-6 w-6 mb-1" />
                    <span className="text-xs font-medium">Activités</span>
                  </button>
                  <button className="flex flex-col items-center justify-center py-3 px-1 rounded-xl bg-[#1B0353]/10 text-[#1B0353] hover:bg-[#1B0353]/20 transition">
                    <FiStar className="h-6 w-6 mb-1" />
                    <span className="text-xs font-medium">Important</span>
                  </button>
                  <button className="flex flex-col items-center justify-center py-3 px-1 rounded-xl bg-[#1B0353]/10 text-[#1B0353] hover:bg-[#1B0353]/20 transition">
                    <FiUser className="h-6 w-6 mb-1" />
                    <span className="text-xs font-medium">Profil</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProspectDetailPage;