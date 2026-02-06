"use client"

import Link from "next/link"
import { useAuth } from "../../modules/auth/auth.hooks"
import { usePathname } from "next/navigation"

export default function TopNav() {
  const { status } = useAuth()
  const isAuthed = status === "authenticated"
  const pathname = usePathname()

  const hideOn = ["/"]
  if (hideOn.includes(pathname)) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200">
      <div className="mx-auto w-full max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm font-medium text-slate-700">
          <Link href="/feed" className="hover:text-slate-900">Feed</Link>
          <Link href="/history" className="hover:text-slate-900">History</Link>
          <Link href="/meetup/create" className="hover:text-slate-900">Create</Link>
          <Link href="/profile" className="hover:text-slate-900">Profile</Link>
        </div>

        {!isAuthed && (
          <Link
            href="/login"
            className="text-sm font-medium text-sky-600 hover:text-sky-700"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  )
}

