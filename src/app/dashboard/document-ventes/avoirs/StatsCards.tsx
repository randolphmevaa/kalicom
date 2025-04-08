// StatsCards.tsx
'use client';
// import { FiFileText, FiClock, FiCheckCircle } from 'react-icons/fi';
// import { FaEuroSign } from 'react-icons/fa6';
// import { motion } from 'framer-motion';

type Stat = {
  title: string;
  value: string;
  icon: React.JSX.Element;
};

type StatsCardsProps = {
  statistics: Stat[];
};

export default function StatsCards({ statistics }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {statistics.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-2xl shadow-lg flex flex-col">
          <div className="flex items-center mb-2">
            <div className="p-2 bg-indigo-50 rounded-lg mr-3">
              {stat.icon}
            </div>
            <span className="text-sm font-medium text-gray-500">{stat.title}</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
        </div>
      ))}
    </div>
  );
}