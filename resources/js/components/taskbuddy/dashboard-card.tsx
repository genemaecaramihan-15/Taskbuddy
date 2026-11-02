import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface DashboardCardProps {
    title: string;
    value: number | string;
    subtitle?: string;
    icon: LucideIcon;
    iconColor?: string;
    iconBg?: string;
    badge?: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

export function DashboardCard({
    title,
    value,
    subtitle,
    icon: Icon,
    iconColor = 'text-primary',
    iconBg = 'bg-primary/10',
    badge,
    onClick,
    className = '',
}: DashboardCardProps) {
    return (
        <Card
            onClick={onClick}
            className={`min-h-[174px] overflow-hidden border border-border/70 shadow-xs transition-all duration-200 hover:shadow-md ${className} ${
                onClick ? 'cursor-pointer hover:border-primary/50' : ''
            }`}
        >
            <CardContent className="flex min-h-[174px] flex-col justify-center p-5">
                <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-muted-foreground">{title}</span>
                    <div className={`flex size-9 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}>
                        <Icon className="size-5" />
                    </div>
                </div>

                <div className="mt-3 flex items-baseline justify-between gap-2">
                    <span className="text-3xl font-bold tracking-tight text-foreground">{value}</span>
                    {badge}
                </div>

                {subtitle && (
                    <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
                )}
            </CardContent>
        </Card>
    );
}

