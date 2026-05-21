"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
          <h1 className="text-2xl font-bold text-indigo-600">AMS</h1>
          <nav className="space-x-4">
            <Link
              href="#features"
              className="text-gray-700 hover:text-indigo-600"
            >
              Features
            </Link>
            <Link href="#about" className="text-gray-700 hover:text-indigo-600">
              About
            </Link>
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
          </nav>
        </div>
      </header>

      <section className="max-w-350 m-auto my-40 flex-1 flex flex-col justify-center items-center text-center px-6">
        <h2
          className=" md:text-6xl mb-6 text-7xl text-center font-bold tracking-tight leading-tight max-w-xl bg-clip-text 
          text-transparent bg-linear-to-b from-neutral-50 to-neutral-500 text-shadow-xs"
        >
          Welcome to Artist Management System
        </h2>
        <p className="text-gray-700 max-w-xl mb-8 text-lg">
          Manage your artists and their songs effortlessly. CRUD operations, CSV
          import/export, and a beautiful dashboard — all in one place.
        </p>
        <div className="flex gap-4">
          <Link href="/register">
            <Button>Get Started</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
        </div>
      </section>

      <section id="features" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          <div className="p-6 border rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">User Management</h3>
            <p className="text-gray-600">
              Create, update, and delete users with ease.
            </p>
          </div>
          <div className="p-6 border rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">Artist & Songs</h3>
            <p className="text-gray-600">
              Manage artists, songs, and CSV imports seamlessly.
            </p>
          </div>
          <div className="p-6 border rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">Secure Dashboard</h3>
            <p className="text-gray-600">
              Protected admin dashboard with JWT authentication.
            </p>
          </div>
        </div>
      </section>

      <section id="about" className="py-20 bg-indigo-50 text-center px-6">
        <h3 className="text-3xl font-bold text-indigo-700 mb-4">About AMS</h3>
        <p className="text-gray-700 max-w-2xl mx-auto text-lg">
          AMS is built to simplify artist management. From adding new artists,
          managing their songs, to exporting/importing CSV files — everything is
          organized in one beautiful interface.
        </p>
      </section>

      <footer className="bg-white shadow-inner py-6 mt-auto text-center text-gray-600">
        &copy; {new Date().getFullYear()} AMS. All rights reserved.
      </footer>
    </div>
  );
}
