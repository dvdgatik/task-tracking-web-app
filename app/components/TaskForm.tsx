"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "@/lib/api";

export default function TaskForm() {
  const [title, setTitle] = useState("");
  const qc = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      setTitle("");
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const v = title.trim();
        if (!v) return;
        mutate(v);
      }}
      className="card card-pad mb-6 flex items-center gap-3"
      aria-label="Create new task"
    >
      <input
        className="input flex-1"
        placeholder="Type a new task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-label="Task title"
      />
      <button
        type="submit"
        className="btn btn-primary whitespace-nowrap"
        disabled={!title.trim() || isPending}
      >
        {isPending ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
