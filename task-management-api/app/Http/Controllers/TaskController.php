<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateTaskRequest;
use App\Http\Requests\FilterTaskRequest;
use App\Http\Requests\SortTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    /**
     * Display a listing of the task resource of the authenticated user.
     */
    public function index(FilterTaskRequest $request)
    {
        // Get authenticated user's ID
        $userId = Auth::id();

        // Initial query of getting the of the authenticated user.
        $query = Task::where('user_id', $userId);

        // Filter by created_at date
        if ($request->filled('created_at_date')) {
            $date = $request->created_at_date;

            $query->whereDate('created_at', $date);
        }

        // Filter by description
        if ($request->filled('search')) {
            $query->where('description', 'LIKE', '%' . $request->search . '%');
        }

        // Sort by sort_order ascending
        $query->orderBy('sort_order', 'asc');

        // Process query
        $tasks = $query->get();

        // Return a collection of the tasks.
        return TaskResource::collection($tasks);
    }

    /**
     * Store a newly created task for the authenticated user.
     */
    public function store(CreateTaskRequest $request)
    {
        // Get authenticated user's ID
        $userId = Auth::id();

        // Process assigning of task to authenticated user.
        $createdTask = Task::create([
            'description' => $request->description,
            'user_id' => $userId,
            'sort_order' => Task::where('user_id', $userId)
                ->whereDate('created_at', today())
                ->count()
        ]);

        // If success, return the newly created task data.
        return response()->json([
            'data' => $createdTask
        ], 201);
    }

    /**
     * Display the specified task.
     */
    public function show(string $id)
    {
        // Get task data by ID.
        $task = Task::findOrFail($id);

        // Return the tasks data.
        return new TaskResource($task);
    }

    /**
     * Update the specified task in storage.
     */
    public function update(UpdateTaskRequest $request, string $id)
    {
        // Get authenticated user's ID
        $userId = Auth::id();

        // Ensure only owner can update
        $task = Task::where('id', $id)
            ->where('user_id', $userId)
            ->firstOrFail();

        // Only update fields that exist in the request
        $task->update($request->only(['description', 'done', 'sort_order']));

        // Return the updated task data
        return (new TaskResource($task))
            ->response()
            ->setStatusCode(200);
    }

    /**
     * Remove the specified task from storage.
     */
    public function destroy(string $id)
    {
        // Get authenticated user's ID
        $userId = Auth::id();

        // Ensure only owner can update
        $task = Task::where('id', $id)
            ->where('user_id', $userId)
            ->firstOrFail();

        // Process task deletion
        $task->delete();

        return response()->noContent(); // 204 response
    }

    public function sort(SortTaskRequest $request)
    {
        $ids = $request->taskIds;
        // Get authenticated user's ID
        $userId = Auth::id();

        // Ensure only owner can update
        $tasks = Task::whereIn('id', $ids)
            ->where('user_id', $userId)
            ->get();

        // Check if all requested IDs exist for this user
        if ($tasks->count() !== count($ids)) {
            abort(403, 'One or more tasks do not belong to the authenticated user.');
        }

        // Only update fields that exist in the request
        foreach($ids as $indx => $id) {
            $task = Task::where('id', $id)->firstOrFail();
            $task->update(['sort_order' => $indx]);
        }

        return response()->noContent(); // 204 response
    }
}
