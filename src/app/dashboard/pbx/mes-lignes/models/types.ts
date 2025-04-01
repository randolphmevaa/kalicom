export interface LineType {
    id: number;
    extension: string;
    number: string;
    displayNumber: string;
    name: string;
    user: string;
    voicemailEnabled: boolean;
    status: 'Active' | 'Inactive';
    description: string;
  }
  
  export interface Device {
    id: number;
    macAddress: string;
    label: string;
    model: string;
    line: string;
    deviceUrl: string;
    status: 'Online' | 'Offline';
    lastSeen: string;
  }
  
  export interface UsageLine {
    extension: string;
    userName: string;
    aliasNumber: string;
    missed: number;
    unanswered: number;
    busy: number;
    aloc: string;
    incomingCalls: number;
    incomingDuration: number;
    outgoingCalls: number;
    outgoingFailed: number;
    outgoingMissed: number;
    outgoingDuration: number;
    description: string;
  }
  
  // Define a type for exportable data
  export type ExportableData = LineType | UsageLine | Device;