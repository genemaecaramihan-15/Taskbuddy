<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            if (!Schema::hasColumn('tasks', 'due_tomorrow_notified_at')) {
                $table->timestamp('due_tomorrow_notified_at')->nullable();
            }

            if (!Schema::hasColumn('tasks', 'overdue_notified_at')) {
                $table->timestamp('overdue_notified_at')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            if (Schema::hasColumn('tasks', 'due_tomorrow_notified_at')) {
                $table->dropColumn('due_tomorrow_notified_at');
            }

            if (Schema::hasColumn('tasks', 'overdue_notified_at')) {
                $table->dropColumn('overdue_notified_at');
            }
        });
    }
};