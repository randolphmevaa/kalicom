'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiClock,
  FiUserPlus,
  FiPauseCircle,
  FiList,
  FiXCircle,
} from 'react-icons/fi';
import Link from 'next/link';

export default function PosteDeTravail() {
  // Example states
  const [extensionName] = useState('poste 101 (Alice)');
  const [callStatus, setCallStatus] = useState<'active' | 'ended' | 'none'>('active');
  const [callDuration, setCallDuration] = useState(0); // in seconds

  // Increment timer if call is active
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (callStatus === 'active') {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [callStatus]);

  // Convert callDuration to mm:ss
  const formatDuration = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  // Handlers for phone bar actions
  const handleTransfer = () => {
    console.log('Transfer pressed');
  };
  const handleHold = () => {
    console.log('Put on hold pressed');
  };
  const handleRecents = () => {
    console.log('Show recent calls');
  };
  const handleEndCall = () => {
    setCallStatus('ended');
  };

  // Animate the bar container
  const phoneBarVariants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
    hover: {
      scale: 1.02,
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
      y: -2,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen"
    >
      <div className="max-w-7xl mx-auto space-y-8 px-4 md:px-0">
        {/* ---------- HEADER ---------- */}
        <div className="relative mb-8 overflow-hidden bg-white/80 rounded-3xl shadow-2xl border border-gray-100">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#004AC8]/10 to-[#4BB2F6]/10 rounded-3xl pointer-events-none" />
          <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center p-8 gap-4">
            <div>
              {/* Extension name */}
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#1B0353] capitalize">
                Poste de travail: {extensionName}
              </h1>
              <p className="text-sm text-gray-600 mt-1 max-w-lg">
                Gérez vos appels directement depuis votre poste.
              </p>
            </div>
            {/* Link to call history */}
            <Link
              href="/journal-appels"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#004AC8] text-white rounded-xl font-semibold hover:bg-[#003DA8] transition-colors"
            >
              Historique d’appel
              <FiList className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* ---------- PHONE BAR SECTION ---------- */}
        <div className="relative">
          {/* Glowing ring behind the phone bar (AnimatePresence to show/hide conditionally if you like) */}
          <AnimatePresence>
            {(callStatus === 'active' || callStatus === 'ended') && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 0.25,
                  scale: 1,
                  transition: { duration: 1 },
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`absolute -inset-0 flex items-center justify-center`}
              >
                <div
                  className={`w-full h-full rounded-2xl bg-gradient-to-r from-[#004AC8] to-[#4BB2F6] blur-2xl ${
                    callStatus === 'ended' ? 'bg-red-500' : ''
                  }`}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phone bar container */}
          <motion.div
            variants={phoneBarVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            className="relative bg-white p-6 rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            {/* Subtle pattern + gradient overlay behind phone bar */}
            <div
              className="absolute inset-0 opacity-10 bg-center bg-cover pointer-events-none rounded-2xl"
              style={{
                backgroundImage:
                  "url('https://www.toptal.com/designers/subtlepatterns/patterns/double-bubble-outline.png')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#004AC8]/5 to-[#4BB2F6]/5 rounded-2xl pointer-events-none" />

            {/* Phone bar content */}
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              {/* Left side: Call status text + timer */}
              <div className="flex flex-col gap-1">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`text-xl font-extrabold bg-clip-text text-transparent 
                    ${
                      callStatus === 'ended'
                        ? 'bg-gradient-to-r from-red-600 to-red-400'
                        : 'bg-gradient-to-r from-[#1B0353] to-[#004AC8]'
                    }
                  `}
                  style={{ WebkitBackgroundClip: 'text' }}
                >
                  {callStatus === 'active'
                    ? 'Appel en cours'
                    : callStatus === 'ended'
                    ? "L’appel est terminé,"
                    : 'Pas d’appel actif'}
                </motion.div>

                {/* If call is active or ended, show the timer (some users want final duration) */}
                {callStatus !== 'none' && (
                  <div
                    className={`inline-flex items-center gap-2 text-sm font-semibold 
                      ${
                        callStatus === 'ended'
                          ? 'text-red-500'
                          : 'text-[#004AC8]'
                      }
                    `}
                  >
                    <FiClock className="w-4 h-4" />
                    <span>{formatDuration(callDuration)}</span>
                  </div>
                )}
              </div>

              {/* Right side: phone controls */}
              <div className="flex flex-wrap md:flex-nowrap gap-3 items-center">
                {/* Transfer Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleTransfer}
                  disabled={callStatus !== 'active'}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-colors 
                    ${
                      callStatus === 'active'
                        ? 'bg-[#004AC8] text-white hover:bg-[#003DA8]'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  <FiUserPlus className="w-5 h-5" />
                  Transfert
                </motion.button>

                {/* Attente Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleHold}
                  disabled={callStatus !== 'active'}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-colors 
                    ${
                      callStatus === 'active'
                        ? 'bg-[#004AC8] text-white hover:bg-[#003DA8]'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  <FiPauseCircle className="w-5 h-5" />
                  Attente
                </motion.button>

                {/* Appels récents Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRecents}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold bg-[#004AC8] text-white hover:bg-[#003DA8] transition-colors"
                >
                  <FiList className="w-5 h-5" />
                  Appels récents
                </motion.button>

                {/* End Call Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEndCall}
                  disabled={callStatus !== 'active'}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-colors 
                    ${
                      callStatus === 'active'
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  <FiXCircle className="w-5 h-5" />
                  Terminer
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
