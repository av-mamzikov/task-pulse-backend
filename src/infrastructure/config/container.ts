import {ITaskRepository} from '@core/application/interfaces/ITaskRepository';
import {TaskRepository} from '../repositories/TaskRepository';

/**
 * Type for services that can be registered in the container
 */
type ServiceInstance = ITaskRepository; // Add more types here as needed: | IOtherService | ...

/**
 * Simple Dependency Injection container
 * Following Clean Architecture principles - Infrastructure provides implementations
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
   * Register all services/repositories
   */
  private registerServices(): void {
    // Register repositories
    this.services.set('ITaskRepository', new TaskRepository());
  }
}

/**
 * Export convenience function to get container instance
 */
export const getContainer = (): Container => Container.getInstance();
