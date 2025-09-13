import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export async function listTasks(): Promise<Task[]> {
  const r = await axios.get(`${API}/tasks`);
  return r.data;
}

export async function createTask(title: string): Promise<Task> {
  const r = await axios.post(`${API}/tasks`, { title });
  return r.data;
}

export async function updateTask(
  id: string,
  patch: Partial<Pick<Task, 'title' | 'completed'>>
): Promise<Task> {
  const r = await axios.patch(`${API}/tasks/${id}`, patch);
  return r.data;
}

export async function deleteTask(id: string): Promise<void> {
  await axios.delete(`${API}/tasks/${id}`);
}
