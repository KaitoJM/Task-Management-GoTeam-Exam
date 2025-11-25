import {
  differenceInCalendarWeeks,
  format,
  isToday,
  isYesterday,
  parseISO,
} from "date-fns";
import type { Task } from "~/types/task.type";

const config = useRuntimeConfig();

type ApiResponseToken = {
  data: Task[];
};

type ApiResponseTokenGroup = {
  data: string[];
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

  // getter
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

  const getTaskList = async (date: string) => {
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
      const res: ApiResponseToken = await $fetch(
        `${config.public.apiBase}tasks${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      activeCollection.value = res.data;
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
      const res: ApiResponseTokenGroup = await $fetch(
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

  return {
    activeCollection,
    dateGroups,
    groupedByWeek,
    getTaskList,
    getTaskGroups,
  };
});
