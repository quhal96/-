
export enum TaskType {
  DAILY = 'daily',
  MONTHLY = 'monthly',
  PERMANENT = 'permanent',
  WORKFLOW = 'workflow'
}

export enum TaskStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  SUBMITTED = 'submitted',
  AWAITING_APPROVAL = 'awaiting_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  OVERDUE = 'overdue'
}

export enum Importance {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export interface PurchaseItem {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  price: number; // أضيف حديثاً
  itemCode: string;
  total: number;
}

export interface PurchaseData {
  serialNumber: string;
  recipient: string;
  items: PurchaseItem[];
  terms: string[];
  grandTotal: number;
}

export interface TaskLog {
  id: string;
  user: string;
  action: string;
  timestamp: string;
}

export interface Task {
  id: string;
  title: string;
  category: string;
  subCategory: string;
  importance: Importance;
  type: TaskType;
  status: TaskStatus;
  date: string;
  assignee?: string;
  department?: string;
  branch?: string;
  notes: string;
  checklist: { id: string; text: string; completed: boolean }[];
  attachments?: string[];
  progress: number;
  actualTime?: number; 
  createdAt: string;
  purchaseData?: PurchaseData;
  logs?: TaskLog[];
}

export interface Category {
  id: string;
  label: string;
  icon: any;
  color: string;
  subCategories: string[];
}

export interface DashboardStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  urgent: number;
  completionRate: number;
  totalPurchaseValue?: number;
}
