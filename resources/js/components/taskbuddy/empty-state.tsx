import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: LucideIcon;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

export function EmptyState({
    title,
    description,
    icon: Icon = CheckSquare,
    actionLabel,
    onAction,
    className = '',
}: EmptyStateProps) {
    return (
        <div className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 p-8 text-center sm:p-12 ${className}`}>
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-8 ring-primary/5">
                <Icon className="size-7" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground">{title}</h3>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>
            {actionLabel && onAction && (
                <div className="mt-6">
                    <Button onClick={onAction} className="gap-2">
                        {actionLabel}
                    </Button>
                </div>
            )}
        </div>
    );
}

