'use client';
import { motion} from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell, 
  Area,
  AreaChart,
  // Legend
} from 'recharts';
import { 
  FiCalendar, 
  FiPhoneCall, 
  FiClipboard, 
  FiClock, 
  FiUserPlus, 
  FiAward, 
  FiFileText,
  FiDownload,
  FiRefreshCw,
  FiSettings,
  FiChevronRight,
  FiPlusCircle,
  FiTarget,
  FiArrowUpRight,
  FiArrowDownRight,
  FiFlag,
  FiDollarSign,
  FiUsers,
  FiBarChart2,
  FiAlertCircle,
  FiBriefcase,
  FiCheck,
  FiX,
} from 'react-icons/fi';

const prospectData = [
  { name: 'Jan', prospects: 30, leads: 20, clients: 10 },
  { name: 'Feb', prospects: 45, leads: 28, clients: 15 },
  { name: 'Mar', prospects: 60, leads: 35, clients: 22 },
  { name: 'Apr', prospects: 80, leads: 42, clients: 30 },
  { name: 'May', prospects: 75, leads: 50, clients: 35 },
  { name: 'Jun', prospects: 90, leads: 60, clients: 45 },
];

const eventsData = [
  { type: 'Appel', time: '09:30', contact: 'Marie Dupont', status: 'À venir', priority: 'Haute' },
  { type: 'Tâche', time: '11:00', contact: 'Jean Martin', status: 'À venir', priority: 'Moyenne' },
  { type: 'Rendez-vous', time: '14:30', contact: 'Sophie Leclerc', status: 'À venir', priority: 'Haute' },
  { type: 'Appel', time: '16:00', contact: 'Thomas Bernard', status: 'À venir', priority: 'Basse' },
];

const notesData = [
  { time: '08:45', text: 'Suivi nécessaire avec client Acme Corp', author: 'Léa', avatar: '/api/placeholder/30/30' },
  { time: '10:20', text: 'Préparation démo produit pour Nexus Tech', author: 'Marc', avatar: '/api/placeholder/30/30' },
  { time: '13:15', text: 'Relancer proposition commerciale Zenith SA', author: 'Julie', avatar: '/api/placeholder/30/30' },
];

const topSalesData = [
  { name: 'Emma', prospects: 25, value: 56000, color: '#4F46E5' },
  { name: 'Lucas', prospects: 18, value: 42000, color: '#10B981' },
  { name: 'Léa', prospects: 15, value: 38000, color: '#F59E0B' },
];

const conversionData = [
  { name: 'Jan', taux: 24 },
  { name: 'Feb', taux: 28 },
  { name: 'Mar', taux: 26 },
  { name: 'Apr', taux: 32 },
  { name: 'May', taux: 35 },
  { name: 'Jun', taux: 38 },
];

const eventTypeData = [
  { name: 'Appel', value: 12, color: '#4F46E5' },
  { name: 'Tâche', value: 8, color: '#10B981' },
  { name: 'Rendez-vous', value: 5, color: '#F59E0B' },
];

interface CircleStatProps {
  icon: React.ReactNode;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  onClick?: () => void;
}

