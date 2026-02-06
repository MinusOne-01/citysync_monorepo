"use client"

import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-xl">
        {/* Brand */}
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
          CitySync
        </h1>

        {/* Tagline */}
        <p className="text-base text-slate-600">
          Organise, Discover and Join meetups happening around you.
        </p>

        {/* CTA */}
        <div className="pt-2">
          <Link href="/feed">
            <button
              className="
                rounded-lg bg-sky-500 px-6 py-3
                text-sm font-medium text-white
                hover:bg-sky-600
                transition-colors
              "
            >
              Find your next meetup
            </button>
          </Link>
        </div>
      </div>
    </main>
  )
}
