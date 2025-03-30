import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiEdit,
  FiFileText,
  FiInfo,
  FiChevronDown,
  FiHelpCircle,
  FiClipboard
} from 'react-icons/fi';
import { IconType } from 'react-icons';

// Interfaces needed for the component
interface Prospect {
  buyerReferenceCode?: string;
  vatExemptionReason?: string;
  documentNote?: string;
}

interface FactureElectroniqueProps {
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
  infoTooltip?: string;
}

interface FormSelectProps {
  label: string;
  value?: string;
  options: { value: string; label: string }[];
  className?: string;
  infoTooltip?: string;
}

interface FormTextareaProps {
  label: string;
  value?: string;
  className?: string;
  rows?: number;
  infoTooltip?: string;
}

const FactureElectroniqueTab: React.FC<FactureElectroniqueProps> = ({ prospect, loading }) => {
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
    infoTooltip
  }) => (
    <div className={`${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          {infoTooltip && (
            <div className="relative group ml-2">
              <FiHelpCircle className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
              <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 w-60 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                {infoTooltip}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
              </div>
            </div>
          )}
        </div>
        {value && <span className="text-xs text-teal-500">Modifier</span>}
      </div>
      <div className="relative">
        <input
          type={type}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all duration-200 text-gray-900 font-medium bg-white"
          defaultValue={value}
          placeholder={`Saisir ${label.toLowerCase()}...`}
        />
      </div>
    </div>
  );
  
  // Form select with label
  const FormSelect: React.FC<FormSelectProps> = ({ 
    label, 
    value, 
    options, 
    className = "",
    infoTooltip
  }) => (
    <div className={`${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          {infoTooltip && (
            <div className="relative group ml-2">
              <FiHelpCircle className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
              <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 w-60 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                {infoTooltip}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
              </div>
            </div>
          )}
        </div>
        {value && <span className="text-xs text-teal-500">Modifier</span>}
      </div>
      <div className="relative">
        <select
          className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all duration-200 text-gray-900 font-medium bg-white appearance-none"
          defaultValue={value || ""}
        >
          <option value="">Sélectionnez...</option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>{option.label}</option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <FiChevronDown className="w-5 h-5 text-gray-500" />
        </div>
      </div>
    </div>
  );
  
  // Form textarea with label
  const FormTextarea: React.FC<FormTextareaProps> = ({ 
    label, 
    value, 
    className = "", 
    rows = 4,
    infoTooltip
  }) => (
    <div className={`${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          {infoTooltip && (
            <div className="relative group ml-2">
              <FiHelpCircle className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
              <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 w-60 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                {infoTooltip}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
              </div>
            </div>
          )}
        </div>
        {value && <span className="text-xs text-teal-500">Modifier</span>}
      </div>
      <div className="relative">
        <textarea
          className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all duration-200 text-gray-900 font-medium bg-white"
          rows={rows}
          defaultValue={value}
          placeholder={`Saisir ${label.toLowerCase()}...`}
        />
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
      {/* Facture électronique Section */}
      <motion.section
        custom={0}
        initial="hidden"
        animate="visible"
        variants={sectionAnimation}
        className="bg-white rounded-2xl overflow-hidden shadow-lg border border-teal-100 hover:shadow-xl transition-shadow duration-300"
      >
        <SectionHeader 
          icon={FiFileText} 
          title="Facture électronique" 
          subtitle="Paramètres pour la facturation électronique" 
          color="bg-teal-600" 
          onEdit={() => console.log('Edit facture électronique settings')}
        />

        <div className="p-8">
          <div className="grid grid-cols-1 gap-8">
            <FormInput 
              label="Référence de l'acheteur / Code service"
              value={prospect?.buyerReferenceCode || ""}
              infoTooltip="Identifiant unique utilisé par l'acheteur pour référencer cette relation commerciale ou le service associé."
            />
            
            <FormSelect 
              label="Motif d'exonération de TVA"
              value={prospect?.vatExemptionReason || ""}
              options={[
                { value: "none", label: "Aucune exonération" },
                { value: "export", label: "Exportation" },
                { value: "intra_community", label: "Livraison intracommunautaire" },
                { value: "dom_tom", label: "DOM-TOM" },
                { value: "art_262", label: "Article 262 du CGI" },
                { value: "art_293b", label: "Article 293B du CGI (Franchise en base)" },
                { value: "other", label: "Autre motif d'exonération" }
              ]}
              infoTooltip="Motif légal pour lequel ce client peut bénéficier d'une exonération de TVA sur les factures."
            />
            
            <FormTextarea 
              label="Mention à imprimer sur le document"
              value={prospect?.documentNote || ""}
              rows={5}
              infoTooltip="Cette mention sera imprimée sur toutes les factures électroniques destinées à ce client."
            />
            
            <div className="bg-teal-50 rounded-xl p-5 border border-teal-100 mt-2">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiInfo className="h-6 w-6 text-teal-500" />
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-teal-800">Information sur la facturation électronique</h4>
                  <p className="mt-1 text-sm text-teal-700">
                    La facturation électronique est obligatoire pour toutes les entreprises assujetties à la TVA en France. 
                    Pour les transactions avec le secteur public, le format Chorus Pro est requis.
                  </p>
                  <p className="mt-3 text-sm text-teal-700">
                    Pour les transactions B2B, un identifiant unique et le motif d&apos;exonération de TVA 
                    (le cas échéant) doivent être clairement indiqués sur la facture électronique.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-100 rounded-lg flex items-start">
              <div className="flex-shrink-0 text-yellow-500 mt-0.5">
                <FiClipboard className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Conformité réglementaire</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Assurez-vous que les informations saisies sont conformes aux exigences légales 
                    en matière de facturation électronique. Ces données seront utilisées pour générer 
                    les factures au format électronique requis par la législation.
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

export default FactureElectroniqueTab;