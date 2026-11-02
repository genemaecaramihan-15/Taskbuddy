<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskBuddyTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_view_dashboard(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertStatus(200);
    }

    public function test_authenticated_user_can_create_category(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/categories', [
            'name' => 'Project Alpha',
            'color' => '#3b82f6',
            'description' => 'Important alpha sprint tasks',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('categories', [
            'user_id' => $user->id,
            'name' => 'Project Alpha',
            'color' => '#3b82f6',
        ]);
    }

    public function test_user_can_create_task_and_assign_category(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->post('/tasks', [
            'title' => 'Design new dashboard UI',
            'description' => 'Use Tailwind CSS and React',
            'status' => 'to_do',
            'priority' => 'high',
            'due_date' => now()->addDays(2)->toDateString(),
            'category_id' => $category->id,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('tasks', [
            'user_id' => $user->id,
            'category_id' => $category->id,
            'title' => 'Design new dashboard UI',
            'status' => 'to_do',
            'priority' => 'high',
        ]);
    }

    public function test_user_cannot_assign_another_users_category(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $otherCategory = Category::factory()->create(['user_id' => $user2->id]);

        $response = $this->actingAs($user1)->post('/tasks', [
            'title' => 'Malicious category assignment',
            'status' => 'to_do',
            'priority' => 'low',
            'category_id' => $otherCategory->id,
        ]);

        $response->assertSessionHasErrors('category_id');
        $this->assertDatabaseMissing('tasks', [
            'title' => 'Malicious category assignment',
        ]);
    }

    public function test_user_cannot_update_another_users_task(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user2->id, 'title' => 'Private Task']);

        $response = $this->actingAs($user1)->put("/tasks/{$task->id}", [
            'title' => 'Attempted hijack',
            'status' => 'completed',
            'priority' => 'urgent',
        ]);

        $response->assertStatus(403);
        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => 'Private Task',
        ]);
    }

    public function test_user_can_toggle_task_status(): void
    {
        $user = User::factory()->create();
        $task = Task::factory()->create([
            'user_id' => $user->id,
            'status' => 'to_do',
            'completed_at' => null,
        ]);

        $response = $this->actingAs($user)->patch("/tasks/{$task->id}/status", [
            'status' => 'completed',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'status' => 'completed',
        ]);
        $this->assertNotNull($task->fresh()->completed_at);
    }

    public function test_user_can_soft_delete_and_restore_task(): void
    {
        $user = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user->id]);

        // Soft delete
        $response = $this->actingAs($user)->delete("/tasks/{$task->id}");
        $response->assertRedirect();
        $this->assertSoftDeleted('tasks', ['id' => $task->id]);

        // Restore
        $restoreResponse = $this->actingAs($user)->post("/tasks/{$task->id}/restore");
        $restoreResponse->assertRedirect();
        $this->assertNotSoftDeleted('tasks', ['id' => $task->id]);
    }

    public function test_user_cannot_delete_another_users_category(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $category = Category::factory()->create(['user_id' => $user2->id]);

        $response = $this->actingAs($user1)->delete("/categories/{$category->id}");
        $response->assertStatus(403);
        $this->assertDatabaseHas('categories', ['id' => $category->id]);
    }
}

