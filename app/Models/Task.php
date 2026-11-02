<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use HasFactory, SoftDeletes;

    protected static function booted(): void
    {
        static::updating(function (Task $task): void {
            if ($task->isDirty('due_date')) {
                $task->due_tomorrow_notified_at = null;
                $task->overdue_notified_at = null;
            }
        });
    }

    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'description',
        'status',
        'priority',
        'due_date',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'due_date' => 'date',
            'completed_at' => 'datetime',
        ];
    }

    /**
     * User who owns the task.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Search scope for title and description.
     */
    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (blank($search)) {
            return $query;
        }

        return $query->where(function (Builder $q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%");
        });
    }

    /**
     * Filter by status.
     */
    public function scopeStatus(Builder $query, ?string $status): Builder
    {
        if (blank($status) || $status === 'all') {
            return $query;
        }

        return $query->where('status', $status);
    }

    /**
     * Filter by priority.
     */
    public function scopePriority(Builder $query, ?string $priority): Builder
    {
        if (blank($priority) || $priority === 'all') {
            return $query;
        }

        return $query->where('priority', $priority);
    }

    public function scopeCategory(Builder $query, $categoryId): Builder
    {
        if ($categoryId === 'categorized') {
            return $query->whereNotNull('category_id');
        }

        if (blank($categoryId) || $categoryId === 'all') {
            return $query;
        }

        return $query->where('category_id', $categoryId);
    }

    /**
     * Filter by due date preset.
     */
    public function scopeDueDatePreset(Builder $query, ?string $preset): Builder
    {
        if (blank($preset) || $preset === 'all') {
            return $query;
        }

        $today = Carbon::today();

        return match ($preset) {
            'today' => $query->whereDate('due_date', $today),
            'overdue' => $query->whereDate('due_date', '<', $today)->where('status', '!=', 'completed'),
            'this_week' => $query->whereBetween('due_date', [$today->copy()->startOfWeek(), $today->copy()->endOfWeek()]),
            'upcoming' => $query->whereDate('due_date', '>', $today),
            default => $query,
        };
    }
}

