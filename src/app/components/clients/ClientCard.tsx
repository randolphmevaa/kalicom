// ClientCard.jsx
'use client';
// ClientCard.tsx
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiMessageCircle, FiEdit, FiSend, FiCheckSquare, FiSquare, FiArrowRight } from 'react-icons/fi';
import { FaEuroSign } from 'react-icons/fa';
import { Client } from './types';
import { getStatusColor, getTagColor, getInitials, getStatusBadgeColor } from './utils';

// Optimized animation variants
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

interface ClientCardProps {
  client: Client;
  isSelected: boolean;
  onSelect: (id: number, event?: React.MouseEvent) => void;
  onOpenQuickView: (client: Client) => void;
  onSendDocument: (client: Client, event?: React.MouseEvent) => void;
}

const ClientCard: React.FC<ClientCardProps> = memo(({
  client,
  isSelected,
  onSelect,
  onOpenQuickView,
  onSendDocument
}) => {
  return (
    <motion.div
      key={client.id}
      layoutId={`card-${client.id}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ 
        y: -8, 
        boxShadow: "0 20px 25px -5px rgba(0, 74, 200, 0.15), 0 10px 10px -5px rgba(27, 3, 83, 0.1)"
      }}
      className="group bg-white rounded-xl overflow-hidden cursor-pointer border border-gray-100"
      style={{ 
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)",
      }}
      onClick={() => onOpenQuickView(client)}
    >
      {/* Card Header with Gradient */}
      <div 
        className="h-16 relative overflow-hidden"
        style={{ 
          background: "linear-gradient(120deg, #4BB2F6, #004AC8, #1B0353)",
          clipPath: "polygon(0 0, 100% 0, 100% 80%, 0 100%)"
        }}
      >
        {/* Background pattern (static to improve performance) */}
        <div 
          className="absolute inset-0 opacity-20"
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
              getStatusColor(client.dernierContact) === "#4BB2F6" ? "animate-ping absolute" : ""
            }`}
            style={{ 
              backgroundColor: getStatusColor(client.dernierContact),
              opacity: 0.5
            }}
          />
          <div 
            className="w-2 h-2 rounded-full relative"
            style={{ backgroundColor: getStatusColor(client.dernierContact) }}
            title={`Dernier contact: ${client.dernierContact}`}
          />
          <span className="ml-2 text-xs text-gray-500">{client.dernierContact}</span>
        </div>
        
        {/* Checkbox for selection */}
        <button
          className="absolute top-4 left-4 focus:outline-none"
          onClick={(e) => onSelect(client.id, e)}
        >
          {isSelected ? (
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
            <div 
              className="absolute -inset-1 rounded-full opacity-20 blur-md"
              style={{ 
                background: "radial-gradient(circle, #4BB2F6, #004AC8)", 
              }}
            />
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center text-white text-xl font-bold relative z-10 border-2 border-white"
              style={{ 
                background: "linear-gradient(45deg, #4BB2F6, #004AC8, #1B0353)",
                boxShadow: "0 10px 15px -3px rgba(27, 3, 83, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.15)"
              }}
            >
              {getInitials(client.prenom, client.nom)}
            </div>
          </div>
          
          <h3 className="text-lg font-bold text-[#1B0353] group-hover:text-[#004AC8] transition-colors">
            {client.prenom} {client.nom}
          </h3>
          
          <p className="text-sm font-medium text-[#004AC8]">
            {client.entreprise}
          </p>
          
          <p className="text-xs text-gray-500 mb-2">
            ID: {client.id}
          </p>
          
          {/* Status badge */}
          <span className={`mt-1 px-3 py-1 text-xs rounded-full ${getStatusBadgeColor(client.statut)}`}>
            {client.statut}
          </span>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {client.tags.map((tag, tagIndex) => (
              <span 
                key={tagIndex}
                className="px-3 py-1 text-xs font-medium rounded-full text-white shadow-sm transform hover:-translate-y-1 transition-transform" 
                style={{ 
                  backgroundColor: getTagColor(tag),
                  boxShadow: `0 2px 5px ${getTagColor(tag)}40`
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        {/* Contact info */}
        <div className="space-y-3 mt-4">
          {/* Email */}
          <div 
            className="flex items-center p-3 rounded-lg border border-gray-100 group-hover:border-[#4BB2F6] transition-colors hover:scale-102 hover:translate-x-1 transform"
            style={{
              background: "linear-gradient(to right, rgba(240, 249, 255, 0.8), rgba(255, 255, 255, 0.9))",
              boxShadow: "0 2px 6px rgba(75, 178, 246, 0.1)"
            }}
          >
            <div className="p-2 rounded-full bg-[#4BB2F6] bg-opacity-10 text-[#004AC8] mr-3 flex-shrink-0">
              <FiMail className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium uppercase tracking-wider text-[#004AC8]">Email</div>
              <div className="text-gray-700 text-sm font-medium truncate" title={client.email}>
                {client.email}
              </div>
            </div>
          </div>
          
          {/* Phone */}
          <div
            className="flex items-center p-3 rounded-lg border border-gray-100 group-hover:border-[#4BB2F6] transition-colors hover:scale-102 hover:translate-x-1 transform"
            style={{
              background: "linear-gradient(to right, rgba(240, 249, 255, 0.8), rgba(255, 255, 255, 0.9))",
              boxShadow: "0 2px 6px rgba(0, 74, 200, 0.1)"
            }}
          >
            <div className="p-2 rounded-full bg-[#004AC8] bg-opacity-10 text-[#004AC8] mr-3 flex-shrink-0">
              <FiPhone className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium uppercase tracking-wider text-[#004AC8]">Téléphone</div>
              <a 
                href={`tel:${client.telephone.replace(/\s/g, '')}`} 
                className="text-gray-700 text-sm font-medium block truncate hover:text-[#004AC8]" 
                title={client.telephone}
                onClick={(e) => e.stopPropagation()}
              >
                {client.telephone}
              </a>
            </div>
          </div>

          {/* Address - Simplified to improve performance */}
          <div
            className="flex items-center p-3 rounded-lg border border-gray-100 group-hover:border-[#4BB2F6] transition-colors"
            style={{
              background: "linear-gradient(to right, rgba(240, 249, 255, 0.8), rgba(255, 255, 255, 0.9))",
              boxShadow: "0 2px 6px rgba(27, 3, 83, 0.1)"
            }}
          >
            <div className="p-2 rounded-full bg-[#1B0353] bg-opacity-10 text-[#1B0353] mr-3 flex-shrink-0">
              <FiMapPin className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium uppercase tracking-wider text-[#004AC8]">Adresse</div>
              <div className="text-gray-700 text-sm font-medium truncate" title={`${client.adresse}, ${client.ville}, ${client.pays}`}>
                {client.adresse}
              </div>
              <div className="text-gray-700 text-sm font-medium">
                {client.ville}, {client.pays}
              </div>
            </div>
          </div>
          
          {/* Value */}
          <div
            className="flex items-center justify-between p-3 rounded-lg border border-gray-100 group-hover:border-[#4BB2F6] transition-colors"
            style={{
              background: "linear-gradient(to right, rgba(240, 249, 255, 0.8), rgba(255, 255, 255, 0.9))",
              boxShadow: "0 2px 6px rgba(27, 3, 83, 0.1)"
            }}
          >
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-[#004AC8] bg-opacity-10 text-[#004AC8] mr-3 flex-shrink-0">
                <FaEuroSign className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-[#004AC8]">Valeur due</div>
                <div className="text-gray-700 text-sm font-medium">
                  {client.valeurTotale}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center space-x-2 mt-6">
          <button 
            className="p-2 rounded-lg shadow-sm hover:scale-110 hover:-translate-y-1 transform transition"
            style={{
              background: "rgba(75, 178, 246, 0.1)",
              border: "1px solid rgba(75, 178, 246, 0.2)",
              boxShadow: "0 2px 5px rgba(75, 178, 246, 0.1)"
            }}
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `tel:${client.telephone.replace(/\s/g, '')}`;
            }}
          >
            <FiPhone className="w-5 h-5 text-[#004AC8]" />
          </button>
          <button 
            className="p-2 rounded-lg shadow-sm hover:scale-110 hover:-translate-y-1 transform transition"
            style={{
              background: "rgba(0, 74, 200, 0.1)",
              border: "1px solid rgba(0, 74, 200, 0.2)",
              boxShadow: "0 2px 5px rgba(0, 74, 200, 0.1)"
            }}
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `mailto:${client.email}`;
            }}
          >
            <FiMail className="w-5 h-5 text-[#004AC8]" />
          </button>
          <button 
            className="p-2 rounded-lg shadow-sm hover:scale-110 hover:-translate-y-1 transform transition"
            style={{
              background: "rgba(27, 3, 83, 0.1)",
              border: "1px solid rgba(27, 3, 83, 0.2)",
              boxShadow: "0 2px 5px rgba(27, 3, 83, 0.1)"
            }}
            onClick={(e) => {
              e.stopPropagation();
              alert(`Commencer une conversation avec ${client.prenom}`);
            }}
          >
            <FiMessageCircle className="w-5 h-5 text-[#1B0353]" />
          </button>
          <button 
            className="p-2 rounded-lg shadow-sm hover:scale-110 hover:-translate-y-1 transform transition"
            style={{
              background: "rgba(75, 178, 246, 0.1)",
              border: "1px solid rgba(75, 178, 246, 0.2)",
              boxShadow: "0 2px 5px rgba(75, 178, 246, 0.1)"
            }}
            onClick={(e) => {
              e.stopPropagation();
              alert(`Modifier les informations de ${client.prenom}`);
            }}
          >
            <FiEdit className="w-5 h-5 text-[#004AC8]" />
          </button>
          
          {/* Send document button */}
          <button 
            className="p-2 rounded-lg shadow-sm hover:scale-110 hover:-translate-y-1 transform transition"
            style={{
              background: "rgba(34, 197, 94, 0.1)",
              border: "1px solid rgba(34, 197, 94, 0.2)",
              boxShadow: "0 2px 5px rgba(34, 197, 94, 0.1)"
            }}
            onClick={(e) => onSendDocument(client, e)}
          >
            <FiSend className="w-5 h-5 text-green-600" />
          </button>
        </div>

        {/* View Details Button */}
        <div className="mt-5 flex justify-center">
          <button
            className="px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center w-full transition-all duration-300 bg-gradient-to-r from-[#004AC8] to-[#1B0353] text-white shadow-md hover:shadow-lg hover:scale-103"
            onClick={(e) => {
              e.stopPropagation();
              onOpenQuickView(client);
            }}
          >
            <FiArrowRight className="mr-2 w-4 h-4" />
            <span>Voir le détail</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
});

ClientCard.displayName = 'ClientCard';

export default ClientCard;