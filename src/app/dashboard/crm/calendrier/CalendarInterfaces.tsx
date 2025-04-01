import React from 'react';

// Define a proper type for attachments
export interface AttachmentType {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  addedAt: Date;
}

// Define a proper type for attendees with attendance status
export interface AttendeeType {
  id: number;
  name: string;
  email: string;
  status: 'accepted' | 'pending' | 'declined';
  avatar?: string;
}

// Define a FilterValueType to replace 'any' in filter functions
export type FilterValueType = string | string[] | boolean;

// Event types
export interface EventType {
  id: string;
  title: string;
  start: Date;
  end: Date;
  category: string;
  contact: number;
  priority: string;
  description: string;
  location: string;
  allDay: boolean;
  isRecurring?: boolean;
  recurrencePattern?: string;
  reminderTime?: string;
  notes?: string;
  attachments?: AttachmentType[];
  attendees?: AttendeeType[];
}

// Event category definitions
export interface EventCategoryType {
  name: string;
  color: string;
  icon: React.ReactElement; // Specific React element type
}

export interface EventCategoriesType {
  [key: string]: EventCategoryType;
}

// Priority definitions
export interface PriorityType {
  id: string;
  name: string;
  color: string;
}

// Contact definition
export interface ContactType {
  id: number;
  name: string;
  company: string;
  avatar: string;
}

// Filter types
export interface FilterType {
  categories: string[];
  priority: string[];
  search: string;
  dateRange: string;
  showCompleted: boolean;
}

// Calendar day data
export interface CalendarDayType {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isPrevMonth?: boolean;
  isToday?: boolean;
}

// Component props interfaces
export interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'pending';
  text: string;
  size?: 'sm' | 'md' | 'lg';
}

export interface WeatherIndicatorProps {
  condition?: 'clear' | 'cloudy' | 'rain' | 'snow';
  temperature?: number;
}

export interface CircleStatProps {
  icon: React.ReactNode;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  onClick?: () => void;
}

export interface EventModalProps {
  event: EventType | null;
  isOpen: boolean;
  onClose: (nextMode?: string) => void;
  onSave: (eventData: EventType) => void;
  onDelete: (eventId: string) => void;
  mode?: 'view' | 'edit' | 'create';
}

// Form data interface
export interface EventFormData extends EventType {
  isRecurring: boolean;
  recurrencePattern: string;
  reminderTime: string;
  notes: string;
  attachments: AttachmentType[];
  attendees: AttendeeType[];
}

// Slot data for creating new events
export interface SlotData {
  date: Date;
  start?: Date;
  end?: Date;
  defaultCategory?: string;
}

// Position data for drag and drop operations
export interface PositionData {
  x: number;
  y: number;
}

export interface SelectionBoxType {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface CreationAreaType {
  date: Date;
  top: number;
  height: number;
}

export interface DropTargetIndicatorType {
  x: number;
  y: number;
}

// Views props interfaces
export interface MonthViewProps {
  currentDate: Date;
  events: EventType[];
  onEventClick: (event: EventType) => void;
  onSlotClick: (slot: SlotData) => void;
  onDragStart: (event: EventType, e: React.MouseEvent) => void;
  onDragEnter: (date: Date, element: HTMLElement) => void;
  onDragEnd: () => void;
  selectedEvents: string[];
  draggedOver: Date | null;
}

export interface WeekViewProps {
  currentDate: Date;
  events: EventType[];
  onEventClick: (event: EventType) => void;
  onSlotClick: (slot: SlotData) => void;
  onDragStart: (event: EventType, e: React.MouseEvent) => void;
  onDragEnter: (date: Date, element: HTMLElement) => void;
  onDragEnd: () => void;
  nowIndicatorPosition: number;
  timeGridRef?: React.MutableRefObject<HTMLDivElement | null>;
  selectedEvents: string[];
  draggedOver: Date | null;
}

export interface DayViewProps {
  currentDate: Date;
  events: EventType[];
  onEventClick: (event: EventType) => void;
  onSlotClick: (slot: SlotData) => void;
  nowIndicatorPosition: number;
  timeGridRef?: React.MutableRefObject<HTMLDivElement | null>;
}

export interface CalendarSidebarProps {
  filter: FilterType;
  onFilterChange: (key: string, value: FilterValueType) => void;
  onCategoryToggle: (category: string) => void;
  onPriorityToggle: (priority: string) => void;
  events: EventType[];
  onEventClick: (event: EventType) => void;
  onCreateEvent: (mode: 'view' | 'edit' | 'create', event: EventType | null, slot: SlotData | null) => void;
}

// Status colors mapping
export interface StatusColorType {
  bg: string;
  text: string;
  icon: React.ReactNode;
}

export interface StatusColorsType {
  [key: string]: StatusColorType;
}

// Size classes mapping
export interface SizeClassesType {
  [key: string]: string;
}

export interface CircleSizeClassesType {
  [key: string]: {
    container: string;
    icon: string;
  };
}

// Weather icons mapping
export interface WeatherIconsType {
  [key: string]: React.ReactNode;
}

// Event style return type
export interface EventStyleType {
  backgroundColor: string;
  borderLeft: string;
  opacity: string;
}

// Event position calculation return type
export interface EventPositionType {
  top: number;
  height: number;
}

// Time slot type
export interface TimeSlotType {
  hour: number;
  time: string;
}

// Interface for address properties returned by the API
export interface AddressProperties {
  label: string;
  name: string;
  city?: string;
  postcode?: string;
}

// Interface for address features returned by the API
export interface AddressFeature {
  properties: AddressProperties;
}

// Interface for the address suggestion response
export interface AddressSuggestionResponse {
  features: AddressFeature[];
}