import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHome, FiTruck, FiBriefcase, FiUser, FiDatabase, 
  FiBookmark, FiUsers, FiEdit, FiPlus, FiCheckSquare, 
  FiTrash2, FiPhone, FiMail, FiSearch, FiChevronDown,
  FiClock, FiMapPin, FiInfo
} from 'react-icons/fi';
import { IconType } from 'react-icons';

// Define interfaces for the data structures
interface Address {
  id: string | number;
  description: string;
  npai: boolean;
  billingType: string;
  primaryBilling: boolean;
  shippingType: string;
  primaryShipping: boolean;
  address1: string;
  city: string;
}

interface Contact {
  id: string | number;
  firstName: string;
  lastName: string;
  role: string;
  primaryBilling: boolean;
  primaryShipping: boolean;
  mobilePhone: string;
  email: string;
  address: string;
}

// Define Client interface
interface Client {
  // Billing address fields
  address?: string;
  addressAdditional1?: string;
  addressAdditional2?: string;
  addressAdditional3?: string;
  zipCode?: string;
  city?: string;
  department?: string;
  country?: string;
  website?: string;
  
  // Shipping address fields
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
  
  // Headquarters fields
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
  
  // Billing contact fields
  billingContactTitle?: string;
  billingContactLastName?: string;
  billingContactFirstName?: string;
  billingContactRole?: string;
  billingContactDepartment?: string;
  billingContactEmail?: string;
  billingContactPhone?: string;
  billingContactMobile?: string;
  billingContactFax?: string;
  
  // Registration fields
  siren?: string;
  territoriality?: string;
  naf?: string;
  vatNumber?: string;
  documentNote?: string;
  
  // Collections
  addressBook?: Address[];
  contacts?: Contact[];
}

interface ClientOverviewProps {
  client?: Client;
  loading: boolean;
}

interface FormInputProps {
  label: string;
  value?: string | number;
  type?: string;
  className?: string;
  autocomplete?: boolean;
  suggestions?: string[];
  onFocus?: () => void;
  onBlur?: () => void;
}

interface FormSelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  value?: string;
  options: FormSelectOption[];
  className?: string;
}

interface SectionHeaderProps {
  icon: IconType;
  title: string;
  subtitle: string;
  color: string;
  onEdit?: () => void;
}

