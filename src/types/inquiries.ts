import { Avatar } from "./common";

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  avatar: Avatar;
}

export interface Inquiry {
  id: string;
  customer_id: string;
  assignee_type: string;
  subject: string;
  description: string;
  status: ENUM_INQUIRY_STATUS;
  priority: ENUM_INQUIRY_PRIORITY;
  resolution_notes: string | null;
  created_at: number;
  updated_at: number;
  resolved_at: number | null;
  customer: Customer;
  order: any | null;
}

export enum ENUM_INQUIRY_STATUS {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
  ESCALATE = "ESCALATE",
}
export enum ENUM_INQUIRY_PRIORITY {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}
