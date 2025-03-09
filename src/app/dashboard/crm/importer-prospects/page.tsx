'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUpload,  FiUser, FiFolder, FiTag, FiFile, FiPhone, FiToggleRight } from 'react-icons/fi';

export default function ImporterProspects() {
  const [activeTab, setActiveTab] = useState('importer');
  const [currentStep, setCurrentStep] = useState(1);
  const [applyPrefix, setApplyPrefix] = useState(false);
  const [importToDialer, setImportToDialer] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);


  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0].name);
    }
  };
  

  const resetForm = () => {
    setCurrentStep(1);
    setApplyPrefix(false);
    setImportToDialer(false);
    setSelectedFile(null);
  };

  const nextStep = () => {
    setCurrentStep(2);
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  // Sample history data
  const historyData = [
    { id: 1, date: '08/03/2025', time: '09:30', user: 'Marie Dupont', file: 'prospects_mars.csv', count: 145, status: 'Complété' },
    { id: 2, date: '05/03/2025', time: '14:15', user: 'Jean Martin', file: 'leads_q1.csv', count: 78, status: 'Complété' },
    { id: 3, date: '28/02/2025', time: '11:20', user: 'Sophie Leclerc', file: 'contacts_nouveaux.csv', count: 230, status: 'Complété' },
    { id: 4, date: '15/02/2025', time: '16:45', user: 'Thomas Bernard', file: 'contacts_region_sud.csv', count: 67, status: 'Complété' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen"
    >
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center p-6 bg-white rounded-2xl shadow-xl">
          <div>
            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-3xl font-bold text-indigo-700 drop-shadow-md"
            >
              Importer des Prospects
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">
              Importez et gérez vos prospects depuis un fichier CSV.
            </p>
          </div>
          <div className="p-2 bg-indigo-100 rounded-lg">
            <FiUpload className="w-6 h-6 text-indigo-600" />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'importer' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('importer')}
            >
              Importer des prospects
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'historique' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('historique')}
            >
              Historique
            </button>
          </div>

          {/* Import Tab Content */}
          {activeTab === 'importer' && (
            <div className="p-6">
              {/* Step 1: Assign Prospects */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold">
                      1
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Assigner les prospects</h2>
                  </div>
                  
                  <div className="p-5 border border-gray-200 rounded-xl space-y-4">
                    <h3 className="text-lg font-medium text-gray-700">Assigner les prospects de l&apos;importation</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <div className="flex items-center space-x-2">
                            <FiUser className="text-gray-500" />
                            <span>Utilisateur</span>
                          </div>
                        </label>
                        <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
                          <option>Sélectionnez un utilisateur...</option>
                          <option>Marie Dupont</option>
                          <option>Jean Martin</option>
                          <option>Sophie Leclerc</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <div className="flex items-center space-x-2">
                            <FiFolder className="text-gray-500" />
                            <span>Module</span>
                          </div>
                        </label>
                        <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
                          <option>Sélectionnez un module...</option>
                          <option>Ventes</option>
                          <option>Marketing</option>
                          <option>Support</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <div className="flex items-center space-x-2">
                            <FiTag className="text-gray-500" />
                            <span>Tags</span>
                          </div>
                        </label>
                        <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
                          <option>Sélectionnez des tags...</option>
                          <option>Nouveau</option>
                          <option>Chaud</option>
                          <option>Priorité</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={resetForm}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                      Réinitialiser
                    </button>
                    <button
                      onClick={nextStep}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                      Étape suivante
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: File Configuration */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold">
                      2
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Configuration fichier</h2>
                  </div>
                  
                  <div className="p-5 border border-gray-200 rounded-xl space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-700 mb-3">Sélectionnez votre fichier</h3>
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-500 truncate">
                          {selectedFile || "Sélectionner un fichier..."}
                        </div>
                        <label className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition cursor-pointer">
                          <input type="file" className="hidden" onChange={handleFileSelect} />
                          <div className="flex items-center space-x-2">
                            <FiFile className="text-gray-500" />
                            <span>Parcourir</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-700 mb-3">Configurez votre fichier</h3>
                      <div className="p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
                        <p>
                          Nous vous recommandons d&apos;utiliser la fonction &quot;Appliquer indicatif automatique&quot; afin que les numéros de téléphone respectent la syntaxe recommandée pour le bon fonctionnement de votre CRM. L&apos;indicatif sélectionné sera automatiquement ajouté aux numéros.
                        </p>
                        <p className="mt-2">
                          Si vous avez des numéros de différents pays, vous pouvez importer un fichier par indicatif puis utilisez &quot;Appliquer indicatif automatique&quot; ou formater les numéros avec les bons indicatifs avant l&apos;importation.
                        </p>
                      </div>
                      
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <FiPhone className="text-gray-500" />
                            <span className="text-gray-700">Appliquer indicatif automatique</span>
                          </div>
                          <button 
                            onClick={() => setApplyPrefix(!applyPrefix)}
                            className={`w-12 h-6 flex items-center ${applyPrefix ? 'bg-indigo-600' : 'bg-gray-300'} rounded-full p-1 transition-all duration-300`}
                          >
                            <span 
                              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                                applyPrefix ? 'translate-x-6' : ''
                              }`} 
                            />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <FiToggleRight className="text-gray-500" />
                            <span className="text-gray-700">Importer aussi au Predictive Dialer</span>
                          </div>
                          <button 
                            onClick={() => setImportToDialer(!importToDialer)}
                            className={`w-12 h-6 flex items-center ${importToDialer ? 'bg-indigo-600' : 'bg-gray-300'} rounded-full p-1 transition-all duration-300`}
                          >
                            <span 
                              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                                importToDialer ? 'translate-x-6' : ''
                              }`} 
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between space-x-3 mt-6">
                    <button
                      onClick={prevStep}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                      Retour
                    </button>
                    <div className="flex space-x-3">
                      <button
                        onClick={resetForm}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                      >
                        Réinitialiser
                      </button>
                      <button
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                      >
                        Importer des prospects
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* History Tab Content */}
          {activeTab === 'historique' && (
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 text-left text-sm">
                      <th className="py-3 px-4 font-medium">Date</th>
                      <th className="py-3 px-4 font-medium">Utilisateur</th>
                      <th className="py-3 px-4 font-medium">Fichier</th>
                      <th className="py-3 px-4 font-medium">Nombre</th>
                      <th className="py-3 px-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm">
                    {historyData.map((item) => (
                      <tr key={item.id} className="border-t hover:bg-gray-50 transition">
                        <td className="py-3 px-4">{item.date} {item.time}</td>
                        <td className="py-3 px-4">{item.user}</td>
                        <td className="py-3 px-4 font-medium text-indigo-600">{item.file}</td>
                        <td className="py-3 px-4">{item.count}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
