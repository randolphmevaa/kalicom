'use client';

import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  FiX,
  FiInfo,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiTrash2,
  FiEdit,
  FiUserCheck,
  FiCheck,
  FiArrowRight
} from 'react-icons/fi';

// Define Prospect interface
interface Prospect {
  id: string;
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  mobilePhoneNumber: string;
  phoneNumber: string;
  address: string;
  zipCode: string;
  city: string;
  country: string;
  tags: string[];
  assignedTo: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  lastContactDate: string;
}

// Define props interface
interface ProspectQuickViewProps {
  prospect: Prospect | null;
  isOpen: boolean;
  onClose: () => void;
  onConvert: (id: string) => void;
  conversionSuccess: Record<string, boolean>;
  getTagColor: (tag: string) => string;
  getStatusColor: (date: string) => string;
  getInitials: (firstName: string, lastName: string) => string;
}

// Using memo to prevent unnecessary re-renders
const ProspectQuickView = memo<ProspectQuickViewProps>(({
  prospect,
  isOpen,
  onClose,
  onConvert,
  conversionSuccess,
  getTagColor,
  getStatusColor,
  getInitials
}) => {
  if (!prospect || !isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[#1B0353] bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 30, rotateX: 5 }}
          animate={{ scale: 1, y: 0, rotateX: 0 }}
          exit={{ scale: 0.9, y: 30, rotateX: 5 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            mass: 1.5
          }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden relative"
          style={{ 
            boxShadow: "0 25px 50px -12px rgba(27, 3, 83, 0.25), 0 0 40px rgba(0, 0, 0, 0.1)",
            transform: "perspective(1000px)",
            transformStyle: "preserve-3d"
          }}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          {/* Modal header with gradient */}
          <div className="relative p-8" style={{ 
            background: "linear-gradient(135deg, #4BB2F6 0%, #004AC8 60%, #1B0353 100%)",
            boxShadow: "0 4px 6px -1px rgba(27, 3, 83, 0.1)"
          }}>
            {/* Animated background pattern */}
            <motion.div 
              className="absolute inset-0 opacity-15"
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
              {/* Avatar with 3D effect */}
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold overflow-hidden"
                style={{ 
                  background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent 80%)",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.2), inset 0 0 20px rgba(255,255,255,0.3)"
                }}
              >
                {getInitials(prospect.firstName, prospect.lastName)}
                
                {/* Animated shine effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-40"
                  animate={{ 
                    x: ["150%", "-150%"],
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    repeatType: "mirror", 
                    duration: 1.5,
                    ease: "easeInOut",
                    repeatDelay: 3
                  }}
                  style={{ 
                    transform: "skewX(45deg)",
                    width: "50%"
                  }}
                />
              </motion.div>
              
              <div className="text-white">
                <h2 className="text-2xl font-bold">{prospect.firstName} {prospect.lastName}</h2>
                <p className="opacity-90">{prospect.companyName}</p>
                <div className="flex mt-2 space-x-2">
                  {prospect.tags.map((tag: string, index: number) => (
                    <motion.span 
                      key={index}
                      whileHover={{ y: -2, scale: 1.05 }}
                      className="px-2 py-1 text-xs rounded-full bg-white bg-opacity-20 backdrop-blur-sm shadow-sm"
                      style={{
                        border: "1px solid rgba(255,255,255,0.2)",
                        textShadow: "0 1px 2px rgba(0,0,0,0.1)"
                      }}
                    >
                      {tag}
                    </motion.span>
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
                  <motion.div 
                    className="flex items-center p-4 rounded-xl shadow-sm transition-all duration-300"
                    whileHover={{ y: -5, scale: 1.02 }}
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
                        {prospect.email}
                      </div>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="ml-auto p-2 rounded-lg text-[#004AC8] hover:bg-[#004AC8] hover:text-white transition-colors"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        window.location.href = `mailto:${prospect.email}`;
                      }}
                      style={{
                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                      }}
                    >
                      <FiMail className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center p-4 rounded-xl shadow-sm transition-all duration-300"
                    whileHover={{ y: -5, scale: 1.02 }}
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
                      <div className="text-xs font-medium uppercase tracking-wider text-[#1B0353]">Téléphone Mobile</div>
                      <div className="text-sm font-semibold text-gray-800 mt-1">{prospect.mobilePhoneNumber}</div>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="ml-auto p-2 rounded-lg text-[#1B0353] hover:bg-[#1B0353] hover:text-white transition-colors"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        window.location.href = `tel:${prospect.mobilePhoneNumber.replace(/\s/g, '')}`;
                      }}
                      style={{
                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                      }}
                    >
                      <FiPhone className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center p-4 rounded-xl shadow-sm transition-all duration-300"
                    whileHover={{ y: -5, scale: 1.02 }}
                    style={{
                      background: "linear-gradient(145deg, #f5f0ff, #efe6ff)",
                      boxShadow: "5px 5px 10px rgba(0,0,0,0.05), -5px -5px 10px #ffffff",
                      border: "1px solid rgba(27, 3, 83, 0.2)"
                    }}
                  >
                    <div className="p-3 rounded-full mr-4 flex items-center justify-center"
                      style={{
                        background: "linear-gradient(145deg, #004AC8, #1B0353)",
                        boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.3), 3px 3px 6px rgba(0,0,0,0.1)"
                      }}
                    >
                      <FiPhone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider text-[#004AC8]">Téléphone Fixe</div>
                      <div className="text-sm font-semibold text-gray-800 mt-1">{prospect.phoneNumber}</div>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="ml-auto p-2 rounded-lg text-[#004AC8] hover:bg-[#004AC8] hover:text-white transition-colors"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        window.location.href = `tel:${prospect.phoneNumber.replace(/\s/g, '')}`;
                      }}
                      style={{
                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                      }}
                    >
                      <FiPhone className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center p-4 rounded-xl shadow-sm transition-all duration-300"
                    whileHover={{ y: -5, scale: 1.02 }}
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
                      <div className="text-sm font-semibold text-gray-800 mt-1">{prospect.address}, {prospect.zipCode} {prospect.city}, {prospect.country}</div>
                    </div>
                  </motion.div>
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
                  <motion.div 
                    className="p-4 rounded-xl shadow-sm transition-all duration-300"
                    whileHover={{ y: -5, scale: 1.02 }}
                    style={{
                      background: "linear-gradient(145deg, #fff9e6, #fff5d6)",
                      boxShadow: "5px 5px 10px rgba(0,0,0,0.05), -5px -5px 10px #ffffff",
                      border: "1px solid rgba(251, 191, 36, 0.2)"
                    }}
                  >
                    <div className="text-xs font-medium text-amber-700 uppercase tracking-wide">Description</div>
                    <div className="text-sm font-medium text-gray-800 mt-2 italic">&quot;{prospect.description}&quot;</div>
                  </motion.div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div 
                      className="p-4 rounded-xl shadow-sm transition-all duration-300"
                      whileHover={{ y: -5, scale: 1.02 }}
                      style={{
                        background: "linear-gradient(145deg, #f0f9ff, #e6f7ff)",
                        boxShadow: "5px 5px 10px rgba(0,0,0,0.05), -5px -5px 10px #ffffff",
                        border: "1px solid rgba(75, 178, 246, 0.2)"
                      }}
                    >
                      <div className="text-xs font-medium text-cyan-700 uppercase tracking-wide">Assigné à</div>
                      <div className="mt-2 flex items-center">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 shadow-sm"
                          style={{ background: "linear-gradient(45deg, #4BB2F6, #004AC8)" }}
                        >
                          {getInitials(prospect.assignedTo.split(' ')[0], prospect.assignedTo.split(' ')[1] || '')}
                        </div>
                        <div className="text-sm font-semibold text-gray-800">{prospect.assignedTo}</div>
                      </div>
                    </motion.div>
                    
                    <motion.div className="p-4 rounded-xl shadow-sm transition-all duration-300"
                      whileHover={{ y: -5, scale: 1.02 }}
                      style={{
                      background: "linear-gradient(145deg, #f2f0ff, #e8e6ff)",
                      boxShadow: "5px 5px 10px rgba(0,0,0,0.05), -5px -5px 10px #ffffff",
                      border: "1px solid rgba(124, 58, 237, 0.2)"
                      }}
                      >
                      <div className="text-xs font-medium text-violet-700 uppercase tracking-wide">ID Prospect</div>
                      <div className="text-sm font-mono font-semibold text-gray-800 mt-2 bg-violet-100 py-1 px-2 rounded inline-block">{prospect.id}</div>
                    </motion.div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div 
                      className="p-4 rounded-xl shadow-sm transition-all duration-300"
                      whileHover={{ y: -5, scale: 1.02 }}
                      style={{
                        background: "linear-gradient(145deg, #fff0f0, #ffe6e6)",
                        boxShadow: "5px 5px 10px rgba(0,0,0,0.05), -5px -5px 10px #ffffff",
                        border: "1px solid rgba(244, 63, 94, 0.2)"
                      }}
                    >
                      <div className="text-xs font-medium text-rose-700 uppercase tracking-wide">Créé le</div>
                      <div className="text-sm font-semibold text-gray-800 mt-2">{prospect.createdAt}</div>
                    </motion.div>
                    
                    <motion.div 
                      className="p-4 rounded-xl shadow-sm transition-all duration-300"
                      whileHover={{ y: -5, scale: 1.02 }}
                      style={{
                        background: "linear-gradient(145deg, #fdf0ff, #f8e6ff)",
                        boxShadow: "5px 5px 10px rgba(0,0,0,0.05), -5px -5px 10px #ffffff",
                        border: "1px solid rgba(217, 70, 239, 0.2)"
                      }}
                    >
                      <div className="text-xs font-medium text-fuchsia-700 uppercase tracking-wide">Mise à jour</div>
                      <div className="text-sm font-semibold text-gray-800 mt-2">{prospect.updatedAt}</div>
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    className="p-4 rounded-xl shadow-sm transition-all duration-300"
                    whileHover={{ y: -5, scale: 1.02 }}
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
                        style={{ backgroundColor: getStatusColor(prospect.lastContactDate) }}
                      />
                      <span className="text-sm font-semibold text-gray-800">{prospect.lastContactDate}</span>
                      
                      <div className="ml-auto flex gap-1">
                        {prospect.tags.map((tag: string, index: number) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 text-xs rounded-full text-white font-medium shadow-sm" 
                            style={{ backgroundColor: getTagColor(tag) }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Modal Footer */}
          <div className="border-t p-4 flex justify-between items-center bg-gray-50">
            <div className="flex space-x-2">
              <button 
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm flex items-center"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  alert(`Supprimer ${prospect.firstName} ?`);
                }}
              >
                <FiTrash2 className="mr-2" />
                <span>Supprimer</span>
              </button>
              
              <button 
                className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm flex items-center"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  window.location.href = `tel:${prospect.mobilePhoneNumber.replace(/\s/g, '')}`;
                }}
              >
                <FiPhone className="mr-2" />
                <span>Appeler</span>
              </button>
              
              <button 
                className="px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition text-sm flex items-center"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  window.location.href = `mailto:${prospect.email}`;
                }}
              >
                <FiMail className="mr-2" />
                <span>Email</span>
              </button>
            </div>
            
            <div className="flex space-x-2">
              <motion.button 
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className={`px-4 py-2 rounded-lg text-sm flex items-center ${
                  conversionSuccess[prospect.id] 
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-gradient-to-r from-[#004AC8] to-[#1B0353] text-white"
                }`}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onConvert(prospect.id);
                }}
                disabled={conversionSuccess[prospect.id]}
              >
                {conversionSuccess[prospect.id] ? (
                  <>
                    <FiCheck className="mr-2" />
                    <span>Converti en client</span>
                  </>
                ) : (
                  <>
                    <FiUserCheck className="mr-2" />
                    <span>Transformer en client</span>
                  </>
                )}
              </motion.button>
            
              <button 
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm flex items-center"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  alert(`Éditer les informations de ${prospect.firstName}`);
                }}
              >
                <FiEdit className="mr-2" />
                <span>Modifier</span>
              </button>
            </div>
          </div>

          {/* Sticky "Voir fiche complète" button at bottom */}
          <div className="sticky bottom-0 left-0 right-0 p-4 bg-white bg-opacity-90 backdrop-blur-sm border-t border-gray-100 flex justify-center shadow-lg">
            <Link 
              href={`/dashboard/crm/prospects/${prospect.id}`}
              passHref
              legacyBehavior
            >
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-lg font-bold text-white flex items-center gap-2 w-full max-w-md"
                style={{
                  background: "linear-gradient(135deg, #4BB2F6, #004AC8, #1B0353)"
                }}
                onClick={onClose}
              >
                <span className="mx-auto flex items-center">
                  Voir fiche complète
                  <FiArrowRight className="ml-2" />
                </span>
              </motion.a>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

ProspectQuickView.displayName = 'ProspectQuickView';

export default ProspectQuickView;