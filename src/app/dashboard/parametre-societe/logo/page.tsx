'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiImage, 
  FiUpload, 
  FiDownload, 
  FiEye, 
  FiTrash2, 
  FiCopy, 
  FiEdit,
  // FiPlus,
  // FiCheck,
  FiX,
  FiInfo,
  // FiSettings,
  // FiAlertTriangle,
  FiRefreshCw,
  FiGrid,
  FiList,
  // FiMoon,
  // FiSun,
  FiZap,
  // FiCamera,
  // FiLayers,
  // FiCrop,
  FiCompass,
  // FiShield
} from 'react-icons/fi';

export default function Logo() {
  // State for active tab and view options
  const [activeTab, setActiveTab] = useState('logos');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedLogoId, setSelectedLogoId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  
  // Sample logo data
  const logosData = [
    {
      id: 'LOGO-001',
      name: 'Logo principal',
      fileName: 'logo-principal.svg',
      format: 'SVG',
      type: 'Principal',
      dateCreation: '10/01/2024',
      dimensions: 'Vectoriel',
      taille: '24 Ko',
      couleur: 'Full color',
      version: '1.0',
      tags: ['officiel', 'principal', 'vectoriel'],
      url: '/images/logo-principal.svg',
      previewUrl: '/images/logo-principal-preview.png',
      fond: 'Transparent',
      description: 'Logo principal au format vectoriel pour toutes utilisations'
    },
    {
      id: 'LOGO-002',
      name: 'Logo horizontal',
      fileName: 'logo-horizontal.svg',
      format: 'SVG',
      type: 'Variante',
      dateCreation: '10/01/2024',
      dimensions: 'Vectoriel',
      taille: '22 Ko',
      couleur: 'Full color',
      version: '1.0',
      tags: ['officiel', 'horizontal', 'vectoriel'],
      url: '/images/logo-horizontal.svg',
      previewUrl: '/images/logo-horizontal-preview.png',
      fond: 'Transparent',
      description: 'Version horizontale du logo pour en-têtes et signatures'
    },
    {
      id: 'LOGO-003',
      name: 'Logo monochrome',
      fileName: 'logo-monochrome.svg',
      format: 'SVG',
      type: 'Variante',
      dateCreation: '15/01/2024',
      dimensions: 'Vectoriel',
      taille: '18 Ko',
      couleur: 'Monochrome',
      version: '1.0',
      tags: ['monochrome', 'vectoriel', 'impression'],
      url: '/images/logo-monochrome.svg',
      previewUrl: '/images/logo-monochrome-preview.png',
      fond: 'Transparent',
      description: 'Version monochrome pour impression en noir et blanc'
    },
    {
      id: 'LOGO-004',
      name: 'Logo favicon',
      fileName: 'favicon.png',
      format: 'PNG',
      type: 'Web',
      dateCreation: '15/01/2024',
      dimensions: '32x32 px',
      taille: '4 Ko',
      couleur: 'Full color',
      version: '1.0',
      tags: ['web', 'favicon', 'icône'],
      url: '/images/favicon.png',
      previewUrl: '/images/favicon.png',
      fond: 'Transparent',
      description: 'Icône de site web (favicon)'
    },
    {
      id: 'LOGO-005',
      name: 'Logo haute résolution',
      fileName: 'logo-highres.png',
      format: 'PNG',
      type: 'HD',
      dateCreation: '20/01/2024',
      dimensions: '2000x2000 px',
      taille: '1.2 Mo',
      couleur: 'Full color',
      version: '1.0',
      tags: ['haute-résolution', 'print', 'marketing'],
      url: '/images/logo-highres.png',
      previewUrl: '/images/logo-highres-preview.png',
      fond: 'Transparent',
      description: 'Version haute résolution pour l\'impression et le marketing'
    },
    {
      id: 'LOGO-006',
      name: 'Logo noir',
      fileName: 'logo-black.svg',
      format: 'SVG',
      type: 'Variante',
      dateCreation: '25/01/2024',
      dimensions: 'Vectoriel',
      taille: '20 Ko',
      couleur: 'Noir',
      version: '1.0',
      tags: ['noir', 'vectoriel', 'impression'],
      url: '/images/logo-black.svg',
      previewUrl: '/images/logo-black-preview.png',
      fond: 'Transparent',
      description: 'Version noire sur fond transparent pour impression'
    },
    {
      id: 'LOGO-007',
      name: 'Logo blanc',
      fileName: 'logo-white.svg',
      format: 'SVG',
      type: 'Variante',
      dateCreation: '25/01/2024',
      dimensions: 'Vectoriel',
      taille: '20 Ko',
      couleur: 'Blanc',
      version: '1.0',
      tags: ['blanc', 'vectoriel', 'fonds-sombres'],
      url: '/images/logo-white.svg',
      previewUrl: '/images/logo-white-preview.png',
      fond: 'Sombre',
      description: 'Version blanche sur fond sombre'
    },
    {
      id: 'LOGO-008',
      name: 'Logo réseaux sociaux',
      fileName: 'logo-social-media.png',
      format: 'PNG',
      type: 'Web',
      dateCreation: '01/02/2024',
      dimensions: '1200x1200 px',
      taille: '280 Ko',
      couleur: 'Full color',
      version: '1.0',
      tags: ['réseaux-sociaux', 'web', 'marketing'],
      url: '/images/logo-social-media.png',
      previewUrl: '/images/logo-social-media-preview.png',
      fond: 'Transparent',
      description: 'Version optimisée pour les réseaux sociaux'
    }
  ];

  // Sample icons data
  const iconsData = [
    {
      id: 'ICON-001',
      name: 'Icône App Mobile',
      fileName: 'app-icon.png',
      format: 'PNG',
      type: 'App',
      dateCreation: '05/02/2024',
      dimensions: '512x512 px',
      taille: '45 Ko',
      couleur: 'Full color',
      version: '1.0',
      tags: ['app', 'mobile', 'icône'],
      url: '/images/app-icon.png',
      previewUrl: '/images/app-icon-preview.png',
      fond: 'Carré arrondi',
      description: 'Icône pour application mobile'
    },
    {
      id: 'ICON-002',
      name: 'Icône Document',
      fileName: 'doc-icon.svg',
      format: 'SVG',
      type: 'Document',
      dateCreation: '10/02/2024',
      dimensions: 'Vectoriel',
      taille: '12 Ko',
      couleur: 'Full color',
      version: '1.0',
      tags: ['document', 'vectoriel', 'icône'],
      url: '/images/doc-icon.svg',
      previewUrl: '/images/doc-icon-preview.png',
      fond: 'Transparent',
      description: 'Icône pour les documents officiels'
    },
    {
      id: 'ICON-003',
      name: 'Favicon ICO',
      fileName: 'favicon.ico',
      format: 'ICO',
      type: 'Web',
      dateCreation: '15/02/2024',
      dimensions: 'Multiple',
      taille: '8 Ko',
      couleur: 'Full color',
      version: '1.0',
      tags: ['favicon', 'web', 'navigateur'],
      url: '/images/favicon.ico',
      previewUrl: '/images/favicon-preview.png',
      fond: 'Transparent',
      description: 'Favicon au format ICO pour compatibilité navigateurs'
    },
    {
      id: 'ICON-004',
      name: 'Icône Email',
      fileName: 'email-icon.png',
      format: 'PNG',
      type: 'Email',
      dateCreation: '20/02/2024',
      dimensions: '200x200 px',
      taille: '15 Ko',
      couleur: 'Full color',
      version: '1.0',
      tags: ['email', 'signature', 'icône'],
      url: '/images/email-icon.png',
      previewUrl: '/images/email-icon-preview.png',
      fond: 'Transparent',
      description: 'Icône pour signatures email'
    }
  ];

  // Statistics
  const logoStatistics = [
    { title: "Total logos", value: logosData.length, icon: <FiImage className="text-blue-500" /> },
    { title: "Formats vectoriels", value: logosData.filter(logo => logo.format === 'SVG').length, icon: <FiZap className="text-green-500" /> },
    { title: "Formats bitmap", value: logosData.filter(logo => ['PNG', 'JPG'].includes(logo.format)).length, icon: <FiGrid className="text-amber-500" /> },
    { title: "Total icônes", value: iconsData.length, icon: <FiCompass className="text-indigo-500" /> }
  ];

  // Function to get logo or icon data based on active tab
  const getActiveData = () => activeTab === 'logos' ? logosData : iconsData;

  // Function to get selected logo or icon
  const getSelectedItem = () => {
    if (!selectedLogoId) return null;
    return getActiveData().find(item => item.id === selectedLogoId);
  };

  // Color for format badge
  const getFormatColor = (format: string): string => {
    switch(format) {
      case 'SVG':
        return 'bg-green-100 text-green-800';
      case 'PNG':
        return 'bg-blue-100 text-blue-800';
      case 'JPG':
        return 'bg-amber-100 text-amber-800';
      case 'ICO':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Simulated upload function
  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      // Here you would typically add the new logo to the logosData array
    }, 2000);
  };

  // Use selected item with optional chaining to avoid null errors
  const selectedItem = getSelectedItem();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center p-6 bg-white rounded-2xl shadow-xl">
          <div>
            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-3xl font-bold text-indigo-700 drop-shadow-md"
            >
              Paramètres de la Société
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">
              Gérez les logos, icônes et autres paramètres de votre société
            </p>
          </div>
          <div className="p-2 bg-indigo-100 rounded-lg">
            <FiImage className="w-6 h-6 text-indigo-600" />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Logo List */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b">
                <button
                  className={`flex-1 py-4 text-center font-medium transition ${
                    activeTab === 'logos'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => {
                    setActiveTab('logos');
                    setSelectedLogoId(null);
                  }}
                >
                  Logos
                </button>
                <button
                  className={`flex-1 py-4 text-center font-medium transition ${
                    activeTab === 'icons'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => {
                    setActiveTab('icons');
                    setSelectedLogoId(null);
                  }}
                >
                  Icônes
                </button>
              </div>

              {/* Statistics */}
              <div className="p-6 border-b">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {logoStatistics.map((stat, index) => (
                    <div key={index} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                      <div className="flex items-center mb-2">
                        <div className="p-2 bg-indigo-50 rounded-lg mr-2">
                          {stat.icon}
                        </div>
                        <span className="text-sm font-medium text-gray-500">{stat.title}</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions & View Options */}
              <div className="p-6 border-b">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={handleUpload}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center"
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <FiRefreshCw className="animate-spin mr-2" />
                          <span>Téléchargement...</span>
                        </>
                      ) : (
                        <>
                          <FiUpload className="mr-2" />
                          <span>Télécharger un {activeTab === 'logos' ? 'logo' : 'icône'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* View Options */}
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}
                    >
                      <FiGrid />
                    </button>
                    <button 
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}
                    >
                      <FiList />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Instructions */}
              {showInstructions && (
                <div className="m-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <FiInfo className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Conseils d&apos;utilisation</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Utilisez des formats SVG pour les logos qui doivent être redimensionnés</li>
                          <li>Pour le web, privilégiez des formats légers (PNG avec fond transparent)</li>
                          <li>Cliquez sur un logo pour voir ses détails et options de téléchargement</li>
                        </ul>
                      </div>
                    </div>
                    <div className="ml-auto pl-3">
                      <button
                        onClick={() => setShowInstructions(false)}
                        className="-mx-1.5 -my-1.5 p-1.5 text-blue-500 hover:text-blue-700 rounded-lg"
                      >
                        <FiX className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Logo Grid/List View */}
              <div className="p-6">
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getActiveData().map((item) => (
                      <div 
                        key={item.id}
                        className={`bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer ${selectedLogoId === item.id ? 'ring-2 ring-indigo-500' : ''}`}
                        onClick={() => setSelectedLogoId(item.id)}
                      >
                        <div className="p-4 h-44 flex items-center justify-center bg-gray-50">
                          <div 
                            className="relative w-full h-full flex items-center justify-center"
                            style={{
                              backgroundImage: item.fond === 'Sombre' ? 'linear-gradient(to bottom right, #1e293b, #334155)' : ''
                            }}
                          >
                            <img 
                              src="/api/placeholder/200/200" 
                              alt={item.name}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                              <p className="text-sm text-gray-500 mt-1">{item.dimensions}</p>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFormatColor(item.format)}`}>
                              {item.format}
                            </span>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {item.tags.slice(0, 3).map((tag, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="overflow-hidden border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nom
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Format
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Dimensions
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Taille
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {getActiveData().map((item) => (
                          <tr 
                            key={item.id}
                            className={`hover:bg-gray-50 cursor-pointer ${selectedLogoId === item.id ? 'bg-indigo-50' : ''}`}
                            onClick={() => setSelectedLogoId(item.id)}
                          >
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded flex items-center justify-center">
                                  <img 
                                    src="/api/placeholder/32/32" 
                                    alt={item.name}
                                    className="max-h-full max-w-full"
                                  />
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                  <div className="text-xs text-gray-500">{item.fileName}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFormatColor(item.format)}`}>
                                {item.format}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {item.dimensions}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {item.taille}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {item.dateCreation}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                <button className="p-1 text-gray-400 hover:text-blue-600">
                                  <FiEye />
                                </button>
                                <button className="p-1 text-gray-400 hover:text-green-600">
                                  <FiDownload />
                                </button>
                                <button className="p-1 text-gray-400 hover:text-indigo-600">
                                  <FiEdit />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Logo Details */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full">
              {selectedLogoId ? (
                <div className="h-full flex flex-col">
                  <div className="p-6 border-b">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-800">{selectedItem?.name}</h2>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 hover:text-indigo-600">
                          <FiEdit />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600">
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-8 rounded-lg flex items-center justify-center mb-4">
                      <div 
                        className="relative w-full h-36 flex items-center justify-center"
                        style={{
                          backgroundImage: selectedItem?.fond === 'Sombre' ? 'linear-gradient(to bottom right, #1e293b, #334155)' : '',
                          borderRadius: '0.5rem'
                        }}
                      >
                        <img 
                          src="/api/placeholder/200/200" 
                          alt={selectedItem?.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <button className="flex items-center justify-center space-x-2 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                        <FiDownload />
                        <span>Télécharger</span>
                      </button>
                      <button className="flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition">
                        <FiCopy />
                        <span>Copier le lien</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6 overflow-y-auto flex-grow">
                    <h3 className="text-sm uppercase text-gray-500 mb-3">Informations</h3>
                    
                    <dl className="space-y-3">
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Format</dt>
                        <dd className="text-sm font-medium">{selectedItem?.format}</dd>
                      </div>
                      
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Dimensions</dt>
                        <dd className="text-sm font-medium">{selectedItem?.dimensions}</dd>
                      </div>
                      
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Taille</dt>
                        <dd className="text-sm font-medium">{selectedItem?.taille}</dd>
                      </div>
                      
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Date de création</dt>
                        <dd className="text-sm font-medium">{selectedItem?.dateCreation}</dd>
                      </div>
                      
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Fond</dt>
                        <dd className="text-sm font-medium">{selectedItem?.fond}</dd>
                      </div>
                      
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Couleur</dt>
                        <dd className="text-sm font-medium">{selectedItem?.couleur}</dd>
                      </div>
                      
                      <div className="pt-3">
                        <dt className="text-sm text-gray-500 mb-1">Description</dt>
                        <dd className="text-sm">{selectedItem?.description}</dd>
                      </div>
                      
                      <div className="pt-3">
                        <dt className="text-sm text-gray-500 mb-1">Tags</dt>
                        <dd className="flex flex-wrap gap-1 pt-1">
                          {selectedItem?.tags.map((tag, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              {tag}
                            </span>
                          ))}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              ) : (
                <div className="p-6 flex items-center justify-center h-full">
                  <p className="text-gray-500">Sélectionnez un logo ou une icône pour voir les détails</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
