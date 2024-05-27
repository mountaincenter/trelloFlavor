import React from "react";
import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-blue-600 p-4 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold">Task Management App</h1>
        <nav className="space-x-4">
          <Link href="/" className="rounded px-3 py-2 hover:bg-blue-500">
            Home
          </Link>
          <Link href="/tasks" className="rounded px-3 py-2 hover:bg-blue-500">
            Tasks
          </Link>
          <Link
            href="/calendar"
            className="rounded px-3 py-2 hover:bg-blue-500"
          >
            Calendar
          </Link>
          <Link href="/timer" className="rounded px-3 py-2 hover:bg-blue-500">
            Timer
          </Link>
          <Link
            href="/pomodoro"
            className="rounded px-3 py-2 hover:bg-blue-500"
          >
            Pomodoro
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
