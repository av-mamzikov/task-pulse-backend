/**
 * Simple logger utility
 * Wraps console methods to provide a centralized logging interface
 */
export const logger = {
  info: (message: string, ...args: unknown[]): void => {
    // eslint-disable-next-line no-console
    console.log(message, ...args);
  },

  error: (message: string, ...args: unknown[]): void => {
    // eslint-disable-next-line no-console
    console.error(message, ...args);
  },

  warn: (message: string, ...args: unknown[]): void => {
    // eslint-disable-next-line no-console
    console.warn(message, ...args);
  },

  debug: (message: string, ...args: unknown[]): void => {
    // eslint-disable-next-line no-console
    console.debug(message, ...args);
  },
};
