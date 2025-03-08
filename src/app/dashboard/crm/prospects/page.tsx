"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiPlus,
  FiFilter,
  FiCalendar,
  FiChevronDown,
  FiRefreshCw,
  FiCheckSquare,
  FiSquare,
  FiMoreVertical,
  FiTag,
  FiUser,
} from "react-icons/fi";

/** -----------------------------
 *  Define TypeScript interfaces
 *  -----------------------------
 */
interface Prospect {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  companyName: string;
  zipCode: string;
  address: string;
  description: string;
  email: string;
  mobilePhoneNumber: string;
  city: string;
  country: string;
  tags: string[];
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
}

interface TeamMember {
  id: number;
  name: string;
}

interface FilterModel {
  id: number;
  name: string;
}

interface FieldOption {
  id: string;
  label: string;
  checked: boolean;
}

interface PropertyOption {
  id: string;
  label: string;
  checked: boolean;
}

/** -----------------------------
 *  Sample Data
 *  -----------------------------
 */
const prospectsData: Prospect[] = [
  {
    id: "LD-12345",
    firstName: "Marie",
    lastName: "Dupont",
    phoneNumber: "06 12 34 56 78",
    companyName: "Nexus Tech",
    zipCode: "75001",
    address: "10 Rue de Rivoli",
    description: "Intéressé par notre offre premium",
    email: "marie.dupont@nexustech.fr",
    mobilePhoneNumber: "06 12 34 56 78",
    city: "Paris",
    country: "France",
    tags: ["VIP", "Premium"],
    assignedTo: "Emma Laurent",
    createdAt: "2023-09-15",
    updatedAt: "2023-10-01",
  },
  {
    id: "LD-12346",
    firstName: "Thomas",
    lastName: "Bernard",
    phoneNumber: "06 23 45 67 89",
    companyName: "Global Solutions",
    zipCode: "69001",
    address: "25 Rue de la République",
    description: "A contacté via le site web",
    email: "thomas.bernard@globalsolutions.fr",
    mobilePhoneNumber: "06 23 45 67 89",
    city: "Lyon",
    country: "France",
    tags: ["Nouveau"],
    assignedTo: "Lucas Martin",
    createdAt: "2023-09-18",
    updatedAt: "2023-09-25",
  },
  {
    id: "LD-12347",
    firstName: "Sophie",
    lastName: "Leclerc",
    phoneNumber: "06 34 56 78 90",
    companyName: "Innovate Design",
    zipCode: "33000",
    address: "5 Cours de l'Intendance",
    description: "Demande de démonstration",
    email: "sophie.leclerc@innovatedesign.fr",
    mobilePhoneNumber: "06 34 56 78 90",
    city: "Bordeaux",
    country: "France",
    tags: ["Démonstration", "Tech"],
    assignedTo: "Julie Dubois",
    createdAt: "2023-09-20",
    updatedAt: "2023-10-05",
  },
  {
    id: "LD-12348",
    firstName: "Pierre",
    lastName: "Moreau",
    phoneNumber: "06 45 67 89 01",
    companyName: "Eco Habitat",
    zipCode: "31000",
    address: "15 Rue du Taur",
    description: "Contact via salon professionnel",
    email: "pierre.moreau@ecohabitat.fr",
    mobilePhoneNumber: "06 45 67 89 01",
    city: "Toulouse",
    country: "France",
    tags: ["Événement", "Priorité"],
    assignedTo: "Emma Laurent",
    createdAt: "2023-09-22",
    updatedAt: "2023-09-30",
  },
  {
    id: "LD-12349",
    firstName: "Isabelle",
    lastName: "Petit",
    phoneNumber: "06 56 78 90 12",
    companyName: "Marketing Plus",
    zipCode: "67000",
    address: "30 Avenue des Vosges",
    description: "Recommandé par client existant",
    email: "isabelle.petit@marketingplus.fr",
    mobilePhoneNumber: "06 56 78 90 12",
    city: "Strasbourg",
    country: "France",
    tags: ["Référence"],
    assignedTo: "Lucas Martin",
    createdAt: "2023-09-25",
    updatedAt: "2023-10-02",
  },
];

const teamMembers: TeamMember[] = [
  { id: 1, name: "Emma Laurent" },
  { id: 2, name: "Lucas Martin" },
  { id: 3, name: "Julie Dubois" },
  { id: 4, name: "Marc Lefevre" },
  { id: 5, name: "Léa Rousseau" },
];

const filterModels: FilterModel[] = [
  { id: 1, name: "Prospects récents" },
  { id: 2, name: "Prospects VIP" },
  { id: 3, name: "Prospects non assignés" },
  { id: 4, name: "Prospects du mois en cours" },
];

const fieldOptions: FieldOption[] = [
  { id: "firstName", label: "First name", checked: true },
  { id: "lastName", label: "Last name", checked: true },
  { id: "phoneNumber", label: "Phone number", checked: true },
  { id: "companyName", label: "Company name", checked: true },
  { id: "zipCode", label: "Zip code", checked: true },
  { id: "address", label: "Address", checked: true },
  { id: "description", label: "Description", checked: true },
  { id: "email", label: "E-mail", checked: true },
  { id: "mobilePhoneNumber", label: "Mobile phone number", checked: true },
  { id: "city", label: "City", checked: false },
  { id: "country", label: "Country", checked: false },
];

