<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskGroupController extends Controller
{
    /**
     * Display a listing of the dates from tasks.
     */
    public function index()
    {
        // Get authenticated user's ID
        $userId = Auth::id();

        // Get distinct dates of the authenticated user's task
        $dates = Task::selectRaw('DATE(created_at) as only_date')
            ->where('user_id', $userId)
            ->distinct()
            ->orderByDesc('only_date')
            ->pluck('only_date');

        
        return response()->json(['data' => $dates]);
    }
}
