// app/not-found.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function Custom404() {
  const router = useRouter();
  const [hover, setHover] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const [countdown, setCountdown] = useState(15);
  
  // Capture current path for display
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
  }, []);
  
  // Auto-redirect countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      router.push('/dashboard');
    }
  }, [countdown, router]);

  return (
    <div className="min-h-screen w-full overflow-hidden relative bg-gradient-to-br from-[#EEF2FF] via-[#F5F8FF] to-[#FAFBFF] flex flex-col items-center justify-center p-6">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {/* 3D floating elements */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={`float-${i}`}
            initial={{ 
              x: `${Math.random() * 100}%`, 
              y: `${Math.random() * 100}%`,
              scale: Math.random() * 0.4 + 0.1,
              opacity: 0.05 + Math.random() * 0.1
            }}
            animate={{ 
              y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              rotate: [0, 360],
              opacity: [0.05 + Math.random() * 0.1, 0.1 + Math.random() * 0.1]
            }}
            transition={{ 
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            className={`absolute rounded-full bg-gradient-to-r ${
              i % 3 === 0 
                ? 'from-[#004AC8]/10 to-[#4BB2F6]/10' 
                : i % 3 === 1
                  ? 'from-[#4BB2F6]/10 to-[#1B0353]/10'
                  : 'from-[#1B0353]/10 to-[#004AC8]/10'
            } blur-xl`}
            style={{ 
              width: `${(Math.random() * 300) + 50}px`, 
              height: `${(Math.random() * 300) + 50}px` 
            }}
          />
        ))}
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: 'linear-gradient(to right, #004AC8 1px, transparent 1px), linear-gradient(to bottom, #004AC8 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}>
        </div>
      </div>
      
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-center">
          {/* Left side - 404 Number */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 flex items-center justify-center mb-10 lg:mb-0"
          >
            <div className="relative">
              <motion.div
                animate={{ 
                  scale: [1, 1.02, 1],
                  rotate: [0, 0.5, 0, -0.5, 0]
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
                className="relative z-10"
              >
                <div className="text-[13rem] lg:text-[20rem] font-bold bg-clip-text text-transparent bg-gradient-to-br from-[#004AC8] to-[#4BB2F6] leading-none select-none">
                  404
                </div>
                
                {/* Shadow effect */}
                <div className="absolute -inset-1 text-[13rem] lg:text-[20rem] font-bold text-[#1B0353]/5 leading-none select-none transform translate-x-2 translate-y-2 -z-10">
                  404
                </div>
              </motion.div>
              
              {/* Decorative dots */}
              <motion.div 
                className="absolute top-0 -right-4 w-8 h-8 bg-[#4BB2F6] rounded-full"
                animate={{ 
                  y: [0, -15, 0],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              />
              <motion.div 
                className="absolute bottom-10 -left-10 w-12 h-12 bg-gradient-to-br from-[#1B0353] to-[#004AC8] rounded-full blur-sm"
                animate={{ 
                  x: [0, 10, 0],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              />
            </div>
          </motion.div>
          
          {/* Right side - Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex-1 max-w-md px-6"
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-6">
              Page introuvable
            </h1>
            
            <div className="space-y-4 text-gray-600 mb-8 text-lg">
              <p>Nous n&apos;avons pas pu trouver la page que vous recherchez.</p>
              <p className="text-sm text-gray-500">
                L&apos;URL demandée <span className="px-2 py-1 bg-gray-100 rounded font-mono text-xs">{currentPath}</span> n&apos;existe pas sur ce serveur.
              </p>
            </div>
            
            {/* Suggestions */}
            <div className="bg-white/70 backdrop-blur-md rounded-xl p-6 border border-[#004AC8]/10 shadow-lg mb-8">
              <h3 className="font-semibold text-gray-700 mb-4">Suggestions:</h3>
              <ul className="space-y-3 text-sm">
                <motion.li 
                  className="flex items-center space-x-2 text-gray-600"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="w-2 h-2 bg-[#4BB2F6] rounded-full"></div>
                  <span>Vérifiez que l&apos;URL saisie est correcte</span>
                </motion.li>
                <motion.li 
                  className="flex items-center space-x-2 text-gray-600"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="w-2 h-2 bg-[#4BB2F6] rounded-full"></div>
                  <span>Retournez à la page précédente</span>
                </motion.li>
                <motion.li 
                  className="flex items-center space-x-2 text-gray-600"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="w-2 h-2 bg-[#4BB2F6] rounded-full"></div>
                  <span>Accédez directement au tableau de bord</span>
                </motion.li>
              </ul>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <motion.button
                whileHover={{ 
                  scale: 1.03,
                  y: -3,
                  transition: { duration: 0.2 }
                }}
                onHoverStart={() => setHover(true)}
                onHoverEnd={() => setHover(false)}
                onClick={() => router.push('/dashboard')}
                className="flex-1 px-6 py-3.5 bg-gradient-to-r from-[#004AC8] to-[#4BB2F6] text-white font-medium rounded-xl shadow-lg shadow-blue-200/30 flex items-center justify-center relative overflow-hidden group"
              >
                <span className="relative z-10">Retour au tableau de bord</span>
                
                {/* Animated button background effect */}
                <AnimatePresence>
                  {hover && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0.5 }}
                      animate={{ scale: 2.5, opacity: 0.15 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 bg-white rounded-full z-0"
                    />
                  )}
                </AnimatePresence>
                
                {/* Countdown indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20">
                  <motion.div 
                    className="h-full bg-white"
                    initial={{ width: "100%" }}
                    animate={{ width: `${(countdown / 15) * 100}%` }}
                    transition={{ duration: 1, ease: "linear" }}
                  />
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.03, y: -3 }}
                onClick={() => router.back()}
                className="flex-1 px-6 py-3.5 border border-[#004AC8]/30 text-[#004AC8] font-medium rounded-xl hover:bg-[#004AC8]/5 transition-colors flex items-center justify-center"
              >
                Page précédente
              </motion.button>
            </div>
            
            {/* Auto-redirect message */}
            <div className="mt-6 text-center text-sm text-gray-400">
              Redirection automatique dans <span className="font-medium text-[#004AC8]">{countdown}</span> secondes
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Footer with support info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-6 w-full text-center text-sm text-gray-400 flex flex-col items-center z-10"
      >
        <div className="mb-2">
          Besoin d&apos;aide? Contactez notre équipe support
        </div>
        <Link 
          href="mailto:support@kalicom.fr"
          className="text-[#004AC8] hover:text-[#4BB2F6] transition-colors"
        >
          support@kalicom.fr
        </Link>
      </motion.div>
    </div>
  );
}