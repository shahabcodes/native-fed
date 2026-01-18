export type InspectionStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type InspectionPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Inspection {
  id: string;
  title: string;
  description: string;
  location: string;
  status: InspectionStatus;
  priority: InspectionPriority;
  inspectorId: string;
  inspectorName: string;
  scheduledDate: string;
  completedDate?: string;
  findings?: string;
  recommendations?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface InspectionFilter {
  status?: InspectionStatus;
  priority?: InspectionPriority;
  inspectorId?: string;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
}
