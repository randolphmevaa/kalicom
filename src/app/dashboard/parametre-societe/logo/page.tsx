'use client';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FiImage, 
  FiUpload,
  FiDownload,
  FiEdit2,
  FiScissors,
  FiCopy,
  FiTrash2,
  FiInfo,
  FiGrid,
  FiPlus,
  FiMinus
} from 'react-icons/fi';
import Image from 'next/image';

export default function LogoManagement() {
  // State to track if a logo exists
  const [hasLogo, setHasLogo] = useState<boolean>(true);
  
  // State for preview size
  const [previewSize, setPreviewSize] = useState<number>(80); // percentage of container
  
  // Reference to the file input
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real application, you would upload the file to your server here
      console.log('File selected:', file.name);
      setHasLogo(true);
      
      // Reset the input to allow uploading the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  // Trigger file input click
  const triggerFileInput = (): void => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle logo export/download
  const handleExport = (): void => {
    // In a real application, you would generate a download link to the server file
    console.log('Exporting logo');
    // This is just a placeholder, in a real app you would create a download link
    const link = document.createElement('a');
    link.href = '/path/to/logo/Artboard 1.svg'; // Replace with actual path
    link.download = 'company-logo.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Handle image editing functions
  const handleEdit = (): void => {
    console.log('Edit/Retouch logo');
    // In a real app, this would open an image editor or apply filters
  };
  
  const handleCut = (): void => {
    console.log('Cut logo');
    // In a real app, this would handle cutting the image
  };
  
  const handleCopy = (): void => {
    console.log('Copy logo');
    // In a real app, this would copy the image to clipboard
  };
  
  const handlePaste = (): void => {
    console.log('Paste from clipboard');
    // In a real app, this would handle pasting from clipboard
  };
  
  const handleDelete = (): void => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer le logo?')) {
      console.log('Delete logo');
      setHasLogo(false);
    }
  };
  
  // Handle zoom in/out
  const handleZoomIn = (): void => {
    setPreviewSize(prev => Math.min(prev + 10, 100));
  };
  
  const handleZoomOut = (): void => {
    setPreviewSize(prev => Math.max(prev - 10, 40));
  };
  
  // Handle reset zoom
  const handleResetZoom = (): void => {
    setPreviewSize(80);
  };

  // Animation variants for header
  const headerVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen bg-gray-50"
    >
      <div className="max-w-5xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8 pb-16">
        {/* New Header with gradient styling */}
        <motion.div
          variants={headerVariants}
          initial="initial"
          animate="animate"
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
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-white/70 to-indigo-400/10 rounded-3xl pointer-events-none" />

          {/* Blurred circles for decoration */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative p-8 z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
              <div className="max-w-2xl">
                {/* Title with decorative elements */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <FiImage className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-800 to-indigo-500">
                    Logo
                  </h1>
                </div>
                
                <p className="text-base text-gray-600 leading-relaxed">
                  Personnalisez l&apos;apparence de vos documents grâce à votre logo d&apos;entreprise.
                </p>
              </div>
            </div>
            
            {/* Quick tip */}
            <div className="mt-6 flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl text-sm">
              <FiInfo className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-amber-700">Astuce :</span>{' '}
                <span className="text-amber-700">
                  Un logo de qualité améliore l&apos;image de marque sur vos documents. Utilisez de préférence un format vectoriel (SVG) pour une qualité optimale.
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg mr-4">
                <FiImage className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Gestion du logo</h2>
            </div>
            <p className="text-gray-500 text-sm mt-2 ml-11">
              Vous pouvez ajouter le logo de votre entreprise. Il sera imprimé sur vos documents.
            </p>
          </div>
          
          <div className="p-6">
            {/* File Input (hidden) */}
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden"
              accept=".svg,.png,.jpg,.jpeg"
              onChange={handleFileUpload}
            />
            
            {/* Logo Preview */}
            <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
              {/* Preview Area */}
              <div className="flex-1">
                <div className="border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center p-4 h-72 md:h-96 relative">
                  {hasLogo ? (
                    <div 
                      className="flex items-center justify-center h-full overflow-hidden"
                      style={{ maxWidth: `${previewSize}%`, maxHeight: `${previewSize}%` }}
                    >
                      {/* Display logo with appropriate sizing */}
                      <Image
                        src="/Artboard 1.svg" 
                        alt="Logo de l'entreprise"
                        className="max-w-full max-h-full object-contain" 
                      />
                    </div>
                  ) : (
                    <div className="text-center">
                      <FiImage className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Aucun logo disponible</p>
                      <button
                        onClick={triggerFileInput}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition flex items-center space-x-2 mx-auto"
                      >
                        <FiUpload className="w-4 h-4" />
                        <span>Importer un logo</span>
                      </button>
                    </div>
                  )}
                  
                  {/* Zoom controls */}
                  {hasLogo && (
                    <div className="absolute bottom-4 right-4 flex bg-white rounded-lg shadow-md">
                      <button 
                        onClick={handleZoomOut}
                        className="p-2 hover:bg-gray-100 rounded-l-lg"
                        title="Réduire"
                      >
                        <FiMinus className="w-4 h-4 text-gray-600" />
                      </button>
                      <button 
                        onClick={handleResetZoom}
                        className="p-2 hover:bg-gray-100 border-l border-r border-gray-200"
                        title="Réinitialiser le zoom"
                      >
                        <FiGrid className="w-4 h-4 text-gray-600" />
                      </button>
                      <button 
                        onClick={handleZoomIn}
                        className="p-2 hover:bg-gray-100 rounded-r-lg"
                        title="Agrandir"
                      >
                        <FiPlus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Preview Controls */}
                {hasLogo && (
                  <div className="mt-4 flex justify-center">
                    <button 
                      onClick={handleExport} 
                      className="px-3 py-2 flex items-center space-x-1 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      <FiDownload className="w-4 h-4" />
                      <span>Télécharger le logo</span>
                    </button>
                  </div>
                )}
              </div>
              
              {/* Edit Controls - now always visible */}
              <div className="md:w-72 space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-700 mb-3">Actions</h3>
                  
                  {/* Upload button */}
                  <button
                    onClick={triggerFileInput}
                    className="w-full mb-3 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center justify-center space-x-2"
                  >
                    <FiUpload className="w-5 h-5" />
                    <span>{hasLogo ? 'Remplacer le logo' : 'Importer un logo'}</span>
                  </button>
                  
                  {/* Edit actions */}
                  {hasLogo && (
                    <>
                      <button
                        onClick={handleEdit}
                        className="w-full mb-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center space-x-2"
                      >
                        <FiEdit2 className="w-4 h-4" />
                        <span>Retoucher</span>
                      </button>
                      
                      <button
                        onClick={handleCut}
                        className="w-full mb-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center space-x-2"
                      >
                        <FiScissors className="w-4 h-4" />
                        <span>Couper</span>
                      </button>
                      
                      <button
                        onClick={handleCopy}
                        className="w-full mb-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center space-x-2"
                      >
                        <FiCopy className="w-4 h-4" />
                        <span>Copier</span>
                      </button>
                      
                      <button
                        onClick={handlePaste}
                        className="w-full mb-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center space-x-2"
                      >
                        <FiCopy className="w-4 h-4" />
                        <span>Coller</span>
                      </button>
                      
                      <button
                        onClick={handleDelete}
                        className="w-full px-4 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition flex items-center space-x-2"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        <span>Supprimer</span>
                      </button>
                    </>
                  )}
                </div>
                
                {/* File info */}
                {hasLogo && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-700 mb-2 flex items-center">
                      <FiInfo className="w-4 h-4 mr-2" />
                      Informations
                    </h3>
                    <ul className="text-sm text-blue-800 space-y-1.5">
                      <li>Nom: Artboard 1.svg</li>
                      <li>Type: Image SVG</li>
                      <li>Dimensions: Vectoriel</li>
                      <li>Date d&apos;ajout: 15/03/2025</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            {/* Best Practices */}
            <div className="mt-8 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="flex items-start">
                <div className="p-1.5 bg-indigo-100 rounded-lg mr-3 mt-0.5">
                  <FiInfo className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800 mb-1">
                    Recommandations pour votre logo
                  </h3>
                  <ul className="text-xs text-gray-600 space-y-1 ml-5 list-disc">
                    <li>Utilisez de préférence un format vectoriel (SVG) pour une qualité optimale</li>
                    <li>Dimensions recommandées: 400×200 pixels minimum</li>
                    <li>Assurez-vous que le logo est lisible en petit format</li>
                    <li>Optez pour un fond transparent pour une meilleure intégration sur vos documents</li>
                    <li>Vérifiez l&apos;apparence de votre logo sur un document de test avant de l&apos;utiliser officiellement</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}