export type TaskStatus = 'to_do' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Category {
    id: number;
    user_id: number;
    name: string;
    color: string;
    description: string | null;
    tasks_count?: number;
    tasks?: Task[];
}

export interface Task {
    id: number;
    user_id: number;
    category_id: number | null;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    due_date: string | null;
    completed_at: string | null;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    category?: Category | null;
}

export interface DashboardStats {
    total_tasks: number;
    upcoming_tasks: number;
    pending_tasks: number;
    in_progress_tasks: number;
    completed_tasks: number;
    overdue_tasks: number;
    due_today_tasks: number;
    completion_rate: number;
}

export interface PriorityBreakdown {
    low: number;
    medium: number;
    high: number;
    urgent: number;
}

export interface TaskFilters {
    view: 'active' | 'trashed';
    search: string;
    status: string;
    priority: string;
    category_id: string | number;
    due_date: string;
    sort: string;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
    from: number | null;
    to: number | null;
}

