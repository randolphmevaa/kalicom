import React, { useState, useEffect, useRef, useCallback } from 'react';
import _ from 'lodash';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiClock, 
  FiTrash2, 
  FiEdit, 
  FiUsers, 
  // FiTag,
  FiCheck,
  FiX,
  FiInfo,
  FiRepeat,
  FiArrowRight,
  FiCopy,
  FiLink,
  FiShare2,
  FiHash,
  FiCalendar,
  FiBell,
  FiBold,
  FiMapPin,
  FiNavigation,
  FiCommand,
  FiUserPlus,
  FiRefreshCw,
  FiChevronDown,
  FiPlusCircle,
  FiDownload,
  FiFileText,
  // FiAlertCircle
} from 'react-icons/fi';

import { Tooltip, StatusBadge } from './UIComponents';
import { 
  EventModalProps, 
  EventFormData, 
  EventType,
  AddressFeature,
  AddressSuggestionResponse
} from '../CalendarInterfaces';
import { eventCategories, priorities, sampleContacts } from '../data/calendarData';

// Enhanced Event Modal with premium UI/UX features
const EventModal: React.FC<EventModalProps> = ({ 
  event, 
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  mode = 'view' 
}) => {
  // Extended event data with more options
  const [formData, setFormData] = useState<EventFormData>(() => {
    if (event) {
      return {
        ...event,
        isRecurring: event.isRecurring ?? false,
        recurrencePattern: event.recurrencePattern ?? 'none',
        reminderTime: event.reminderTime ?? '15',
        notes: event.notes ?? '',
        attachments: event.attachments ?? [],
        attendees: event.attendees ?? [],
      };
    }
    
    return {
      id: '', // Add empty id for new events
      title: '',
      start: new Date(),
      end: new Date(new Date().getTime() + 60 * 60 * 1000),
      category: 'meeting',
      contact: 1,
      priority: 'medium',
      description: '',
      location: '',
      allDay: false,
      isRecurring: false,
      recurrencePattern: 'none', // none, daily, weekly, monthly, yearly
      reminderTime: '15', // minutes before
      notes: '',
      attachments: [],
      attendees: [],
    };
  });
  
  // UI state management
  const [activeTab, setActiveTab] = useState<string>('details');
  const modalRef = useRef<HTMLDivElement>(null);
  const [animateColor, setAnimateColor] = useState<boolean>(false);
  const [addressSuggestions, setAddressSuggestions] = useState<AddressFeature[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  // Add proper type for the query parameter
  const fetchAddressSuggestions = async (query: string): Promise<void> => {
    if (!query || query.length < 3) {
      setAddressSuggestions([]);
      return;
    }
    
    setIsLoadingAddresses(true);
    try {
      const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`);
      const data: AddressSuggestionResponse = await response.json();
      setAddressSuggestions(data.features || []);
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      setAddressSuggestions([]);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  // Properly type the debounced function
  const debouncedFetchAddresses = useCallback(
    _.debounce((query: string) => {
      fetchAddressSuggestions(query);
    }, 300),
    []
  );

  // Add type for the event parameter
  const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    
    // Update form data
    handleInputChange(e);
    
    // Fetch suggestions
    if (isEditMode) {
      debouncedFetchAddresses(value);
      setShowSuggestions(true);
    }
  };

  // Add type for the suggestion parameter
  const handleSelectAddress = (suggestion: AddressFeature): void => {
    const selectedAddress = suggestion.properties.label;
    
    setFormData({
      ...formData,
      location: selectedAddress
    });
    
    setShowSuggestions(false);
    setAddressSuggestions([]);
  };

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        isRecurring: event.isRecurring || false,
        recurrencePattern: event.recurrencePattern || 'none',
        reminderTime: event.reminderTime || '15',
        notes: event.notes || '',
        attachments: event.attachments || [],
        attendees: event.attendees || [],
      });
    }
  }, [event]);

  useEffect(() => {
    // Add color animation when category changes
    if (formData.category) {
      setAnimateColor(true);
      const timer = setTimeout(() => setAnimateColor(false), 800);
      return () => clearTimeout(timer);
    }
  }, [formData.category]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node) && isOpen) {
        onClose();
      }
    };
    
    // Add escape key listener for closing
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatDateForInput = (date: Date): string => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure we have an ID for the event
    const eventToSave: EventType = {
      ...formData,
      id: formData.id || `event-${Date.now()}`
    };
    
    onSave(eventToSave);
  };

  // Generate recurrence text for display
  const getRecurrenceText = (): string => {
    if (!formData.isRecurring) return 'Pas de récurrence';
    
    switch(formData.recurrencePattern) {
      case 'daily': return 'Tous les jours';
      case 'weekly': return 'Toutes les semaines';
      case 'biweekly': return 'Toutes les deux semaines';
      case 'monthly': return 'Tous les mois';
      case 'yearly': return 'Tous les ans';
      default: return 'Personnalisé';
    }
  };

  const isEditMode = mode === 'edit' || mode === 'create';
  const categoryColor = formData.category ? eventCategories[formData.category]?.color ?? '#4F46E5' : '#4F46E5';

  // Template suggestions
  const templateSuggestions = [
    { name: 'Appel prospect', category: 'call', duration: 30 },
    { name: 'Réunion d\'équipe', category: 'meeting', duration: 60 },
    { name: 'Suivi client', category: 'call', duration: 20 },
    { name: 'Déjeuner d\'affaires', category: 'meeting', duration: 90 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur effect */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-gradient-to-br from-gray-900/60 to-black/70 backdrop-blur-sm"
        onClick={() => onClose()}
      />
      
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 300 
          }}
          className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden relative z-10"
          ref={modalRef}
        >
          {/* Enhanced decorative header with animated gradient */}
          <motion.div 
            initial={{ opacity: 0.7 }}
            animate={{ 
              opacity: animateColor ? [0.7, 1, 0.7] : 0.9,
              background: `linear-gradient(90deg, ${categoryColor}90 0%, ${categoryColor}70 35%, ${categoryColor}90 100%)`
            }}
            transition={{ duration: 1.5, repeat: animateColor ? 3 : 0 }}
            className="absolute inset-x-0 top-0 h-1.5"
          />
          
          {/* Side color decoration */}
          <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: categoryColor }}></div>
          
          {/* Modal header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-center relative">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-lg shadow-sm" style={{ 
                backgroundColor: `${categoryColor}15`,
                boxShadow: `0 2px 10px ${categoryColor}20`
              }}>
                <motion.div 
                  animate={{ rotate: animateColor ? [0, 15, 0, -15, 0] : 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ color: categoryColor }}
                >
                  {formData.category && eventCategories[formData.category]?.icon ? eventCategories[formData.category].icon : null}
                </motion.div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {mode === 'create' ? 'Nouvel événement' : mode === 'edit' ? 'Modifier l\'événement' : 'Détails de l\'événement'}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-500">
                    {formData.category && eventCategories[formData.category].name}
                  </span>
                  {formData.isRecurring && (
                    <StatusBadge 
                      status="info" 
                      text={getRecurrenceText()} 
                      size="sm" 
                    />
                  )}
                </div>
              </div>
            </div>
            
            {/* Header actions */}
            <div className="flex items-center gap-2">
              {mode !== 'create' && (
                <Tooltip content="Dupliquer (Ctrl+D)" position="bottom">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all"
                  >
                    <FiCopy className="w-4 h-4" />
                  </motion.button>
                </Tooltip>
              )}
              
              <Tooltip content="Raccourcis clavier" position="bottom">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Show keyboard shortcuts (implementation would go here)
                  }}
                >
                  <FiCommand className="w-4 h-4" />
                </motion.button>
              </Tooltip>
              
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onClose()}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all"
              >
                <FiX className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
          
          {/* Tab navigation */}
          <div className="flex border-b border-gray-100">
            <motion.button
              whileHover={{ backgroundColor: '#f9fafb' }}
              className={`px-4 py-3 text-sm font-medium relative ${activeTab === 'details' ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => setActiveTab('details')}
            >
              Détails
              {activeTab === 'details' && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                />
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ backgroundColor: '#f9fafb' }}
              className={`px-4 py-3 text-sm font-medium relative ${activeTab === 'schedule' ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => setActiveTab('schedule')}
            >
              Planification
              {activeTab === 'schedule' && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                />
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ backgroundColor: '#f9fafb' }}
              className={`px-4 py-3 text-sm font-medium relative ${activeTab === 'attendees' ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => setActiveTab('attendees')}
            >
              Participants
              {activeTab === 'attendees' && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                />
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ backgroundColor: '#f9fafb' }}
              className={`px-4 py-3 text-sm font-medium relative ${activeTab === 'notes' ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => setActiveTab('notes')}
            >
              Notes
              {activeTab === 'notes' && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                />
              )}
            </motion.button>
          </div>
          
          {/* Modal body with animated transitions between tabs */}
          <form onSubmit={handleSubmit}>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Details Tab */}
                  {activeTab === 'details' && (
                    <div className="space-y-6">
                      {/* Title with smart suggestions */}
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                          Titre
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            disabled={!isEditMode}
                            className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:bg-gray-50 text-gray-500"
                            required
                            placeholder="Titre de l'événement"
                          />
                          {isEditMode && (
                            <Tooltip content="Modèles d'événement" position="left">
                              <button
                                type="button"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
                              >
                                <FiHash className="w-4 h-4" />
                              </button>
                            </Tooltip>
                          )}
                        </div>
                        
                        {/* Template suggestions - only show when editing and title field is empty */}
                        {isEditMode && !formData.title && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {templateSuggestions.map((template, idx) => (
                              <motion.button
                                key={idx}
                                type="button"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-3 py-1.5 text-xs bg-gray-50 hover:bg-gray-100 rounded-full text-gray-700 flex items-center gap-1"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    title: template.name,
                                    category: template.category,
                                    end: new Date(new Date(formData.start).getTime() + template.duration * 60000)
                                  });
                                }}
                              >
                                <span>{template.name}</span>
                                <FiArrowRight className="w-3 h-3" />
                              </motion.button>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Category and priority */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                            Type d&apos;événement
                          </label>
                          <div className="relative">
                            <select
                              id="category"
                              name="category"
                              value={formData.category}
                              onChange={handleInputChange}
                              disabled={!isEditMode}
                              className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:bg-gray-50 text-gray-500 appearance-none"
                              style={{
                                background: isEditMode ? 'white' : `linear-gradient(90deg, ${categoryColor}05 0%, white 50%)`
                              }}
                            >
                              {Object.entries(eventCategories).map(([id, category]) => (
                                <option key={id} value={id}>{category.name}</option>
                              ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                              <FiChevronDown className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                            Priorité
                          </label>
                          <div className="relative">
                            <select
                              id="priority"
                              name="priority"
                              value={formData.priority}
                              onChange={handleInputChange}
                              disabled={!isEditMode}
                              className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:bg-gray-50 text-gray-500 appearance-none"
                            >
                              {priorities.map((priority) => (
                                <option key={priority.id} value={priority.id}>{priority.name}</option>
                              ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                              <FiChevronDown className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Contact with avatar */}
                      <div>
                        <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                          Contact principal
                        </label>
                        <div className="relative">
                          <select
                            id="contact"
                            name="contact"
                            value={formData.contact}
                            onChange={handleInputChange}
                            disabled={!isEditMode}
                            className="w-full pl-12 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:bg-gray-50 text-gray-500 appearance-none"
                          >
                            {sampleContacts.map((contact) => (
                              <option key={contact.id} value={contact.id}>{contact.name} - {contact.company}</option>
                            ))}
                          </select>
                          <div className="absolute left-2 top-1/2 -translate-y-1/2">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                              {sampleContacts.find(c => c.id === Number(formData.contact))?.name.charAt(0) || '?'}
                            </div>
                          </div>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <FiChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Location with map icon and suggestions */}
                      <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                          Lieu
                          {formData.location && !isEditMode && (
                            <Tooltip content="Voir sur la carte" position="right">
                              <button
                                type="button"
                                className="p-1 text-indigo-600 rounded-full hover:bg-indigo-50"
                              >
                                <FiNavigation className="w-3 h-3" />
                              </button>
                            </Tooltip>
                          )}
                        </label>
                        <div className="relative">
                          <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleLocationInputChange}
                            onFocus={() => isEditMode && setShowSuggestions(true)}
                            onBlur={() => {
                              // Delay hiding suggestions to allow clicking on them
                              setTimeout(() => setShowSuggestions(false), 200);
                            }}
                            disabled={!isEditMode}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:bg-gray-50 text-gray-500"
                            placeholder="Ajouter un lieu"
                          />
                          
                          {/* Loading indicator */}
                          {isLoadingAddresses && (
                            <motion.div 
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                              <FiRefreshCw className="w-4 h-4 text-indigo-400" />
                            </motion.div>
                          )}
                          
                          {/* Address suggestions dropdown */}
                          {showSuggestions && addressSuggestions.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto"
                            >
                              {addressSuggestions.map((suggestion, index) => (
                                <motion.div
                                  key={index}
                                  whileHover={{ backgroundColor: "#f3f4f6" }}
                                  className="px-3 py-2 cursor-pointer hover:bg-gray-50 text-sm text-gray-700 border-b border-gray-100 last:border-0"
                                  onClick={() => handleSelectAddress(suggestion)}
                                >
                                  <div className="flex items-center gap-2">
                                    <FiMapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                    <div>
                                      <div className="font-medium">{suggestion.properties.name}</div>
                                      {suggestion.properties.city && (
                                        <div className="text-xs text-gray-500">
                                          {suggestion.properties.postcode} {suggestion.properties.city}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                        </div>
                      </div>
                      
                      {/* Description with rich text controls */}
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        {isEditMode && (
                          <div className="flex items-center gap-1 mb-2 border-b border-gray-100 pb-2">
                            <Tooltip content="Gras" position="top">
                              <button
                                type="button"
                                className="p-1.5 rounded hover:bg-gray-100 text-gray-700"
                              >
                                <FiBold className="w-3.5 h-3.5" />
                              </button>
                            </Tooltip>
                            <Tooltip content="Lien" position="top">
                              <button
                                type="button"
                                className="p-1.5 rounded hover:bg-gray-100 text-gray-700"
                              >
                                <FiLink className="w-3.5 h-3.5" />
                              </button>
                            </Tooltip>
                          </div>
                        )}
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          disabled={!isEditMode}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:bg-gray-50 text-gray-500"
                          placeholder="Description détaillée de l'événement"
                        ></textarea>
                      </div>
                    </div>
                  )}
                  
                  {/* Schedule Tab */}
                  {activeTab === 'schedule' && (
                    <div className="space-y-6">
                      {/* Date and time with improved UI */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="start" className="block text-sm font-medium text-gray-700 mb-1">
                            Début
                          </label>
                          <div className="relative">
                            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="datetime-local"
                              id="start"
                              name="start"
                              value={formatDateForInput(formData.start)}
                              onChange={handleInputChange}
                              disabled={!isEditMode}
                              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:bg-gray-50 text-gray-500"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="end" className="block text-sm font-medium text-gray-700 mb-1">
                            Fin
                          </label>
                          <div className="relative">
                            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="datetime-local"
                              id="end"
                              name="end"
                              value={formatDateForInput(formData.end)}
                              onChange={handleInputChange}
                              disabled={!isEditMode || formData.allDay}
                              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:bg-gray-50 text-gray-500"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Duration indicator */}
                      {!formData.allDay && (
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <FiClock className="text-indigo-400" />
                          <span>
                            Durée : {Math.round((new Date(formData.end).getTime() - new Date(formData.start).getTime()) / (1000 * 60))} minutes
                          </span>
                        </div>
                      )}
                      
                      {/* All day switch with better styling */}
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <label htmlFor="allDay" className="text-sm font-medium text-gray-700 block">
                            Journée entière
                          </label>
                          <p className="text-xs text-gray-500 mt-0.5">
                            L&apos;événement durera toute la journée
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            id="allDay"
                            name="allDay"
                            checked={formData.allDay}
                            onChange={handleInputChange}
                            disabled={!isEditMode}
                            className="sr-only"
                          />
                          <div className={`w-12 h-6 rounded-full transition-colors ${formData.allDay ? 'bg-indigo-600' : 'bg-gray-200'} ${!isEditMode ? 'opacity-60' : ''}`}>
                            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${formData.allDay ? 'translate-x-7' : 'translate-x-1'}`}></div>
                          </div>
                        </label>
                      </div>
                      
                      {/* Recurrence options */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <label htmlFor="isRecurring" className="text-sm font-medium text-gray-700 block">
                              Récurrence
                            </label>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Répéter l&apos;événement selon un schéma
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              id="isRecurring"
                              name="isRecurring"
                              checked={formData.isRecurring}
                              onChange={handleInputChange}
                              disabled={!isEditMode}
                              className="sr-only"
                            />
                            <div className={`w-12 h-6 rounded-full transition-colors ${formData.isRecurring ? 'bg-indigo-600' : 'bg-gray-200'} ${!isEditMode ? 'opacity-60' : ''}`}>
                              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${formData.isRecurring ? 'translate-x-7' : 'translate-x-1'}`}></div>
                            </div>
                          </label>
                        </div>
                        
                        {/* Show recurrence options when recurring is enabled */}
                        {formData.isRecurring && (
                          <AnimatePresence>
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-3 border-l-2 border-indigo-200"
                            >
                              <div className="space-y-3 pt-2">
                                <div>
                                  <label htmlFor="recurrencePattern" className="block text-sm font-medium text-gray-700 mb-1">
                                    Fréquence
                                  </label>
                                  <div className="relative">
                                    <FiRepeat className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <select
                                      id="recurrencePattern"
                                      name="recurrencePattern"
                                      value={formData.recurrencePattern}
                                      onChange={handleInputChange}
                                      disabled={!isEditMode}
                                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:bg-gray-50 text-gray-500 appearance-none"
                                    >
                                      <option value="daily">Quotidienne</option>
                                      <option value="weekly">Hebdomadaire</option>
                                      <option value="biweekly">Toutes les deux semaines</option>
                                      <option value="monthly">Mensuelle</option>
                                      <option value="yearly">Annuelle</option>
                                      <option value="custom">Personnalisée</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                      <FiChevronDown className="w-4 h-4" />
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Visual recurrence summary */}
                                <div className="bg-indigo-50 p-3 rounded-lg">
                                  <div className="text-xs text-indigo-700 font-medium">
                                    <div className="flex items-center gap-2">
                                      <FiInfo className="w-4 h-4" />
                                      <span>Résumé de la récurrence</span>
                                    </div>
                                    <div className="mt-1 pl-6">
                                      {getRecurrenceText()}
                                      {formData.recurrencePattern !== 'none' && `, à partir du ${new Date(formData.start).toLocaleDateString('fr-FR')}`}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </AnimatePresence>
                        )}
                      </div>
                      
                      {/* Reminder settings */}
                      <div>
                        <label htmlFor="reminderTime" className="block text-sm font-medium text-gray-700 mb-1">
                          Rappel
                        </label>
                        <div className="relative">
                          <FiBell className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <select
                            id="reminderTime"
                            name="reminderTime"
                            value={formData.reminderTime}
                            onChange={handleInputChange}
                            disabled={!isEditMode}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:bg-gray-50 text-gray-500 appearance-none"
                          >
                            <option value="0">Pas de rappel</option>
                            <option value="5">5 minutes avant</option>
                            <option value="15">15 minutes avant</option>
                            <option value="30">30 minutes avant</option>
                            <option value="60">1 heure avant</option>
                            <option value="120">2 heures avant</option>
                            <option value="1440">1 jour avant</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <FiChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Attendees Tab */}
                  {activeTab === 'attendees' && (
                    <div className="space-y-6">
                      <div className="flex flex-col items-center justify-center py-6 text-center px-4 bg-gray-50 rounded-lg">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                          <FiUsers className="w-8 h-8 text-indigo-500" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-700 mb-1">Gestion des participants</h3>
                        <p className="text-xs text-gray-500 mb-4 max-w-md">
                          Invitez des contacts à cet événement, suivez leur réponse et envoyez des rappels
                        </p>
                        {isEditMode && (
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            type="button"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 font-medium text-sm flex items-center gap-2"
                          >
                            <FiUserPlus className="w-4 h-4" />
                            Ajouter des participants
                          </motion.button>
                        )}
                      </div>
                      
                      {/* Sample attendees UI */}
                      <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
                        <div className="p-3 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium">
                              M
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-800">Marie Dupont</div>
                              <div className="text-xs text-gray-500">marie.dupont@example.com</div>
                            </div>
                          </div>
                          <StatusBadge status="success" text="Accepté" />
                        </div>
                        
                        <div className="p-3 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-medium">
                              J
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-800">Jean Martin</div>
                              <div className="text-xs text-gray-500">jean.martin@example.com</div>
                            </div>
                          </div>
                          <StatusBadge status="pending" text="En attente" />
                        </div>
                        
                        <div className="p-3 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-medium">
                              S
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-800">Sophie Leclerc</div>
                              <div className="text-xs text-gray-500">sophie.leclerc@example.com</div>
                            </div>
                          </div>
                          <StatusBadge status="error" text="Refusé" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Notes Tab */}
                  {activeTab === 'notes' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                          Notes personnelles
                        </label>
                        <p className="text-xs text-gray-500">
                          Ces notes ne sont visibles que par vous et ne sont pas partagées avec les participants
                        </p>
                        <textarea
                          id="notes"
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          disabled={!isEditMode}
                          rows={5}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:bg-gray-50 text-gray-500"
                          placeholder="Ajoutez vos notes personnelles ici..."
                        ></textarea>
                      </div>
                      
                      {/* Attachments section */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="block text-sm font-medium text-gray-700">
                            Pièces jointes
                          </label>
                          {isEditMode && (
                            <button 
                              type="button"
                              className="text-xs text-indigo-600 font-medium flex items-center gap-1"
                            >
                              <FiPlusCircle className="w-3.5 h-3.5" />
                              Ajouter un fichier
                            </button>
                          )}
                        </div>
                        
                        {/* Sample attachment */}
                        <div className="border border-gray-200 rounded-lg p-3 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded">
                              <FiFileText className="w-4 h-4 text-blue-500" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-800">Présentation.pdf</div>
                              <div className="text-xs text-gray-500">2.4 MB - Ajouté le 24/03/2025</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              type="button"
                              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all"
                            >
                              <FiDownload className="w-4 h-4" />
                            </button>
                            {isEditMode && (
                              <button 
                                type="button"
                                className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-full transition-all"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Modal footer with enhanced action buttons */}
            <div className="p-6 border-t border-gray-100 flex justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                {formData.id && mode !== 'create' && (
                  <Tooltip content="Supprimer cet événement">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => onDelete(formData.id)}
                      className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium flex items-center gap-2 transition-all shadow-sm"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      Supprimer
                    </motion.button>
                  </Tooltip>
                )}
                
                {mode !== 'create' && (
                  <Tooltip content="Partager cet événement">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      className="p-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
                    >
                      <FiShare2 className="w-4 h-4" />
                    </motion.button>
                  </Tooltip>
                )}
              </div>
              
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => onClose()}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all shadow-sm"
                >
                  Annuler
                </motion.button>
                
                {isEditMode && (
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 8px 20px rgba(79, 70, 229, 0.2)' }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium flex items-center gap-2 transition-all shadow-md"
                  >
                    <FiCheck className="w-4 h-4" />
                    Enregistrer
                  </motion.button>
                )}
                
                {!isEditMode && (
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 8px 20px rgba(79, 70, 229, 0.2)' }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => onClose('edit')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium flex items-center gap-2 transition-all shadow-md"
                  >
                    <FiEdit className="w-4 h-4" />
                    Modifier
                  </motion.button>
                )}
              </div>
            </div>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default EventModal;