'use client';

import React from "react";
import { Prospect } from "../../types/crm-types";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheckSquare,
  FiSquare,
  FiMail,
  FiPhone,
  FiMapPin,
  FiEdit,
  FiMessageCircle,
  FiArrowRight,
  FiUserCheck,
  FiCheck
} from "react-icons/fi";

// Import intersection observer for lazy loading cards
import { useInView } from 'react-intersection-observer';

// Define Prospect interface
// interface Prospect {
//   id: string;
//   firstName: string;
//   lastName: string;
//   phoneNumber: string;
//   mobilePhoneNumber: string;
//   companyName: string;
//   zipCode: string;
//   city: string;
//   country: string;
//   address: string;
//   email: string;
//   description?: string;
//   tags: string[];
//   assignedTo: string;
//   lastContactDate: string;
//   createdAt?: string;
//   updatedAt?: string;
// }

// Define props interfaces
interface ProspectCardProps {
  prospect: Prospect;
  selectedRows: string[];
  toggleRowSelection: (id: string, e?: React.MouseEvent) => void;
  conversionSuccess: Record<string, boolean>;
  handleConvertToClient: (id: string, e?: React.MouseEvent) => void;
  openQuickView: (prospect: Prospect) => void;
  getInitials: (firstName: string, lastName: string) => string;
  getTagColor: (tag: string) => string;
  getStatusColor: (date: string) => string;
}

interface ProspectGridViewProps {
  prospects: Prospect[];
  selectedRows: string[];
  toggleRowSelection: (id: string, e?: React.MouseEvent) => void;
  conversionSuccess: Record<string, boolean>;
  handleConvertToClient: (id: string, e?: React.MouseEvent) => void;
  openQuickView: (prospect: Prospect) => void;
  getInitials: (firstName: string, lastName: string) => string;
  getTagColor: (tag: string) => string;
  getStatusColor: (date: string) => string;
}

// Card animation variants
const cardVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 24,
      mass: 1.2
    } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    y: 10,
    transition: { duration: 0.3, ease: "easeInOut" }
  }
};

