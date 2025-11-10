import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export interface EnvironmentConfig {
  nodeEnv: string;
  port: number;
  host: string;
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };
  logging: {
    level: string;
  };
  cors: {
    origin: string;
  };
}

export const environment: EnvironmentConfig = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || '0.0.0.0',
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'taskpulse',
    password: process.env.DB_PASSWORD || 'taskpulse_password',
    database: process.env.DB_DATABASE || 'taskpulse_db',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },
};

export const isDevelopment = environment.nodeEnv === 'development';
export const isProduction = environment.nodeEnv === 'production';
export const isTest = environment.nodeEnv === 'test';
