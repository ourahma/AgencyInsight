export interface Agency {
  id: string;
  name: string;
  city: string;
  address?: string;
  phone?: string;
}

export interface AgencyWithDetails extends Agency {
  state_code?: string;
  type?: string;
  population?: number | null;
  website?: string;
  county?: string;
  created_at?: string;
  updated_at?: string;
}

// Type pour les données brutes du CSV
export interface AgencyCSVRow {
  name: string;
  state: string;
  state_code?: string;
  type?: string;
  population?: number | null;
  website?: string;
  total_schools?: number;
  total_students?: number;
  mailing_address?: string;
  grade_span?: string;
  locale?: string;
  csa_cbsa?: string;
  domain_name?: string;
  physical_address?: string;
  phone?: string;
  status?: string;
  student_teacher_ratio?: number;
  supervisory_union?: string;
  county?: string;
  created_at?: string;
  updated_at?: string;
  id: string;
}

// Types pour les Contacts
export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title?: string;
  agencyId?: string;
  department?: string;
}

export interface ContactWithDetails extends Contact {
  email_type?: string;
  contact_form_url?: string;
  firm_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ContactCSVRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  title?: string;
  email_type?: string;
  contact_form_url?: string;
  created_at?: string;
  updated_at?: string;
  agency_id?: string;
  firm_id?: string;
  department?: string;
}

export interface UserUsage {
  userId: string;
  date: string;
  contactsViewed: number;
}

export interface StatsData {
  contactsViewed: number;
  totalContacts: number;
  totalAgencies: number;
  dailyLimit: number;
}

export interface NavbarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}
