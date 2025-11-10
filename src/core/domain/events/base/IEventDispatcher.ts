import {DomainEvent} from './DomainEvent';

/**
 * Interface for event handlers
 * Each handler is responsible for handling a specific type of domain event
 */
export interface IEventHandler<T extends DomainEvent = DomainEvent> {
  /**
   * Handles the given domain event
   * @param event The domain event to handle
   */
  handle(event: T): Promise<void>;
}

/**
 * Interface for the event dispatcher
 * Responsible for dispatching domain events to registered handlers
 */
export interface IEventDispatcher {
  /**
   * Dispatches a domain event to all registered handlers
   * @param event The domain event to dispatch
   */
  dispatch(event: DomainEvent): Promise<void>;

  /**
   * Registers an event handler for a specific event type
   * @param eventName The name of the event to handle
   * @param handler The handler to register
   */
  register(eventName: string, handler: IEventHandler): void;
}
