import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiEdit,
  // FiSettings,
  FiInfo,
  FiChevronDown,
  FiTag,
  FiAlertCircle,
  FiCheck,
  FiX,
  FiClock,
  FiRefreshCw
} from 'react-icons/fi';
import { IconType } from 'react-icons';

// Define specific interfaces instead of using 'any'
interface StatusHistoryItem {
  fromStatus: string;
  toStatus: string;
  date: string;
}

interface Prospect {
  status?: string;
  statusHistory?: StatusHistoryItem[];
}

// Interfaces needed for the component
interface ParametresProps {
  prospect?: Prospect; // Changed from 'any' to Prospect
  loading: boolean;
}

interface SectionHeaderProps {
  icon: IconType;
  title: string;
  subtitle: string;
  color: string;
  onEdit?: () => void;
}

interface FormSelectProps {
  label: string;
  value?: string;
  options: { value: string; label: string; icon?: IconType; color?: string }[];
  className?: string;
}

const ParametresTab: React.FC<ParametresProps> = ({ prospect, loading }) => {
  // State for selected status
  const [selectedStatus, setSelectedStatus] = useState<string>(prospect?.status || "active");

  // Animation variants
  const sectionAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.1, 
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  // Section Header component
  const SectionHeader: React.FC<SectionHeaderProps> = ({ icon: Icon, title, subtitle, color, onEdit }) => (
    <div 
      className={`relative px-6 sm:px-10 py-8 ${color} overflow-hidden`}
      style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E\")"
      }}
    >          
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center">
          <div 
            className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold mr-5 border-2 border-white/30"
            style={{
              background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent 80%)",
              boxShadow: "0 8px 16px rgba(0,0,0,0.2), inset 0 0 20px rgba(255,255,255,0.2)"
            }}
          >
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {title}
            </h2>
            <p className="text-white/80 text-sm mt-1">{subtitle}</p>
          </div>
        </div>
        {onEdit && (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEdit}
            className="p-2 rounded-lg bg-white/15 text-white hover:bg-white/25 transition-colors duration-200 flex items-center space-x-2"
          >
            <FiEdit className="w-4 h-4" />
            <span className="text-sm font-medium">Éditer</span>
          </motion.button>
        )}
      </div>
    </div>
  );
  
  // Enhanced Form select with icons
  const FormSelect: React.FC<FormSelectProps> = ({ 
    label, 
    value, 
    options, 
    className = ""
  }) => {
    const selectedOption = options.find(option => option.value === (value || selectedStatus));
    
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedStatus(e.target.value);
    };
    
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          {value && <span className="text-xs text-purple-500">Modifier</span>}
        </div>
        <div className="relative">
          <select
            className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-200 text-gray-900 font-medium bg-white appearance-none"
            value={selectedStatus}
            onChange={handleChange}
          >
            {options.map((option, index) => (
              <option key={index} value={option.value}>{option.label}</option>
            ))}
          </select>
          
          {/* Display the selected option's icon */}
          {selectedOption?.icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div 
                className={`rounded-full p-1 ${selectedOption.color || 'bg-gray-100'}`}
              >
                {React.createElement(selectedOption.icon, { className: "w-4 h-4" })}
              </div>
            </div>
          )}
          
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <FiChevronDown className="w-5 h-5 text-gray-500" />
          </div>
        </div>
      </div>
    );
  };

  // Get status card details based on selected status
  const getStatusDetails = () => {
    switch(selectedStatus) {
      case 'active':
        return {
          title: 'Client Actif',
          description: 'Ce client est actif et peut passer des commandes normalement. Toutes les fonctionnalités sont disponibles pour ce compte.',
          icon: FiCheck,
          color: 'bg-green-100 text-green-800',
          border: 'border-green-200'
        };
      case 'blocked':
        return {
          title: 'Client Bloqué',
          description: 'Ce client est bloqué et ne peut pas passer de nouvelles commandes. Les commandes en cours peuvent être traitées.',
          icon: FiX,
          color: 'bg-red-100 text-red-800',
          border: 'border-red-200'
        };
      case 'dormant':
        return {
          title: 'Client en Sommeil',
          description: 'Ce client est actuellement en sommeil. Aucune activité commerciale récente. Une action commerciale peut être nécessaire.',
          icon: FiClock,
          color: 'bg-amber-100 text-amber-800',
          border: 'border-amber-200'
        };
      case 'prospect':
        return {
          title: 'Prospect',
          description: 'Ce compte est un prospect potentiel qui n\'a pas encore passé de commande. Actions commerciales recommandées.',
          icon: FiTag,
          color: 'bg-blue-100 text-blue-800',
          border: 'border-blue-200'
        };
      case 'lead':
        return {
          title: 'Lead',
          description: 'Ce compte est un lead en phase de qualification. Actions commerciales à prévoir selon le scoring.',
          icon: FiRefreshCw,
          color: 'bg-purple-100 text-purple-800',
          border: 'border-purple-200'
        };
      case 'former':
        return {
          title: 'Ancien Client',
          description: 'Ce compte est un ancien client qui n\'a pas passé de commande depuis plus de 12 mois. Une réactivation est possible.',
          icon: FiAlertCircle,
          color: 'bg-gray-100 text-gray-800',
          border: 'border-gray-200'
        };
      default:
        return {
          title: 'Statut Inconnu',
          description: 'Le statut de ce client n\'est pas défini ou n\'est pas reconnu par le système.',
          icon: FiInfo,
          color: 'bg-gray-100 text-gray-800',
          border: 'border-gray-200'
        };
    }
  };
  
  const statusDetails = getStatusDetails();

  // If loading, show skeleton
  if (loading) {
    return (
      <div className="p-6 space-y-8">
        <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse mb-8" />
        <div className="h-48 bg-gray-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12">
      {/* Classification Section */}
      <motion.section
        custom={0}
        initial="hidden"
        animate="visible"
        variants={sectionAnimation}
        className="bg-white rounded-2xl overflow-hidden shadow-lg border border-purple-100 hover:shadow-xl transition-shadow duration-300"
      >
        <SectionHeader 
          icon={FiTag} 
          title="Classification" 
          subtitle="Paramètres de classification du client" 
          color="bg-purple-700" 
          onEdit={() => console.log('Edit classification settings')}
        />

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Left column */}
              <FormSelect 
                label="Statut"
                value={prospect?.status}
                options={[
                  { value: "active", label: "Actif", icon: FiCheck, color: "bg-green-100 text-green-600" },
                  { value: "blocked", label: "Bloqué", icon: FiX, color: "bg-red-100 text-red-600" },
                  { value: "dormant", label: "En sommeil", icon: FiClock, color: "bg-amber-100 text-amber-600" },
                  { value: "prospect", label: "Prospect", icon: FiTag, color: "bg-blue-100 text-blue-600" },
                  { value: "lead", label: "Lead", icon: FiRefreshCw, color: "bg-purple-100 text-purple-600" },
                  { value: "former", label: "Ancien client", icon: FiAlertCircle, color: "bg-gray-100 text-gray-600" }
                ]}
              />
              
              <div className="mt-4 h-full">
                <div className={`p-5 rounded-xl ${statusDetails.color} ${statusDetails.border} border`}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <statusDetails.icon className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium">{statusDetails.title}</h3>
                      <p className="mt-2 text-sm">{statusDetails.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Right column - Information panel */}
              <div className="bg-purple-50 rounded-xl p-5 border border-purple-100 h-full">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FiInfo className="h-6 w-6 text-purple-500" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-purple-800">Information sur les statuts</h4>
                    <p className="mt-1 text-sm text-purple-700">
                      Le statut du client détermine les actions possibles et les règles commerciales appliquées.
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-purple-700">
                      <li className="flex items-start">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-green-100 text-green-600 mr-2">
                          <FiCheck className="h-3 w-3" />
                        </span>
                        <span><strong>Actif</strong> : Le client peut commander et être facturé normalement</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-100 text-red-600 mr-2">
                          <FiX className="h-3 w-3" />
                        </span>
                        <span><strong>Bloqué</strong> : Les commandes sont bloquées (impayés, litige...)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-amber-100 text-amber-600 mr-2">
                          <FiClock className="h-3 w-3" />
                        </span>
                        <span><strong>En sommeil</strong> : Client sans activité récente</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-600 mr-2">
                          <FiTag className="h-3 w-3" />
                        </span>
                        <span><strong>Prospect</strong> : Possibilité de créer des devis mais pas de facturation</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Activity log section */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <FiClock className="mr-2 text-gray-500" />
              Historique des changements de statut
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-4">
                {prospect?.statusHistory ? (
                  prospect.statusHistory.map((item: StatusHistoryItem, index: number) => (
                    <div key={index} className="flex items-start">
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-800">
                            Changement de statut : <span className="font-medium">{item.fromStatus}</span> → <span className="font-medium">{item.toStatus}</span>
                          </p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          <time dateTime={item.date}>{new Date(item.date).toLocaleDateString('fr-FR')}</time>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Aucun historique de changement de statut disponible.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default ParametresTab;