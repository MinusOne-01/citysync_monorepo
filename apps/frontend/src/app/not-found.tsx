import Link from "next/link"

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-semibold text-slate-900">
          Page not found
        </h1>
        <p className="text-sm text-slate-600">
          Seems like you are lost...
        </p>
        <Link
          href="/"
          className="text-sm font-medium text-sky-600 hover:underline"
        >
          Go back home
        </Link>
      </div>
    </main>
  )
}
