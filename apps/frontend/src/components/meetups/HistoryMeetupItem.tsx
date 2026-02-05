import type { ParticipantHistoryItem } from "../../modules/participate/participate.types"

type Props = {
  item: ParticipantHistoryItem
}

export function HistoryMeetupItem({ item }: Props) {
  return (
    <div className="flex gap-4 py-3">
      <img
        src={item.meetupImageUrl}
        alt={item.placeName ?? "Meetup"}
        className="h-16 w-24 rounded-lg object-cover border border-slate-200"
      />

      <div className="flex-1 space-y-0.5">
        <div className="text-sm font-medium text-slate-900">
          {item.placeName ?? "Meetup"}
          <span className="text-slate-500"> · {item.city ?? "Unknown city"}</span>
        </div>

        <div className="text-xs text-slate-500">
          {new Date(item.meetupDate).toLocaleString()}
        </div>

        <div className="text-xs text-slate-500">
          Role: <span className="font-medium text-slate-700">{item.role}</span>
        </div>
      </div>
    </div>
  )
}
