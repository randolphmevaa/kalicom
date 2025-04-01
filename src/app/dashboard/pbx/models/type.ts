export interface CallData {
    date: string;
    heure: string;
    appels: number;
    duree: number;
    taux: number;
    entrants?: number;
    sortants?: number;
    internes?: number;
    manques?: number;
  }
  
  export interface TimePeriod {
    id: string;
    label: string;
  }
  
  export interface ActiveCall {
    id: number;
    number: string;
    duration: string;
    status: 'answered' | 'ringing' | 'onHold' | 'internal' | string;
    location: string;
    staff: string;
    direction: 'incoming' | 'outgoing' | 'internal';
  }
  
  export interface ChartClickData {
    activePayload?: { payload: CallData }[];
  }
  