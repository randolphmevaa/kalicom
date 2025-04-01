'use client';

import React from "react";
import { motion } from "framer-motion";
import { Prospect } from "../../types/crm-types";
import {
  FiCheckSquare,
  FiSquare,
  FiPhone,
  FiMail,
  FiEdit,
  FiUserCheck,
  FiCheck,
  FiArrowRight
} from "react-icons/fi";

// Define Prospect interface
// interface Prospect {
//   id: string;
//   firstName: string;
//   lastName: string;
//   companyName: string;
//   email: string;
//   mobilePhoneNumber: string;
//   address: string;
//   zipCode: string;
//   city: string;
//   country: string;
//   tags: string[];
//   assignedTo: string;
//   lastContactDate: string;
//   description?: string;
//   createdAt?: string;
//   updatedAt?: string;
// }

// Define ProspectListViewProps interface
interface ProspectListViewProps {
  prospects: Prospect[];
  selectedRows: string[];
  toggleRowSelection: (id: string, e?: React.MouseEvent) => void;
  conversionSuccess: Record<string, boolean>;
  handleConvertToClient: (id: string, e?: React.MouseEvent) => void;
  openQuickView: (prospect: Prospect) => void;
  getTagColor: (tag: string) => string;
  getStatusColor: (date: string) => string;
  getInitials: (firstName: string, lastName: string) => string;
}

// For performance with large lists, consider using the VirtualizedProspectListView component instead
const ProspectListView: React.FC<ProspectListViewProps> = ({
  prospects,
  selectedRows,
  toggleRowSelection,
  conversionSuccess,
  handleConvertToClient,
  openQuickView,
  getTagColor,
  getStatusColor,
  getInitials
}) => {
  // Memoized row renderer for better performance
  const renderRow = React.useCallback((prospect: Prospect, index: number) => {
    const isEven = index % 2 === 0;
    
    return (
      <tr
        key={prospect.id}
        className={`hover:bg-gray-50 cursor-pointer ${isEven ? 'bg-white' : 'bg-gray-50'}`}
        onClick={() => openQuickView(prospect)}
      >
        <td className="px-4 py-4 whitespace-nowrap">
          <button
            className="focus:outline-none"
            onClick={(e: React.MouseEvent) => toggleRowSelection(prospect.id, e)}
          >
            {selectedRows.includes(prospect.id) ? (
              <FiCheckSquare className="text-indigo-600" />
            ) : (
              <FiSquare className="text-gray-400" />
            )}
          </button>
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
          {prospect.id}
        </td>
        <td className="px-4 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3"
              style={{ background: "linear-gradient(45deg, #4BB2F6, #004AC8)" }}
            >
              {getInitials(prospect.firstName, prospect.lastName)}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                {prospect.firstName} {prospect.lastName}
              </div>
              <div className="text-xs text-gray-500">
                Assigné à: {prospect.assignedTo}
              </div>
            </div>
          </div>
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
          {prospect.companyName}
        </td>
        <td className="px-4 py-4 whitespace-nowrap">
          <div className="text-sm text-indigo-600">
            <a 
              href={`mailto:${prospect.email}`} 
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {prospect.email}
            </a>
          </div>
          <div className="text-sm text-gray-500">
            <a 
              href={`tel:${prospect.mobilePhoneNumber.replace(/\s/g, '')}`} 
              className="hover:text-[#004AC8]"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {prospect.mobilePhoneNumber}
            </a>
          </div>
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
          {/* Show full address in list view */}
          <div className="max-w-xs truncate" title={`${prospect.address}, ${prospect.zipCode} ${prospect.city}, ${prospect.country}`}>
            {prospect.address}, {prospect.zipCode} {prospect.city}
          </div>
        </td>
        <td className="px-4 py-4 whitespace-nowrap">
          <div className="flex flex-wrap gap-1">
            {prospect.tags.map((tag: string, tagIndex: number) => (
              <span 
                key={tagIndex} 
                className="px-2 py-1 text-xs rounded-full text-white" 
                style={{ backgroundColor: getTagColor(tag) }}
              >
                {tag}
              </span>
            ))}
          </div>
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
          <div className="flex items-center">
            <div 
              className="w-2 h-2 rounded-full mr-2" 
              style={{ backgroundColor: getStatusColor(prospect.lastContactDate) }}
            />
            {prospect.lastContactDate}
          </div>
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-sm">
          <div className="flex space-x-1">
            <button 
              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                window.location.href = `tel:${prospect.mobilePhoneNumber.replace(/\s/g, '')}`;
              }}
            >
              <FiPhone size={16} />
            </button>
            <button 
              className="p-1 text-purple-600 hover:bg-purple-50 rounded"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                window.location.href = `mailto:${prospect.email}`;
              }}
            >
              <FiMail size={16} />
            </button>
            <button 
              className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                alert(`Modifier les informations de ${prospect.firstName}`);
              }}
            >
              <FiEdit size={16} />
            </button>
            <button 
              className={`p-1 ${conversionSuccess[prospect.id] ? 'text-green-600 hover:bg-green-50' : 'text-indigo-600 hover:bg-indigo-50'} rounded`}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                handleConvertToClient(prospect.id, e);
              }}
            >
              {conversionSuccess[prospect.id] ? <FiCheck size={16} /> : <FiUserCheck size={16} />}
            </button>
            
            {/* Added "Voir le détail" button */}
            <button 
              className="p-1 text-blue-700 hover:bg-blue-50 rounded"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                openQuickView(prospect);
              }}
            >
              <FiArrowRight size={16} />
            </button>
          </div>
        </td>
      </tr>
    );
  }, [selectedRows, toggleRowSelection, conversionSuccess, handleConvertToClient, openQuickView, getTagColor, getStatusColor, getInitials]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-md overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="w-10 px-4 py-3 text-left">
                <button className="focus:outline-none">
                  <FiSquare className="text-gray-400" />
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Nom complet
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Entreprise
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Contact
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Localisation
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Tags
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Dernier contact
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {prospects.map(renderRow)}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ProspectListView;