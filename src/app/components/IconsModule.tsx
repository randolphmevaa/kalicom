// app/components/IconsModule.tsx
import React from 'react';
import { FaGoogleDrive } from "react-icons/fa6";
import { PiToolbox } from "react-icons/pi";
import { RiWhatsappFill } from "react-icons/ri";
import { BiLogoGmail } from "react-icons/bi";
import { IoApps } from "react-icons/io5";
import { IoIosChatboxes } from "react-icons/io";
import { FaEuroSign } from 'react-icons/fa';
import {
  FiHome,
  FiPhoneOutgoing,
  FiSmartphone,
  FiPhoneCall,
  FiBarChart,
  FiMonitor,
  FiUsers,
  FiActivity,
  FiMail,
  FiBox,
  FiFileText,
  FiTool,
  FiFile,
  FiUpload,
  FiCalendar,
  FiMapPin,
  FiUser,
  FiInfo,
  FiImage,
  FiHash,
  FiPercent,
  FiCreditCard,
  FiClipboard,
  FiMessageSquare,
} from 'react-icons/fi';

import type { MenuSection } from './Sidebar';

// Define sections with their icons
const sections: Record<string, MenuSection> = {
  accueil: {
    title: 'Accueil',
    icon: <FiHome size={20} className="text-white" />,
    items: [
      { name: 'Accueil', href: '/dashboard/accueil', icon: <FiHome size={20} className="text-white" /> },
    ],
  },
  pbx: {
    title: 'PBX',
    icon: <FiPhoneCall size={20} className="text-white" />,
    items: [
      { name: 'Tableau de bord', href: '/dashboard', icon: <FiHome size={20} className="text-white" /> },
      { name: 'Mes lignes', href: '/dashboard/pbx/mes-lignes', icon: <FiPhoneOutgoing size={20} className="text-white" /> },
      { name: 'Mes numéros', href: '/dashboard/pbx/mes-numeros', icon: <FiSmartphone size={20} className="text-white" /> },
      { name: 'Applications', href: '/dashboard/pbx/application', icon: <FiMail size={20} className="text-white" /> },
      { name: 'Journal dappels & Enregistrements', href: '/dashboard/pbx/journal-appels', icon: <FiPhoneCall size={20} className="text-white" /> },
      { name: 'Statistiques', href: '/dashboard/pbx/statistique', icon: <FiBarChart size={20} className="text-white" /> },
      { name: 'Parc téléphonique', href: '/dashboard/pbx/parc-telephone', icon: <FiMonitor size={20} className="text-white" /> },
      { name: 'Statut système', href: '/dashboard/pbx/statut', icon: <FiActivity size={20} className="text-white" /> },
      { name: 'Postes de travail', href: '/dashboard/pbx/poste-de-travail', icon: <FiUsers size={20} className="text-white" /> },
    ],
  },
  crm: {
    title: 'CRM',
    icon: <FiMail size={20} className="text-white" />,
    items: [
      { name: 'Tableau de bord', href: '/dashboard/crm/tableau-de-bord', icon: <FiHome size={20} className="text-white" /> },
      { name: 'Prospects', href: '/dashboard/crm/prospects', icon: <FiUser size={20} className="text-white" /> },
      { name: 'Importer prospects', href: '/dashboard/crm/importer-prospects', icon: <FiUpload size={20} className="text-white" /> },
      { name: 'Chat', href: '/dashboard/crm/chat', icon: <IoIosChatboxes size={20} className="text-white" /> },
    ],
  },
  agenda: {
    title: 'Agenda',
    icon: <FiCalendar size={20} className="text-white" />,
    items: [
      { name: 'Agenda', href: '/dashboard/crm/calendrier', icon: <FiCalendar size={20} className="text-white" /> },
    ],
  },
  clients: {
    title: 'Clients',
    icon: <FiUsers size={20} className="text-white" />,
    items: [
      { name: 'Clients', href: '/dashboard/clients', icon: <FiUsers size={20} className="text-white" /> },
    ],
  },
  produits: {
    title: 'Produits',
    icon: <FiBox size={20} className="text-white" />,
    items: [
      { name: 'Produits', href: '/dashboard/produits', icon: <FiBox size={20} className="text-white" /> },
    ],
  },
  applications: {
    title: 'Applications',
    icon: <IoApps size={20} className="text-white" />,
    items: [
      { name: 'Whatsapp', href: '/dashboard/applications/whatsapp', icon: <RiWhatsappFill size={20} className="text-white" /> },
      { name: 'Gmail', href: '/dashboard/applications/gmail', icon: <BiLogoGmail size={20} className="text-white" /> },
      { name: 'Drive', href: '/dashboard/applications/drive', icon: <FaGoogleDrive size={20} className="text-white" /> },
    ],
  },
  documents_ventes: {
    title: 'Documents de ventes',
    icon: <FiFileText size={20} className="text-white" />,
    items: [
      { name: 'Devis', href: '/dashboard/document-ventes/devis', icon: <FiFileText size={20} className="text-white" /> },
      { name: 'Factures', href: '/dashboard/document-ventes/factures', icon: <FiFile size={20} className="text-white" /> },
      { name: 'Avoirs', href: '/dashboard/document-ventes/avoirs', icon: <FiClipboard size={20} className="text-white" /> },
      { name: 'Factures dacompte', href: '/dashboard/document-ventes/factures-acompte', icon: <FiFileText size={20} className="text-white" /> },
      { name: 'Avoir dacompte', href: '/dashboard/document-ventes/avoirs-acompte', icon: <FiFile size={20} className="text-white" /> },
    ],
  },
  reglements_comptabilite: {
    title: 'Reglements/Comptabilite',
    icon: <FaEuroSign size={20} className="text-white" />,
    items: [
      { name: 'Reglements/Comptabilite', href: '/dashboard/reglements-comptabilite', icon: <FaEuroSign size={20} className="text-white" /> },
    ],
  },
  parametre_societe: {
    title: 'Paramètre societe',
    icon: <FiTool size={20} className="text-white" />,
    items: [
      { name: 'Coordonnées', href: '/dashboard/parametre-societe/coordonners', icon: <FiMapPin size={20} className="text-white" /> },
      { 
        name: 'Identification', 
        href: '/dashboard/parametre-societe/identification',
        icon: <FiUser size={20} className="text-white" />,
        subItems: [
          { name: 'Informations administratives', href: '/dashboard/parametre-societe/identification/infos-administratives', icon: <FiInfo size={16} className="text-white" /> },
          { name: 'Informations TVA', href: '/dashboard/parametre-societe/identification/informations-tva', icon: <FiPercent size={16} className="text-white" /> },
        ],
      },
      { name: 'Logo', href: '/dashboard/parametre-societe/logo', icon: <FiImage size={20} className="text-white" /> },
      { name: 'Numerotation', href: '/dashboard/parametre-societe/numerotation', icon: <FiHash size={20} className="text-white" /> },
      { name: 'Mentions legales des devis', href: '/dashboard/parametre-societe/mentions-devis', icon: <FiFileText size={20} className="text-white" /> },
      { name: 'Mentions legales des factures', href: '/dashboard/parametre-societe/mentions-factures', icon: <FiFile size={20} className="text-white" /> },
      { name: 'Taxes', href: '/dashboard/parametre-societe/taxes', icon: <FiPercent size={20} className="text-white" /> },
      { name: 'Banque', href: '/dashboard/parametre-societe/banque', icon: <FiCreditCard size={20} className="text-white" /> },
    ],
  },
  modeles_de_documents: {
    title: 'Modèles de documents',
    icon: <FiFile size={20} className="text-white" />,
    items: [
      { name: 'Factures', href: '/dashboard/modeles-de-documents/factures', icon: <FiFile size={20} className="text-white" /> },
      { name: 'Devis', href: '/dashboard/modeles-de-documents/devis', icon: <FiFileText size={20} className="text-white" /> },
      { name: 'Avoirs', href: '/dashboard/modeles-de-documents/avoirs', icon: <FiClipboard size={20} className="text-white" /> },
      { name: 'Factures dacompte', href: '/dashboard/modeles-de-documents/factures-acompte', icon: <FiFileText size={20} className="text-white" /> },
      { name: 'Avoir dacompte', href: '/dashboard/modeles-de-documents/avoirs-acompte', icon: <FiFile size={20} className="text-white" /> },
    ],
  },
  modeles: {
    title: 'Modèles',
    icon: <FiMessageSquare size={20} className="text-white" />,
    items: [
      { name: 'Email', href: '/dashboard/modeles/email', icon: <FiMail size={20} className="text-white" /> },
      { name: 'SMS', href: '/dashboard/modeles/sms', icon: <FiMessageSquare size={20} className="text-white" /> },
    ],
  },
  utilisateurs: {
    title: 'Utilisateurs',
    icon: <FiUsers size={20} className="text-white" />,
    items: [
      { name: 'Utilisateurs', href: '/dashboard/utilisateurs', icon: <FiUsers size={20} className="text-white" /> },
    ],
  },
  support: {
    title: 'Support & Tickets',
    icon: <PiToolbox size={20} className="text-white" />,
    items: [
      { name: 'Support & Tickets', href: '/dashboard/support-tickets', icon: <PiToolbox size={20} className="text-white" /> },
    ],
  },
};

export default sections;