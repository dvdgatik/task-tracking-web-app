"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteTask, listTasks, Task, updateTask } from "@/lib/api";

function SkeletonItem() {
  return (
    <li className="card card-pad animate-pulse flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="h-5 w-5 rounded bg-slate-200" />
        <span className="h-4 w-40 rounded bg-slate-200" />
      </div>
      <span className="h-6 w-16 rounded bg-slate-200" />
    </li>
  );
}

export default function TaskList() {
  const qc = useQueryClient();

  const {
    data: tasks = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: listTasks,
  });

  const toggleMut = useMutation({
    mutationFn: (t: Task) => updateTask(t.id, { completed: !t.completed }),
    onMutate: async (t) => {
      await qc.cancelQueries({ queryKey: ["tasks"] });
      const prev = qc.getQueryData<Task[]>(["tasks"]) ?? [];
      qc.setQueryData<Task[]>(
        ["tasks"],
        prev.map((x) => (x.id === t.id ? { ...x, completed: !x.completed } : x))
      );
      return { prev };
    },
    onError: (_e, _v, ctx) => ctx?.prev && qc.setQueryData(["tasks"], ctx.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["tasks"] });
      const prev = qc.getQueryData<Task[]>(["tasks"]) ?? [];
      qc.setQueryData<Task[]>(
        ["tasks"],
        prev.filter((x) => x.id !== id)
      );
      return { prev };
    },
    onError: (_e, _v, ctx) => ctx?.prev && qc.setQueryData(["tasks"], ctx.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });

  if (isLoading) {
    return (
      <ul className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonItem key={i} />
        ))}
      </ul>
    );
  }

  if (isError) {
    return (
      <div className="card card-pad border-red-200 bg-red-50 text-red-700 shadow-md">
        Error loading tasks. Please try again
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {tasks.map((t) => (
        <li
          key={t.id}
          className="card card-pad flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
        >
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="h-5 w-5 accent-blue-600"
              checked={t.completed}
              onChange={() => toggleMut.mutate(t)}
              aria-label={`Completar ${t.title}`}
            />
            <span
              className={`text-sm sm:text-base ${
                t.completed ? "line-through text-slate-400" : "text-slate-800"
              }`}
            >
              {t.title}
            </span>
          </label>

          <div className="flex items-center gap-2">
            <span
              className={`badge ${
                t.completed
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {t.completed ? "Done" : "Pending"}
            </span>
            <button
              className="btn btn-ghost text-sm hover:text-red-600"
              onClick={() => deleteMut.mutate(t.id)}
              aria-label={`Eliminar ${t.title}`}
            >
              🗑️ Delete
            </button>
          </div>
        </li>
      ))}

      {tasks.length === 0 && (
        <li className="card card-pad text-center text-slate-500 italic">
          ✨ There are no tasks yet. Create the first one above!
        </li>
      )}
    </ul>
  );
}
