<?php

use App\Models\User;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;
use function Pest\Laravel\patchJson;
use function Pest\Laravel\deleteJson;

describe('Retrieving user tasks', function () {
    it('returns tasks only for authenticated user', function () {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
    
        // Tasks belonging to authenticated user
        $task1 = Task::factory()->create(['user_id' => $user->id]);
        $task2 = Task::factory()->create(['user_id' => $user->id]);
    
        // Task belonging to someone else
        Task::factory()->create(['user_id' => $otherUser->id]);
    
        $response = actingAs($user)->getJson('/api/tasks');
    
        $response->assertStatus(200);
        $response->assertJsonCount(2, 'data');
    });

    it('can filter tasks by created_at', function() {
        $user = User::factory()->create();

        // Tasks belonging to authenticated user
        $task1 = Task::factory()->create([
            'user_id' => $user->id,
            'created_at' => '2025-11-20 00:00:00',
        ]);
        $task2 = Task::factory()->create([
            'user_id' => $user->id,
            'created_at' => '2025-11-21 00:00:00',
        ]);

        $response = actingAs($user)->getJson('/api/tasks?created_at_date=2025-11-20');

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');

        $response->assertJsonFragment([
            'id' => 1, // $task1 id
        ]);
    });

    it('can search tasks by description', function() {
        $user = User::factory()->create();

        // Tasks belonging to authenticated user
        $task1 = Task::factory()->create([
            'user_id' => $user->id,
            'description' => 'This is a test 1',
        ]);
        $task2 = Task::factory()->create([
            'user_id' => $user->id,
            'description' => 'This is a test 2',
        ]);

        $response = actingAs($user)->getJson('/api/tasks?search=test 1');

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');

        $response->assertJsonFragment([
            'id' => 1, // $task1 id
        ]);
    });
    
    it('returns empty array if user has no tasks', function () {
        $user = User::factory()->create();
    
        $response = actingAs($user)->getJson('/api/tasks');
    
        $response->assertStatus(200);
        $response->assertJsonCount(0, 'data');
    });
    
    it('returns tasks with correct structure', function () {
        $user = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user->id]);
    
        $response = actingAs($user)->getJson('/api/tasks');
    
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'description', 'done', 'created_at', 'updated_at']
                ]
            ]);
    });
    
    it('returns 401 for guests', function () {
        $response = getJson('/api/tasks');
    
        $response->assertStatus(401);
    });
});

describe('Create user tasks data', function () {
    it('creates a new task for the authenticated user', function () {
        $user = User::factory()->create();

        $payload = [
            'description' => 'New task',
        ];

        $response = actingAs($user)->postJson('/api/tasks', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('data.description', 'New task')
            ->assertJsonPath('data.user_id', $user->id);

        // Check database
        assertDatabaseHas('tasks', [
            'description' => 'New task',
            'user_id' => $user->id,
        ]);
    });

    it('fails when description is missing', function () {
        $user = User::factory()->create();

        $payload = []; // empty payload

        $response = actingAs($user)->postJson('/api/tasks', $payload);

        $response->assertStatus(422); // Laravel validation returns 422 for FormRequest
        $response->assertJsonValidationErrors(['description']);
    });

    it('does not allow unauthenticated users to create tasks', function () {
        $payload = [
            'description' => 'Task without auth',
        ];

        $response = postJson('/api/tasks', $payload);

        $response->assertStatus(401);
    });
});

describe('Show specific Task', function () {
    it('returns the specified task', function () {
        $user = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user->id]);

        $response = actingAs($user)->getJson("/api/tasks/{$task->id}");

        $response->assertStatus(200)
                 ->assertJsonPath('data.id', $task->id)
                 ->assertJsonPath('data.description', $task->description)
                 ->assertJsonPath('data.done', (int) $task->done);
    });

    it('returns 404 if task does not exist', function () {
        $user = User::factory()->create();

        $response = actingAs($user)->getJson("/api/tasks/999999"); // Non-existent ID

        $response->assertStatus(404);
    });

    it('returns 401 for guests', function () {
        $task = Task::factory()->create();

        $response = getJson("/api/tasks/{$task->id}");

        $response->assertStatus(401);
    });
});

