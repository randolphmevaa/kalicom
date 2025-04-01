// File: types/crm-types.ts

export interface Prospect {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  mobilePhoneNumber: string;
  companyName: string;
  zipCode: string;
  city: string;
  country: string;
  address: string;
  email: string;
  description: string; // Make this required, not optional
  tags: string[];
  assignedTo: string;
  lastContactDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: number;
  name: string;
}

export interface FilterModel {
  id: number;
  name: string;
}

export interface FieldOption {
  id: string;
  label: string;
  checked: boolean;
}
