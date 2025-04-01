// app/dashboard/pbx/mes-lignes/data/mockData.ts
import { LineType, Device, UsageLine } from '../models/types';

export const lines: LineType[] = [
  { id: 1, extension: '101', number: '+33 1 23 45 67 89', displayNumber: '+33 1 23 45 67 89', name: 'Accueil', user: 'Thomas Martin', voicemailEnabled: true, status: 'Active', description: 'Ligne principale pour l\'accueil' },
  { id: 2, extension: '102', number: '+33 1 98 76 54 32', displayNumber: '+33 1 98 76 54 32', name: 'Support', user: 'Sophie Dubois', voicemailEnabled: false, status: 'Inactive', description: 'Ligne pour le service support client' },
  { id: 3, extension: '103', number: '+33 1 11 22 33 44', displayNumber: '+33 1 11 22 33 44', name: 'Commercial', user: 'Pierre Leroy', voicemailEnabled: true, status: 'Active', description: 'Ligne du département commercial' },
];

export const devices: Device[] = [
  { id: 1, macAddress: '00:1A:2B:3C:4D:5E', label: 'Téléphone Accueil', model: 'Aastra 6731i', line: '101', deviceUrl: 'http://192.168.1.101', status: 'Online', lastSeen: '2023-10-01 12:00' },
  { id: 2, macAddress: 'A1:B2:C3:D4:E5:F6', label: 'Softphone Support', model: 'Atcom A20', line: '102', deviceUrl: 'http://192.168.1.102', status: 'Offline', lastSeen: '2023-09-30 10:00' },
  { id: 3, macAddress: '6F:7E:8D:9C:0B:1A', label: 'Téléphone Commercial', model: 'Grandstream GXP2170', line: '103', deviceUrl: 'http://192.168.1.103', status: 'Online', lastSeen: '2023-10-01 14:00' },
];

export const usageLines: UsageLine[] = [
  { extension: '101', userName: 'Thomas Martin', aliasNumber: '+33 1 23 45 67 89', missed: 5, unanswered: 3, busy: 2, aloc: '4m12s', incomingCalls: 45, incomingDuration: 180, outgoingCalls: 28, outgoingFailed: 2, outgoingMissed: 1, outgoingDuration: 120, description: 'Ligne principale pour l\'accueil' },
  { extension: '102', userName: 'Sophie Dubois', aliasNumber: '+33 1 98 76 54 32', missed: 2, unanswered: 1, busy: 0, aloc: '3m45s', incomingCalls: 32, incomingDuration: 145, outgoingCalls: 19, outgoingFailed: 1, outgoingMissed: 0, outgoingDuration: 95, description: 'Ligne pour le service support client' },
  { extension: '103', userName: 'Pierre Leroy', aliasNumber: '+33 1 11 22 33 44', missed: 3, unanswered: 2, busy: 1, aloc: '5m23s', incomingCalls: 38, incomingDuration: 210, outgoingCalls: 25, outgoingFailed: 3, outgoingMissed: 2, outgoingDuration: 130, description: 'Ligne du département commercial' },
];
