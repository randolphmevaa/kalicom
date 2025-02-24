// app/dashboard/pbx/tableau-de-bord/page.tsx
'use client';

import {  useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,LineChart, Line, CartesianGrid, RadialBarChart, RadialBar } from 'recharts';
import { motion } from 'framer-motion';
import { FiPhoneCall, FiVoicemail, FiUsers, FiServer, FiSettings, FiGlobe, FiActivity,  } from 'react-icons/fi';
import dynamic from 'next/dynamic';

const WorldMap = dynamic(() => import('react-svg-worldmap'), { ssr: false });

const callData = [
  { heure: '08:00', appels: 45, durée: 4.2, taux: 92 },
  { heure: '10:00', appels: 78, durée: 3.8, taux: 89 },
  { heure: '12:00', appels: 125, durée: 5.1, taux: 95 },
  { heure: '14:00', appels: 156, durée: 4.9, taux: 91 },
  { heure: '16:00', appels: 134, durée: 4.5, taux: 93 },
  { heure: '18:00', appels: 89, durée: 3.9, taux: 88 },
];

const countries = [
  { country: 'fr', value: 1560 },
  { country: 'us', value: 2345 },
  { country: 'de', value: 890 },
  { country: 'jp', value: 670 },
];

export default function PBXDashboard() {
  const [activeCalls ] = useState([
    { id: 1, number: '+33 6 12 34 56 78', duration: '00:02:45', status: 'answered', location: 'Paris' },
    { id: 2, number: '+1 212 555 0199', duration: '00:01:23', status: 'ringing', location: 'New York' },
    { id: 3, number: '+49 30 12345678', duration: '00:04:12', status: 'onHold', location: 'Berlin' },
  ]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20  min-h-screen"
    >
      <div className="max-w-7xl mx-auto space-y-8">

        {/* En-tête Premium */}
        <div className="flex justify-between items-center p-6 bg-white rounded-2xl shadow-2xl">
          <div>
            <motion.h1 
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-3xl font-bold text-indigo-700 drop-shadow-md"
            >
              Centre de Contrôle PBX
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">Gestion en temps réel de votre infrastructure téléphonique</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-xl">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-emerald-600">Système optimal</span>
            </div>
            <button className="p-2 hover:bg-gray-200 rounded-xl transition">
              <FiSettings className="text-gray-600 w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Métriques Clés */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <DashboardCard 
            title="Appels Actifs"
            value={activeCalls.length}
            icon={<FiPhoneCall className="w-6 h-6 text-blue-600" />}
            trend="+8.3%"
            chart={
              <ResponsiveContainer width="100%" height={80}>
                <LineChart data={callData}>
                  <Line 
                    type="monotone" 
                    dataKey="appels" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            }
          />

          <DashboardCard
            title="File d'Attente"
            value="12"
            icon={<FiUsers className="w-6 h-6 text-purple-600" />}
            trend="-2.1%"
            chart={
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute w-12 h-12 bg-purple-100 rounded-full" />
                <div className="text-lg font-bold text-purple-600">12</div>
              </div>
            }
          />

          <DashboardCard
            title="IVR Actif"
            value="98.7%"
            icon={<FiVoicemail className="w-6 h-6 text-emerald-600" />}
            trend="+0.3%"
            chart={
              <ResponsiveContainer width="100%" height={80}>
                <RadialBarChart innerRadius="80%" outerRadius="100%" data={[{ value: 98.7 }]}>
                  <RadialBar background dataKey="value" fill="#34d399" />
                </RadialBarChart>
              </ResponsiveContainer>
            }
          />

          <DashboardCard
            title="SLA Respecté"
            value="99.99%"
            icon={<FiActivity className="w-6 h-6 text-cyan-600" />}
            trend="Stable"
            chart={
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-2xl font-bold text-cyan-600">99.99%</div>
              </div>
            }
          />
        </div>

        {/* Répartition Géographique Box */}
        <div className="bg-white p-6 rounded-2xl shadow-2xl transform hover:scale-30 transition duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-700">Répartition Géographique</h3>
            <span className="text-sm text-gray-500">Mise à jour en temps réel</span>
          </div>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="h-96">
              <WorldMap
                color="#3b82f6"
                value-suffix="appels"
                size="responsive"
                data={countries}
                backgroundColor="rgba(255,255,255,0)"
                borderColor="#e2e8f0"
              />
            </div>
          </div>
        </div>

        {/* Analytics Avancés */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-2xl">
            <h3 className="text-xl text-gray-500 font-semibold mb-6">Performance des Appels</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={callData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="heure" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid rgba(0, 0, 0, 0.05)',
                      borderRadius: '12px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="appels" 
                    fill="#3b82f6"
                    radius={[8, 8, 0, 0]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="taux" 
                    stroke="#34d399" 
                    strokeWidth={2}
                    dot={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Santé du Système */}
          <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-6 rounded-2xl shadow-2xl text-white">
            <h3 className="text-xl font-semibold mb-6">Diagnostic Système</h3>
            <div className="grid grid-cols-2 gap-6">
              <SystemHealthIndicator 
                label="Qualité VoIP"
                value={98.7}
                color="#34d399"
                icon={<FiPhoneCall className="w-5 h-5" />}
              />
              <SystemHealthIndicator
                label="Charge Serveurs"
                value={32}
                color="#3b82f6"
                icon={<FiServer className="w-5 h-5" />}
              />
              <SystemHealthIndicator
                label="Stockage"
                value={78}
                color="#f59e0b"
                icon={<FiActivity className="w-5 h-5" />}
              />
              <SystemHealthIndicator
                label="Latence Moyenne"
                value={28}
                color="#a855f7"
                icon={<FiGlobe className="w-5 h-5" />}
                suffix="ms"
              />
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

// Define prop types for DashboardCard
interface DashboardCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend: string;
  chart: React.ReactNode;
}

// Update DashboardCard to use the defined types
const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, trend, chart }) => (
  <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-2xl shadow-xl transition hover:shadow-2xl">
    <div className="flex justify-between items-start">
      <div>
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-opacity-20 rounded-lg">{icon}</div>
          <span className="text-sm font-medium text-gray-500">{title}</span>
        </div>
        <div className="text-3xl font-bold text-gray-900">{value}</div>
      </div>
      <span className={`text-sm ${trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
        {trend}
      </span>
    </div>
    <div className="h-20 mt-4">{chart}</div>
  </motion.div>
);

// Define prop types for SystemHealthIndicator
interface SystemHealthIndicatorProps {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
  suffix?: string;
}

// Update SystemHealthIndicator to use the defined types
const SystemHealthIndicator: React.FC<SystemHealthIndicatorProps> = ({
  label,
  value,
  color,
  icon,
  suffix = '%',
}) => (
  <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center space-x-2">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      <span className="font-bold">
        {value}
        {suffix}
      </span>
    </div>
    <div className="w-full bg-white/20 rounded-full h-2">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8 }}
        className="h-2 rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  </div>
);
