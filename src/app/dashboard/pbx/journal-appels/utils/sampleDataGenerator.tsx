// Define the CallLog type
interface CallLog {
  id: number;
  direction: 'Entrant' | 'Sortant' | 'Interne';
  extensionUser: string;
  callerName: string;
  debut: string;
  fin: string;
  monNumero: string;
  numeroDuContact: string;
  dureeAppel: number;
  tta: number;
  enregistrement: boolean;
  du: string;
  vers: string;
  cost: number;
  statut: 'Répondu' | 'Échoué' | 'Annulé' | 'Messagerie vocale';
}

// Generate sample data for demonstration
export const generateSampleLogs = (): CallLog[] => {
  const statuses = ['Répondu', 'Échoué', 'Annulé', 'Messagerie vocale'] as const;
  const directions = ['Entrant', 'Sortant', 'Interne'] as const;
  const extensions = ['101', '102', '103', '104', '105'];
  const callerNames = ['Alice', 'Bob', 'Charlie', 'David', 'Emma', 'Frank', 'Grace', 'Henry'];
  const phoneNumbers = [
    '+33 1 23 45 67 89', 
    '+33 6 54 32 10 98', 
    '+33 1 98 76 54 32', 
    '+33 7 12 34 56 78',
    '+33 6 87 65 43 21'
  ];
  const providers = ['SIP/ProviderA', 'SIP/ProviderB', 'SIP/Trunk1', 'SIP/Trunk2', 'Local/'];
  
  const logs: CallLog[] = [];
  
  for (let i = 1; i <= 20; i++) {
    const direction = directions[Math.floor(Math.random() * directions.length)];
    const extension = extensions[Math.floor(Math.random() * extensions.length)];
    const dureeAppel = Math.floor(Math.random() * 600); // 0-600 seconds
    const tta = Math.floor(Math.random() * 30); // 0-30 seconds
    const cost = direction === 'Sortant' ? Math.random() * 2 : 0;
    const statut = statuses[Math.floor(Math.random() * statuses.length)];
    const enregistrement = Math.random() > 0.5;
    
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 10));
    date.setHours(Math.floor(Math.random() * 12) + 8); // 8 AM to 8 PM
    date.setMinutes(Math.floor(Math.random() * 60));
    
    const debutDate = new Date(date);
    const finDate = new Date(date);
    finDate.setSeconds(finDate.getSeconds() + dureeAppel);
    
    const formatDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    };
    
    logs.push({
      id: i,
      direction,
      extensionUser: extension,
      callerName: callerNames[Math.floor(Math.random() * callerNames.length)],
      debut: formatDate(debutDate),
      fin: formatDate(finDate),
      monNumero: direction === 'Sortant' ? phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)] : extension,
      numeroDuContact: direction === 'Entrant' ? phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)] : (direction === 'Interne' ? extensions[Math.floor(Math.random() * extensions.length)] : phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)]),
      dureeAppel,
      tta,
      enregistrement,
      du: providers[Math.floor(Math.random() * providers.length)] + (direction === 'Interne' ? extension : ''),
      vers: providers[Math.floor(Math.random() * providers.length)] + (direction === 'Interne' ? extensions[Math.floor(Math.random() * extensions.length)] : ''),
      cost,
      statut,
    });
  }
  
  return logs;
};