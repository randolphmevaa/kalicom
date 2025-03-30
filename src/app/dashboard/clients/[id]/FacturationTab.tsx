import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiPercent, 
  FiDollarSign, 
  FiTruck, 
  FiCheckSquare,
  FiEdit
} from 'react-icons/fi';
import { IconType } from 'react-icons';

// Interfaces needed for the component
interface Prospect {
  discountPercent1?: number;
  depositPercent?: number;
  shippingCost?: number;
  // Add other fields as needed
}

interface FacturationProps {
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
}

const FacturationTab: React.FC<FacturationProps> = ({ prospect, loading }) => {
  // State for TTC checkbox
  const [facturationTTC, setFacturationTTC] = useState<boolean>(false);

  // Toggle TTC handler
  const handleToggleTTC = (): void => {
    setFacturationTTC(!facturationTTC);
  };
  
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
    suffix
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
          className={`w-full rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 text-gray-900 font-medium bg-white
            ${prefix ? 'pl-7' : 'px-4'} 
            ${suffix ? 'pr-12' : 'pr-4'} 
            py-3`}
          defaultValue={value}
          placeholder={`Saisir ${label.toLowerCase()}...`}
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
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12">
      {/* Facturation et remise Section */}
      <motion.section
        custom={0}
        initial="hidden"
        animate="visible"
        variants={sectionAnimation}
        className="bg-white rounded-2xl overflow-hidden shadow-lg border border-orange-100 hover:shadow-xl transition-shadow duration-300"
      >
        <SectionHeader 
          icon={FiDollarSign} 
          title="Facturation et remise" 
          subtitle="Paramètres de facturation et remises applicables" 
          color="bg-orange-500" 
          onEdit={() => console.log('Edit facturation settings')}
        />

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Left column */}
              <div className="grid grid-cols-2 gap-6">
                <FormInput 
                  label="% remise 1"
                  value={prospect?.discountPercent1 || ""}
                  type="number"
                  suffix="%"
                />
                <FormInput 
                  label="% acompte"
                  value={prospect?.depositPercent || ""}
                  type="number"
                  suffix="%"
                />
              </div>
              
              <FormInput 
                label="Frais de port"
                value={prospect?.shippingCost || ""}
                type="number"
                prefix="€"
              />
            </div>
            
            <div className="space-y-6">
              {/* Right column - TTC Checkbox */}
              <div className="mt-4">
                <button 
                  onClick={handleToggleTTC}
                  className="flex items-center w-full justify-between p-4 rounded-xl transition-all duration-200 group hover:shadow-md"
                  style={{
                    background: facturationTTC 
                      ? 'linear-gradient(to right, #fff7ed, #ffedd5)' 
                      : 'white',
                    border: facturationTTC 
                      ? '1px solid rgba(234, 88, 12, 0.3)' 
                      : '1px solid transparent'
                  }}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded flex items-center justify-center mr-3 transition-colors duration-200 ${
                      facturationTTC ? 'bg-orange-500 text-white' : 'bg-white border border-gray-300'
                    }`}>
                      {facturationTTC && <FiCheckSquare className="w-4 h-4" />}
                    </div>
                    <span className={`font-medium ${facturationTTC ? 'text-orange-800' : 'text-gray-700'}`}>
                      Facturation TTC
                    </span>
                  </div>
                </button>
              </div>
              
              {/* Additional billing information */}
              <div className="bg-orange-50 rounded-xl p-4 mt-4 border border-orange-100">
                <h4 className="text-sm font-medium text-orange-800 mb-2 flex items-center">
                  <FiTruck className="mr-2" />
                  Informations de livraison
                </h4>
                <p className="text-sm text-orange-700">
                  Les frais de port sont calculés automatiquement en fonction de la destination et du poids des articles.
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-4 mt-2 border border-blue-100">
                <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                  <FiPercent className="mr-2" />
                  Informations de remise
                </h4>
                <p className="text-sm text-blue-700">
                  Les remises sont appliquées avant calcul de la TVA. L&apos;acompte est calculé sur le montant total TTC.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
      
      {/* Additional sections can be added here */}
    </div>
  );
};

export default FacturationTab;