const CircleStat: React.FC<CircleStatProps> = ({
  icon,
  color,
  size = 'md',
  pulse = false,
  onClick,
}) => {
  const sizeClasses: { [key in 'sm' | 'md' | 'lg']: { container: string; icon: string } } = {
    sm: { container: 'w-12 h-12', icon: 'w-5 h-5' },
    md: { container: 'w-16 h-16', icon: 'w-6 h-6' },
    lg: { container: 'w-20 h-20', icon: 'w-8 h-8' },
  };

  return (
    <motion.div
      whileHover={{ scale: 1.08, rotate: 3 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative ${sizeClasses[size].container} rounded-full flex items-center justify-center shadow-md ${
        onClick ? 'cursor-pointer' : ''
      }`}
      style={{
        backgroundColor: `${color}15`,
        border: `2px solid ${color}50`,
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      }}
    >
      <div className={`${sizeClasses[size].icon} flex items-center justify-center`} style={{ color }}>
        {icon}
      </div>
      {pulse && (
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-30 duration-1000"
          style={{ backgroundColor: color, animationDuration: '3s' }}
        ></span>
      )}
    </motion.div>
  );
};

interface StatsCardProps {
  title: string;
  value: string | number;
  subvalue: string;
  icon: React.ReactNode;
  color: string;
  chart: React.ReactNode;
  trend?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subvalue,
  icon,
  color,
  chart,
  trend = null,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{
        y: -5,
        boxShadow:
          '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }}
      className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white -z-10"></div>
      <div
        className="absolute inset-0 opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)]"
        style={{ backgroundSize: '20px 20px' }}
      ></div>
      <div className="flex items-center space-x-3 mb-4">
        <CircleStat icon={icon} color={color} size="sm" />
        <span className="text-sm font-medium text-gray-700">{title}</span>
      </div>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        {trend && (
          <span
            className={`text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1 ${
              trend.startsWith('+')
                ? 'bg-green-100 text-green-700'
                : trend === 'stable'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {trend.startsWith('+') ? (
              <FiArrowUpRight className="w-3 h-3" />
            ) : trend === 'stable' ? (
              <FiBarChart2 className="w-3 h-3" />
            ) : (
              <FiArrowDownRight className="w-3 h-3" />
            )}
            {trend}
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500 mb-4">{subvalue}</p>
      <div className="h-32 mt-2">{chart}</div>
      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
        <motion.button
          whileHover={{ x: 5 }}
          whileTap={{ x: -2 }}
          className="text-xs text-indigo-600 font-medium flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity"
        >
          Plus de détails <FiChevronRight className="w-3 h-3" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default function CRMTableauDeBord() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen pb-10 bg-gray-50/50"
    >
      <div className="max-w-7xl mx-auto space-y-8 px-4 md:px-6">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="relative overflow-hidden bg-white rounded-2xl shadow-2xl border border-gray-100"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 pointer-events-none"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
          
          {/* Subtle pattern overlay */}
          <div 
            className="absolute inset-0 opacity-10" 
            style={{ 
              backgroundImage: 'radial-gradient(#4F46E5 0.5px, transparent 0.5px), radial-gradient(#A855F7 0.5px, transparent 0.5px)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 10px 10px'
            }}
          ></div>
          
          <div className="relative p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-lg">
                <motion.div 
                  className="flex items-center gap-3 mb-2"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  <div className="p-3 bg-gradient-to-br from-indigo-600/20 to-indigo-600/10 rounded-xl shadow-md">
                    <FiBriefcase className="w-7 h-7 text-indigo-600" />
                  </div>
                  <h1 className="text-3xl font-bold text-indigo-900 drop-shadow-sm">
                    Tableau de Bord CRM
                  </h1>
                </motion.div>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  Suivez vos prospects, visualisez vos performances commerciales et gérez vos activités quotidiennes.
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20 shadow-sm"
                >
                  <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/30 animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">Données en temps réel</span>
                </motion.div>
                
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05, rotate: 15 }}
                    whileTap={{ scale: 0.95, rotate: 30 }}
                    className="p-3 rounded-xl transition-all shadow-md bg-white text-gray-700 hover:bg-gray-50"
                  >
                    <FiRefreshCw className="w-5 h-5" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-white text-gray-700 hover:bg-gray-50 rounded-xl transition-all shadow-md"
                  >
                    <FiSettings className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>
            
            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-8">
              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-gray-100 shadow-md flex items-center gap-4 group hover:border-indigo-200 transition-all duration-300"
              >
                <div className="p-3 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300">
                  <FiUsers className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 group-hover:text-indigo-600 transition-colors">Prospects</div>
                  <div className="text-xl font-bold text-gray-800">458</div>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-gray-100 shadow-md flex items-center gap-4 group hover:border-green-200 transition-all duration-300"
              >
                <div className="p-3 bg-gradient-to-br from-green-100 to-green-50 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300">
                  <FiTarget className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 group-hover:text-green-600 transition-colors">Conversions</div>
                  <div className="text-xl font-bold text-gray-800">32%</div>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-gray-100 shadow-md flex items-center gap-4 group hover:border-purple-200 transition-all duration-300"
              >
                <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300">
                  <FiCalendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 group-hover:text-purple-600 transition-colors">Événements</div>
                  <div className="text-xl font-bold text-gray-800">12</div>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-gray-100 shadow-md flex items-center gap-4 group hover:border-amber-200 transition-all duration-300"
              >
                <div className="p-3 bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300">
                  <FiDollarSign className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 group-hover:text-amber-600 transition-colors">Chiffre d&apos;affaires</div>
                  <div className="text-xl font-bold text-gray-800">132K€</div>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-gray-100 shadow-md flex items-center gap-4 group hover:border-rose-200 transition-all duration-300"
              >
                <div className="p-3 bg-gradient-to-br from-rose-100 to-rose-50 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300">
                  <FiFlag className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 group-hover:text-rose-600 transition-colors">Objectifs</div>
                  <div className="text-xl font-bold text-gray-800">75%</div>
                </div>
              </motion.div>
            </div>

            {/* Download/Export button */}
            <div className="flex justify-end mt-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-600 bg-white/80 rounded-lg border border-gray-200 shadow-sm hover:bg-white hover:text-indigo-600 transition-all"
              >
                <FiDownload className="w-3.5 h-3.5" />
                Exporter les données
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Top metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Statistiques Prospects */}
          <StatsCard
            title="Statistiques Prospects"
            value="458"
            subvalue="Total prospects ajoutés"
            icon={<FiUserPlus />}
            color="#4F46E5"
            trend="+12.5%"
            chart={
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prospectData}>
                  <defs>
                    <linearGradient id="prospectGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#A855F7" stopOpacity={0.6} />
                    </linearGradient>
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#00000010" />
                    </filter>
                  </defs>
                  <XAxis dataKey="name" stroke="#A855F7" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#A855F7" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      border: 'none',
                      padding: '8px'
                    }}
                    labelStyle={{ color: '#4F46E5', fontWeight: 'bold' }}
                  />
                  <Bar 
                    dataKey="prospects" 
                    fill="url(#prospectGradient)" 
                    barSize={18} 
                    radius={[4, 4, 0, 0]} 
                    filter="url(#shadow)"
                  />
                </BarChart>
              </ResponsiveContainer>
            }
          />

          {/* Événements du Calendrier */}
          <StatsCard
            title="Événements du Calendrier"
            value="12"
            subvalue="Prochains événements programmés"
            icon={<FiCalendar />}
            color="#10B981"
            trend="stable"
            chart={
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feFlood floodColor="#00000010" result="color" />
                      <feComposite in="color" in2="blur" operator="in" result="shadow" />
                      <feComposite in="SourceGraphic" in2="shadow" operator="over" />
                    </filter>
                  </defs>
                  <Pie
                    data={eventTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    filter="url(#glow)"
                  >
                    {eventTypeData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        stroke="white"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [
                      <span key="value" className="font-bold">{value}</span>, 
                      <span key="name" className="text-gray-600">{name}</span>
                    ]} 
                    contentStyle={{ 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      border: '1px solid #e2e8f0',
                      padding: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            }
          />

          {/* Taux de Conversion */}
          <StatsCard
            title="Taux de Conversion"
            value="32%"
            subvalue="Moyenne des 6 derniers mois"
            icon={<FiTarget />}
            color="#F59E0B"
            trend="+8.2%"
            chart={
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={conversionData}>
                  <defs>
                    <linearGradient id="conversionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis fontSize={10} tickLine={false} axisLine={false} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      border: 'none',
                      padding: '8px'
                    }}
                    formatter={(value) => [`${value}%`, 'Taux de conversion']}
                    labelStyle={{ color: '#F59E0B', fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="taux" 
                    stroke="#F59E0B" 
                    fillOpacity={1} 
                    fill="url(#conversionGradient)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            }
          />
        </div>

        {/* Second row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Meilleures ventes */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.4, delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl relative overflow-hidden"
          >
            {/* Subtle gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-white -z-10"></div>
            
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)]" 
              style={{ backgroundSize: '20px 20px' }}></div>
            
            <div className="flex items-center space-x-3 mb-5">
              <CircleStat icon={<FiAward />} color="#F59E0B" size="sm" />
              <div>
                <span className="text-sm font-medium text-gray-700">Meilleures ventes</span>
                <div className="text-gray-500 text-xs">Performance de l&apos;équipe</div>
              </div>
            </div>
            
            <div className="text-2xl font-bold text-gray-900 mb-1 flex items-baseline gap-2">
              136K€
              <span className="text-xs px-2 py-1 rounded-full font-semibold bg-green-100 text-green-700 flex items-center gap-1">
                <FiArrowUpRight className="w-3 h-3" />+18.3%
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-5">Chiffre d&apos;affaires total généré ce mois</p>
            
            <div className="space-y-5 mt-6">
              {topSalesData.map((seller, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-center p-3 rounded-xl hover:bg-amber-50/50 transition-colors"
                  whileHover={{ x: 4 }}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center shadow-sm mr-4">
                    <span className="font-semibold text-amber-600">{seller.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-800">{seller.name}</span>
                      <span className="text-sm font-semibold text-gray-800">{seller.value.toLocaleString()}€</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(seller.value / topSalesData[0].value) * 100}%` }}
                        transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: seller.color }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">{seller.prospects} prospects</span>
                      <span className="text-xs text-gray-500">
                        {Math.round((seller.value / topSalesData[0].value) * 100)}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Add subtle divider */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
              <motion.button
                whileHover={{ x: 5 }}
                whileTap={{ x: -2 }}
                className="text-xs text-amber-600 font-medium flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity"
              >
                Voir toute l&apos;équipe <FiChevronRight className="w-3 h-3" />
              </motion.button>
            </div>
          </motion.div>

          {/* Événements du jour */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl relative overflow-hidden"
          >
            {/* Subtle gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white -z-10"></div>
            
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)]" 
              style={{ backgroundSize: '20px 20px' }}></div>
            
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center space-x-3">
                <CircleStat icon={<FiClock />} color="#3B82F6" size="sm" />
                <div>
                  <span className="text-sm font-medium text-gray-700">Événements du jour</span>
                  <div className="text-gray-500 text-xs">4 événements programmés</div>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 p-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <FiPlusCircle className="w-3.5 h-3.5" />
                Ajouter
              </motion.button>
            </div>
            
            <div className="mt-4 space-y-3">
              {eventsData.map((event, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex items-start p-3 rounded-lg hover:bg-blue-50/50 transition-all border border-gray-100 shadow-sm hover:shadow-md"
                >
                  <div className={`p-2 rounded-lg mr-3 ${
                    event.type === 'Appel' ? 'bg-indigo-100' : 
                    event.type === 'Tâche' ? 'bg-amber-100' : 'bg-blue-100'
                  }`}>
                    {event.type === 'Appel' ? (
                      <FiPhoneCall className="w-4 h-4 text-indigo-600" />
                    ) : event.type === 'Tâche' ? (
                      <FiClipboard className="w-4 h-4 text-amber-600" />
                    ) : (
                      <FiCalendar className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-800">{event.type}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{event.time}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                          event.priority === 'Haute' ? 'bg-red-100 text-red-700' : 
                          event.priority === 'Moyenne' ? 'bg-amber-100 text-amber-700' : 
                          'bg-green-100 text-green-700'
                        }`}>
                          {event.priority}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-700 mt-1 font-medium">{event.contact}</p>
                    <div className="flex justify-end mt-2 gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors"
                      >
                        <FiCheck className="w-3.5 h-3.5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                      >
                        <FiAlertCircle className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Add subtle divider */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
              <motion.button
                whileHover={{ x: 5 }}
                whileTap={{ x: -2 }}
                className="text-xs text-blue-600 font-medium flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity"
              >
                Voir tous les événements <FiChevronRight className="w-3 h-3" />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Third row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl relative overflow-hidden"
        >
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white -z-10"></div>
          
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)]" 
            style={{ backgroundSize: '20px 20px' }}></div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <CircleStat icon={<FiFileText />} color="#4F46E5" size="sm" />
              <div>
                <span className="text-sm font-medium text-gray-700">Les notes d&apos;aujourd&apos;hui</span>
                <div className="text-gray-500 text-xs">Dernières activités importantes</div>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 p-2 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <FiPlusCircle className="w-3.5 h-3.5" />
              Ajouter une note
            </motion.button>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {notesData.map((note, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="p-4 border border-indigo-100 rounded-lg hover:shadow-md transition-all bg-gradient-to-br from-white to-indigo-50/30"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="font-medium text-xs text-indigo-700">{note.author.charAt(0)}</span>
                    </div>
                    <span className="text-xs font-medium text-indigo-700">{note.author}</span>
                  </div>
                  <span className="text-xs text-gray-500">{note.time}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{note.text}</p>
                
                <div className="flex justify-end mt-3 gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-1 bg-indigo-100 text-indigo-600 rounded hover:bg-indigo-200 transition-colors"
                  >
                    <FiCheck className="w-3.5 h-3.5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                  >
                    <FiX className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Add subtle divider */}
          <div className="mt-6 pt-3 border-t border-gray-100 flex justify-end">
            <motion.button
              whileHover={{ x: 5 }}
              whileTap={{ x: -2 }}
              className="text-xs text-indigo-600 font-medium flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity"
            >
              Voir toutes les notes <FiChevronRight className="w-3 h-3" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
