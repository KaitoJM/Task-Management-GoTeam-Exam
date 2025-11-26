import {
  differenceInCalendarWeeks,
  format,
  isToday,
  isYesterday,
  parseISO,
} from "date-fns";
import type {
  ApiError,
  ApiResponse,
  StoreActionResponse,
} from "~/types/response.type";
import type { Task, TaskUpdate } from "~/types/task.type";

const config = useRuntimeConfig();

type ApiResponseTask = {
  data: Task[];
};

type ApiResponseTaskGroup = {
  data: string[];
};

type ApiCreateTaskResponse = {
  data: Task;
};

export type WeekDate = {
  label: string;
  date: string;
};

export type WeekGroup = {
  weekLabel: string;
  dates: WeekDate[];
};

export const useTaskStore = defineStore("taskStore", () => {
  // state
  const activeCollection = ref<Task[]>([]);
  const dateGroups = ref<string[]>([]);
  const activeTaskGroup = ref<string>("");
  const applySort = ref<boolean>(true);
  // loaders
  const loadingGroups = ref<boolean>(false);
  const loadingTasks = ref<boolean>(false);
  const creatingTask = ref<boolean>(false);
  const updatingTask = ref<boolean>(false);
  const deletingTask = ref<boolean>(false);

  // getters
  const groupedByWeek = computed<WeekGroup[]>(() => {
    const weeksMap: Record<number, { weekLabel: string; dates: any[] }> = {};
    const today = new Date();

    dateGroups.value.forEach((dateStr) => {
      const date = parseISO(dateStr);

      // Week difference relative to current week
      const weekDiff = differenceInCalendarWeeks(today, date, {
        weekStartsOn: 1,
      });

      // Determine week label
      let weekLabel = "";
      if (weekDiff === 0) weekLabel = "active week";
      else if (weekDiff === 1) weekLabel = "last week";
      else {
        const weekOfMonth = Math.ceil(date.getDate() / 7);
        const month = format(date, "MMMM");
        let thlabel = `${weekOfMonth}th`;

        if (weekOfMonth == 1) {
          thlabel = `${weekOfMonth}st`;
        }

        if (weekOfMonth == 2) {
          thlabel = `${weekOfMonth}nd`;
        }

        if (weekOfMonth == 3) {
          thlabel = `${weekOfMonth}rd`;
        }

        weekLabel = `${thlabel} week of ${month}`;
      }

      // Determine date label
      let dateLabel = "";
      if (isToday(date)) dateLabel = "Today";
      else if (isYesterday(date)) dateLabel = "Yesterday";
      else dateLabel = format(date, "EEEE, MMMM dd");

      // Push into weeks map
      if (!weeksMap[weekDiff]) {
        weeksMap[weekDiff] = { weekLabel, dates: [] };
      }
      weeksMap[weekDiff].dates.push({ label: dateLabel, date: dateStr });
    });

    // Convert map to sorted array (closest week first)
    return Object.values(weeksMap).sort((a, b) =>
      a.dates[0].date < b.dates[0].date ? 1 : -1
    );
  });

  const updatedDateGroups = computed<string[]>(() => {
    return dateGroups.value;
  });

  const withTodayRecord = computed<boolean>(() => {
    const today = new Date().toISOString().split("T")[0];

    if (
      today &&
      updatedDateGroups.value.length &&
      updatedDateGroups.value.includes(today)
    ) {
      return true;
    }

    return false;
  });

  const updatedActiveTaskGroup = computed<string>(() => {
    return activeTaskGroup.value;
  });

  const sortable = computed<boolean>(() => {
    return applySort.value;
  });

  const updatedGroupLoading = computed<boolean>(() => {
    return loadingGroups.value;
  });

  const updatedTasksLoading = computed<boolean>(() => {
    return loadingTasks.value;
  });

  const updatedCreatingTasksLoading = computed<boolean>(() => {
    return creatingTask.value;
  });

  const taskActionLoading = computed<boolean>(() => {
    return creatingTask.value || updatingTask.value || deletingTask.value;
  });

  /**
   * Fetches the list of tasks for a specific date from the API and updates the store state.
   *
   * This function will:
   * 1. Set the currently active task group to the provided date.
   * 2. Check if a valid API token exists in localStorage.
   * 3. Build a query string to filter tasks by the given `date`.
   * 4. Send a GET request to fetch tasks from the API.
   * 5. Convert the `done` property of each task to a boolean.
   * 6. Update the `activeCollection` state with the fetched tasks.
   * 7. If an error occurs or token is missing, it will reset `activeCollection` to an empty array.
   *
   * @async
   * @function
   * @param {string} date - The date string in `YYYY-MM-DD` format to filter tasks by.
   * @param {boolean} applyLoader - use for loader indication defaul value is false.
   * @returns {Promise<void>} A promise that resolves when the tasks are fetched and state is updated.
   *
   * @example
   * await getTaskList('2025-11-25');
   * console.log(activeCollection.value);
   * // [{ id: 1, description: 'Task 1', done: true, ... }, ...]
   */
  const getTaskList = async (date: string, applyLoader: boolean = false) => {
    applySort.value = true; // items should be sortable when getting task list via date

    if (applyLoader) {
      loadingTasks.value = true;
    }

    activeTaskGroup.value = date;
    const token = localStorage.getItem("token");

    if (!token) {
      activeCollection.value = [];
      return;
    }

    let query: string = "";

    // filter by created_date if date is given
    if (date) {
      query = `?created_at_date=${date}`;
    }

    try {
      const res: ApiResponseTask = await $fetch(
        `${config.public.apiBase}tasks${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      loadingTasks.value = false;
      activeCollection.value = res.data.map((task) => ({
        ...task,
        done: Boolean(task.done), // need to convert done type to boolean since it is being auto parse an int
      }));
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      loadingTasks.value = false;
      activeCollection.value = [];
    }
  };

  /**
   * Searches the authenticated user's tasks based on the provided keyword.
   *
   * This function makes a GET request to the `/tasks` endpoint with a search query,
   * using the stored authentication token. If the token is missing, it clears the
   * active task collection. The returned tasks are normalized before being stored.
   *
   * @async
   * @function searchTaskList
   * @param {string} key - The search keyword used to filter tasks.
   *
   * @returns {Promise<void>} Resolves when the task list has been successfully
   *                          updated or cleared on error.
   *
   * @description
   * - Retrieves the user's token from `localStorage`.
   * - If no token exists, resets the active collection.
   * - Sends an authenticated request to fetch tasks matching the search key.
   * - Converts the `done` field to boolean because the API returns it as an integer.
   * - Gracefully handles errors by logging and clearing the collection.
   */
  const searchTaskList = async (key: string) => {
    applySort.value = false; // items should not be sortable when getting task list via search
    loadingTasks.value = true;
    const token = localStorage.getItem("token");

    if (!token) {
      activeCollection.value = [];
      return;
    }

    try {
      const res: ApiResponseTask = await $fetch(
        `${config.public.apiBase}tasks?search=${key}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      loadingTasks.value = false;
      activeCollection.value = res.data.map((task) => ({
        ...task,
        done: Boolean(task.done), // need to convert done type to boolean since it is being auto parse an int
      }));
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      loadingTasks.value = false;
      activeCollection.value = [];
    }
  };

  /**
   * Fetches the list of task groups from the API and updates the store state.
   *
   * This function will:
   * 1. Check if a valid API token exists in localStorage.
   * 2. Send a GET request to fetch task groups from the API.
   * 3. Update the `dateGroups` state with the fetched data.
   * 4. If an error occurs or token is missing, it will reset `dateGroups` to an empty array.
   *
   * @async
   * @function
   * @returns {Promise<void>} A promise that resolves when the task groups are fetched and state is updated.
   *
   * @example
   * await getTaskGroups();
   * console.log(dateGroups.value); // ['2025-11-28', '2025-11-27', ...]
   */
  const getTaskGroups = async () => {
    // initialte loader only if dateGroups is empty
    if (!dateGroups.value.length) {
      loadingGroups.value = true;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      dateGroups.value = [];
      return;
    }

    try {
      const res: ApiResponseTaskGroup = await $fetch(
        `${config.public.apiBase}task-groups`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      loadingGroups.value = false;

      dateGroups.value = res.data;
    } catch (error) {
      console.error("Failed to fetch task groups:", error);
      dateGroups.value = [];
      loadingGroups.value = false;
    }
  };

  /**
   * Creates a new task with the given description.
   *
   * This function will:
   * 1. Check if a valid API token exists in localStorage.
   * 2. Send a POST request to the API to create the task.
   * 3. Update the task list for the current active task group if available.
   * 4. Return a standardized `StoreActionResponse` indicating success or failure.
   *
   * @param {string} description - The description of the new task to create.
   * @returns {Promise<StoreActionResponse>} A promise resolving to an object containing:
   *   - success: boolean — Whether the task creation was successful.
   *   - message: string — A human-readable message describing the result.
   *   - statusCode: number — The HTTP status code returned from the API or error code.
   *
   * @example
   * const response = await createNewTask("Finish writing report");
   * if (response.success) {
   *   console.log(response.message);
   * } else {
   *   console.error(response.message);
   * }
   */
  const createNewTask = async (
    description: string
  ): Promise<StoreActionResponse> => {
    const token = localStorage.getItem("token");
    creatingTask.value = true;

    if (!token) {
      creatingTask.value = false;
      return {
        success: false,
        message: `You are not allowed to do this function.`,
        statusCode: 401,
      };
    }

    try {
      let statusCode = 0;

      const res: ApiCreateTaskResponse = await $fetch(
        `${config.public.apiBase}tasks`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: {
            description: description,
          },
          onResponse({ response }) {
            statusCode = response.status;
          },
        }
      );

      creatingTask.value = false;

      //refresh task list
      getTaskGroups();
      if (updatedActiveTaskGroup.value) {
        getTaskList(updatedActiveTaskGroup.value);
      }

      return {
        success: true,
        message: `Sucessfully added new entry on the tasks list.`,
        statusCode: statusCode,
      };
    } catch (err) {
      creatingTask.value = false;
      const error = err as ApiError;
      console.error("Error while creating new task: ", error);

      return {
        success: false,
        message: `An error occured white creating a task.`,
        statusCode: error.statusCode || 500,
      };
    }
  };

  /**
   * Updates a task by its ID using the API endpoint.
   *
   * This function sends a PATCH request to the backend with updated task data.
   * It also manages UI state by toggling `updatingTask` and refreshing the active
   * task list once the update is completed.
   *
   * ### Behavior:
   * - Validates authentication by checking for an access token.
   * - Sends a PATCH request with the updated task fields.
   * - Captures the HTTP status via `onResponse` because Nuxt's `$fetch`
   *   wraps responses and does not expose raw status codes directly.
   * - Refreshes the active task list after a successful update.
   * - Returns a standardized `StoreActionResponse` indicating success or failure.
   *
   * @param {number} id - The ID of the task to update.
   * @param {TaskUpdate} form - The data payload containing updated task fields.
   * @returns {Promise<StoreActionResponse>} A promise resolving with the result of the update action.
   *
   * @typedef {Object} StoreActionResponse
   * @property {boolean} success - Whether the action succeeded.
   * @property {string} message - Descriptive message for UI feedback.
   * @property {number} statusCode - The HTTP status code returned by the API.
   */
  const updateTask = async (
    id: number,
    form: TaskUpdate
  ): Promise<StoreActionResponse> => {
    const token = localStorage.getItem("token");
    updatingTask.value = true;

    if (!token) {
      updatingTask.value = false;
      return {
        success: false,
        message: `You are not allowed to do this function.`,
        statusCode: 401,
      };
    }

    try {
      let statusCode = 0;

      const res: ApiResponse = await $fetch(
        `${config.public.apiBase}tasks/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
          onResponse({ response }) {
            statusCode = response.status;
          },
        }
      );

      updatingTask.value = false;

      //refresh task list
      getTaskList(updatedActiveTaskGroup.value);

      return {
        success: true,
        message: `Task with id ${id} has been successfully updated.`,
        statusCode: statusCode,
      };
    } catch (err) {
      updatingTask.value = false;
      const error = err as ApiError;
      console.error("Error while updating task: ", error);

      return {
        success: false,
        message: `An error occured white updating a task.`,
        statusCode: error.statusCode || 500,
      };
    }
  };

  /**
   * Deletes a task by its ID using the API endpoint.
   *
   * This function sends a DELETE request to the backend to permanently remove a task.
   * It also updates UI state by setting `deletingTask` and refreshing the task list
   * when the deletion is successful.
   *
   * ### Behavior:
   * - If no authentication token is found, returns an unauthorized response.
   * - Sends a DELETE request to the `/tasks/:id` endpoint.
   * - Uses `onResponse` to capture the raw HTTP status code (important because 204
   *   responses contain no JSON body).
   * - If deletion succeeds (`204`), it refreshes the active task list.
   * - Handles all network and API errors gracefully and returns a standardized
   *   `StoreActionResponse`.
   *
   * @param {number} id - The ID of the task to delete.
   * @returns {Promise<StoreActionResponse>} A promise resolving with the result of the deletion action.
   *
   * @typedef {Object} StoreActionResponse
   * @property {boolean} success - Indicates whether the operation succeeded.
   * @property {string} message - A user-friendly message describing the result.
   * @property {number} statusCode - The HTTP status code returned by the API.
   */
  const deleteTask = async (id: number): Promise<StoreActionResponse> => {
    const token = localStorage.getItem("token");
    deletingTask.value = true;

    if (!token) {
      deletingTask.value = false;
      return {
        success: false,
        message: `You are not allowed to do this function.`,
        statusCode: 401,
      };
    }

    try {
      let statusCode = 0;
      await $fetch(`${config.public.apiBase}tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        onResponse({ response }) {
          statusCode = response.status;
        },
      });

      deletingTask.value = false;

      if (statusCode == 204) {
        //refresh task list and task group
        getTaskGroups();
        getTaskList(updatedActiveTaskGroup.value);

        return {
          success: true,
          message: `Task with id ${id} has been successfully deleted.`,
          statusCode: statusCode,
        };
      }

      return {
        success: false,
        message: `An error occured white deleting a task.`,
        statusCode: statusCode,
      };
    } catch (err) {
      deletingTask.value = false;
      const error = err as ApiError;
      console.error("Error while deleting task: ", error);

      return {
        success: false,
        message: `An error occured white deleting a task.`,
        statusCode: error.statusCode || 500,
      };
    }
  };

  /**
   * Reorders tasks using the API endpoint based on a provided array of task IDs.
   *
   * This function sends a PATCH request to the backend to update the sort order of tasks.
   * It updates UI state by setting `updatingTask` and refreshes the task list after
   * the operation is successful.
   *
   * ### Behavior:
   * - If no authentication token is found, returns an unauthorized response.
   * - Sends a PATCH request to the `/tasks-reorder` endpoint with the new order of task IDs.
   * - Uses `onResponse` to capture the raw HTTP status code from the API response.
   * - Refreshes the active task list after successfully reordering tasks.
   * - Handles all network and API errors gracefully and returns a standardized `StoreActionResponse`.
   *
   * @param {number[]} taskIds - An array of task IDs in the desired order.
   * @returns {Promise<StoreActionResponse>} A promise resolving with the result of the reorder action.
   *
   * @typedef {Object} StoreActionResponse
   * @property {boolean} success - Indicates whether the operation succeeded.
   * @property {string} message - A user-friendly message describing the result.
   * @property {number} statusCode - The HTTP status code returned by the API.
   */
  const sortTask = async (taskIds: number[]): Promise<StoreActionResponse> => {
    const token = localStorage.getItem("token");
    updatingTask.value = true;

    if (!token) {
      updatingTask.value = false;
      return {
        success: false,
        message: `You are not allowed to do this function.`,
        statusCode: 401,
      };
    }

    try {
      let statusCode = 0;

      const res: ApiResponse = await $fetch(
        `${config.public.apiBase}tasks-reorder`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: {
            taskIds: taskIds,
          },
          onResponse({ response }) {
            statusCode = response.status;
          },
        }
      );

      updatingTask.value = false;

      //refresh task list
      getTaskList(updatedActiveTaskGroup.value);

      return {
        success: true,
        message: `Task has been successfully resorted.`,
        statusCode: statusCode,
      };
    } catch (err) {
      updatingTask.value = false;
      const error = err as ApiError;
      console.error("Error while sorting task: ", error);

      return {
        success: false,
        message: `An error occured white sorting a task.`,
        statusCode: error.statusCode || 500,
      };
    }
  };

  return {
    activeCollection,
    dateGroups,
    updatedDateGroups,
    withTodayRecord,
    groupedByWeek,
    updatedActiveTaskGroup,
    sortable,
    updatedGroupLoading,
    updatedTasksLoading,
    updatedCreatingTasksLoading,
    taskActionLoading,
    getTaskList,
    searchTaskList,
    getTaskGroups,
    createNewTask,
    updateTask,
    deleteTask,
    sortTask,
  };
});
