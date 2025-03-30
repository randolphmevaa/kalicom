'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiPhone,
  FiMail,
  FiMapPin,
  // FiCalendar,
  // FiUserCheck,
  FiEdit,
  FiMessageCircle,
  // FiBarChart2,
  FiClock,
  FiUser,
  FiHeadphones,
  FiMic,
  FiPhoneCall,
  FiPhoneIncoming,
  FiPhoneOff,
  FiPhoneOutgoing,
  // FiActivity,
  // FiMessageSquare,
  // FiStar,
  // FiVolume2,
  // FiWifi,
  FiCloud,
  FiCloudRain,
  FiCloudSnow,
  FiSun,
  FiWind,
  FiDollarSign,
  FiShoppingBag,
  FiFileText,
  FiTrendingUp,
  FiPackage,
  FiCreditCard,
  FiPieChart,
  FiSend
} from 'react-icons/fi';

import ClientOverview from './ClientOverview';
import FacturationTab from './FacturationTab';
import ReglementsSolvabiliteTab from './ReglementsSolvabiliteTab';
import ComptabiliteTab from './ComptabiliteTab';
import FactureElectroniqueTab from './FactureElectroniqueTab';
import ParametresTab from './ParametresTab';

// Define TypeScript interfaces
interface Client {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  entreprise: string;
  ville: string;
  pays: string;
  adresse: string;
  statut: string;
  source: string;
  tags: string[];
  dernierContact: string;
  valeurTotale: string;
  
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
  
  // New fields for billing info
  addressAdditional1?: string;
  addressAdditional2?: string;
  addressAdditional3?: string;
  department?: string;
  siren?: string;
  territoriality?: string;
  naf?: string;
  vatNumber?: string;
  
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
  documentNote?: string;
  
  // Address book entries
  addressBook?: AddressBookEntry[];
  
  // Contact list
  contacts?: Contact[];
  
  // Order history
  orders?: Order[];
  
  // Payment methods
  paymentMethods?: PaymentMethod[];
  
  // Invoice history
  invoices?: Invoice[];
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

interface Order {
  id: string;
  orderNumber: string;
  orderDate: string;
  totalAmount: string;
  status: string;
  items: OrderItem[];
}

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
}

interface PaymentMethod {
  id: string;
  type: string;
  lastFour?: string;
  expiryDate?: string;
  isDefault: boolean;
  accountName?: string;
  accountNumber?: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  amount: string;
  status: string;
  paidDate?: string;
}

// Tag color mapping with brand colors
const tagColors: { [key: string]: string } = {
  "VIP": "#1B0353",
  "Fidèle": "#004AC8",
  "Nouveau": "#4BB2F6",
  "Premium": "#004AC8",
  "Tech": "#1B0353",
  "International": "#1B0353",
  "Référence": "#004AC8",
  "Historique": "#4BB2F6",
  // Default color for any other tags
  "default": "#4BB2F6"
};