// Single prospect card - split out for better reusability and performance
const ProspectCard: React.FC<ProspectCardProps> = ({ 
  prospect, 
  selectedRows, 
  toggleRowSelection, 
  conversionSuccess, 
  handleConvertToClient, 
  openQuickView,
  getInitials,
  getTagColor,
  getStatusColor
}) => {
  // Use intersection observer to load card only when visible
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
  });

  return (
    <motion.div
      ref={ref}
      key={prospect.id}
      layoutId={`card-${prospect.id}`}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      exit="exit"
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        boxShadow: "0 20px 25px -5px rgba(0, 74, 200, 0.15), 0 10px 10px -5px rgba(27, 3, 83, 0.1)"
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group bg-white rounded-xl overflow-hidden cursor-pointer border border-gray-100"
      style={{ 
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)",
        transform: "perspective(1000px) rotateX(0deg)"
      }}
      onClick={() => openQuickView(prospect)}
    >
      {/* Card Header with Gradient */}
      <div 
        className="h-16 relative overflow-hidden"
        style={{ 
          background: "linear-gradient(120deg, #4BB2F6, #004AC8, #1B0353)",
          clipPath: "polygon(0 0, 100% 0, 100% 80%, 0 100%)"
        }}
      >
        {/* Abstract pattern overlay */}
        <motion.div 
          className="absolute inset-0 opacity-20"
          animate={{ 
            backgroundPosition: ["0% 0%", "100% 100%"], 
          }} 
          transition={{ 
            duration: 20, 
            ease: "linear", 
            repeat: Infinity, 
            repeatType: "reverse" 
          }}
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <div className="relative px-6 pt-8 pb-6">
        {/* Status indicator */}
        <div className="absolute top-4 right-4 flex items-center">
          <div 
            className={`w-2 h-2 rounded-full ${
              getStatusColor(prospect.lastContactDate) === "#4BB2F6" ? "animate-ping absolute" : ""
            }`}
            style={{ 
              backgroundColor: getStatusColor(prospect.lastContactDate),
              opacity: 0.5
            }}
          />
          <div 
            className="w-2 h-2 rounded-full relative"
            style={{ backgroundColor: getStatusColor(prospect.lastContactDate) }}
            title={`Dernier contact: ${prospect.lastContactDate}`}
          />
          <span className="ml-2 text-xs text-gray-500">{prospect.lastContactDate}</span>
        </div>
        
        {/* Checkbox for selection */}
        <button
          className="absolute top-4 left-4 focus:outline-none"
          onClick={(e: React.MouseEvent) => toggleRowSelection(prospect.id, e)}
        >
          {selectedRows.includes(prospect.id) ? (
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-indigo-600"
            >
              <FiCheckSquare className="h-5 w-5" />
            </motion.div>
          ) : (
            <FiSquare className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
          )}
        </button>
        
        <div className="flex flex-col items-center mb-6">
          {/* Avatar */}
          <div className="relative mb-4">
            {/* Soft glow behind avatar */}
            <div 
              className="absolute -inset-1 rounded-full opacity-20 blur-md"
              style={{ 
                background: "radial-gradient(circle, #4BB2F6, #004AC8)", 
              }}
            />
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-20 h-20 rounded-full flex items-center justify-center text-white text-xl font-bold relative z-10 border-2 border-white"
              style={{ 
                background: "linear-gradient(45deg, #4BB2F6, #004AC8, #1B0353)",
                boxShadow: "0 10px 15px -3px rgba(27, 3, 83, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.15)"
              }}
            >
              {getInitials(prospect.firstName, prospect.lastName)}
              
              {/* Shine effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-30 rounded-full"
                animate={{ 
                  x: ["150%", "-150%"],
                }}
                transition={{ 
                  repeat: Infinity, 
                  repeatType: "mirror", 
                  duration: 2,
                  ease: "easeInOut",
                  repeatDelay: 4
                }}
                style={{ 
                  transform: "skewX(45deg)",
                  width: "50%"
                }}
              />
            </motion.div>
          </div>
          
          <h3 className="text-lg font-bold text-[#1B0353] group-hover:text-[#004AC8] transition-colors">
            {prospect.firstName} {prospect.lastName}
          </h3>
          
          <p className="text-sm font-medium text-[#004AC8] mb-2">
            {prospect.companyName}
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {prospect.tags.map((tag: string, tagIndex: number) => (
              <motion.span 
                key={tagIndex}
                whileHover={{ y: -2, scale: 1.05 }}
                className="px-3 py-1 text-xs font-medium rounded-full text-white shadow-sm transform transition-transform" 
                style={{ 
                  backgroundColor: getTagColor(tag),
                  boxShadow: `0 2px 5px ${getTagColor(tag)}40`,
                  backdropFilter: "blur(8px)"
                }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>
        
        {/* Contact info */}
        <div className="space-y-3 mt-4">
          <motion.div 
            whileHover={{ scale: 1.02, x: 5 }}
            className="flex items-center p-3 rounded-lg border border-gray-100 group-hover:border-[#4BB2F6] transition-colors"
            style={{
              background: "linear-gradient(to right, rgba(240, 249, 255, 0.8), rgba(255, 255, 255, 0.9))",
              backdropFilter: "blur(8px)",
              boxShadow: "0 2px 6px rgba(75, 178, 246, 0.1)"
            }}
          >
            <div className="p-2 rounded-full bg-[#4BB2F6] bg-opacity-10 text-[#004AC8] mr-3 flex-shrink-0">
              <FiMail className="w-4 h-4" />
            </div>
            <span className="text-[#004AC8] text-sm font-medium truncate" title={prospect.email}>
              {prospect.email}
            </span>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02, x: 5 }}
            className="flex items-center p-3 rounded-lg border border-gray-100 group-hover:border-[#4BB2F6] transition-colors"
            style={{
              background: "linear-gradient(to right, rgba(240, 249, 255, 0.8), rgba(255, 255, 255, 0.9))",
              backdropFilter: "blur(8px)",
              boxShadow: "0 2px 6px rgba(0, 74, 200, 0.1)"
            }}
          >
            <div className="p-2 rounded-full bg-[#004AC8] bg-opacity-10 text-[#004AC8] mr-3 flex-shrink-0">
              <FiPhone className="w-4 h-4" />
            </div>
            <a 
              href={`tel:${prospect.mobilePhoneNumber.replace(/\s/g, '')}`} 
              className="text-gray-700 text-sm font-medium truncate hover:text-[#004AC8]" 
              title={prospect.mobilePhoneNumber}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {prospect.mobilePhoneNumber}
            </a>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02, x: 5 }}
            className="flex items-center p-3 rounded-lg border border-gray-100 group-hover:border-[#4BB2F6] transition-colors"
            style={{
              background: "linear-gradient(to right, rgba(240, 249, 255, 0.8), rgba(255, 255, 255, 0.9))",
              backdropFilter: "blur(8px)",
              boxShadow: "0 2px 6px rgba(27, 3, 83, 0.1)"
            }}
          >
            <div className="p-2 rounded-full bg-[#1B0353] bg-opacity-10 text-[#1B0353] mr-3 flex-shrink-0">
              <FiMapPin className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-gray-700 text-sm font-medium truncate" title={`${prospect.address}, ${prospect.zipCode} ${prospect.city}, ${prospect.country}`}>
                {prospect.address}, {prospect.zipCode} {prospect.city}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center space-x-2 mt-6">
          <motion.button 
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg shadow-sm transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, rgba(75, 178, 246, 0.1), rgba(75, 178, 246, 0.2))",
              border: "1px solid rgba(75, 178, 246, 0.2)",
              boxShadow: "0 2px 5px rgba(75, 178, 246, 0.1)"
            }}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              window.location.href = `tel:${prospect.mobilePhoneNumber.replace(/\s/g, '')}`;
            }}
          >
            <FiPhone className="w-5 h-5 text-[#004AC8]" />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg shadow-sm transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, rgba(0, 74, 200, 0.1), rgba(0, 74, 200, 0.2))",
              border: "1px solid rgba(0, 74, 200, 0.2)",
              boxShadow: "0 2px 5px rgba(0, 74, 200, 0.1)"
            }}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              window.location.href = `mailto:${prospect.email}`;
            }}
          >
            <FiMail className="w-5 h-5 text-[#004AC8]" />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg shadow-sm transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, rgba(27, 3, 83, 0.1), rgba(27, 3, 83, 0.2))",
              border: "1px solid rgba(27, 3, 83, 0.2)",
              boxShadow: "0 2px 5px rgba(27, 3, 83, 0.1)"
            }}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              alert(`Commencer une conversation avec ${prospect.firstName}`);
            }}
          >
            <FiMessageCircle className="w-5 h-5 text-[#1B0353]" />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg shadow-sm transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, rgba(75, 178, 246, 0.1), rgba(75, 178, 246, 0.2))",
              border: "1px solid rgba(75, 178, 246, 0.2)",
              boxShadow: "0 2px 5px rgba(75, 178, 246, 0.1)"
            }}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              alert(`Modifier les informations de ${prospect.firstName}`);
            }}
          >
            <FiEdit className="w-5 h-5 text-[#004AC8]" />
          </motion.button>
          
          {/* Transform to Client button */}
          <motion.button 
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg shadow-sm transition-all duration-300 ${
              conversionSuccess[prospect.id] ? 'bg-green-100' : 'bg-gradient-to-r from-[#004AC8] to-[#1B0353]'
            }`}
            style={{
              border: conversionSuccess[prospect.id] ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(27, 3, 83, 0.2)',
              boxShadow: "0 2px 5px rgba(27, 3, 83, 0.1)"
            }}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              handleConvertToClient(prospect.id, e);
            }}
            disabled={conversionSuccess[prospect.id]}
          >
            {conversionSuccess[prospect.id] ? (
              <FiCheck className="w-5 h-5 text-green-600" />
            ) : (
              <FiUserCheck className="w-5 h-5 text-white" />
            )}
          </motion.button>
        </div>

        {/* View Details Button */}
        <div className="mt-5 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center w-full transition-all duration-300 bg-gradient-to-r from-[#004AC8] to-[#1B0353] text-white shadow-md hover:shadow-lg"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              openQuickView(prospect);
            }}
          >
            <FiArrowRight className="mr-2 w-4 h-4" />
            <span>Voir le détail</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Main grid component
const ProspectGridView: React.FC<ProspectGridViewProps> = ({ 
  prospects, 
  selectedRows, 
  toggleRowSelection, 
  conversionSuccess, 
  handleConvertToClient, 
  openQuickView,
  getInitials,
  getTagColor,
  getStatusColor
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {prospects.map((prospect: Prospect) => (
          <ProspectCard
            key={prospect.id}
            prospect={prospect}
            selectedRows={selectedRows}
            toggleRowSelection={toggleRowSelection}
            conversionSuccess={conversionSuccess}
            handleConvertToClient={handleConvertToClient}
            openQuickView={openQuickView}
            getInitials={getInitials}
            getTagColor={getTagColor}
            getStatusColor={getStatusColor}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ProspectGridView;