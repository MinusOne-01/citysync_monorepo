type DomainEvent =
  | { type: "JOIN_REQUEST"; payload: { organizerId: string, meetupId: string, participantId: string, participantName: string } }
  | { type: "PARTICIPANT_APPROVED"; payload: { participantId: string, meetupId: string, meetupName: string} }

type EventHandler<T> = (event: T) => Promise<void>;

class EventBus {
  private handlers: Record<string, EventHandler<any>[]> = {};

  subscribe<T extends DomainEvent["type"]>(
    type: T,
    handler: EventHandler<Extract<DomainEvent, { type: T }>>
  ) {
    this.handlers[type] ??= [];
    this.handlers[type].push(handler);
    console.log("Worker subscriber-> ", type);
  }

  async publish(event: DomainEvent) {
    console.log("Fan out for -> ", event.type);
    const handlers = this.handlers[event.type] ?? [];
    for (const handler of handlers) {
      queueMicrotask(() => handler(event)); // async, non-blocking
      console.log("handler -> ", event.type);
    }
  }
}

export const eventBus = new EventBus();
