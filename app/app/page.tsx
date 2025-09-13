"use client";

import Providers from "./providers";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";

export default function Page() {
  return (
    <Providers>
      <main className="space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">My Tasks</h1>
          <span className="badge">FastAPI · Next.js</span>
        </header>

        <section className="card card-pad space-y-4">
          <TaskForm />
          <hr className="-mx-6 border-slate-200" />
          <TaskList />
        </section>

        <footer className="text-center text-xs text-slate-500">
          @2025 - David Gatica
        </footer>
      </main>
    </Providers>
  );
}