const ClientOverview: React.FC<ClientOverviewProps> = ({ client, loading }) => {
  // State management
  const [sameShippingAddress, setSameShippingAddress] = useState<boolean>(true);
  const [sameHeadquarters, setSameHeadquarters] = useState<boolean>(true);
  const [sameBillingContact, setSameBillingContact] = useState<boolean>(true);
  
  // Address suggestions for autocomplete
  const [showAddressSuggestions, setShowAddressSuggestions] = useState<boolean>(false);
  const [addressSuggestions] = useState<string[]>([
    "10 Rue de Rivoli, 75001 Paris",
    "25 Avenue des Champs-Élysées, 75008 Paris",
    "15 Boulevard Haussmann, 75009 Paris",
    "25 Rue de la République, 69001 Lyon",
    "5 Cours de l'Intendance, 33000 Bordeaux"
  ]);
  
  // SIREN/SIRET suggestions
  const [showSirenSuggestions, setShowSirenSuggestions] = useState<boolean>(false);
  const [sirenSuggestions] = useState<string[]>([
    "512 965 874 00025 - Nexus Technologies SAS",
    "439 716 531 00011 - Global Solutions Consulting SARL",
    "432 123 456 00018 - Innovate Design SARL"
  ]);
  
  // Toggle section handlers
  const handleToggleSameShippingAddress = (): void => {
    setSameShippingAddress(!sameShippingAddress);
  };
  
  const handleToggleSameHeadquarters = (): void => {
    setSameHeadquarters(!sameHeadquarters);
  };
  
  const handleToggleSameBillingContact = (): void => {
    setSameBillingContact(!sameBillingContact);
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
  
  // Form input with label
  const FormInput: React.FC<FormInputProps> = ({ 
    label, 
    value, 
    type = "text", 
    className = "", 
    autocomplete = false, 
    suggestions = [], 
    onFocus, 
    onBlur 
  }) => (
    <div className={`${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {value && <span className="text-xs text-blue-500">{type === "tel" ? "Vérifier" : "Modifier"}</span>}
      </div>
      <div className="relative">
        <input
          type={type}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 text-gray-900 font-medium bg-white"
          defaultValue={value}
          placeholder={`Saisir ${label.toLowerCase()}...`}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {autocomplete && suggestions?.length > 0 && (
          <div className="absolute z-10 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-gray-800 transition-colors duration-150 border-b border-gray-100 last:border-b-0">
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
  
  // Form select with label
  const FormSelect: React.FC<FormSelectProps> = ({ label, value, options, className = "" }) => (
    <div className={`${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <select
          className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 text-gray-900 font-medium bg-white appearance-none"
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

  // If loading, show skeleton
  if (loading) {
    return (
      <div className="p-6 space-y-8">
        <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse mb-8" />
        <div className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
        <div className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12">
      {/* Floating Action Bar */}
      <div className="sticky top-20 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 py-4 px-6 -mx-8 mb-6">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <FiClock className="w-5 h-5" />
              <span className="text-sm font-medium">Historique</span>
            </motion.button>
            
            <div className="h-6 border-r border-gray-300" />
            
            <div className="text-sm text-gray-500">
              Dernière modification: <span className="font-medium text-gray-900">
                {new Date().toLocaleDateString('fr-FR', { 
                  day: 'numeric', 
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#1B0353] to-[#004AC8] text-white font-medium flex items-center shadow-lg transition-all duration-300 hover:shadow-xl hover:from-[#25046f] hover:to-[#0055e8]"
          >
            <FiEdit className="mr-2" />
            <span>Modifier les informations</span>
          </motion.button>
        </div>
      </div>

      {/* Billing Address */}
      <motion.section
        custom={0}
        initial="hidden"
        animate="visible"
        variants={sectionAnimation}
        className="bg-white rounded-2xl overflow-hidden shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300"
      >
        <SectionHeader 
          icon={FiHome} 
          title="Adresse de facturation" 
          subtitle="Informations pour la facturation du client" 
          color="bg-[#1B0353]" 
        />

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Left column */}
              <FormInput 
                label="Adresse"
                value={client?.address}
                autocomplete={true}
                suggestions={showAddressSuggestions ? addressSuggestions : []}
                onFocus={() => setShowAddressSuggestions(true)}
                onBlur={() => setTimeout(() => setShowAddressSuggestions(false), 200)}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput 
                  label="Adresse (suite)"
                  value={client?.addressAdditional1}
                />
                <FormInput 
                  label="Adresse (suite)"
                  value={client?.addressAdditional2}
                />
              </div>
              
              <FormInput 
                label="Adresse (fin)"
                value={client?.addressAdditional3}
              />
            </div>
            
            <div className="space-y-6">
              {/* Right column */}
              <div className="grid grid-cols-2 gap-4">
                <FormInput 
                  label="Code postal"
                  value={client?.zipCode}
                />
                <FormInput 
                  label="Ville"
                  value={client?.city}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormInput 
                  label="Département"
                  value={client?.department}
                />
                <FormInput 
                  label="Pays"
                  value={client?.country}
                />
              </div>
              
              <FormInput 
                label="Site web"
                value={client?.website}
                type="url"
              />
              
              <div className="pt-4 border-t border-gray-100">
                <div className="space-y-3">
                  <button 
                    onClick={handleToggleSameShippingAddress}
                    className="flex items-center w-full justify-between p-4 rounded-xl transition-all duration-200 group hover:shadow-md"
                    style={{
                      background: sameShippingAddress 
                        ? 'linear-gradient(to right, #ebf5ff, #f0f9ff)' 
                        : 'white',
                      border: sameShippingAddress 
                        ? '1px solid rgba(59, 130, 246, 0.3)' 
                        : '1px solid transparent'
                    }}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded flex items-center justify-center mr-3 transition-colors duration-200 ${
                        sameShippingAddress ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300'
                      }`}>
                        {sameShippingAddress && <FiCheckSquare className="w-4 h-4" />}
                      </div>
                      <span className={`font-medium ${sameShippingAddress ? 'text-blue-800' : 'text-gray-700'}`}>
                        L&apos;adresse de livraison est identique
                      </span>
                    </div>
                    <div>
                      <FiInfo className={`w-5 h-5 ${sameShippingAddress ? 'text-blue-500' : 'text-gray-400'}`} />
                    </div>
                  </button>
                  
                  <button 
                    onClick={handleToggleSameHeadquarters}
                    className="flex items-center w-full justify-between p-4 rounded-xl transition-all duration-200 group hover:shadow-md"
                    style={{
                      background: sameHeadquarters 
                        ? 'linear-gradient(to right, #f3e8ff, #f5f3ff)' 
                        : 'white',
                      border: sameHeadquarters 
                        ? '1px solid rgba(147, 51, 234, 0.3)' 
                        : '1px solid transparent'
                    }}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded flex items-center justify-center mr-3 transition-colors duration-200 ${
                        sameHeadquarters ? 'bg-purple-600 text-white' : 'bg-white border border-gray-300'
                      }`}>
                        {sameHeadquarters && <FiCheckSquare className="w-4 h-4" />}
                      </div>
                      <span className={`font-medium ${sameHeadquarters ? 'text-purple-800' : 'text-gray-700'}`}>
                        Les informations du siège social sont identiques
                      </span>
                    </div>
                    <div>
                      <FiInfo className={`w-5 h-5 ${sameHeadquarters ? 'text-purple-500' : 'text-gray-400'}`} />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Shipping Address Section - Shown when different from billing */}
      <AnimatePresence>
        {!sameShippingAddress && (
          <motion.section
            custom={1}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            variants={sectionAnimation}
            className="bg-white rounded-2xl overflow-hidden shadow-lg border border-green-100 hover:shadow-xl transition-shadow duration-300"
          >
            <SectionHeader 
              icon={FiTruck} 
              title="Adresse de livraison" 
              subtitle="Informations pour la livraison des produits" 
              color="bg-green-600" 
            />

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {/* Left column */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormSelect 
                      label="Civilité"
                      value={client?.shippingTitle}
                      options={[
                        { value: "M", label: "M." },
                        { value: "Mme", label: "Mme" },
                        { value: "Mlle", label: "Mlle" }
                      ]}
                    />
                    <FormInput 
                      label="Nom"
                      value={client?.shippingName}
                    />
                  </div>

                  <FormInput 
                    label="Adresse"
                    value={client?.shippingAddress}
                    autocomplete={true}
                    suggestions={showAddressSuggestions ? addressSuggestions : []}
                    onFocus={() => setShowAddressSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowAddressSuggestions(false), 200)}
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput 
                      label="Adresse (suite)"
                      value={client?.shippingAddressAdditional1}
                    />
                    <FormInput 
                      label="Adresse (suite)"
                      value={client?.shippingAddressAdditional2}
                    />
                  </div>
                </div>
                
                <div className="space-y-6">
                  {/* Right column */}
                  <FormInput 
                    label="Adresse (fin)"
                    value={client?.shippingAddressAdditional3}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput 
                      label="Code postal"
                      value={client?.shippingZipCode}
                    />
                    <FormInput 
                      label="Ville"
                      value={client?.shippingCity}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput 
                      label="Département"
                      value={client?.shippingDepartment}
                    />
                    <FormInput 
                      label="Pays"
                      value={client?.shippingCountry}
                    />
                  </div>
                  
                  <FormInput 
                    label="Site web"
                    value={client?.shippingWebsite}
                    type="url"
                  />
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Headquarters Section - Shown when different from billing */}
      <AnimatePresence>
        {!sameHeadquarters && (
          <motion.section
            custom={2}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            variants={sectionAnimation}
            className="bg-white rounded-2xl overflow-hidden shadow-lg border border-purple-100 hover:shadow-xl transition-shadow duration-300"
          >
            <SectionHeader 
              icon={FiBriefcase} 
              title="Informations du siège social" 
              subtitle="Coordonnées du siège social de l'entreprise" 
              color="bg-purple-700" 
            />

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {/* Left column */}
                  <FormInput 
                    label="Raison sociale"
                    value={client?.companyLegalName}
                  />
                  
                  <FormInput 
                    label="Adresse"
                    value={client?.headquartersAddress}
                    autocomplete={true}
                    suggestions={showAddressSuggestions ? addressSuggestions : []}
                    onFocus={() => setShowAddressSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowAddressSuggestions(false), 200)}
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput 
                      label="Adresse (suite)"
                      value={client?.headquartersAddressAdditional1}
                    />
                    <FormInput 
                      label="Adresse (suite)"
                      value={client?.headquartersAddressAdditional2}
                    />
                  </div>
                </div>
                
                <div className="space-y-6">
                  {/* Right column */}
                  <FormInput 
                    label="Adresse (fin)"
                    value={client?.headquartersAddressAdditional3}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput 
                      label="Code postal"
                      value={client?.headquartersZipCode}
                    />
                    <FormInput 
                      label="Ville"
                      value={client?.headquartersCity}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput 
                      label="Département"
                      value={client?.headquartersDepartment}
                    />
                    <FormInput 
                      label="Pays"
                      value={client?.headquartersCountry}
                    />
                  </div>
                  
                  <FormInput 
                    label="Site web"
                    value={client?.headquartersWebsite}
                    type="url"
                  />
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Billing Contact Section */}
      <motion.section
        custom={3}
        initial="hidden"
        animate="visible"
        variants={sectionAnimation}
        className="bg-white rounded-2xl overflow-hidden shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300"
      >
        <SectionHeader 
          icon={FiUser} 
          title="Contact de facturation" 
          subtitle="Informations de contact pour la facturation" 
          color="bg-[#004AC8]" 
        />

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Left column */}
              <div className="grid grid-cols-3 gap-4">
                <FormSelect 
                  label="Civilité"
                  value={client?.billingContactTitle}
                  options={[
                    { value: "M", label: "M." },
                    { value: "Mme", label: "Mme" },
                    { value: "Mlle", label: "Mlle" }
                  ]}
                />
                <FormInput 
                  label="Nom"
                  value={client?.billingContactLastName}
                  className="col-span-2"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <FormInput 
                  label="Prénom"
                  value={client?.billingContactFirstName}
                  className="col-span-3 sm:col-span-2"
                />
                <div className="hidden sm:block"></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormInput 
                  label="Fonction"
                  value={client?.billingContactRole}
                />
                <FormInput 
                  label="Service/Bureau"
                  value={client?.billingContactDepartment}
                />
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Right column */}
              <FormInput 
                label="E-mail"
                value={client?.billingContactEmail}
                type="email"
              />
              
              <div className="grid grid-cols-3 gap-4">
                <FormInput 
                  label="Téléphone fixe"
                  value={client?.billingContactPhone}
                  type="tel"
                />
                <FormInput 
                  label="Téléphone portable"
                  value={client?.billingContactMobile}
                  type="tel"
                />
                <FormInput 
                  label="Fax"
                  value={client?.billingContactFax}
                  type="tel"
                />
              </div>
              
              <div className="pt-4 border-t border-gray-100 mt-6">
                <button 
                  onClick={handleToggleSameBillingContact}
                  className="flex items-center w-full justify-between p-4 rounded-xl transition-all duration-200 group hover:shadow-md"
                  style={{
                    background: sameBillingContact 
                      ? 'linear-gradient(to right, #ebf5ff, #f0f9ff)' 
                      : 'white',
                    border: sameBillingContact 
                      ? '1px solid rgba(59, 130, 246, 0.3)' 
                      : '1px solid transparent'
                  }}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded flex items-center justify-center mr-3 transition-colors duration-200 ${
                      sameBillingContact ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300'
                    }`}>
                      {sameBillingContact && <FiCheckSquare className="w-4 h-4" />}
                    </div>
                    <span className={`font-medium ${sameBillingContact ? 'text-blue-800' : 'text-gray-700'}`}>
                      Le contact de livraison est identique
                    </span>
                  </div>
                  <div>
                    <FiInfo className={`w-5 h-5 ${sameBillingContact ? 'text-blue-500' : 'text-gray-400'}`} />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Registration Section */}
      <motion.section
        custom={4}
        initial="hidden"
        animate="visible"
        variants={sectionAnimation}
        className="bg-white rounded-2xl overflow-hidden shadow-lg border border-indigo-100 hover:shadow-xl transition-shadow duration-300"
      >
        <SectionHeader 
          icon={FiDatabase} 
          title="Immatriculation" 
          subtitle="Informations légales et fiscales" 
          color="bg-indigo-600" 
        />

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Left column */}
              <div className="relative">
                <FormInput 
                  label="SIREN/SIRET"
                  value={client?.siren}
                  autocomplete={true}
                  suggestions={showSirenSuggestions ? sirenSuggestions : []}
                  onFocus={() => setShowSirenSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSirenSuggestions(false), 200)}
                />
                <div className="absolute right-4 top-10">
                  <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                    Vérifier
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormInput 
                  label="Territorialité"
                  value={client?.territoriality}
                />
                <FormInput 
                  label="NAF"
                  value={client?.naf}
                />
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Right column */}
              <FormInput 
                label="N° de TVA intracommunautaire"
                value={client?.vatNumber}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mention à imprimer sur le document</label>
                <textarea
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200 text-gray-900 font-medium"
                  rows={3}
                  defaultValue={client?.documentNote}
                  placeholder="Ajouter une mention..."
                />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Address Book Section */}
      <motion.section
        custom={5}
        initial="hidden"
        animate="visible"
        variants={sectionAnimation}
        className="bg-white rounded-2xl overflow-hidden shadow-lg border border-amber-100 hover:shadow-xl transition-shadow duration-300"
      >
        <div 
          className="relative bg-amber-600 px-6 sm:px-10 py-8 overflow-hidden"
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
                <FiBookmark className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Carnet d&apos;adresses
                </h2>
                <p className="text-white/80 text-sm mt-1">Liste des adresses associées</p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white rounded-lg flex items-center backdrop-blur-sm transition-colors duration-200 border border-white/20"
            >
              <FiPlus className="mr-2" />
              <span>Ajouter</span>
            </motion.button>
          </div>
        </div>

        <div className="p-6">
          {/* Search and Filters */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                placeholder="Rechercher une adresse..."
              />
            </div>
            
            <div>
              <select className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-lg">
                <option>Toutes les adresses</option>
                <option>Adresses principales</option>
                <option>Adresses de facturation</option>
                <option>Adresses de livraison</option>
              </select>
            </div>
          </div>
          
          {/* Table */}
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">NPAI</th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type fact.</th>
                  <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Principal</th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type livr.</th>
                  <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Principal</th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ville</th>
                  <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {client?.addressBook?.map((address) => (
                  <tr key={address.id} className="hover:bg-amber-50 transition-colors">
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{address.description}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-center">
                      {address.npai ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Oui
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Non
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">{address.billingType}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-center">
                      {address.primaryBilling ? (
                        <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-700">
                          <FiCheckSquare className="h-4 w-4" />
                        </div>
                      ) : null}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">{address.shippingType}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-center">
                      {address.primaryShipping ? (
                        <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-700">
                          <FiCheckSquare className="h-4 w-4" />
                        </div>
                      ) : null}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">{address.address1}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">{address.city}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2 justify-center">
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full"
                        >
                          <FiEdit className="w-4 h-4" />
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 text-sm text-gray-700">
            <div>
              <span className="font-medium">{client?.addressBook?.length || 0}</span> résultats
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">Précédent</button>
              <button className="px-3 py-1 border border-gray-300 bg-amber-50 text-amber-800 font-medium rounded">1</button>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">Suivant</button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Contacts Section */}
      <motion.section
        custom={6}
        initial="hidden"
        animate="visible"
        variants={sectionAnimation}
        className="bg-white rounded-2xl overflow-hidden shadow-lg border border-green-100 hover:shadow-xl transition-shadow duration-300"
      >
        <div 
          className="relative bg-green-600 px-6 sm:px-10 py-8 overflow-hidden"
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
                <FiUsers className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Contacts
                </h2>
                <p className="text-white/80 text-sm mt-1">Personnes à contacter</p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white rounded-lg flex items-center backdrop-blur-sm transition-colors duration-200 border border-white/20"
            >
              <FiPlus className="mr-2" />
              <span>Ajouter</span>
            </motion.button>
          </div>
        </div>

        <div className="p-6">
          {/* Contact cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {client?.contacts?.map((contact) => (
              <motion.div 
                key={contact.id}
                whileHover={{ y: -3, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
                className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 transition-all duration-200"
              >
                <div className="p-1 border-b border-gray-100">
                  <div className="flex justify-between items-start p-3">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                        {`${contact.firstName?.charAt(0) || ''}${contact.lastName?.charAt(0) || ''}`}
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-gray-900">{contact.firstName} {contact.lastName}</h3>
                        <p className="text-sm text-gray-600">{contact.role}</p>
                      </div>
                    </div>
                    <div>
                      {contact.primaryBilling && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-1">
                          Fact.
                        </span>
                      )}
                      {contact.primaryShipping && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Livr.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="p-4 space-y-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                      <FiPhone className="h-4 w-4" />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs text-gray-500">Téléphone mobile</p>
                      <a href={`tel:${contact.mobilePhone}`} className="text-sm font-medium text-gray-900 hover:text-gray-600">
                        {contact.mobilePhone}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <FiMail className="h-4 w-4" />
                    </div>
                    <div className="ml-3 truncate">
                      <p className="text-xs text-gray-500">Email</p>
                      <a href={`mailto:${contact.email}`} className="text-sm font-medium text-gray-900 hover:text-gray-600 truncate block">
                        {contact.email}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-amber-100 text-amber-600">
                      <FiMapPin className="h-4 w-4" />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs text-gray-500">Adresse</p>
                      <p className="text-sm font-medium text-gray-900 truncate">{contact.address}</p>
                    </div>
                  </div>
                </div>
                
                <div className="px-4 py-3 bg-gray-50 flex space-x-2 justify-end border-t border-gray-100">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-full text-blue-600 hover:bg-blue-100"
                  >
                    <FiEdit className="w-4 h-4" />
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-full text-green-600 hover:bg-green-100"
                  >
                    <FiPhone className="w-4 h-4" />
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-full text-blue-600 hover:bg-blue-100"
                  >
                    <FiMail className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
            
            {/* Add Contact Card */}
            <motion.div 
              whileHover={{ y: -3, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
              className="bg-white rounded-xl overflow-hidden border border-dashed border-gray-300 transition-all duration-200 flex items-center justify-center"
              style={{ minHeight: "14rem" }}
            >
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-3">
                  <FiPlus className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Ajouter un contact</h3>
                <p className="text-sm text-gray-500 mb-3">Ajoutez un nouveau contact à ce prospect</p>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors duration-200">
                  Nouveau contact
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default ClientOverview;