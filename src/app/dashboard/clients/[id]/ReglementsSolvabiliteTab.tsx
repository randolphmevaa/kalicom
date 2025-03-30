import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiCalendar, 
  FiClock, 
  FiAlertTriangle,
  FiLock,
  FiEdit,
  FiFileText,
  FiCreditCard
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { FaEuroSign } from 'react-icons/fa6';

// Interfaces needed for the component
interface Prospect {
  overdueOneMonth?: string;
  overdueTwoMonths?: string;
  overdueMoreThanTwoMonths?: string;
  invoiced?: string;
  credits?: string;
  authorizedCredit?: string;
  creditExcess?: string;
  initialBalance?: string;
}

interface ReglementsSolvabiliteProps {
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
  readonly?: boolean;
}

const ReglementsSolvabiliteTab: React.FC<ReglementsSolvabiliteProps> = ({ prospect, loading }) => {
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
    readonly = false
  }) => (
    <div className={`${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {readonly && (
            <span className="ml-2 text-xs text-gray-500 inline-flex items-center">
              <FiLock className="w-3 h-3 mr-1" />
              Lecture seule
            </span>
          )}
        </label>
        {!readonly && value && <span className="text-xs text-blue-500">Modifier</span>}
      </div>
      <div className="relative">
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">{prefix}</span>
          </div>
        )}
        <input
          type={type}
          className={`w-full rounded-lg border ${readonly ? 'bg-gray-50 text-gray-700' : 'bg-white text-gray-900'} border-gray-300 shadow-sm ${!readonly && 'focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500'} transition-all duration-200 font-medium
            ${prefix ? 'pl-7' : 'px-4'} 
            ${suffix ? 'pr-12' : 'pr-4'} 
            py-3`}
          defaultValue={value}
          placeholder={readonly ? '—' : `Saisir ${label.toLowerCase()}...`}
          readOnly={readonly}
          disabled={readonly}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">{suffix}</span>
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
        <div className="h-48 bg-gray-200 rounded-2xl animate-pulse" />
        <div className="h-48 bg-gray-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12">
      {/* Échéances échues Section */}
      <motion.section
        custom={0}
        initial="hidden"
        animate="visible"
        variants={sectionAnimation}
        className="bg-white rounded-2xl overflow-hidden shadow-lg border border-red-100 hover:shadow-xl transition-shadow duration-300"
      >
        <SectionHeader 
          icon={FiClock} 
          title="Échéances échues" 
          subtitle="Factures et paiements en retard" 
          color="bg-red-600" 
        />

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormInput 
              label="dont à 1 mois"
              value={prospect?.overdueOneMonth || "0.00"}
              type="number"
              prefix="€"
              readonly={true}
            />
            
            <FormInput 
              label="dont à 2 mois"
              value={prospect?.overdueTwoMonths || "0.00"}
              type="number"
              prefix="€"
              readonly={true}
            />
            
            <FormInput 
              label="dont à plus de 2 mois"
              value={prospect?.overdueMoreThanTwoMonths || "0.00"}
              type="number"
              prefix="€"
              readonly={true}
            />
          </div>
          
          <div className="mt-6 bg-red-50 rounded-xl p-4 border border-red-100">
            <div className="flex items-start">
              <FiAlertTriangle className="text-red-500 w-5 h-5 mr-3 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-red-800">Informations sur les échéances</h4>
                <p className="text-sm text-red-700 mt-1">
                  Ces données sont calculées automatiquement à partir des factures impayées du client.
                  Les montants sont mis à jour quotidiennement en fonction des règlements reçus.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Échéances non échues Section */}
      <motion.section
        custom={1}
        initial="hidden"
        animate="visible"
        variants={sectionAnimation}
        className="bg-white rounded-2xl overflow-hidden shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300"
      >
        <SectionHeader 
          icon={FiFileText} 
          title="Échéances non échues" 
          subtitle="Factures et avoirs en cours" 
          color="bg-blue-600" 
        />

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput 
              label="Facturé"
              value={prospect?.invoiced || "0.00"}
              type="number"
              prefix="€"
              readonly={true}
            />
            
            <FormInput 
              label="Avoirs"
              value={prospect?.credits || "0.00"}
              type="number"
              prefix="€"
              readonly={true}
            />
          </div>
          
          <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-start">
              <FiCalendar className="text-blue-500 w-5 h-5 mr-3 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-800">Informations sur les factures en cours</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Ces montants représentent la somme des factures non échues et des avoirs en cours.
                  Les avoirs sont déduits du montant total facturé.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Soldes Section */}
      <motion.section
        custom={2}
        initial="hidden"
        animate="visible"
        variants={sectionAnimation}
        className="bg-white rounded-2xl overflow-hidden shadow-lg border border-green-100 hover:shadow-xl transition-shadow duration-300"
      >
        <SectionHeader 
          icon={FiCreditCard} 
          title="Soldes" 
          subtitle="Encours et limitations de crédit" 
          color="bg-green-600" 
          onEdit={() => console.log('Edit soldes settings')}
        />

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormInput 
              label="Encours autorisé"
              value={prospect?.authorizedCredit || ""}
              type="number"
              prefix="€"
            />
            
            <FormInput 
              label="Dépassement"
              value={prospect?.creditExcess || "0.00"}
              type="number"
              prefix="€"
              readonly={true}
            />
            
            <FormInput 
              label="Solde initial"
              value={prospect?.initialBalance || ""}
              type="number"
              prefix="€"
            />
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <div className="flex items-start">
                <FaEuroSign className="text-green-500 w-5 h-5 mr-3 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-green-800">Calcul de l&apos;encours</h4>
                  <p className="text-sm text-green-700 mt-1">
                    L&apos;encours correspond à la somme des factures non payées, échues ou non.
                    Le dépassement est calculé automatiquement lorsque l&apos;encours dépasse l&apos;encours autorisé.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <div className="flex items-start">
                <FiAlertTriangle className="text-amber-500 w-5 h-5 mr-3 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-amber-800">Alerte de dépassement</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    En cas de dépassement de l&apos;encours autorisé, une notification est envoyée à l&apos;équipe commerciale 
                    et les nouvelles commandes sont automatiquement bloquées jusqu&apos;à régularisation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default ReglementsSolvabiliteTab;