import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function SearchBar({
    value,
    onChange,
    placeholder = 'Search tasks by title or description...',
    className = '',
}: SearchBarProps) {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (localValue !== value) {
                onChange(localValue);
            }
        }, 350);

        return () => clearTimeout(timer);
    }, [localValue, onChange, value]);

    const handleClear = () => {
        setLocalValue('');
        onChange('');
    };

    return (
        <div className={`relative flex items-center ${className}`}>
            <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
            <Input
                type="text"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                placeholder={placeholder}
                className="pl-9 pr-9 h-10 w-full rounded-lg bg-background"
            />
            {localValue && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="size-4" />
                    <span className="sr-only">Clear search</span>
                </button>
            )}
        </div>
    );
}

