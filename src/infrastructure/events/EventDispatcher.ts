import {DomainEvent, IEventDispatcher, IEventHandler,} from '@core/domain/events';
import {logger} from '../logger';

/**
 * Implementation of the Event Dispatcher
 * Manages registration and dispatching of domain events to their handlers
 */
export class EventDispatcher implements IEventDispatcher {
  private handlers: Map<string, IEventHandler[]> = new Map();

  /**
   * Registers an event handler for a specific event type
   * @param eventName The name of the event to handle
   * @param handler The handler to register
   */
  register(eventName: string, handler: IEventHandler): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }

    const eventHandlers = this.handlers.get(eventName)!;
    eventHandlers.push(handler);

    logger.debug(`Registered handler for event: ${eventName}`);
  }

  /**
   * Dispatches a domain event to all registered handlers
   * @param event The domain event to dispatch
   */
  async dispatch(event: DomainEvent): Promise<void> {
    const eventHandlers = this.handlers.get(event.eventName);

    if (!eventHandlers || eventHandlers.length === 0) {
      logger.debug(`No handlers registered for event: ${event.eventName}`);
      return;
    }

    logger.info(
      `Dispatching event: ${event.eventName} (aggregateId: ${event.aggregateId})`
    );

    // Execute all handlers in parallel
    const handlerPromises = eventHandlers.map((handler) =>
      this.executeHandler(handler, event)
    );

    await Promise.all(handlerPromises);
  }

  /**
   * Gets the number of handlers registered for an event
   * @param eventName The event name
   * @returns The number of handlers
   */
  getHandlerCount(eventName: string): number {
    return this.handlers.get(eventName)?.length ?? 0;
  }

  /**
   * Clears all registered handlers
   * Useful for testing
   */
  clearAll(): void {
    this.handlers.clear();
    logger.debug('Cleared all event handlers');
  }

  /**
   * Clears handlers for a specific event
   * @param eventName The event name
   */
  clear(eventName: string): void {
    this.handlers.delete(eventName);
    logger.debug(`Cleared handlers for event: ${eventName}`);
  }

  /**
   * Executes a single handler with error handling
   * @param handler The handler to execute
   * @param event The event to handle
   */
  private async executeHandler(
    handler: IEventHandler,
    event: DomainEvent
  ): Promise<void> {
    try {
      await handler.handle(event);
    } catch (error) {
      logger.error(
        `Error handling event ${event.eventName} in handler ${handler.constructor.name}:`,
        error
      );
      // Don't rethrow - we don't want one handler failure to affect others
    }
  }
}