const ClientDetailPage: React.FC = () => {
  // Temporary definition for accountManager
  const accountManager = { firstName: "Lucas", lastName: "Martin", role: "Chargé de compte", phone: "06 12 45 78 90", email: "l.martin@company.fr" };
  const pathname = usePathname();
  
  // Extract ID from the URL path
  const extractIdFromPath = (path: string | null): string => {
    if (!path) return '';
    
    const segments = path.split('/');
    // The ID should be the last segment of the path
    return segments[segments.length - 1];
  };
  
  const id = extractIdFromPath(pathname);
  
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // State for call functionality
  const [lastCallStatus, setLastCallStatus] = useState("completed"); // 'completed', 'missed', 'ongoing'
  const [callHistory, setCallHistory] = useState([
    { 
      id: 1, 
      type: 'outgoing', 
      date: new Date(Date.now() - 86400000), 
      duration: '2:18',
      status: 'completed'
    },
    { 
      id: 2, 
      type: 'incoming', 
      date: new Date(Date.now() - 172800000), 
      duration: '4:35',
      status: 'completed'
    },
    { 
      id: 3, 
      type: 'outgoing', 
      date: new Date(Date.now() - 345600000), 
      duration: '0:52',
      status: 'missed'
    }
  ]);
  
  const [voipCredentials] = useState({
    extension: "186",
    username: "user_" + (client ? client.id : ""),
    did: "+33 1 64 28 34 35"
  });
  // const [voipStatus] = useState('connected'); // connected, disconnected, connecting
  const [ , setCallQuality] = useState(95); // 0-100%
  // const [lastActivity] = useState({
  //   type: 'incoming',
  //   time: new Date(Date.now() - 45 * 60000), // 45 minutes ago
  //   duration: '3:17'
  // });
  
  // const [callStats] = useState({
  //   today: { incoming: 4, outgoing: 3, missed: 1, total: 8 },
  //   week: { incoming: 15, outgoing: 20, missed: 3, total: 38 },
  //   avgDuration: '3:22'
  // });
  
  const [weather] = useState({
    location: 'Paris, France',
    temperature: 18,
    condition: 'Partiellement nuageux',
    high: 22,
    low: 14,
    rainChance: 20,
    humidity: 65,
    wind: 12
  });
  
  // Get initials helper function
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };
  
  // Format currency helper function
  // const formatCurrency = (value: string | number) => {
  //   if (typeof value === 'string') {
  //     // Try to convert string to number, removing currency symbols and non-numeric chars except decimal separator
  //     const numericValue = parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.'));
  //     return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(numericValue);
  //   }
  //   return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  // };
  
  // Simulates VoIP connection changes
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update connection quality between 85-100
      setCallQuality(85 + Math.floor(Math.random() * 15));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Format time ago
  // const formatTimeAgo = (date: Date) => {
  //   const now = new Date();
  //   const diffMs = now.getTime() - date.getTime();
  //   const diffMins = Math.floor(diffMs / 60000);
  //   const diffHours = Math.floor(diffMins / 60);
  //   const diffDays = Math.floor(diffHours / 24);
    
  //   if (diffMins < 60) return `il y a ${diffMins} min`;
  //   if (diffHours < 24) return `il y a ${diffHours}h`;
  //   return `il y a ${diffDays}j`;
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
  
  // Get tag color
  const getTagColor = (tag: string) => {
    return tagColors[tag] || tagColors.default;
  };
  
  // Sample client data
  const sampleClients: Client[] = [
    {
      id: 1,
      nom: 'Dupont',
      prenom: 'Marie',
      email: 'marie.dupont@example.com',
      telephone: '+33 6 12 34 56 78',
      entreprise: 'Acme Corp',
      ville: 'Paris',
      pays: 'France',
      adresse: '123 Avenue des Champs-Élysées, 75008',
      statut: 'Actif',
      source: 'Site Web',
      tags: ['VIP', 'Fidèle'],
      dernierContact: '02/03/2025',
      valeurTotale: '15,600 €',
      
      // Extended fields for detailed view
      website: 'https://acmecorp.fr',
      industry: 'Technologies',
      revenueEstimate: '5M€ - 10M€',
      employeeCount: 85,
      linkedIn: 'linkedin.com/company/acmecorp',
      twitter: '@acmecorp',
      
      // Additional fields for new sections
      addressAdditional1: 'Bâtiment A, 3ème étage',
      addressAdditional2: 'Zone Commerciale Est',
      addressAdditional3: '',
      department: 'Paris',
      
      // Shipping address
      shippingTitle: 'Mme',
      shippingName: 'Dupont',
      shippingAddress: '15 Boulevard Haussmann',
      shippingAddressAdditional1: 'Service Logistique',
      shippingAddressAdditional2: 'Quai de livraison n°3',
      shippingAddressAdditional3: '',
      shippingZipCode: '75009',
      shippingCity: 'Paris',
      shippingDepartment: 'Paris',
      shippingCountry: 'France',
      shippingWebsite: 'https://acmecorp.fr/logistics',
      
      // Headquarters info
      companyLegalName: 'Acme Corporation SAS',
      headquartersAddress: '25 Avenue des Champs-Élysées',
      headquartersAddressAdditional1: 'Tour Cristal, 12ème étage',
      headquartersAddressAdditional2: '',
      headquartersAddressAdditional3: '',
      headquartersZipCode: '75008',
      headquartersCity: 'Paris',
      headquartersDepartment: 'Paris',
      headquartersCountry: 'France',
      headquartersWebsite: 'https://acmecorp-group.com',
      
      // Billing contact
      billingContactTitle: 'Mme',
      billingContactLastName: 'Renaud',
      billingContactFirstName: 'Sophie',
      billingContactRole: 'Responsable Comptabilité',
      billingContactDepartment: 'Finance',
      billingContactEmail: 's.renaud@acmecorp.fr',
      billingContactPhone: '01 42 65 78 90',
      billingContactMobile: '07 65 43 21 09',
      billingContactFax: '01 42 65 78 91',
      
      // Registration info
      siren: '512 965 874 00025',
      territoriality: 'France',
      naf: '6201Z',
      vatNumber: 'FR 34 512965874',
      documentNote: 'Référence client à mentionner: ACM-2023',
      
      // Orders
      orders: [
        {
          id: 'o1',
          orderNumber: 'CMD-2023-0042',
          orderDate: '15/02/2025',
          totalAmount: '4,850.00 €',
          status: 'Livré',
          items: [
            {
              id: 'item1',
              productName: 'Solution CRM Premium - Licence Annuelle',
              quantity: 10,
              unitPrice: '485.00 €',
              totalPrice: '4,850.00 €'
            }
          ]
        },
        {
          id: 'o2',
          orderNumber: 'CMD-2024-0017',
          orderDate: '05/03/2025',
          totalAmount: '2,340.00 €',
          status: 'En cours',
          items: [
            {
              id: 'item1',
              productName: 'Module Analytics Pro',
              quantity: 1,
              unitPrice: '1,200.00 €',
              totalPrice: '1,200.00 €'
            },
            {
              id: 'item2',
              productName: 'Heures de formation',
              quantity: 8,
              unitPrice: '140.00 €',
              totalPrice: '1,120.00 €'
            },
            {
              id: 'item3',
              productName: 'Frais de mise en service',
              quantity: 1,
              unitPrice: '20.00 €',
              totalPrice: '20.00 €'
            }
          ]
        }
      ],
      
      // Invoices
      invoices: [
        {
          id: 'inv1',
          invoiceNumber: 'FACT-2023-0126',
          issueDate: '16/02/2025',
          dueDate: '17/03/2025',
          amount: '4,850.00 €',
          status: 'Payée',
          paidDate: '15/03/2025'
        },
        {
          id: 'inv2',
          invoiceNumber: 'FACT-2024-0038',
          issueDate: '06/03/2025',
          dueDate: '05/04/2025',
          amount: '2,340.00 €',
          status: 'En attente'
        }
      ],
      
      // Payment methods
      paymentMethods: [
        {
          id: 'pm1',
          type: 'Carte bancaire',
          lastFour: '4242',
          expiryDate: '03/26',
          isDefault: true
        },
        {
          id: 'pm2',
          type: 'Virement bancaire',
          accountName: 'Acme Corporation SAS',
          accountNumber: 'FR76 3000 5001 0800 0020 0521 M33',
          isDefault: false
        }
      ],
      
      // Notes
      notes: [
        {
          id: 'n1',
          content: 'Marie est très satisfaite de notre solution CRM. Elle souhaite également explorer nos options d\'intégration avec leur ERP existant.',
          createdBy: 'Lucas Martin',
          createdAt: '2025-02-20'
        },
        {
          id: 'n2',
          content: 'J\'ai discuté avec Marie de notre nouvelle offre Analytics. Elle semble intéressée et a demandé une démonstration pour son équipe.',
          createdBy: 'Lucas Martin',
          createdAt: '2025-02-28'
        },
        {
          id: 'n3',
          content: 'Démonstration Analytics réalisée avec succès. Commande passée pour le module et 8 heures de formation supplémentaire.',
          createdBy: 'Emma Laurent',
          createdAt: '2025-03-05'
        }
      ],
      
      // Activities
      activities: [
        {
          id: 'a1',
          type: 'call',
          title: 'Appel de suivi trimestriel',
          description: 'Discussion sur la satisfaction et les besoins futurs',
          date: '2025-02-15',
          status: 'completed',
          performer: 'Lucas Martin'
        },
        {
          id: 'a2',
          type: 'email',
          title: 'Envoi d\'information sur Analytics Pro',
          description: 'Documentation technique et tarifs',
          date: '2025-02-18',
          status: 'completed',
          performer: 'Lucas Martin'
        },
        {
          id: 'a3',
          type: 'meeting',
          title: 'Démonstration Analytics Pro',
          description: 'Présentation des fonctionnalités et cas d\'usage',
          date: '2025-03-01',
          status: 'completed',
          performer: 'Emma Laurent'
        },
        {
          id: 'a4',
          type: 'meeting',
          title: 'Formation équipe',
          description: 'Première session de formation sur le module CRM avancé',
          date: '2025-03-12',
          status: 'pending',
          performer: 'Lucas Martin'
        }
      ],
      
      // Contacts and Address Book
      contacts: [
        {
          id: 'cont1',
          lastName: 'Dupont',
          firstName: 'Marie',
          role: 'Directrice Générale',
          mobilePhone: '06 12 34 56 78',
          phone: '01 42 65 78 92',
          email: 'marie.dupont@example.com',
          address: '123 Avenue des Champs-Élysées, 75008 Paris',
          primaryBilling: false,
          primaryShipping: false,
          dataReuseConsent: true
        },
        {
          id: 'cont2',
          lastName: 'Renaud',
          firstName: 'Sophie',
          role: 'Responsable Comptabilité',
          mobilePhone: '07 65 43 21 09',
          phone: '01 42 65 78 90',
          email: 's.renaud@example.com',
          address: '123 Avenue des Champs-Élysées, 75008 Paris',
          primaryBilling: true,
          primaryShipping: false,
          dataReuseConsent: true
        }
      ],
      
      addressBook: [
        {
          id: 'addr1',
          description: 'Siège social',
          npai: false,
          billingType: 'Principal',
          primaryBilling: true,
          shippingType: 'Secondaire',
          primaryShipping: false,
          title: '',
          name: 'Acme Corporation SAS',
          address1: '25 Avenue des Champs-Élysées',
          address2: 'Tour Cristal, 12ème étage',
          address3: '',
          address4: '',
          zipCode: '75008',
          city: 'Paris',
          department: 'Paris',
          country: 'France',
          website: 'https://acmecorp.fr'
        },
        {
          id: 'addr2',
          description: 'Bureau principal',
          npai: false,
          billingType: 'Secondaire',
          primaryBilling: false,
          shippingType: 'Principal',
          primaryShipping: true,
          title: '',
          name: 'Acme Corp',
          address1: '123 Avenue des Champs-Élysées',
          address2: 'Bâtiment A, 3ème étage',
          address3: 'Zone Commerciale Est',
          address4: '',
          zipCode: '75008',
          city: 'Paris',
          department: 'Paris',
          country: 'France',
          website: 'https://acmecorp.fr'
        }
      ]
    },
    {
      id: 2,
      nom: 'Martin',
      prenom: 'Jean',
      email: 'jean.martin@example.com',
      telephone: '+33 6 23 45 67 89',
      entreprise: 'Nexus Tech',
      ville: 'Lyon',
      pays: 'France',
      adresse: '45 Rue de la République, 69002',
      statut: 'Actif',
      source: 'Référence',
      tags: ['Nouveau', 'Tech'],
      dernierContact: '28/02/2025',
      valeurTotale: '5,800 €',
      
      // Extended fields
      website: 'https://nexustech.fr',
      industry: 'Technologies',
      revenueEstimate: '2M€ - 5M€',
      employeeCount: 35,
      
      // Registration info
      siren: '439 716 531 00011',
      territoriality: 'France',
      naf: '7022Z',
      vatNumber: 'FR 73 439716531',
      
      // Orders
      orders: [
        {
          id: 'o1',
          orderNumber: 'CMD-2025-0003',
          orderDate: '10/01/2025',
          totalAmount: '3,600.00 €',
          status: 'Livré',
          items: [
            {
              id: 'item1',
              productName: 'Solution CRM Standard - Licence Annuelle',
              quantity: 8,
              unitPrice: '450.00 €',
              totalPrice: '3,600.00 €'
            }
          ]
        }
      ],
      
      // Invoices
      invoices: [
        {
          id: 'inv1',
          invoiceNumber: 'FACT-2025-0004',
          issueDate: '11/01/2025',
          dueDate: '10/02/2025',
          amount: '3,600.00 €',
          status: 'Payée',
          paidDate: '05/02/2025'
        }
      ]
    }
  ];
  
  // Fetch client data
  useEffect(() => {
    if (id) {
      setLoading(true);
      
      // In a real app, this would be an API call
      // For demo purposes, we'll use the sample data or simulate not found
      const idNumber = parseInt(id);
      const foundClient = sampleClients.find(c => c.id === idNumber);
      
      // Simulate API delay
      setTimeout(() => {
        // If ID not found, show any sample client to demonstrate the UI
        setClient(foundClient || sampleClients[0]); 
        setLoading(false);
      }, 500);
    } else {
      // If no ID provided yet (on initial render), use the first client as demo
      setClient(sampleClients[0]);
      setLoading(false);
    }
  }, [id]);
  
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
  
  // If client not found, show error
  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Client non trouvé</h1>
          <p className="text-lg text-gray-600 mb-8">Nous n&apos;avons pas pu trouver le client que vous recherchez.</p>
          <Link href="/dashboard/clients" className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition">
            Retour à la liste des clients
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
            href="/dashboard/clients"
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
            Retour à la liste des clients
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
                {/* Client Name */}
                <div className="flex items-center">
                  <motion.div whileHover={{ x: 2 }} className="flex flex-col space-y-1">
                    <span className="text-xs font-medium text-white/70 uppercase tracking-wider">
                      Fiche client
                    </span>
                    <h1 className="text-3xl font-bold text-white">
                      {client.prenom} {client.nom}
                    </h1>
                  </motion.div>
                </div>
                
                {/* Actions Buttons */}
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-lg bg-white text-[#1B0353] font-medium flex items-center shadow-md"
                    onClick={() => alert(`Éditer les informations de ${client.prenom}`)}
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
                    {client.adresse}, {client.ville}, {client.pays}
                  </span>
                </div>

                <div className="flex items-center space-x-3 group">
                  <div className="p-2 bg-white/10 rounded-lg group-hover:bg-purple-600/20 transition-colors">
                    <FiPhone className="w-5 h-5 text-white group-hover:text-purple-300" />
                  </div>
                  <span className="text-white/90 font-medium">
                    {client.telephone}
                  </span>
                </div>
                
                <div className="flex items-center space-x-3 group">
                  <div className="p-2 bg-white/10 rounded-lg group-hover:bg-indigo-600/20 transition-colors">
                    <FiMail className="w-5 h-5 text-white group-hover:text-indigo-300" />
                  </div>
                  <span className="text-white/90 font-medium">
                    {client.email}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  {client.tags.map((tag, index) => (
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
                {/* Client Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <FiDollarSign className="text-white/80" size={16} />
                      <span className="text-white/70 text-sm">Valeur totale</span>
                    </div>
                    <p className="text-xl font-bold text-white">{client.valeurTotale}</p>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <FiShoppingBag className="text-white/80" size={16} />
                      <span className="text-white/70 text-sm">Commandes</span>
                    </div>
                    <p className="text-xl font-bold text-white">{client.orders?.length || 0}</p>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <FiFileText className="text-white/80" size={16} />
                      <span className="text-white/70 text-sm">Factures</span>
                    </div>
                    <p className="text-xl font-bold text-white">{client.invoices?.length || 0}</p>
                  </div>
                </div>

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
                    `${client.adresse}, ${client.ville}, ${client.pays}`
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
                    Localisation du client
                  </span>
                  <span className="block text-sm text-white/80 truncate">
                    {client.adresse}, {client.ville}
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
                      {getInitials(client.prenom, client.nom)}
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
                    {client.entreprise}
                  </span>
                  <span className="text-sm text-white/80 block">
                    Client depuis: <span className="font-medium">2 ans</span>
                  </span>
                </div>
                
                <div className="flex flex-col w-full mt-6 space-y-2">
                  <div className="p-3 bg-white/10 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FiPieChart className="text-white/80" />
                      <span className="text-white text-sm">Dernier achat</span>
                    </div>
                    <span className="text-white font-medium">
                      {client.orders && client.orders.length > 0
                        ? client.orders[0].orderDate
                        : "Aucun"}
                    </span>
                  </div>
                  
                  <div className="p-3 bg-white/10 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FiTrendingUp className="text-white/80" />
                      <span className="text-white text-sm">Statut paiement</span>
                    </div>
                    <span className="px-2 py-1 bg-green-500/20 text-green-100 text-xs rounded-full">
                      À jour
                    </span>
                  </div>
                </div>
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
              <div>
                <ClientOverview 
                  client={client} 
                  loading={loading}
                />
              </div>
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
            {/* Account Manager Card */}
            {accountManager ? (
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
                      {getInitials(accountManager.firstName, accountManager.lastName)}
                    </div>
                  </div>
                </div>
                
                <div className="pt-12 pb-6 px-6">
                  <div className="text-center mb-3">
                    <h3 className="text-xl font-bold text-gray-900">Chargé de compte</h3>
                    <p className="text-blue-600 font-medium">
                      {accountManager.role || "Commercial"}
                    </p>
                  </div>
                  
                  <div className="space-y-3 mt-5">
                    <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <FiUser className="text-blue-600 w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Nom complet</p>
                        <p className="font-medium text-gray-900">{accountManager.firstName} {accountManager.lastName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="p-2 bg-green-100 rounded-full">
                        <FiPhone className="text-green-600 w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Téléphone</p>
                        <p className="font-medium text-gray-900">{accountManager.phone || "Non disponible"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="p-2 bg-purple-100 rounded-full">
                        <FiMail className="text-purple-600 w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="font-medium text-gray-900 truncate">{accountManager.email || "Non disponible"}</p>
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
            
            {/* Customer Portal Access Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100"
            >
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Accès Espace Client</h3>
                
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <FiUser className="text-blue-600 w-4 h-4" />
                      </div>
                      <span className="font-medium text-gray-900">État du compte</span>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Actif
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-600 text-sm">Dernière connexion</span>
                    <span className="text-gray-900 text-sm">27/02/2025</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Adresse email</span>
                    <span className="text-gray-900 text-sm font-medium">{client.email}</span>
                  </div>
                </div>
                
                <div className="flex justify-center gap-3 mt-4">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition text-sm">
                    <FiSend className="w-4 h-4" />
                    <span>Envoyer invitation</span>
                  </button>
                  <button className="flex items-center justify-center p-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition">
                    <FiEdit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
            
            {/* Orders Summary Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Résumé des commandes</h3>
                  <button className="text-xs text-blue-600 hover:text-blue-800 transition">
                    Voir tout
                  </button>
                </div>
                
                <div className="space-y-4">
                  {client.orders && client.orders.length > 0 ? (
                    client.orders.slice(0, 2).map((order) => (
                      <div key={order.id} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-900">{order.orderNumber}</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            order.status === 'Livré' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">{order.orderDate}</span>
                          <span className="font-medium text-gray-900">{order.totalAmount}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-3">Aucune commande</p>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
                  <span className="text-gray-700 font-medium">Total des achats</span>
                  <span className="font-bold text-blue-600">{client.valeurTotale}</span>
                </div>
                
                <button className="w-full py-2 mt-4 bg-[#1B0353] text-white rounded-lg font-medium hover:bg-[#2c0580] transition text-sm flex items-center justify-center gap-2">
                  <FiPackage className="w-4 h-4" />
                  <span>Créer une commande</span>
                </button>
              </div>
            </motion.div>
            
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
            
            {/* Payment Methods Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Moyens de paiement</h3>
                  <button className="text-xs text-blue-600 hover:text-blue-800 transition">
                    Ajouter
                  </button>
                </div>
                
                <div className="space-y-3">
                  {client.paymentMethods && client.paymentMethods.length > 0 ? (
                    client.paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            {method.type === 'Carte bancaire' ? (
                              <FiCreditCard className="text-blue-600 w-5 h-5" />
                            ) : (
                              <FiDollarSign className="text-green-600 w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {method.type}
                              {method.isDefault && (
                                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  Par défaut
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              {method.type === 'Carte bancaire' ? 
                                `**** ${method.lastFour} (exp. ${method.expiryDate})` :
                                method.accountName
                              }
                            </div>
                          </div>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition">
                          <FiEdit className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-3">Aucun moyen de paiement</p>
                  )}
                </div>
              </div>
            </motion.div>
            
            {/* Heure Locale */}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailPage;