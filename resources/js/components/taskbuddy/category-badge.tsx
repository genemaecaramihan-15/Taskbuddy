import type { Category } from '@/types';

export function CategoryBadge({ category }: { category?: Category | null }) {
    if (!category) return null;

    return (
        <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: `${category.color}20`, color: category.color }}>
            <span className="size-1.5 rounded-full" style={{ backgroundColor: category.color }} />
            {category.name}
        </span>
    );
}
