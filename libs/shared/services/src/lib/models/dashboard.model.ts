export interface DashboardStats {
  totalInspections: number;
  pendingReview: number;
  completedToday: number;
  activeInspectors: number;
}

export interface RecentActivity {
  id: string;
  type: 'created' | 'updated' | 'completed';
  title: string;
  description: string;
  timestamp: string;
  user: string;
}
