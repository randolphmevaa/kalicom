'use client';

import { memo } from 'react';
import { FaEuroSign } from 'react-icons/fa6';
import { 
  FiUsers, 
  FiPhoneCall, 
  FiHeadphones, 
  FiCalendar, 
  FiMessageSquare, 
  FiFileText,
  FiUserPlus
} from 'react-icons/fi';
import { QuickActionCard } from '@/app/components/ui/QuickActionCard';

interface QuickActionSectionProps {
  darkMode: boolean;
  unreadMessages: number;
  openTickets: number;
}

export const QuickActionSection = memo(function QuickActionSection({
  // darkMode,
  unreadMessages,
  openTickets
}: QuickActionSectionProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6">
      <QuickActionCard
        icon={<FiUserPlus className="w-6 h-6" />}
        title="Nouveau prospect"
        description="Ajouter un prospect"
        color="#4F46E5"
        onClick={() => console.log('New Prospect')}
        pulse={true}
        href="/dashboard/crm/prospects"
      />
      <QuickActionCard
        icon={<FiUsers className="w-6 h-6" />}
        title="Nouveau client"
        description="Ajouter un client"
        color="#10B981"
        onClick={() => console.log('New Client')}
        href="/dashboard/clients"
      />
      <QuickActionCard
        icon={<FiPhoneCall className="w-6 h-6" />}
        title="Passer un appel"
        description="Contacter un contact"
        color="#004AC8"
        onClick={() => console.log('Make Call')}
        href="/dashboard/pbx/poste-de-travail"
      />
      <QuickActionCard
        icon={<FiHeadphones className="w-6 h-6" />}
        title="Nouveau ticket"
        description="Support client"
        color="#8B5CF6"
        onClick={() => console.log('New Ticket')}
        pulse={openTickets > 5}
        href="/dashboard/support-tickets"
      />
      <QuickActionCard
        icon={<FiCalendar className="w-6 h-6" />}
        title="Planifier"
        description="Gérer le calendrier"
        color="#F59E0B"
        onClick={() => console.log('Schedule')}
        href="/dashboard/crm/calendrier"
      />
      <QuickActionCard
        icon={<FiMessageSquare className="w-6 h-6" />}
        title="Envoyer un message"
        description="Communiquer"
        color="#EF4444"
        onClick={() => console.log('Send Message')}
        pulse={unreadMessages > 0}
        href="/dashboard/crm/chat"
      />
      <QuickActionCard
        icon={<FiFileText className="w-6 h-6" />}
        title="Créer facture"
        description="Facturation client"
        color="#6366F1"
        onClick={() => console.log('Create Invoice')}
        href="/dashboard/document-ventes/factures"
      />
      <QuickActionCard
        icon={<FaEuroSign className="w-6 h-6" />}
        title="Créer devis"
        description="Proposer une offre"
        color="#475569"
        onClick={() => console.log('Create Quote')}
        href="/dashboard/document-ventes/devis"
      />
    </div>
  );
});

export default QuickActionSection;