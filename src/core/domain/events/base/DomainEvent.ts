/**
 * Base interface for all domain events
 * Domain events represent something that happened in the domain that domain experts care about
 */
export interface DomainEvent {
  /** The date and time when the event occurred */
  occurredOn: Date;

  /** The name of the event (e.g., 'TaskCreated', 'TaskStatusChanged') */
  eventName: string;

  /** The ID of the aggregate that raised this event */
  aggregateId: string;
}
