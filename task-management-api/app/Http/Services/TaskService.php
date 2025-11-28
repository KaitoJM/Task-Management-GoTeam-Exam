<?php

namespace App\Http\Services;

use App\Models\Task;

class TaskService
{
    /**
     * Get tasks for the given user with optional filters.
     *
     * @param  int  $userId
     * @param  array{
     *     created_at_date?: string|null,
     *     search?: string|null
     * }  $params
     * @return \Illuminate\Database\Eloquent\Collection<int, \App\Models\Task>
     */
    public function getTasks(int $userId, $params = [])
    {
        // Initial query of getting the task of the authenticated user.
        $query = Task::where('user_id', $userId);

        // Filter by created_at date
        if (isset($params['created_at_date'])) {
            $date = $params['created_at_date'];

            $query->whereDate('created_at', $date);
        }

        // Filter by description
        if (isset($params['search'])) {
            $query->where('description', 'LIKE', '%' . $params['search'] . '%');
        }

        // Sort by sort_order ascending
        $query->orderBy('sort_order', 'asc');

        // Process query
        $tasks = $query->get();

        // Return a collection of the tasks.
        return $query->get();
    }

    /**
     * Store a new task for the given user.
     *
     * @param  int  $userId
     * @param  array{
     *     description: string
     * }  $params
     * @return \App\Models\Task
     */
    public function createTask($userId, $params)
    {
        $createdTask = Task::create([
            'description' => $params['description'],
            'user_id' => $userId,
            'sort_order' => Task::where('user_id', $userId)
                ->whereDate('created_at', today())
                ->count()
        ]);

        return $createdTask;
    }

    /**
     * Get specific Task data
     * @param  int  $id
     * @return \App\Models\Task
     */
    public function showTask(string $id)
    {
        // Get task data by ID.
        $task = Task::findOrFail($id);

        // Return the tasks data.
        return $task;
    }

    /**
     * Update the specific task.
     * @param  int  $id
     * @param  array{
     *     description?: string|null
     *     done?: boolean|null
     *     sort_order?: integer|null
     * }  $params
     * @return \App\Models\Task
     */
    public function updateTask(string $id, $params)
    {
        $task = Task::where('id', $id)
            ->firstOrFail();

        $task->update($params);

        // Return the updated task data
        return $task;
    }

    /**
     * Delete specific task.
     * @param  int  $id
     * @return \App\Models\Task
     */
    public function deleteTask(string $id)
    {
        $task = Task::where('id', $id)
            ->firstOrFail();

        // Process task deletion
        $task->delete();

        return $task;
    }
}
