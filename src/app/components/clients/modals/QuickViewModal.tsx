'use client';

// QuickViewModal.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiX, FiInfo, FiMail, FiPhone, FiMapPin, FiBriefcase, FiTrash2, FiEdit, FiSend, FiArrowRight } from 'react-icons/fi';
import { FaEuroSign } from 'react-icons/fa';
import { Client } from '../types';
import { getStatusBadgeColor, getTagColor, getStatusColor, getInitials } from '../utils';

interface QuickViewModalProps {
  isOpen: boolean;
  client: Client | null;
  onClose: () => void;
  onSendDocument: (client: Client, event?: React.MouseEvent) => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({
  isOpen,
  client,
  onClose,
  onSendDocument
}) => {
  if (!isOpen || !client) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#1B0353] bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden relative"
        style={{ boxShadow: "0 25px 50px -12px rgba(27, 3, 83, 0.25), 0 0 40px rgba(0, 0, 0, 0.1)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative p-8" style={{ 
          background: "linear-gradient(135deg, #4BB2F6 0%, #004AC8 60%, #1B0353 100%)",
          boxShadow: "0 4px 6px -1px rgba(27, 3, 83, 0.1)"
        }}>
          {/* Background pattern */}
          <div 
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />

          <button 
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 z-10"
            onClick={onClose}
          >
            <FiX size={24} />
          </button>

          <div className="flex items-center space-x-4 relative z-10">
            {/* Avatar */}
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold overflow-hidden"
              style={{ 
                background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent 80%)",
                boxShadow: "0 8px 16px rgba(0,0,0,0.2), inset 0 0 20px rgba(255,255,255,0.3)"
              }}
            >
              {getInitials(client.prenom, client.nom)}
            </div>
            
            <div className="text-white">
              <h2 className="text-2xl font-bold">{client.prenom} {client.nom}</h2>
              <p className="opacity-90">{client.entreprise}</p>
              <div className="flex mt-2 space-x-2">
                {client.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 text-xs rounded-full bg-white bg-opacity-20 backdrop-blur-sm shadow-sm"
                    style={{
                      border: "1px solid rgba(255,255,255,0.2)",
                      textShadow: "0 1px 2px rgba(0,0,0,0.1)"
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-bold mb-4 text-indigo-900 flex items-center">
                <div className="p-2 rounded-lg bg-indigo-100 mr-3 shadow-sm">
                  <FiInfo className="text-indigo-600 w-5 h-5" />
                </div>
                Informations de contact
              </h3>
              
              <div className="space-y-4">
                {/* Email */}
                <div 
                  className="flex items-center p-4 rounded-xl shadow-sm"
                  style={{
                    background: "linear-gradient(145deg, #f0f9ff, #e6f7ff)",
                    boxShadow: "5px 5px 10px rgba(0,0,0,0.05), -5px -5px 10px #ffffff",
                    border: "1px solid rgba(75, 178, 246, 0.2)"
                  }}
                >
                  <div className="p-3 rounded-full mr-4 flex items-center justify-center"
                    style={{
                      background: "linear-gradient(145deg, #4BB2F6, #004AC8)",
                      boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.3), 3px 3px 6px rgba(0,0,0,0.1)"
                    }}
                  >
                    <FiMail className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium uppercase tracking-wider text-[#004AC8]">Email</div>
                    <div className="text-sm font-semibold text-gray-800 mt-1 truncate">
                      {client.email}
                    </div>
                  </div>
                  <button 
                    className="ml-auto p-2 rounded-lg text-[#004AC8] hover:bg-[#004AC8] hover:text-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `mailto:${client.email}`;
                    }}
                    style={{
                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                    }}
                  >
                    <FiMail className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Phone */}
                <div 
                  className="flex items-center p-4 rounded-xl shadow-sm"
                  style={{
                    background: "linear-gradient(145deg, #f2f0ff, #e8e6ff)",
                    boxShadow: "5px 5px 10px rgba(0,0,0,0.05), -5px -5px 10px #ffffff",
                    border: "1px solid rgba(0, 74, 200, 0.2)"
                  }}
                >
                  <div className="p-3 rounded-full mr-4 flex items-center justify-center"
                    style={{
                      background: "linear-gradient(145deg, #1B0353, #004AC8)",
                      boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.3), 3px 3px 6px rgba(0,0,0,0.1)"
                    }}
                  >
                    <FiPhone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-[#1B0353]">Téléphone</div>
                    <div className="text-sm font-semibold text-gray-800 mt-1">{client.telephone}</div>
                  </div>
                  <button 
                    className="ml-auto p-2 rounded-lg text-[#1B0353] hover:bg-[#1B0353] hover:text-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `tel:${client.telephone.replace(/\s/g, '')}`;
                    }}
                    style={{
                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                    }}
                  >
                    <FiPhone className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Address */}
                <div 
                  className="flex items-center p-4 rounded-xl shadow-sm"
                  style={{
                    background: "linear-gradient(145deg, #f0f9ff, #e6f7ff)",
                    boxShadow: "5px 5px 10px rgba(0,0,0,0.05), -5px -5px 10px #ffffff",
                    border: "1px solid rgba(75, 178, 246, 0.2)"
                  }}
                >
                  <div className="p-3 rounded-full mr-4 flex items-center justify-center"
                    style={{
                      background: "linear-gradient(145deg, #4BB2F6, #004AC8)",
                      boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.3), 3px 3px 6px rgba(0,0,0,0.1)"
                    }}
                  >
                    <FiMapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium uppercase tracking-wider text-[#004AC8]">Adresse</div>
                    <div className="text-sm font-semibold text-gray-800 mt-1">{client.adresse}</div>
                    <div className="text-sm font-semibold text-gray-800">{client.ville}, {client.pays}</div>
                  </div>
                </div>
                
                {/* Value */}
                <div 
                  className="flex items-center p-4 rounded-xl shadow-sm"
                  style={{
                    background: "linear-gradient(145deg, #f0fff4, #e6ffe9)",
                    boxShadow: "5px 5px 10px rgba(0,0,0,0.05), -5px -5px 10px #ffffff",
                    border: "1px solid rgba(52, 211, 153, 0.2)"
                  }}
                >
                  <div className="p-3 rounded-full mr-4 flex items-center justify-center"
                    style={{
                      background: "linear-gradient(145deg, #4BB2F6, #004AC8)",
                      boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.3), 3px 3px 6px rgba(0,0,0,0.1)"
                    }}
                  >
                    <FaEuroSign className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium uppercase tracking-wider text-green-600">Valeur Totale</div>
                    <div className="text-lg font-bold text-green-700 mt-1">{client.valeurTotale}</div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-bold mb-4 text-indigo-900 flex items-center">
                <div className="p-2 rounded-lg bg-indigo-100 mr-3 shadow-sm">
                  <FiBriefcase className="text-indigo-600 w-5 h-5" />
                </div>
                Informations additionnelles
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    className="p-4 rounded-xl shadow-sm"
                    style={{
                      background: "linear-gradient(145deg, #f0f9ff, #e6f7ff)",
                      boxShadow: "5px 5px 10px rgba(0,0,0,0.05), -5px -5px 10px #ffffff",
                      border: "1px solid rgba(75, 178, 246, 0.2)"
                    }}
                  >
                    <div className="text-xs font-medium text-cyan-700 uppercase tracking-wide">Statut</div>
                    <div className="mt-2 flex items-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(client.statut)}`}>
                        {client.statut}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-xl shadow-sm"
                    style={{
                    background: "linear-gradient(145deg, #f2f0ff, #e8e6ff)",
                    boxShadow: "5px 5px 10px rgba(0,0,0,0.05), -5px -5px 10px #ffffff",
                    border: "1px solid rgba(124, 58, 237, 0.2)"
                    }}
                  >
                    <div className="text-xs font-medium text-violet-700 uppercase tracking-wide">Source</div>
                    <div className="text-sm font-semibold text-gray-800 mt-2 bg-violet-100 py-1 px-2 rounded inline-block">{client.source}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    className="p-4 rounded-xl shadow-sm"
                    style={{
                      background: "linear-gradient(145deg, #fff0f0, #ffe6e6)",
                      boxShadow: "5px 5px 10px rgba(0,0,0,0.05), -5px -5px 10px #ffffff",
                      border: "1px solid rgba(244, 63, 94, 0.2)"
                    }}
                  >
                    <div className="text-xs font-medium text-rose-700 uppercase tracking-wide">ID Client</div>
                    <div className="text-sm font-semibold text-gray-800 mt-2">#{client.id}</div>
                  </div>
                  
                  <div 
                    className="p-4 rounded-xl shadow-sm"
                    style={{
                      background: "linear-gradient(145deg, #fdf0ff, #f8e6ff)",
                      boxShadow: "5px 5px 10px rgba(0,0,0,0.05), -5px -5px 10px #ffffff",
                      border: "1px solid rgba(217, 70, 239, 0.2)"
                    }}
                  >
                    <div className="text-xs font-medium text-fuchsia-700 uppercase tracking-wide">Tags</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {client.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 text-xs rounded-full text-white" 
                          style={{ backgroundColor: getTagColor(tag) }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div 
                  className="p-4 rounded-xl shadow-sm"
                  style={{
                    background: "linear-gradient(145deg, #f0fff4, #e6ffe9)",
                    boxShadow: "5px 5px 10px rgba(0,0,0,0.05), -5px -5px 10px #ffffff",
                    border: "1px solid rgba(52, 211, 153, 0.2)"
                  }}
                >
                  <div className="text-xs font-medium text-emerald-700 uppercase tracking-wide">Dernier contact</div>
                  <div className="flex items-center mt-2">
                    <div 
                      className="w-3 h-3 rounded-full mr-2 shadow-sm" 
                      style={{ backgroundColor: getStatusColor(client.dernierContact) }}
                    />
                    <span className="text-sm font-semibold text-gray-800">{client.dernierContact}</span>
                  </div>
                </div>
                
                <div 
                  className="p-4 rounded-xl shadow-sm"
                  style={{
                    background: "linear-gradient(145deg, #fff9e6, #fff5d6)",
                    boxShadow: "5px 5px 10px rgba(0,0,0,0.05), -5px -5px 10px #ffffff",
                    border: "1px solid rgba(251, 191, 36, 0.2)"
                  }}
                >
                  <div className="text-xs font-medium text-amber-700 uppercase tracking-wide">Activité récente</div>
                  <div className="text-sm font-medium text-gray-800 mt-2">
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span>Dernière facture envoyée le 28/02/2025</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        <span>Email envoyé le 01/03/2025</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t p-4 flex justify-between items-center bg-gray-50">
          <div className="flex space-x-2">
            <button 
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                alert(`Supprimer ${client.prenom} ?`);
              }}
            >
              <FiTrash2 className="mr-2" />
              <span>Supprimer</span>
            </button>
            
            <button 
              className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `tel:${client.telephone.replace(/\s/g, '')}`;
              }}
            >
              <FiPhone className="mr-2" />
              <span>Appeler</span>
            </button>
            
            <button 
              className="px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition text-sm flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `mailto:${client.email}`;
              }}
            >
              <FiMail className="mr-2" />
              <span>Email</span>
            </button>
          </div>

          <div className="flex space-x-2">
          <button 
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                onSendDocument(client, e);
              }}
            >
              <FiSend className="mr-2" />
              <span>Envoyer document</span>
            </button>

            <button 
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                alert(`Éditer les informations de ${client.prenom}`);
              }}
            >
              <FiEdit className="mr-2" />
              <span>Modifier</span>
            </button>
          </div>
        </div>

        {/* "Voir fiche complète" button */}
        <div className="sticky bottom-0 left-0 right-0 p-4 bg-white bg-opacity-90 backdrop-blur-sm border-t border-gray-100 flex justify-center shadow-lg">
          <button
            className="px-6 py-3 rounded-lg font-bold text-white flex items-center gap-2 w-full max-w-md hover:scale-105 transition-transform"
            style={{
              background: "linear-gradient(135deg, #4BB2F6, #004AC8, #1B0353)"
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
              
              const clientDetailPath = `/dashboard/clients/${client.id}`;
              console.log(`Navigating to client detail page: ${clientDetailPath}`);
              window.location.href = clientDetailPath;
            }}
          >
            <span className="mx-auto flex items-center">
              Voir fiche complète
              <FiArrowRight className="ml-2" />
            </span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QuickViewModal;