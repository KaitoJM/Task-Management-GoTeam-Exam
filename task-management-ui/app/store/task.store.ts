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
  // loaders
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
        weekLabel = `${weekOfMonth}th week of ${month}`;
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

  const updatedActiveTaskGroup = computed<string>(() => {
    return activeTaskGroup.value;
  });

  const taskActionLoading = computed<boolean>(() => {
    return creatingTask.value || updatingTask.value || deletingTask.value;
  });

  // actions
  const getTaskList = async (date: string) => {
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

      activeCollection.value = res.data.map((task) => ({
        ...task,
        done: Boolean(task.done), // need to convert done type to boolean since it is being auto parse an int
      }));
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      activeCollection.value = [];
    }
  };

  const getTaskGroups = async () => {
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

      dateGroups.value = res.data;
    } catch (error) {
      console.error("Failed to fetch task groups:", error);
      dateGroups.value = [];
    }
  };

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
        //refresh task list
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

  return {
    activeCollection,
    dateGroups,
    groupedByWeek,
    updatedActiveTaskGroup,
    getTaskList,
    getTaskGroups,
    createNewTask,
    updateTask,
    deleteTask,
  };
});
