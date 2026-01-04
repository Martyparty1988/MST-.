
export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type ProjectStatus = 'planning' | 'in-progress' | 'completed' | 'on-hold';

export interface Project {
  id: string;
  name: string;
  location: string;
  status: ProjectStatus;
  startDate: Date;
  completionDate?: Date;
  budget: number;
  assignedWorkers: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type StringStatus = 'unfinished' | 'panels_done' | 'strings_done' | 'completed';
export type StringSize = 'small' | 'medium' | 'large';

export interface SolarString {
  id: string; // "X.Y" format
  projectId: string;
  size: StringSize;
  status: StringStatus;
  lastActionDate: Date;
  workers: string[];
  position?: { x: number; y: number };
  createdAt: Date;
  updatedAt: Date;
}

export interface StringAction {
  id: string;
  stringId: string;
  workerId: string;
  action: 'created' | 'panels_installed' | 'strings_connected' | 'completed' | 'status_changed';
  newStatus: StringStatus;
  timestamp: Date;
}

export interface Worker {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  hourlyRate: number;
  avatar?: string;
  totalHours: number;
  createdAt: Date;
}

export type TimeRecordType = 'work' | 'break' | 'travel';

export interface TimeRecord {
  id: string;
  workerId: string;
  projectId: string;
  stringId?: string;
  date: Date;
  startTime: string; // HH:mm
  endTime: string;
  duration: number; // minutes
  description: string;
  type: TimeRecordType;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
  read: boolean;
}
