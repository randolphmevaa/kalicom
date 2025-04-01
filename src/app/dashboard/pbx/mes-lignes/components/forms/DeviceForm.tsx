// app/dashboard/pbx/mes-lignes/components/forms/DeviceForm.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiChevronDown } from 'react-icons/fi';
import { Device } from '../../models/types';
import Breadcrumbs from '../Breadcrumbs';

interface DeviceFormProps {
  device?: Device;
  onClose: () => void;
}

const DeviceForm: React.FC<DeviceFormProps> = ({ device, onClose }) => {
  const isEditing = !!device;
  const [formData, setFormData] = useState(
    device || {
      id: 0,
      macAddress: '',
      label: '',
      model: '',
      line: '',
      deviceUrl: '',
      status: 'Offline' as const,
      lastSeen: new Date().toISOString(),
    }
  );
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Appareil ${isEditing ? 'modifié' : 'créé'} avec succès!`);
    onClose();
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-gray-700 pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 pb-12"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header with breadcrumbs */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <button onClick={onClose} className="flex items-center text-[#004AC8] hover:text-[#1B0353] transition-colors">
              <FiArrowLeft className="mr-2" />
              Retour
            </button>
          </div>
          <Breadcrumbs items={['PBX', 'Devices', isEditing ? 'Modifier' : 'Ajouter']} />
        </div>
        
        {/* Device Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200"
        >
          <h2 className="text-2xl font-bold text-[#1B0353] mb-6">{isEditing ? 'Modifier' : 'Ajouter'} un appareil</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mes lignes</label>
              <div className="relative">
                <select
                  name="line"
                  value={formData.line}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                >
                  <option value="101">101 - Accueil</option>
                  <option value="102">102 - Support</option>
                  <option value="103">103 - Commercial</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-[#1B0353] pt-4">Device data</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse Mac *</label>
                <input
                  type="text"
                  name="macAddress"
                  value={formData.macAddress}
                  onChange={handleChange}
                  placeholder="00:1A:2B:3C:4D:5E"
                  pattern="[A-Fa-f0-9:]{17}"
                  required
                  title="The MAC address must be exactly 12 characters long and contain only numbers and letters (A-F)"
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                />
                <p className="text-xs text-gray-500 mt-1">The MAC address must be exactly 12 characters long and contain only numbers and letters (A-F).</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label *</label>
                <input
                  type="text"
                  name="label"
                  value={formData.label}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
                <div className="relative">
                  <select
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                  >
                    <option value="">Sélectionner un modèle</option>
                    <option value="Aastra 6731i">Aastra 6731i</option>
                    <option value="Aastra 6739i">Aastra 6739i</option>
                    <option value="Algo 8180">Algo 8180</option>
                    <option value="Atcom A20">Atcom A20</option>
                    <option value="Grandstream GXP2130">Grandstream GXP2130</option>
                    <option value="Grandstream GXP2170">Grandstream GXP2170</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Device enabled</label>
                <div className="relative">
                  <select
                    name="status"
                    value={formData.status === 'Online' ? 'True' : 'False'}
                    onChange={(e) => setFormData({...formData, status: e.target.value === 'True' ? 'Online' : 'Offline'})}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                  >
                    <option value="True">True</option>
                    <option value="False">False</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-[#1B0353] pt-4">Lines</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Line</label>
                  <div className="relative">
                    <select
                      name="lineNumber"
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                    >
                      {Array.from({ length: 99 }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Server Address</label>
                  <input
                    type="text"
                    name="serverAddress"
                    placeholder="sip.example.com"
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display name</label>
                  <input
                    type="text"
                    name="displayName"
                    placeholder="Nom à afficher"
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                  <input
                    type="text"
                    name="userId"
                    placeholder="user123"
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Auth ID</label>
                  <input
                    type="text"
                    name="authId"
                    placeholder="auth123"
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
                  <input
                    type="number"
                    name="port"
                    placeholder="5060"
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transport</label>
                  <div className="relative">
                    <select
                      name="transport"
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                    >
                      <option value="TCP">TCP</option>
                      <option value="UDP">UDP</option>
                      <option value="TLS">TLS</option>
                      <option value="DNS SRV">DNS SRV</option>
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Register Expires</label>
                  <input
                    type="number"
                    name="registerExpires"
                    placeholder="3600"
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shared Line</label>
                  <div className="relative">
                    <select
                      name="sharedLine"
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                    >
                      <option value="True">True</option>
                      <option value="False">False</option>
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Activé</label>
                  <div className="relative">
                    <select
                      name="enabled"
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                    >
                      <option value="True">True</option>
                      <option value="False">False</option>
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setFormData(device || {
                  id: 0,
                  macAddress: '',
                  label: '',
                  model: '',
                  line: '',
                  deviceUrl: '',
                  status: 'Offline',
                  lastSeen: new Date().toISOString(),
                })}
                className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Réinitialiser
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#004AC8] text-white rounded-xl hover:bg-[#003DA8] transition-colors"
              >
                {isEditing ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DeviceForm;