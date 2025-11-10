/**
 * Result pattern for handling operations that can succeed or fail
 * Provides a type-safe way to handle errors without throwing exceptions
 * @template T The type of the success value
 * @template E The type of the error (defaults to string)
 */
export class Result<T, E = string> {
  private constructor(
    private readonly _isSuccess: boolean,
    private readonly _value?: T,
    private readonly _error?: E
  ) {
  }

  /**
   * Checks if the result is successful
   */
  get isSuccess(): boolean {
    return this._isSuccess;
  }

  /**
   * Checks if the result is a failure
   */
  get isFailure(): boolean {
    return !this._isSuccess;
  }

  /**
   * Gets the success value
   * @throws Error if the result is a failure
   */
  get value(): T {
    if (!this._isSuccess) {
      throw new Error('Cannot get value from a failed result');
    }
    return this._value!;
  }

  /**
   * Gets the error value
   * @throws Error if the result is successful
   */
  get error(): E {
    if (this._isSuccess) {
      throw new Error('Cannot get error from a successful result');
    }
    return this._error!;
  }

  /**
   * Creates a successful result
   * @param value The success value
   * @returns A successful Result
   */
  static ok<T, E = string>(value: T): Result<T, E> {
    return new Result<T, E>(true, value, undefined);
  }

  /**
   * Creates a failed result
   * @param error The error value
   * @returns A failed Result
   */
  static fail<T, E = string>(error: E): Result<T, E> {
    return new Result<T, E>(false, undefined, error);
  }

  /**
   * Maps the success value to a new value
   * @param fn The mapping function
   * @returns A new Result with the mapped value
   */
  map<U>(fn: (value: T) => U): Result<U, E> {
    if (this._isSuccess) {
      return Result.ok<U, E>(fn(this._value!));
    }
    return Result.fail<U, E>(this._error!);
  }

  /**
   * FlatMaps the success value to a new Result
   * @param fn The mapping function that returns a Result
   * @returns The Result returned by the mapping function
   */
  flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    if (this._isSuccess) {
      return fn(this._value!);
    }
    return Result.fail<U, E>(this._error!);
  }

  /**
   * Executes a function if the result is successful
   * @param fn The function to execute
   * @returns The current Result for chaining
   */
  onSuccess(fn: (value: T) => void): Result<T, E> {
    if (this._isSuccess) {
      fn(this._value!);
    }
    return this;
  }

  /**
   * Executes a function if the result is a failure
   * @param fn The function to execute
   * @returns The current Result for chaining
   */
  onFailure(fn: (error: E) => void): Result<T, E> {
    if (!this._isSuccess) {
      fn(this._error!);
    }
    return this;
  }
}
