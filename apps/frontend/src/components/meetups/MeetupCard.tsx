import Link from "next/link"
import type { Meetup } from "../../modules/meetups/meetup.types"

type MeetupCardProps = {
  meetup: Meetup
}

export function MeetupCard({ meetup }: MeetupCardProps) {
  return (
    <Link href={`/meetup/${meetup.id}`}>
      <div
        className="
          group cursor-pointer
          rounded-2xl bg-white border border-slate-200
          overflow-hidden
          hover:bg-slate-50 transition-colors
        "
      >
        {meetup.imageUrl && (
          <img
            src={meetup.imageUrl}
            alt={meetup.title}
            className="h-40 w-full object-cover"
          />
        )}

        <div className="p-4 space-y-2">
          <h3 className="text-base font-semibold text-slate-900 line-clamp-2">
            {meetup.title}
          </h3>

          <p className="text-sm text-slate-500">
            {new Date(meetup.startTime).toLocaleString()}
          </p>

          <div className="flex flex-wrap gap-2 text-xs text-slate-600">
            <span className="rounded-full bg-slate-100 px-2 py-0.5">
              {meetup.city ?? "Unknown city"}
            </span>

            {meetup.area && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5">
                {meetup.area}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
