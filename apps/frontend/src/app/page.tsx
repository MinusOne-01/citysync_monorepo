"use client"

import Link from "next/link"

export default function Home() {
  return (
    <main className="-mt-10 min-h-screen flex items-center justify-center px-4 bg-linear-to-b from-sky-300 to-white">
      <div className="
        w-full max-w-xl
        rounded-3xl bg-white
        px-8 py-20
        text-center space-y-6
        shadow-sm
      ">
        <h1 className="text-5xl font-semibold tracking-tight">
          <span className="text-sky-500">City</span>
          <span className="text-slate-800">Sync</span>
        </h1>

        <p className="text-base text-slate-600">
          Organise, discover, and join meetups happening around you.
        </p>

        <Link href="/feed">
          <button className="
            mt-4 rounded-xl bg-sky-500 px-7 py-3
            text-sm font-medium text-white
            hover:bg-sky-600 transition
          ">
            Find your next meetup
          </button>
        </Link>
      </div>
    </main>
  )
}


