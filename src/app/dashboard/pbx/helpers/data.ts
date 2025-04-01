// app/dashboard/pbx/helpers/data.ts

import { CallData, TimePeriod } from "../models/type";

// Mock data
export const callData: CallData[] = [
    { 
      date: '2025-02-20', 
      heure: '08:00', 
      appels: 45, 
      duree: 4.2, 
      taux: 92,
      entrants: 22,
      sortants: 15,
      internes: 5,
      manques: 3
    },
    { 
      date: '2025-02-20', 
      heure: '10:00', 
      appels: 78, 
      duree: 3.8, 
      taux: 89,
      entrants: 35,
      sortants: 28,
      internes: 10,
      manques: 5
    },
    { 
      date: '2025-02-20', 
      heure: '12:00', 
      appels: 62, 
      duree: 4.5, 
      taux: 91,
      entrants: 28,
      sortants: 24,
      internes: 7,
      manques: 3
    },
    { 
      date: '2025-02-20', 
      heure: '14:00', 
      appels: 85, 
      duree: 3.9, 
      taux: 94,
      entrants: 40,
      sortants: 32,
      internes: 9,
      manques: 4
    },
    { 
      date: '2025-02-20', 
      heure: '16:00', 
      appels: 93, 
      duree: 4.8, 
      taux: 90,
      entrants: 45,
      sortants: 35,
      internes: 8,
      manques: 5
    },
    { 
      date: '2025-02-20', 
      heure: '18:00', 
      appels: 55, 
      duree: 4.1, 
      taux: 88,
      entrants: 25,
      sortants: 20,
      internes: 6,
      manques: 4
    },
  ];
  
  export const timePeriods: TimePeriod[] = [
    { id: 'day', label: 'Jour' },
    { id: 'week', label: 'Semaine' },
    { id: 'month', label: 'Mois' },
    { id: 'year', label: 'Année' },
  ];