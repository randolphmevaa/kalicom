import React from 'react';
import { motion } from 'framer-motion';
import { 
  // FiFileText,
  FiEdit,
  FiInfo,
  FiSearch,
  FiBriefcase
} from 'react-icons/fi';
import { IconType } from 'react-icons';

// Interfaces needed for the component
interface Prospect {
  accountNumber?: string;
  // Add other fields of the prospect object here as needed
}

interface ComptabiliteProps {
  prospect?: Prospect;
  loading: boolean;
}

interface SectionHeaderProps {
  icon: IconType;
  title: string;
  subtitle: string;
  color: string;
  onEdit?: () => void;
}

interface FormInputProps {
  label: string;
  value?: string | number;
  type?: string;
  className?: string;
  suffix?: string;
  prefix?: string;
  showSearchButton?: boolean;
}

const ComptabiliteTab: React.FC<ComptabiliteProps> = ({ prospect, loading }) => {
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
  
  // Form input with label
  const FormInput: React.FC<FormInputProps> = ({ 
    label, 
    value, 
    type = "text", 
    className = "",
    prefix,
    suffix,
    showSearchButton = false
  }) => (
    <div className={`${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {value && <span className="text-xs text-blue-500">Modifier</span>}
      </div>
      <div className="relative">
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">{prefix}</span>
          </div>
        )}
        <input
          type={type}
          className={`w-full rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200 text-gray-900 font-medium bg-white
            ${prefix ? 'pl-7' : 'px-4'} 
            ${suffix || showSearchButton ? 'pr-12' : 'pr-4'} 
            py-3`}
          defaultValue={value}
          placeholder={`Saisir ${label.toLowerCase()}...`}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">{suffix}</span>
          </div>
        )}
        {showSearchButton && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 rounded-full transition-colors duration-200"
            >
              <FiSearch className="w-4 h-4" />
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );

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
      {/* Comptabilité Section */}
      <motion.section
        custom={0}
        initial="hidden"
        animate="visible"
        variants={sectionAnimation}
        className="bg-white rounded-2xl overflow-hidden shadow-lg border border-indigo-100 hover:shadow-xl transition-shadow duration-300"
      >
        <SectionHeader 
          icon={FiBriefcase} 
          title="Comptabilité" 
          subtitle="Informations comptables du client" 
          color="bg-indigo-600" 
          onEdit={() => console.log('Edit comptabilité settings')}
        />

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Left column */}
              <FormInput 
                label="Compte"
                value={prospect?.accountNumber || ""}
                showSearchButton={true}
              />
              
              {/* Can add more inputs here if needed in the future */}
            </div>
            
            <div className="space-y-6">
              {/* Right column - Information panel */}
              <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100 h-full flex items-center">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FiInfo className="h-6 w-6 text-indigo-500" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-indigo-800">Information comptable</h4>
                    <p className="mt-1 text-sm text-indigo-700">
                      Le numéro de compte est utilisé pour le rapprochement bancaire 
                      et l&apos;identification des transactions dans le système comptable.
                    </p>
                    <p className="mt-3 text-sm text-indigo-700">
                      Pour rechercher un compte existant, utilisez le bouton de recherche 
                      à droite du champ de saisie.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional details section that could be expanded in the future */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Détails du compte</h3>
            <div className="bg-gray-50 rounded-lg p-4 text-gray-600 text-sm">
              Aucun détail supplémentaire disponible. Pour ajouter des informations comptables détaillées, 
              utilisez la fonctionnalité d&apos;édition.
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default ComptabiliteTab;