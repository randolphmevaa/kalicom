'use client';

import { useState } from 'react';
import { motion} from 'framer-motion';
import {
  FiRefreshCw,
  // FiChevronDown,
  // FiChevronUp,
  FiEdit,
  FiTrash2,
  FiMail,
  // FiUserCheck,
  // FiServer,
} from 'react-icons/fi';

// ------------------ Sample Interfaces & Data ------------------

interface Enregistrement {
  id: number;
  utilisateur1: string;
  utilisateur2: string;
  lanIP: string;
  ip: string;
  port: number;
  hote: string;
  statut: 'En ligne' | 'Hors ligne';
  ping: string; // e.g. "25ms"
}

interface EmailRow {
  id: number;
  envoye: string; // e.g. "10/10/2023 09:15"
  type: string;
  statut: 'Envoyé' | 'En cours' | 'Échec';
  reference: string;
}

const sampleEnregistrements: Enregistrement[] = [
  {
    id: 1,
    utilisateur1: 'Alice',
    utilisateur2: 'Account 101',
    lanIP: '192.168.1.10',
    ip: '203.0.113.5',
    port: 5060,
    hote: 'sip.provider.com',
    statut: 'En ligne',
    ping: '27ms',
  },
  {
    id: 2,
    utilisateur1: 'Bob',
    utilisateur2: 'Account 102',
    lanIP: '192.168.1.11',
    ip: '203.0.113.10',
    port: 5060,
    hote: 'sip.provider.com',
    statut: 'Hors ligne',
    ping: '-',
  },
];

const sampleEmails: EmailRow[] = [
  {
    id: 1,
    envoye: '2023-10-12 09:30',
    type: 'Notification',
    statut: 'Envoyé',
    reference: 'MSG-1001',
  },
  {
    id: 2,
    envoye: '2023-10-12 10:15',
    type: 'Alerte',
    statut: 'Échec',
    reference: 'MSG-1002',
  },
];

// ------------------ Main Component ------------------
export default function StatutPage() {
  const [activeTab, setActiveTab] = useState<'enregistrement' | 'emails'>(
    'enregistrement'
  );

  // Handler for refresh
  const handleRefresh = () => {
    console.log('Refreshed data');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen"
    >
      <div className="max-w-7xl mx-auto space-y-8 px-4 md:px-0">
        {/* ---------- Header ---------- */}
        <div className="relative mb-8 overflow-hidden bg-white/80 rounded-3xl shadow-2xl border border-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-[#004AC8]/10 to-[#4BB2F6]/10 rounded-3xl pointer-events-none" />
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center p-8 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-[#1B0353]">Statut</h1>
              <p className="text-sm text-gray-600 mt-1">
                Consultez l’état de vos enregistrements et emails
              </p>
            </div>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#004AC8] text-white rounded-xl font-semibold hover:bg-[#003DA8] transition-colors"
            >
              <FiRefreshCw className="w-5 h-5" />
              Actualiser
            </button>
          </div>
        </div>

        {/* ---------- Tabs Navigation ---------- */}
        <div className="relative mb-12">
          {/* Subtle divider below tabs */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#004AC8]/20 to-transparent" />

          <div className="flex gap-6 px-2">
            {['Enregistrement', 'Emails'].map((tab) => {
              const slug = tab.toLowerCase();
              const isActive = activeTab === slug;
              return (
                <motion.button
                  key={tab}
                  onClick={() =>
                    setActiveTab(slug as 'enregistrement' | 'emails')
                  }
                  className="relative py-4"
                >
                  {/* Animated background for active tab */}
                  {isActive && (
                    <motion.div
                      layoutId="tabHighlight"
                      className="absolute inset-0 bg-gradient-to-b from-[#004AC8]/10 to-transparent rounded-t-2xl"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}

                  {/* Tab label */}
                  <div className="relative flex items-center gap-2 px-4">
                    <span
                      className={`text-sm font-semibold transition-colors ${
                        isActive
                          ? 'text-[#004AC8] bg-clip-text bg-gradient-to-r from-[#004AC8] to-[#4BB2F6]'
                          : 'text-gray-600 hover:text-[#1B0353]'
                      }`}
                    >
                      {tab}
                    </span>
                    {/* Active dot */}
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-1.5 h-1.5 bg-[#4BB2F6] rounded-full"
                      />
                    )}
                  </div>

                  {/* Hover underline */}
                  <motion.div
                    initial={false}
                    whileHover={{
                      y: -2,
                      transition: { duration: 0.1 },
                    }}
                    className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                      isActive ? 'bg-[#004AC8]' : 'bg-transparent'
                    }`}
                  />
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ---------- Tab Content ---------- */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === 'enregistrement' ? (
            <EnregistrementTab enregistrements={sampleEnregistrements} />
          ) : (
            <EmailsTab emails={sampleEmails} />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

// ------------------ Enregistrement Tab ------------------
function EnregistrementTab({
  enregistrements,
}: {
  enregistrements: Enregistrement[];
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full min-w-[1000px]">
          <thead className="bg-gradient-to-r from-[#004AC8]/5 to-[#4BB2F6]/5">
            <tr>
              {[
                'Utilisateur',
                'Utilisateur',
                'LAN IP',
                'IP',
                'Port',
                'Hôte',
                'Statut',
                'Ping',
                'Actions',
              ].map((header, idx) => (
                <th
                  key={idx}
                  className="px-6 py-3 text-left text-sm font-semibold text-[#1B0353] first:rounded-tl-xl last:rounded-tr-xl"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/80 text-sm">
            {enregistrements.map((item) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ backgroundColor: '#f8fafc' }}
                className="group transition-colors"
              >
                <td className="px-6 py-4 text-gray-700">{item.utilisateur1}</td>
                <td className="px-6 py-4 text-gray-700">{item.utilisateur2}</td>
                <td className="px-6 py-4 text-gray-700">{item.lanIP}</td>
                <td className="px-6 py-4 text-gray-700">{item.ip}</td>
                <td className="px-6 py-4 text-gray-700">{item.port}</td>
                <td className="px-6 py-4 text-gray-700">{item.hote}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full ${
                      item.statut === 'En ligne'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {item.statut}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-700">{item.ping}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                      title="Modifier"
                    >
                      <FiEdit className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                      title="Supprimer"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
            {enregistrements.length === 0 && (
              <tr>
                <td colSpan={9} className="py-8 text-center text-gray-600">
                  Aucune donnée disponible
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ------------------ Emails Tab ------------------
function EmailsTab({ emails }: { emails: EmailRow[] }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gradient-to-r from-[#004AC8]/5 to-[#4BB2F6]/5">
            <tr>
              {['Envoyé', 'Type', 'Statut', 'Référence', 'Actions'].map(
                (header, idx) => (
                  <th
                    key={idx}
                    className="px-6 py-3 text-left text-sm font-semibold text-[#1B0353] first:rounded-tl-xl last:rounded-tr-xl"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/80 text-sm">
            {emails.map((item) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ backgroundColor: '#f8fafc' }}
                className="group transition-colors"
              >
                <td className="px-6 py-4 text-gray-700">{item.envoye}</td>
                <td className="px-6 py-4 text-gray-700">{item.type}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full ${
                      item.statut === 'Envoyé'
                        ? 'bg-green-100 text-green-800'
                        : item.statut === 'Échec'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {item.statut}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-700">{item.reference}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                      title="Voir l’email"
                    >
                      <FiMail className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                      title="Supprimer"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
            {emails.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-600">
                  Aucune donnée disponible
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
