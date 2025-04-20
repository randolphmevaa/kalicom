'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiInfo } from 'react-icons/fi';

const Header: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative mb-8 overflow-hidden backdrop-blur-sm bg-white/80 rounded-3xl shadow-2xl border border-gray-100"
    >
      {/* Background gradient with pattern */}
      <div 
        className="absolute inset-0 opacity-5 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#1B0353]/10 via-white/70 to-[#7B4AE2]/10 rounded-3xl pointer-events-none" />

      {/* Blurred circles for decoration */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#1B0353]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#7B4AE2]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative p-8 z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
          <div className="max-w-2xl">
            {/* Title with decorative elements */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#1B0353]/10 rounded-lg">
                <FiFileText className="w-6 h-6 text-[#1B0353]" />
              </div>
              <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#1B0353] to-[#7B4AE2]">
                Factures
              </h1>
              <span className="px-2 py-1 text-xs font-medium text-[#1B0353] bg-[#1B0353]/10 rounded-full">
                Gestion des factures
              </span>
            </div>
            
            <p className="text-base text-gray-600 leading-relaxed">
              Gérez vos factures et suivez leur état de paiement. Visualisez rapidement 
              les montants dus et les délais de paiement de vos clients.
            </p>
          </div>
          
          <div className="flex items-center bg-[#1B0353]/5 p-3 rounded-xl">
            <FiFileText className="w-6 h-6 text-[#1B0353]" />
            <span className="ml-2 text-[#1B0353] font-medium">Système de facturation</span>
          </div>
        </div>
        
        {/* Quick tip */}
        <div className="mt-6 flex items-start gap-2 p-3 bg-purple-50 border border-purple-100 rounded-xl text-sm">
          <FiInfo className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-medium text-purple-700">Astuce :</span>{' '}
            <span className="text-purple-700">
              Utilisez les filtres pour trouver rapidement les factures impayées ou en retard. Les factures sont automatiquement classées par date d&apos;échéance.
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Header;