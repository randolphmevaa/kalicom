'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion';
import {
  FiUser,
  FiLock,
  FiMail,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiAlertCircle,
  FiCheckCircle,
  FiGlobe,
  // FiServer,
  FiShield,
  // FiUsers,
  // FiBarChart2,
  // FiDatabase,
  FiHelpCircle,
  // FiCpu,
  FiMessageSquare,
  // FiHeadphones,
  // FiSmartphone,
  FiChevronDown,
  FiStar,
  FiClock,
  FiTrendingUp,
  FiPhoneCall,
  FiWifi,
  FiActivity,
  FiLayers,
} from 'react-icons/fi';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [animateSuccess, setAnimateSuccess] = useState(false);
  const [ , setIsVisible] = useState(false);
  const [language, setLanguage] = useState('FR');
  const [showLanguages, setShowLanguages] = useState(false);
  
  const controls = useAnimation();
  const backgroundControls = useAnimation();
  
  // Refs for animation
  const formRef = useRef(null);
  const isInView = useInView(formRef, { once: false, amount: 0.3 });
  
  // Initialize animation sequence
  useEffect(() => {
    setIsVisible(true);
    
    // Staggered animation sequence
    const sequence = async () => {
      await backgroundControls.start({ 
        opacity: [0, 0.2, 0.5, 0.8, 1],
        scale: [0.98, 1],
        transition: { duration: 1.5, ease: "easeOut" }
      });
      
      await controls.start({
        opacity: 1,
        y: 0,
        transition: { 
          duration: 0.8,
          staggerChildren: 0.1,
          delayChildren: 0.3
        }
      });
    };
    
    sequence();
  }, [controls, backgroundControls]);
  
  // Trigger form animations when in view
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    // Clear error when user starts typing
    if (formError) setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setFormError('Veuillez remplir tous les champs');
      setIsLoading(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError('Format d\'email invalide');
      setIsLoading(false);
      return;
    }

    // Simulate API call delay
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Save login info to localStorage
      localStorage.setItem('proInfo', JSON.stringify({
        email: formData.email,
        isLoggedIn: true,
        timestamp: new Date().getTime(),
        user: {
          name: formData.email.split('@')[0].replace('.', ' '),
          role: 'Administrateur',
          company: 'Kalicom'
        }
      }));
      
      // Successful login animation
      setAnimateSuccess(true);
      
      // Redirect after animation completes
      setTimeout(() => {
        router.push('/dashboard/acceuil');
        
      }, 1000);
      
    } catch {
      setFormError('Erreur de connexion. Veuillez réessayer.');
      setIsLoading(false);
    }
  };
  
  // Toggle language dropdown
  const toggleLanguages = () => {
    setShowLanguages(!showLanguages);
  };
  
  // Change language
  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    setShowLanguages(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="text-gray-700 min-h-screen w-full flex flex-col md:flex-row overflow-hidden bg-gray-50"
    >
      {/* Language Selector */}
      <div className="absolute top-8 right-8 z-50">
        <div className="relative">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleLanguages}
            className="flex items-center gap-2 py-2 px-4 bg-white/80 backdrop-blur-md text-gray-700 rounded-xl shadow-lg border border-gray-100 text-sm font-medium"
          >
            <FiGlobe className="text-[#004AC8]" />
            {language}
            <FiChevronDown className={`transition-transform ${showLanguages ? 'rotate-180' : 'rotate-0'}`} />
          </motion.button>
          
          <AnimatePresence>
            {showLanguages && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
              >
                {['FR', 'EN', 'ES', 'DE'].map((lang) => (
                  <motion.button
                    key={lang}
                    whileHover={{ backgroundColor: '#f1f5ff' }}
                    onClick={() => changeLanguage(lang)}
                    className={`w-full text-left px-4 py-2.5 text-sm ${language === lang ? 'font-semibold text-[#004AC8] bg-blue-50' : 'text-gray-700'}`}
                  >
                    {lang === 'FR' ? 'Français' : lang === 'EN' ? 'English' : lang === 'ES' ? 'Español' : 'Deutsch'}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {/* Enhanced Animated Background Gradient - Lighter colors */}
      <motion.div 
        animate={backgroundControls}
        initial={{ opacity: 0, scale: 0.98 }} 
        className="absolute inset-0 bg-gradient-to-br from-[#EEF2FF] via-[#F5F8FF] to-[#FAFBFF] z-0" 
      />
      
      {/* Particle effect background for premium feel */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ 
              opacity: Math.random() * 0.5 + 0.1, 
              x: `${Math.random() * 100}%`, 
              y: `${Math.random() * 100}%`,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              opacity: [
                Math.random() * 0.5 + 0.1, 
                Math.random() * 0.5 + 0.3, 
                Math.random() * 0.5 + 0.1
              ],
              y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`]
            }}
            transition={{ 
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute w-2 h-2 rounded-full"
            style={{ 
              background: index % 2 === 0 ? 
                `rgba(0, 74, 200, ${Math.random() * 0.2})` : 
                `rgba(75, 178, 246, ${Math.random() * 0.2})` 
            }}
          />
        ))}
      </div>
      
      {/* Subtle grid pattern */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05, transition: { duration: 2 } }}
        className="absolute inset-0 z-0" 
        style={{ 
          backgroundSize: '40px 40px',
          backgroundImage: 'linear-gradient(to right, rgba(0,74,200,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,74,200,0.05) 1px, transparent 1px)'
        }}
      />
      
      {/* Animated geometric shapes for visual interest - made larger and lighter */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          initial={{ opacity: 0, top: '10%', left: '5%' }}
          animate={{ opacity: 0.3, top: '15%', left: '10%' }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-blue-200/30 to-purple-300/30 blur-3xl"
        />
        <motion.div 
          initial={{ opacity: 0, bottom: '20%', right: '10%' }}
          animate={{ opacity: 0.3, bottom: '15%', right: '15%' }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1 }}
          className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-cyan-200/30 to-blue-300/30 blur-3xl"
        />
        <motion.div 
          initial={{ opacity: 0, top: '60%', left: '50%' }}
          animate={{ opacity: 0.2, top: '55%', left: '45%' }}
          transition={{ duration: 25, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 2 }}
          className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-indigo-200/20 to-blue-300/20 blur-3xl"
        />
      </div>
      
      {/* Left Side - Branding & Information with lighter background */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="hidden lg:flex flex-col relative z-10 w-1/2 bg-gradient-to-br from-[#004AC8] via-[#1B0353] to-[#4BB2F6] text-white justify-center overflow-hidden"
      >
        {/* Enhanced background with lighter gradient to help logo visibility */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0050E0] via-[#2B1373] to-[#5BC2FF] opacity-90"></div>
        
        {/* Animated mesh gradient overlay - made lighter */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(135, 206, 255, 0.4) 0%, transparent 30%),
              radial-gradient(circle at 80% 70%, rgba(100, 143, 255, 0.4) 0%, transparent 40%)
            `,
            filter: 'blur(40px)'
          }}
        />
        
        {/* Premium 3D lines effect for depth */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 overflow-hidden"
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={`line-${i}`}
              className="absolute h-px w-full bg-gradient-to-r from-transparent via-white to-transparent"
              style={{ top: `${i * 10}%` }}
              animate={{ 
                x: ['-100%', '100%'], 
                opacity: [0.1, 0.3, 0.1] 
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 15 + i * 2, 
                ease: "linear",
                delay: i * 0.5
              }}
            />
          ))}
        </motion.div>
        
        {/* Animated background pattern */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 3 }}
          className="absolute inset-0"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.2\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          }}
        />
        
        {/* Decorative animated blobs - made more vibrant */}
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse" 
          }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#6BC4FF]/40 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 z-0"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.4, 0.3]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2
          }}
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#2B65FF]/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 z-0"
        />
        
        {/* Content with enhanced styling and better logo visibility */}
        <div className="relative z-10 max-w-2xl mx-auto px-16 py-20">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-12 flex items-center"
          >
            <div className="relative flex items-center">
              {/* Improved logo container with white background for better visibility */}
              <div className="w-20 h-20 bg-white rounded-2xl shadow-xl mr-6 flex items-center justify-center overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="relative w-16 h-16 flex items-center justify-center"
                >
                  {/* Soft glow behind the logo */}
                  <div className="absolute inset-0 bg-blue-100 rounded-xl blur-md"></div>
                  <Image 
                    src="/Artboard 1.svg" 
                    alt="Kalicom Logo" 
                    width={60} 
                    height={60} 
                    className="object-contain relative z-10" 
                  />
                </motion.div>
                
                {/* Animated shine effect */}
                <motion.div
                  initial={{ left: '-100%', top: '-100%' }}
                  animate={{ left: '100%', top: '100%' }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatType: 'loop', repeatDelay: 5 }}
                  className="absolute w-40 h-40 -rotate-45 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
                ></motion.div>
              </div>
              <div>
                <h1 className="text-5xl font-bold tracking-tight">Kalicom <span className="font-light">PBX</span></h1>
                <div className="h-1.5 w-24 bg-white/40 rounded-full mt-3"></div>
              </div>
            </div>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-xl leading-relaxed mb-12 text-white/95 font-light"
          >
            Bienvenue sur votre plateforme cloud de téléphonie d&apos;entreprise. Connectez-vous pour accéder à votre système et gérer vos communications.
          </motion.p>
          
          {/* Enhanced Feature Highlights with animated indicators */}
          <motion.div 
            variants={{
              hidden: { opacity: 0 },
              show: { 
                opacity: 1,
                transition: { staggerChildren: 0.2 }
              }
            }}
            initial="hidden"
            animate="show"
            className="space-y-8 mt-16"
          >
            {[
              { 
                icon: FiPhoneCall, 
                title: "Téléphonie cloud avancée", 
                description: "Centralisez tous vos appels et communications dans une solution sécurisée",
                stat: "Haute disponibilité"
              },
              { 
                icon: FiActivity, 
                title: "Analyses d'appels", 
                description: "Suivez et optimisez vos performances téléphoniques en temps réel",
                stat: "Statistiques précises"
              },
              { 
                icon: FiMessageSquare, 
                title: "Communications unifiées", 
                description: "Voix, visioconférence, messagerie et collaboration en une plateforme",
                stat: "Solution complète"
              },
              { 
                icon: FiLayers, 
                title: "Intégrations simplifiées", 
                description: "Connectez votre téléphonie à vos outils métiers existants",
                stat: "Compatibilité étendue"
              },
            ].map((feature, index) => (
              <motion.div 
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
                whileHover={{ x: 5, transition: { duration: 0.2 } }}
                className="flex items-start space-x-4 group"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 rounded-xl blur-md transform group-hover:scale-125 transition-transform duration-300"></div>
                  <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-xl shadow-xl group-hover:bg-white/20 transition-all duration-300 relative z-10">
                    <feature.icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg group-hover:text-blue-200 transition-colors">
                    {feature.title} 
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + index * 0.2, duration: 0.6 }}
                      className="ml-2 text-xs py-0.5 px-2 bg-white/20 text-white/90 rounded-full"
                    >
                      {feature.stat}
                    </motion.span>
                  </h3>
                  <p className="text-white/80 text-sm mt-1">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Premium award badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="mt-16 flex items-center gap-6"
          >
            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl flex items-center gap-2 border border-white/10">
              <FiStar className="text-yellow-300 w-5 h-5" />
              <span className="text-sm font-medium">Solution PBX Sécurisée</span>
            </div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl flex items-center gap-2 border border-white/10">
              <FiWifi className="text-green-300 w-5 h-5" />
              <span className="text-sm font-medium">Qualité HD</span>
            </div>
          </motion.div>
        </div>
        
        {/* Enhanced premium footer with activity indicators */}
        <div className="absolute bottom-0 left-0 right-0 py-8 px-16 border-t border-white/10 backdrop-blur-sm bg-gradient-to-r from-[#1B0353]/40 via-[#004AC8]/30 to-[#1B0353]/40">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-white/80">
                    Système opérationnel
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <FiClock className="w-4 h-4 text-white/70" />
                  <span className="text-white/80">Support technique <span className="font-medium">24/7</span></span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <FiShield className="w-4 h-4 text-white/70" />
                <span className="text-sm text-white/80">Appels sécurisés</span>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center">
              <div className="text-sm text-white/60">© 2025 Kalicom. Tous droits réservés.</div>
              
              <div className="flex items-center space-x-3">
                <motion.a
                  href="#"
                  whileHover={{ y: -2, color: '#ffffff' }}
                  className="text-white/60 text-sm hover:text-white transition-colors"
                >
                  CGU
                </motion.a>
                <span className="text-white/30">•</span>
                <motion.a
                  href="#"
                  whileHover={{ y: -2, color: '#ffffff' }}
                  className="text-white/60 text-sm hover:text-white transition-colors"
                >
                  Confidentialité
                </motion.a>
                <span className="text-white/30">•</span>
                <motion.a
                  href="#"
                  whileHover={{ y: -2, color: '#ffffff' }}
                  className="text-white/60 text-sm hover:text-white transition-colors"
                >
                  Aide
                </motion.a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Right Side - Login Form with enhanced premium UX */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <motion.div
          animate={controls}
          initial={{ opacity: 0, y: 30 }}
          className="w-full max-w-lg" /* Increased max width for more premium spacing */
          ref={formRef}
        >
          {/* Mobile Logo (shown only on small screens) */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:hidden flex flex-col items-center justify-center mb-12"
          >
            {/* Enhanced mobile logo container with white background */}
            <div className="w-24 h-24 bg-white rounded-2xl shadow-xl mb-4 p-3 flex items-center justify-center">
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Subtle glow behind the logo */}
                <div className="absolute inset-0 bg-blue-100/50 rounded-xl blur-md"></div>
                <Image 
                  src="/Artboard 1.svg" 
                  alt="Kalicom Logo" 
                  width={72} 
                  height={72} 
                  className="object-contain relative z-10" 
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-[#1B0353] tracking-tight">Kalicom <span className="font-light">PBX</span></h1>
            <div className="h-1 w-16 bg-[#004AC8]/30 rounded-full mt-2"></div>
          </motion.div>
          
          {/* Login Card with enhanced premium glass effect */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
            }}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            whileHover={{ boxShadow: "0 30px 60px rgba(0, 74, 200, 0.12)" }}
            className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-[#004AC8]/10 p-12 relative overflow-hidden"
          >
            {/* 3D floating card effect */}
            <motion.div
              animate={{ 
                rotateX: [0.5, -0.5, 0.5], 
                rotateY: [0.5, -0.5, 0.5],
                transition: { 
                  duration: 10, 
                  repeat: Infinity, 
                  repeatType: "mirror" 
                }
              }}
              className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-50/50 via-white/50 to-blue-50/50 z-0"
            />
            
            {/* Success Overlay with enhanced premium animation */}
            <AnimatePresence>
              {animateSuccess && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ 
                      scale: [0, 1.3, 1],
                      rotate: [0, -10, 0]
                    }}
                    transition={{ 
                      duration: 0.6, 
                      times: [0, 0.6, 1],
                      ease: "easeOut"
                    }}
                    className="relative"
                  >
                    {/* Premium success animation with glow */}
                    <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl scale-150"></div>
                    <div className="bg-gradient-to-br from-green-100 to-green-50 text-green-600 rounded-full p-5 relative shadow-lg shadow-green-100/50">
                      <FiCheckCircle className="w-16 h-16" />
                    </div>
                    
                    {/* Animated checkmark particles */}
                    {Array.from({ length: 8 }).map((_, i) => (
                      <motion.div
                        key={`particle-${i}`}
                        initial={{ scale: 0, x: 0, y: 0, opacity: 0.8 }}
                        animate={{ 
                          scale: 0,
                          x: Math.cos(i * Math.PI / 4) * 80,
                          y: Math.sin(i * Math.PI / 4) * 80,
                          opacity: 0
                        }}
                        transition={{ 
                          duration: 0.8, 
                          delay: 0.3,
                          ease: "easeOut"
                        }}
                        className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-green-400 rounded-full"
                      />
                    ))}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-center mt-6"
                  >
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Connexion réussie!</h3>
                    <p className="text-gray-500">
                      Redirection vers votre tableau de bord...
                    </p>
                  </motion.div>
                  
                  {/* Premium loading indicator */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-10"
                  >
                    <div className="w-36 h-1.5 bg-gray-200 rounded-full overflow-hidden relative">
                      <motion.div 
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="absolute inset-0 bg-gradient-to-r from-[#004AC8] via-[#4BB2F6] to-[#004AC8]"
                      />
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Enhanced card decorative elements */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[#004AC8]/5 to-[#4BB2F6]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 z-0"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-[#4BB2F6]/5 to-[#004AC8]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 z-0"></div>
            
            {/* Premium 3D floating elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={`float-${i}`}
                  initial={{ 
                    x: `${Math.random() * 100}%`, 
                    y: `${Math.random() * 100}%`,
                    scale: Math.random() * 0.6 + 0.2,
                    opacity: 0.1 + Math.random() * 0.1
                  }}
                  animate={{ 
                    y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                    x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                    rotate: [0, 360],
                    opacity: [0.1 + Math.random() * 0.1, 0.2 + Math.random() * 0.1]
                  }}
                  transition={{ 
                    duration: 20 + Math.random() * 10,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                  className={`absolute w-12 h-12 rounded-full bg-gradient-to-r ${
                    i % 2 === 0 
                      ? 'from-[#004AC8]/5 to-[#4BB2F6]/5' 
                      : 'from-[#4BB2F6]/5 to-[#004AC8]/5'
                  } blur-xl`}
                />
              ))}
              
              {Array.from({ length: 4 }).map((_, i) => (
                <motion.div
                  key={`shape-${i}`}
                  initial={{ 
                    x: `${Math.random() * 100}%`, 
                    y: `${Math.random() * 100}%`,
                    opacity: 0.1
                  }}
                  animate={{ 
                    y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                    x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                    rotate: [0, 180, 360],
                    opacity: [0.1, 0.15, 0.1]
                  }}
                  transition={{ 
                    duration: 25 + Math.random() * 10,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                  className="absolute border border-[#004AC8]/10 rounded-lg w-16 h-16"
                  style={{ borderRadius: i % 2 === 0 ? '30% 70% 70% 30% / 30% 30% 70% 70%' : '64% 36% 27% 73% / 73% 75% 25% 27%' }}
                />
              ))}
            </div>
            
            {/* Subtle pattern overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.02 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 pointer-events-none" 
              style={{ 
                backgroundImage: 'radial-gradient(#004AC8 0.8px, transparent 0.8px)',
                backgroundSize: '20px 20px'
              }}
            />
            
            {/* Card header with premium typography and effects */}
            <motion.div 
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative z-10 mb-1"
            >
              <div className="flex items-center mb-3">
                <div className="relative w-10 h-10">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-blue-200 rounded-lg blur-md"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#004AC8] to-[#4BB2F6] rounded-lg shadow-lg shadow-blue-200/40 flex items-center justify-center">
                    <FiUser className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h2 className="ml-4 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#1B0353] to-[#004AC8]">
                  Connexion
                </h2>
              </div>
              <p className="text-gray-500 ml-14 text-lg">Accédez à votre plateforme de téléphonie</p>
              
              {/* Premium decorative line */}
              <div className="mt-4 w-full h-px bg-gradient-to-r from-transparent via-[#004AC8]/20 to-transparent"></div>
            </motion.div>
            
            {/* Enhanced Premium Login Form with 3D effects */}
            <form onSubmit={handleSubmit} className="relative z-10 mt-8">
              {/* Email Input with enhanced premium styling and animations */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mb-7"
              >
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5 ml-1 flex items-center">
                  <span>Adresse email</span>
                  <div className="relative ml-2 group">
                    <FiHelpCircle className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-white rounded-lg shadow-lg text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      Utilisez votre adresse email professionnelle
                    </div>
                  </div>
                </label>
                <div className="relative group perspective-1000">
                  {/* 3D hover effect */}
                  <motion.div
                    whileHover={{ 
                      rotateX: 2, 
                      rotateY: 2,
                      z: 10
                    }}
                    className="relative"
                  >
                    {/* Enhanced glow effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#004AC8]/20 to-[#4BB2F6]/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <FiMail className="h-5 w-5 text-[#004AC8]" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`block w-full pl-12 pr-4 py-4 border ${
                        formError && !formData.email 
                          ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/30' 
                          : 'border-gray-200 bg-white/90 backdrop-blur-sm focus:border-[#004AC8] focus:ring-[#004AC8]/30'
                      } rounded-xl shadow-sm focus:outline-none focus:ring-4 transition-all relative z-10`}
                      placeholder="votre.email@kalicom.com"
                    />
                    
                    {/* Dynamic validation indicator with enhanced animations */}
                    {formData.email && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center z-10"
                      >
                        {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.2, 1] }}
                            transition={{ duration: 0.4 }}
                            className="text-green-500 bg-green-50 p-1 rounded-full"
                          >
                            <FiCheckCircle className="h-5 w-5" />
                          </motion.div>
                        ) : formData.email.length > 3 ? (
                          <motion.div
                            animate={{ x: [0, -2, 2, -2, 0] }}
                            transition={{ duration: 0.5 }}
                            className="text-amber-500 bg-amber-50 p-1 rounded-full"
                          >
                            <FiAlertCircle className="h-5 w-5" />
                          </motion.div>
                        ) : null}
                      </motion.div>
                    )}
                  </motion.div>
                </div>
                
                {/* Usage example subtip */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ 
                    opacity: formData.email.length > 0 ? 0 : 0.8,
                    height: formData.email.length > 0 ? 0 : 'auto'
                  }}
                  className="mt-2 flex items-center text-xs text-gray-500 overflow-hidden"
                >
                  <FiTrendingUp className="flex-shrink-0 mr-1 w-3.5 h-3.5 text-[#004AC8]/60" />
                  <span>Exemple: jean.dupont@kalicom.com</span>
                </motion.div>
              </motion.div>
              
              {/* Password Input with enhanced premium styling and animations */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mb-7"
              >
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                  Mot de passe
                </label>
                <div className="relative group perspective-1000">
                  {/* 3D hover effect */}
                  <motion.div
                    whileHover={{ 
                      rotateX: 2, 
                      rotateY: 2,
                      z: 10
                    }}
                    className="relative"
                  >
                    {/* Enhanced glow effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#004AC8]/20 to-[#4BB2F6]/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <FiLock className="h-5 w-5 text-[#004AC8]" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      autoComplete="current-password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`block w-full pl-12 pr-12 py-4 border ${
                        formError && !formData.password 
                          ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/30' 
                          : 'border-gray-200 bg-white/90 backdrop-blur-sm focus:border-[#004AC8] focus:ring-[#004AC8]/30'
                      } rounded-xl shadow-sm focus:outline-none focus:ring-4 transition-all relative z-10`}
                      placeholder="••••••••••••"
                    />
                    <motion.div 
                      whileTap={{ scale: 0.9 }}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center z-10"
                    >
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1.5 rounded-full text-gray-400 hover:text-[#004AC8] hover:bg-blue-50 transition-all focus:outline-none"
                      >
                        {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                      </button>
                    </motion.div>
                  </motion.div>
                </div>
                
                {/* Enhanced Password strength indicator with animations */}
                {formData.password && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="mt-3"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ 
                            width: formData.password.length < 6 
                              ? '33%' 
                              : formData.password.length < 10 
                                ? '66%' 
                                : '100%' 
                          }}
                          transition={{ duration: 0.3 }}
                          className={`h-full rounded-full ${
                            formData.password.length < 6 
                              ? 'bg-red-400' 
                              : formData.password.length < 10 
                                ? 'bg-amber-400' 
                                : 'bg-green-400'
                          }`}
                        />
                      </div>
                      <span className={`text-xs font-medium ${
                        formData.password.length < 6 
                          ? 'text-red-500' 
                          : formData.password.length < 10 
                            ? 'text-amber-500' 
                            : 'text-green-500'
                      }`}>
                        {formData.password.length < 6 
                          ? 'Faible' 
                          : formData.password.length < 10 
                              ? 'Moyen' 
                              : 'Fort'}
                      </span>
                    </div>
                    
                    {/* Password requirements */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.8 }}
                      className="grid grid-cols-2 gap-2"
                    >
                      {[
                        { test: formData.password.length >= 8, text: "8+ caractères" },
                        { test: /[A-Z]/.test(formData.password), text: "Majuscule" },
                        { test: /[0-9]/.test(formData.password), text: "Chiffre" },
                        { test: /[^A-Za-z0-9]/.test(formData.password), text: "Caractère spécial" }
                      ].map((req, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs">
                          <div className={`w-3 h-3 rounded-full flex items-center justify-center ${req.test ? 'bg-green-100' : 'bg-gray-100'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${req.test ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          </div>
                          <span className={req.test ? 'text-green-700' : 'text-gray-500'}>
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
              
              {/* Enhanced Error Message with premium animations */}
              <AnimatePresence>
                {formError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="mb-7 px-5 py-4 bg-gradient-to-r from-red-50 to-white border border-red-100 rounded-xl flex items-start text-sm shadow-sm"
                  >
                    <div className="p-1 bg-red-100 rounded-full mr-3 flex-shrink-0 mt-0.5">
                      <FiAlertCircle className="w-4 h-4 text-red-500" />
                    </div>
                    <div>
                      <div className="font-medium text-red-700">Impossible de se connecter</div>
                      <div className="text-red-600/80 mt-0.5">{formError}</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Premium Remember Me & Forgot Password with enhanced styling */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center justify-between mb-10"
              >
                <div className="flex items-center">
                  <div className="relative">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="h-5 w-5 text-[#004AC8] border-gray-300 rounded focus:ring-[#004AC8] focus:ring-offset-0 focus:ring-2 transition-all cursor-pointer"
                    />
                    {/* Animated checkbox highlight */}
                    <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${formData.rememberMe ? 'opacity-100' : 'opacity-0'}`}>
                      <motion.div 
                        initial={false}
                        animate={formData.rememberMe ? { scale: [0.5, 1.2, 1] } : { scale: 1 }}
                        transition={{ duration: 0.3, times: [0, 0.7, 1] }}
                        className="absolute inset-0 bg-[#004AC8]/10 rounded-sm"
                      />
                      {/* Animated pulse effect when checked */}
                      {formData.rememberMe && (
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0.8 }}
                          animate={{ scale: 1.5, opacity: 0 }}
                          transition={{ 
                            repeat: 1, 
                            duration: 0.6,
                            ease: "easeOut"
                          }}
                          className="absolute inset-0 bg-[#004AC8]/20 rounded-sm"
                        />
                      )}
                    </div>
                  </div>
                  <label htmlFor="rememberMe" className="ml-2.5 block text-sm text-gray-600 select-none cursor-pointer">
                    Se souvenir de moi
                  </label>
                </div>
                <motion.div 
                  whileHover={{ x: 2 }} 
                  whileTap={{ x: -1 }}
                  className="relative"
                >
                  {/* Premium gradient text effect */}
                  <a 
                    href="#" 
                    className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#004AC8] to-[#4BB2F6] hover:from-[#1B0353] hover:to-[#004AC8] transition-all"
                  >
                    Mot de passe oublié?
                  </a>
                  {/* Animated underline */}
                  <div className="absolute bottom-0 left-0 w-full h-0.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "0%" }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full bg-gradient-to-r from-[#004AC8] to-[#4BB2F6]"
                    />
                  </div>
                </motion.div>
              </motion.div>
              
              {/* Enhanced Submit Button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={!isLoading ? { scale: 1.02, y: -2 } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
                  className={`w-full flex items-center justify-center px-6 py-4 border border-transparent rounded-xl shadow-lg text-base font-medium text-white focus:outline-none focus:ring-4 focus:ring-offset-0 focus:ring-[#004AC8]/30 transition-all ${
                    isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-[#004AC8] to-[#4BB2F6] hover:shadow-blue-100'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                      />
                      <span>Connexion en cours...</span>
                    </div>
                  ) : (
                    <div className="relative flex items-center justify-center w-full overflow-hidden">
                      <span className="relative z-10 flex items-center">
                        Se connecter
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ repeat: Infinity, repeatDelay: 2, duration: 1 }}
                          className="ml-2"
                        >
                          <FiArrowRight className="h-5 w-5" />
                        </motion.div>
                      </span>
                      
                      {/* Button hover effect */}
                      <motion.div 
                        initial={{ opacity: 0, scale: 0 }}
                        whileHover={{ opacity: 1, scale: 12 }}
                        transition={{ duration: 0.4 }}
                        className="absolute w-8 h-8 rounded-full bg-white/10 pointer-events-none"
                      />
                    </div>
                  )}
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
          
          {/* Additional Information / Help Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center text-sm text-gray-500"
          >
            <p>Vous avez besoin d&apos;aide? <a href="#" className="font-medium text-[#004AC8] hover:text-[#1B0353]">Contactez le support</a></p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