describe('Update Task', function () {
    it('updates a task successfully', function () {
        $user = User::factory()->create();
        $task = Task::factory()->create([
            'user_id' => $user->id,
            'description' => 'Old description',
            'done' => false,
        ]);

        $payload = [
            'description' => 'Updated description',
            'done' => true,
        ];

        $response = actingAs($user)->patchJson("/api/tasks/{$task->id}", $payload);

        $response->assertStatus(200)
                 ->assertJsonPath('data.id', $task->id)
                 ->assertJsonPath('data.description', 'Updated description')
                 ->assertJsonPath('data.done', true);

        assertDatabaseHas('tasks', [
            'id' => $task->id,
            'description' => 'Updated description',
            'done' => true,
        ]);
    });

    it('updates only fields present in the request', function () {
        $user = User::factory()->create();
        $task = Task::factory()->create([
            'user_id' => $user->id,
            'description' => 'Old description',
            'done' => false,
        ]);

        $payload = [
            'description' => 'Partial update',
        ];

        $response = actingAs($user)->patchJson("/api/tasks/{$task->id}", $payload);

        $response->assertStatus(200)
                 ->assertJsonPath('data.description', 'Partial update')
                 ->assertJsonPath('data.done', (int) false); // unchanged

        assertDatabaseHas('tasks', [
            'id' => $task->id,
            'description' => 'Partial update',
            'done' => false,
        ]);
    });

    it('returns 422 if validation fails', function () {
        $user = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user->id]);

        $payload = [
            'done' => 'not-boolean',
        ];

        $response = actingAs($user)->patchJson("/api/tasks/{$task->id}", $payload);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['done']);
    });

    it('does not allow updating tasks of other users', function () {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $otherUser->id]);

        $payload = [
            'description' => 'Hack attempt',
        ];

        $response = actingAs($user)->patchJson("/api/tasks/{$task->id}", $payload);

        $response->assertStatus(404);
    });

    it('returns 401 for guests', function () {
        $task = Task::factory()->create();

        $payload = [
            'description' => 'Update attempt',
        ];

        $response = patchJson("/api/tasks/{$task->id}", $payload);

        $response->assertStatus(401);
    });
});

describe('Delete Task', function () {
    it('deletes a task successfully', function () {
        $user = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user->id]);

        $response = actingAs($user)->deleteJson("/api/tasks/{$task->id}");

        $response->assertNoContent(); // 204 status

        assertDatabaseMissing('tasks', [
            'id' => $task->id,
        ]);
    });

    it('does not allow deleting tasks of other users', function () {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $otherUser->id]);

        $response = actingAs($user)->deleteJson("/api/tasks/{$task->id}");

        $response->assertStatus(404);
        assertDatabaseHas('tasks', [
            'id' => $task->id,
        ]);
    });

    it('returns 401 for guests', function () {
        $task = Task::factory()->create();

        $response = deleteJson("/api/tasks/{$task->id}");

        $response->assertStatus(401);
        assertDatabaseHas('tasks', [
            'id' => $task->id,
        ]);
    });
});

describe('Sort Tasks', function() {
    it('updates the sort order of the tasks successfully using the given array of task ids in designated order.', function() {
        $user = User::factory()->create();

        // Create 5 tasks and get their IDs
        $tasks = Task::factory(5)->create(['user_id' => $user->id]);

        $payload = [
            'taskIds' => [
                $tasks[2]->id, // 3rd task first
                $tasks[1]->id, // 2nd task second
                $tasks[3]->id, // 4th task third
                $tasks[0]->id, // 1st task fourth
                $tasks[4]->id, // 5th task last
            ],
        ];

        $response = actingAs($user)->patchJson("/api/tasks-reorder", $payload);

        $response->assertStatus(204);

        // Refresh tasks from database to check sort_order
        $tasks->each(fn($task) => $task->refresh());

        // Assert that sort_order matches the index in payload
        foreach ($payload['taskIds'] as $index => $taskId) {
            $task = Task::find($taskId);
            $this->assertEquals($index, $task->sort_order);
        }
    });

    it('returns a 403 error if 1 or more of the task Ids doesnt belong the authenticated user.', function() {
        $user = User::factory()->create();
        $tasks = Task::factory(5)->create(['user_id' => $user->id]);

        $user2 = User::factory()->create();
        $tasks2 = Task::factory(5)->create(['user_id' => $user2->id]);

        $payload = [
            'taskIds' => [
                $tasks2[2]->id, // task of not authenticated user
                $tasks[1]->id,
                $tasks2[3]->id, // task of not authenticated user
                $tasks[0]->id,
                $tasks[4]->id,
            ],
        ];

        $response = actingAs($user)->patchJson("/api/tasks-reorder", $payload);

        $response->assertStatus(403);
    });

    it('returns a 422 error if there is a non numeric data in the set of task ids.', function() {
        $payload = [
            'taskIds' => ['non numeric', 1, 2, 5],
        ];

        $user = User::factory()->create();
        $response = actingAs($user)->patchJson("/api/tasks-reorder", $payload);

        $response->assertStatus(422);
    });
});