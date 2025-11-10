import {DomainEvent} from './DomainEvent';

/**
 * Base class for all Aggregate Roots
 * An Aggregate Root is the entry point to an aggregate - a cluster of domain objects that can be treated as a single unit
 * It ensures consistency and enforces invariants within the aggregate boundary
 */
export abstract class AggregateRoot {
  private _domainEvents: DomainEvent[] = [];

  /**
   * Returns all domain events that have been raised by this aggregate
   * @returns Read-only array of domain events
   */
  public getDomainEvents(): ReadonlyArray<DomainEvent> {
    return this._domainEvents;
  }

  /**
   * Clears all domain events from the aggregate
   * Should be called after events have been successfully dispatched
   */
  public clearDomainEvents(): void {
    this._domainEvents = [];
  }

  /**
   * Adds a domain event to the aggregate's event collection
   * Events will be dispatched after the aggregate is successfully persisted
   * @param event The domain event to add
   */
  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }
}
