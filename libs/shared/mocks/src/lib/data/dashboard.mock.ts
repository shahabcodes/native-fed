import { DashboardStats, RecentActivity } from "../../../../services/src/lib/models/dashboard.model";

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalInspections: 156,
  pendingReview: 12,
  completedToday: 8,
  activeInspectors: 24,
};

export const MOCK_RECENT_ACTIVITIES: RecentActivity[] = [
  {
    id: '1',
    type: 'completed',
    title: 'Safety Inspection #1234',
    description: 'Completed by John',
    timestamp: new Date().toISOString(),
    user: 'John D.',
  },
  {
    id: '2',
    type: 'created',
    title: 'New Inspection #1235',
    description: 'Created for Building A',
    timestamp: new Date().toISOString(),
    user: 'Admin',
  },
  {
    id: '3',
    type: 'updated',
    title: 'Inspection #1230',
    description: 'Status updated',
    timestamp: new Date().toISOString(),
    user: 'Sarah M.',
  },
  {
    id: '4',
    type: 'completed',
    title: 'Fire Safety Check',
    description: 'All requirements met',
    timestamp: new Date().toISOString(),
    user: 'Mike R.',
  },
];
