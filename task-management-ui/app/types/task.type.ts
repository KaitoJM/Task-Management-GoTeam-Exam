export type Task = {
  id: number;
  description: string;
  done: boolean;
  sort_order: string;
  created_at: string;
  updated_at: string;
};

export type TaskUpdate = {
  description?: string;
  done?: boolean;
};
