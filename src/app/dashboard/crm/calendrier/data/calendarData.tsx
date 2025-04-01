import React from 'react';
import { 
  FiUsers, 
  FiPhoneCall, 
  FiClipboard, 
  FiClock, 
  FiUserPlus, 
  FiFileText
} from 'react-icons/fi';
import { 
  EventCategoriesType, 
  PriorityType, 
  ContactType,
  EventType
} from '../CalendarInterfaces';

// Event categories definition
export const eventCategories: EventCategoriesType = {
  "meeting": { name: "Rendez-vous", color: "#4F46E5", icon: <FiUsers /> },
  "call": { name: "Appel", color: "#10B981", icon: <FiPhoneCall /> },
  "task": { name: "Tâche", color: "#F59E0B", icon: <FiClipboard /> },
  "deadline": { name: "Échéance", color: "#EF4444", icon: <FiClock /> },
  "prospect": { name: "Prospection", color: "#8B5CF6", icon: <FiUserPlus /> },
  "note": { name: "Note", color: "#EC4899", icon: <FiFileText /> }
};

// Priorities definition
export const priorities: PriorityType[] = [
  { id: "high", name: "Haute", color: "#EF4444" },
  { id: "medium", name: "Moyenne", color: "#F59E0B" },
  { id: "low", name: "Basse", color: "#10B981" }
];

// Sample contacts
export const sampleContacts: ContactType[] = [
  { id: 1, name: "Marie Dupont", company: "Acme Corp", avatar: "/api/placeholder/40/40" },
  { id: 2, name: "Jean Martin", company: "Globex Inc", avatar: "/api/placeholder/40/40" },
  { id: 3, name: "Sophie Leclerc", company: "Umbrella LLC", avatar: "/api/placeholder/40/40" },
  { id: 4, name: "Thomas Bernard", company: "Stark Industries", avatar: "/api/placeholder/40/40" },
  { id: 5, name: "Émilie Rousseau", company: "Wayne Enterprises", avatar: "/api/placeholder/40/40" },
  { id: 6, name: "Alexandre Dubois", company: "LexCorp", avatar: "/api/placeholder/40/40" },
  { id: 7, name: "Laura Girard", company: "Cyberdyne Systems", avatar: "/api/placeholder/40/40" },
  { id: 8, name: "Nicolas Petit", company: "Weyland-Yutani", avatar: "/api/placeholder/40/40" }
];

// Generate sample events
export const generateEvents = (): EventType[] => {
  const events: EventType[] = [];
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  
  // Generate for current month and next two months
  for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
    const month = (currentMonth + monthOffset) % 12;
    const year = currentYear + Math.floor((currentMonth + monthOffset) / 12);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Generate 25-35 events per month
    const eventsCount = 25 + Math.floor(Math.random() * 10);
    
    for (let i = 0; i < eventsCount; i++) {
      const day = 1 + Math.floor(Math.random() * daysInMonth);
      const startHour = 8 + Math.floor(Math.random() * 9); // 8 AM to 5 PM
      const duration = [30, 60, 90, 120][Math.floor(Math.random() * 4)]; // 30min, 1h, 1h30, 2h
      
      const startDate = new Date(year, month, day, startHour);
      const endDate = new Date(year, month, day, startHour + Math.floor(duration / 60), duration % 60);
      
      // Skip if weekend
      if (startDate.getDay() === 0 || startDate.getDay() === 6) {
        continue;
      }
      
      const categoryKeys = Object.keys(eventCategories);
      const category = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
      const contact = sampleContacts[Math.floor(Math.random() * sampleContacts.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      
      const titles: Record<string, string[]> = {
        "meeting": ["Réunion avec", "Présentation pour", "Discussion avec", "Rencontre avec"],
        "call": ["Appel avec", "Suivi téléphonique avec", "Conférence téléphonique avec"],
        "task": ["Préparer proposition pour", "Envoyer devis à", "Rédiger rapport pour"],
        "deadline": ["Date limite pour", "Échéance pour", "Fin de contrat avec"],
        "prospect": ["Prospection chez", "Démonstration pour", "Visite commerciale chez"],
        "note": ["Note sur", "Mémo concernant", "Rappel pour"]
      };
      
      // Use type assertion to tell TypeScript that category is a valid key
      const titleOptions = titles[category as keyof typeof titles] || titles["meeting"];
      const titlePrefix = titleOptions[Math.floor(Math.random() * titleOptions.length)];
      const title = `${titlePrefix} ${contact.name}`;
      
      events.push({
        id: `event-${year}-${month}-${day}-${i}`,
        title,
        start: startDate,
        end: endDate,
        category,
        contact: contact.id,
        priority: priority.id,
        description: `Événement avec ${contact.name} de ${contact.company}. Prévoir les documents nécessaires.`,
        location: Math.random() > 0.5 ? "Bureau" : `${contact.company} - Paris`,
        allDay: Math.random() > 0.9
      });
    }
  }
  
  return events;
};
