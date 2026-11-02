import type { Category, TaskFilters } from '@/types';

interface FilterDropdownProps {
    filters: TaskFilters;
    categories: Category[];
    onFilterChange: (key: keyof TaskFilters, value: string) => void;
}

export function FilterDropdown({
    filters,
    categories,
    onFilterChange,
}: FilterDropdownProps) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            {/* Status Select */}
            <select
                value={filters.status}
                onChange={(e) => onFilterChange('status', e.target.value)}
                className="h-10 rounded-lg border border-input bg-background px-3 py-1.5 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
                <option value="all">All Statuses</option>
                <option value="to_do">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
            </select>

            {/* Priority Select */}
            <select
                value={filters.priority}
                onChange={(e) => onFilterChange('priority', e.target.value)}
                className="h-10 rounded-lg border border-input bg-background px-3 py-1.5 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
            </select>

            <select
                value={filters.category_id}
                onChange={(e) => onFilterChange('category_id', e.target.value)}
                className="h-10 max-w-[170px] rounded-lg border border-input bg-background px-3 py-1.5 text-sm"
            >
                <option value="categorized">Tasks in Categories</option>
                <option value="all">All Categories</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                ))}
            </select>

            {/* Due Date Preset Select */}
            <select
                value={filters.due_date}
                onChange={(e) => onFilterChange('due_date', e.target.value)}
                className="h-10 rounded-lg border border-input bg-background px-3 py-1.5 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
                <option value="all">All Dates</option>
                <option value="today">Due Today</option>
                <option value="overdue">Overdue</option>
                <option value="this_week">Due This Week</option>
                <option value="upcoming">Upcoming</option>
            </select>

            {/* Sort Select */}
            <select
                value={filters.sort}
                onChange={(e) => onFilterChange('sort', e.target.value)}
                className="h-10 rounded-lg border border-input bg-background px-3 py-1.5 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
                <option value="newest">Sort: Newest</option>
                <option value="oldest">Sort: Oldest</option>
                <option value="priority">Sort: Priority</option>
                <option value="due_date">Sort: Due Date</option>
            </select>
        </div>
    );
}

