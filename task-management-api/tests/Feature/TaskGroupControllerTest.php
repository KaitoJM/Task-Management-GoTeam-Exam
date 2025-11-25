<?php
use App\Models\User;
use App\Models\Task;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;

describe('Retrieve Task Group by Dates', function() {
    it('returns dates according to distinct dates of task items of the authenticated user.', function() {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        // Tasks belonging to authenticated user
        $task1 = Task::factory()->create([
            'user_id' => $user->id,
            'description' => 'Task belong to auth user 1',
            'created_at' => '2025-11-20 08:00:00'
        ]);
        $task2 = Task::factory()->create([
            'user_id' => $user->id,
            'description' => 'Task belong to auth user 1',
            'created_at' => '2025-11-22 10:00:00'
        ]);
        $task3 = Task::factory()->create([
            'user_id' => $user->id,
            'description' => 'Task belong to auth user 1',
            'created_at' => '2025-11-22 18:00:00' // same date, different time
        ]);
    
        // Task belonging to someone else
        Task::factory()->create(['user_id' => $otherUser->id]);

        $response = actingAs($user)->getJson('/api/task-groups');
    
        $response->assertStatus(200);
        $response->assertJsonCount(2, 'data');

        $response->assertJsonFragment(['2025-11-20']);
        $response->assertJsonFragment(['2025-11-22']);
    });

    it('returns empty array if user has no tasks', function () {
        $user = User::factory()->create();
    
        $response = actingAs($user)->getJson('/api/task-groups');
    
        $response->assertStatus(200);
        $response->assertJsonCount(0, 'data');
    });

    it('returns 401 for guests', function () {
        $response = getJson('/api/task-groups');
    
        $response->assertStatus(401);
    });
});
