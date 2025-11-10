import {ITaskRepository} from '@core/application/interfaces/ITaskRepository';
import {IEventDispatcher} from '@core/domain';
import {TaskRepository} from '../repositories/TaskRepository';
import {EventDispatcher} from '../events/EventDispatcher';
import {
  CommentAddedHandler,
  TaskCompletedHandler,
  TaskCreatedHandler,
  TaskPriorityChangedHandler,
  TaskStatusChangedHandler,
} from '../events/handlers';
import {logger} from '../logger';

/**
 * Type for services that can be registered in the container
 */
type ServiceInstance = ITaskRepository | IEventDispatcher; // Add more types here as needed

/**
 * Simple Dependency Injection container
 * Following Clean Architecture and DDD principles - Infrastructure provides implementations
 */
export class Container {
  private static instance: Container;
  private services: Map<string, ServiceInstance> = new Map();

  private constructor() {
    this.registerServices();
  }

  /**
   * Get singleton instance of the container
   */
  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  /**
   * Reset container (useful for testing)
   */
  public static reset(): void {
    if (Container.instance) {
      Container.instance.services.clear();
      Container.instance = null as unknown as Container;
    }
  }

  /**
   * Resolve a service by its interface name
   */
  public resolve<T>(serviceName: string): T {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found in container`);
    }
    return service as T;
  }

  /**
   * Get TaskRepository instance
   */
  public getTaskRepository(): ITaskRepository {
    return this.resolve<ITaskRepository>('ITaskRepository');
  }

  /**
   * Get EventDispatcher instance
   */
  public getEventDispatcher(): IEventDispatcher {
    return this.resolve<IEventDispatcher>('IEventDispatcher');
  }

  /**
   * Register all services/repositories
   */
  private registerServices(): void {
    // Register Event Dispatcher
    const eventDispatcher = new EventDispatcher();
    this.services.set('IEventDispatcher', eventDispatcher);

    // Register event handlers
    this.registerEventHandlers(eventDispatcher);

    // Register repositories (with dependencies)
    this.services.set('ITaskRepository', new TaskRepository(eventDispatcher));

    logger.info('DI Container initialized with all services and event handlers');
  }

  /**
   * Register all event handlers with the event dispatcher
   */
  private registerEventHandlers(eventDispatcher: EventDispatcher): void {
    // Task event handlers
    eventDispatcher.register('TaskCreated', new TaskCreatedHandler());
    eventDispatcher.register('TaskStatusChanged', new TaskStatusChangedHandler());
    eventDispatcher.register('TaskCompleted', new TaskCompletedHandler());
    eventDispatcher.register('TaskPriorityChanged', new TaskPriorityChangedHandler());

    // Comment event handlers
    eventDispatcher.register('CommentAdded', new CommentAddedHandler());

    logger.debug('Registered all event handlers');
  }
}

/**
 * Export convenience function to get container instance
 */
export const getContainer = (): Container => Container.getInstance();