const propertyOptions: PropertyOption[] = [
  { id: "tags", label: "Tags", checked: true },
  { id: "leadId", label: "Lead ID", checked: true },
  { id: "assignedTo", label: "Assigné à", checked: true },
  { id: "createdAt", label: "Créé le", checked: true },
  { id: "updatedAt", label: "Mis à jour le", checked: false },
  { id: "action", label: "Action", checked: true },
];

export default function ProspectPage() {
  // State with explicit type annotations to avoid "never[]" errors
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [phoneSearch, setPhoneSearch] = useState<string>("");
  const [tagSearch, setTagSearch] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null);
  const [selectedFilterModel, setSelectedFilterModel] = useState<string | null>(
    null
  );

  // Booleans for toggling dropdowns
  const [showFieldsDropdown, setShowFieldsDropdown] = useState<boolean>(false);
  const [showTeamDropdown, setShowTeamDropdown] = useState<boolean>(false);
  const [showFilterModelsDropdown, setShowFilterModelsDropdown] =
    useState<boolean>(false);

  // Arrays of fields/properties with explicit types
  const [selectedFields, setSelectedFields] = useState<FieldOption[]>(
    fieldOptions
  );
  const [selectedProperties, setSelectedProperties] = useState<PropertyOption[]>(
    propertyOptions
  );

  // “Select all” logic
  const [selectAll, setSelectAll] = useState<boolean>(false);

  // Selected row IDs are strings
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  /** -----------------------------
   *  Handlers
   *  -----------------------------
   */
  // Toggle all rows
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedRows(prospectsData.map((prospect) => prospect.id));
    } else {
      setSelectedRows([]);
    }
  };

  // Toggle row selection
  const toggleRowSelection = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Reset all filters
  const handleReset = () => {
    setSearchTerm("");
    setPhoneSearch("");
    setTagSearch("");
    setDateFilter("");
    setSelectedAssignee(null);
    setSelectedFilterModel(null);
  };

  // Toggle a field’s `checked` value
  const toggleField = (fieldId: string) => {
    const updatedFields = selectedFields.map((field) =>
      field.id === fieldId ? { ...field, checked: !field.checked } : field
    );
    setSelectedFields(updatedFields);
  };

  // Toggle a property’s `checked` value
  const toggleProperty = (propertyId: string) => {
    const updatedProperties = selectedProperties.map((property) =>
      property.id === propertyId
        ? { ...property, checked: !property.checked }
        : property
    );
    setSelectedProperties(updatedProperties);
  };

  // Select or deselect all fields/properties
  // const selectAllFields = () => {
  //   const allSelected =
  //     selectedFields.every((field) => field.checked) &&
  //     selectedProperties.every((property) => property.checked);

  //   // Flip them all: if all are selected, uncheck; otherwise check
  //   const updatedFields = selectedFields.map((field) => ({
  //     ...field,
  //     checked: !allSelected,
  //   }));
  //   const updatedProps = selectedProperties.map((prop) => ({
  //     ...prop,
  //     checked: !allSelected,
  //   }));

  //   setSelectedFields(updatedFields);
  //   setSelectedProperties(updatedProps);
  // };

  /** -----------------------------
   *  Rendering
   *  -----------------------------
   */
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen"
    >
      <div className="max-w-7xl mx-auto space-y-6 px-4  ">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 bg-white rounded-2xl shadow-lg">
          <div>
            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-3xl font-bold text-indigo-700 drop-shadow-md"
            >
              Prospects
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">
              Gérez et suivez tous vos prospects commerciaux
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
              <FiSearch className="mr-2" />
              <span>Recherche Avancée</span>
            </button>
            <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              <FiPlus className="mr-2" />
              <span>Ajouter un prospect</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* Phone Number */}
            <div className="col-span-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Numéro de Tél.
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={phoneSearch}
                  onChange={(e) => setPhoneSearch(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ex: 06 12 34 56 78"
                />
              </div>
            </div>

            {/* Search */}
            <div className="col-span-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Chercher
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Rechercher..."
                />
                <FiSearch className="absolute top-2.5 right-3 text-gray-400" />
              </div>
            </div>

            {/* Tags */}
            <div className="col-span-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="relative">
                <div className="flex items-center w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <FiTag className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                    className="w-full outline-none"
                    placeholder="Filtrer par tags"
                  />
                </div>
              </div>
            </div>

            {/* Date Created */}
            <div className="col-span-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Créé le
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
                <FiCalendar className="absolute top-2.5 right-3 text-gray-400" />
              </div>
            </div>

            {/* Assigned To */}
            <div className="col-span-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Assigné à
              </label>
              <div className="relative">
                <button
                  className="w-full flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                  onClick={() => setShowTeamDropdown(!showTeamDropdown)}
                >
                  <div className="flex items-center">
                    <FiUser className="text-gray-400 mr-2" />
                    <span>
                      {selectedAssignee ? selectedAssignee : "Sélectionner"}
                    </span>
                  </div>
                  <FiChevronDown className="text-gray-400" />
                </button>
                {showTeamDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                    {teamMembers.map((member) => (
                      <div
                        key={member.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => {
                          setSelectedAssignee(member.name);
                          setShowTeamDropdown(false);
                        }}
                      >
                        {member.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Filter Models */}
            <div className="col-span-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Modèles de filtres
              </label>
              <div className="relative">
                <button
                  className="w-full flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                  onClick={() =>
                    setShowFilterModelsDropdown(!showFilterModelsDropdown)
                  }
                >
                  <div className="flex items-center">
                    <FiFilter className="text-gray-400 mr-2" />
                    <span>
                      {selectedFilterModel ? selectedFilterModel : "Sélectionner"}
                    </span>
                  </div>
                  <FiChevronDown className="text-gray-400" />
                </button>
                {showFilterModelsDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                    {filterModels.map((model) => (
                      <div
                        key={model.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => {
                          setSelectedFilterModel(model.name);
                          setShowFilterModelsDropdown(false);
                        }}
                      >
                        {model.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex justify-between mt-6">
            <div className="flex space-x-3">
              <button
                onClick={handleReset}
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
              >
                <FiRefreshCw className="mr-2" />
                <span>Réinitialiser</span>
              </button>
              <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm">
                <FiFilter className="mr-2" />
                <span>Appliquer le filtre</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table Controls */}
        <div className="flex justify-between items-center">
          {/* Fields dropdown */}
          <div className="relative">
            <button
              className="flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
              onClick={() => setShowFieldsDropdown(!showFieldsDropdown)}
            >
              <span>Champs</span>
              <FiChevronDown className="ml-2" />
            </button>
            {showFieldsDropdown && (
              <div className="absolute z-10 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                <h4 className="font-medium text-sm mb-2">Afficher les champs :</h4>
                <div className="space-y-2 mb-4">
                  {selectedFields.map((field) => (
                    <div key={field.id} className="flex items-center">
                      <button
                        className="mr-2 focus:outline-none"
                        onClick={() => toggleField(field.id)}
                      >
                        {field.checked ? (
                          <FiCheckSquare className="text-indigo-600" />
                        ) : (
                          <FiSquare className="text-gray-400" />
                        )}
                      </button>
                      <span className="text-sm">{field.label}</span>
                    </div>
                  ))}
                </div>
                <h4 className="font-medium text-sm mb-2">
                  Afficher les propriétés :
                </h4>
                <div className="space-y-2 mb-4">
                  {selectedProperties.map((property) => (
                    <div key={property.id} className="flex items-center">
                      <button
                        className="mr-2 focus:outline-none"
                        onClick={() => toggleProperty(property.id)}
                      >
                        {property.checked ? (
                          <FiCheckSquare className="text-indigo-600" />
                        ) : (
                          <FiSquare className="text-gray-400" />
                        )}
                      </button>
                      <span className="text-sm">{property.label}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-3 mt-2">
                  <button className="text-sm text-indigo-600 hover:text-indigo-800">
                    Sauvegarder le filtre en tant que modèle
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleSelectAll}
            className="flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
          >
            {selectAll ? (
              <FiCheckSquare className="mr-2 text-indigo-600" />
            ) : (
              <FiSquare className="mr-2 text-gray-400" />
            )}
            <span>Tout sélectionner</span>
          </button>
        </div>

        {/* Prospects Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Make the table scrollable on small screens */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="w-10 px-4 py-3 text-left">
                    <button onClick={handleSelectAll} className="focus:outline-none">
                      {selectAll ? (
                        <FiCheckSquare className="text-indigo-600" />
                      ) : (
                        <FiSquare className="text-gray-400" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    # Lead ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    First name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone number
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Zip code
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    E-mail
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mobile phone number
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {prospectsData.map((prospect, index) => (
                  <tr
                    key={prospect.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button
                        className="focus:outline-none"
                        onClick={() => toggleRowSelection(prospect.id)}
                      >
                        {selectedRows.includes(prospect.id) ? (
                          <FiCheckSquare className="text-indigo-600" />
                        ) : (
                          <FiSquare className="text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {prospect.id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {prospect.firstName}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {prospect.lastName}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {prospect.phoneNumber}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {prospect.companyName}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {prospect.zipCode}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {prospect.address}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">
                      {prospect.description}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600">
                      {prospect.email}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {prospect.mobilePhoneNumber}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <button className="text-gray-500 hover:text-gray-700">
                        <FiMoreVertical />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Précédent
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Suivant
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Affichage de{" "}
                  <span className="font-medium">1</span> à{" "}
                  <span className="font-medium">5</span> sur{" "}
                  <span className="font-medium">50</span> résultats
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Précédent
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-indigo-50 text-sm font-medium text-indigo-600 hover:bg-gray-50">
                    2
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    3
                  </button>
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    ...
                  </span>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    10
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Suivant
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
