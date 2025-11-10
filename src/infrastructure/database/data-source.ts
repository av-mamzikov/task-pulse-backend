import 'reflect-metadata';
import {DataSource} from 'typeorm';
import {environment} from '../config/environment';
import {TaskEntity} from './entities/TaskEntity';
import {CommentEntity} from './entities/CommentEntity';
import {logger} from '../logger/logger';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: environment.database.host,
  port: environment.database.port,
  username: environment.database.username,
  password: environment.database.password,
  database: environment.database.database,
  synchronize: false, // Never use synchronize in production
  logging: environment.nodeEnv === 'development',
  entities: [TaskEntity, CommentEntity],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  subscribers: [],
  migrationsTableName: 'migrations',
});

/**
 * Initialize database connection
 */
export async function initializeDatabase(): Promise<DataSource> {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      logger.info('✅ Database connection established successfully');
    }
    return AppDataSource;
  } catch (error) {
    logger.error('❌ Error during database initialization:', error);
    throw error;
  }
}

/**
 * Close database connection
 */
export async function closeDatabase(): Promise<void> {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      logger.info('✅ Database connection closed successfully');
    }
  } catch (error) {
    logger.error('❌ Error during database closure:', error);
    throw error;
  }
}
