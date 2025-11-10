/**
 * Base interface for the Specification pattern
 * Specifications encapsulate business rules that can be combined and reused
 * @template T The type of object this specification applies to
 */
export interface Specification<T> {
  /**
   * Checks if the candidate satisfies this specification
   * @param candidate The object to check
   * @returns true if the candidate satisfies the specification
   */
  isSatisfiedBy(candidate: T): boolean;

  /**
   * Combines this specification with another using AND logic
   * @param other The other specification
   * @returns A new specification that is satisfied when both specifications are satisfied
   */
  and(other: Specification<T>): Specification<T>;

  /**
   * Combines this specification with another using OR logic
   * @param other The other specification
   * @returns A new specification that is satisfied when either specification is satisfied
   */
  or(other: Specification<T>): Specification<T>;

  /**
   * Negates this specification
   * @returns A new specification that is satisfied when this specification is not satisfied
   */
  not(): Specification<T>;
}

/**
 * Abstract base class for composite specifications
 * Provides default implementations for and, or, and not operations
 */
export abstract class CompositeSpecification<T> implements Specification<T> {
  abstract isSatisfiedBy(candidate: T): boolean;

  and(other: Specification<T>): Specification<T> {
    return new AndSpecification(this, other);
  }

  or(other: Specification<T>): Specification<T> {
    return new OrSpecification(this, other);
  }

  not(): Specification<T> {
    return new NotSpecification(this);
  }
}

/**
 * Specification that combines two specifications with AND logic
 */
class AndSpecification<T> extends CompositeSpecification<T> {
  constructor(
    private readonly left: Specification<T>,
    private readonly right: Specification<T>
  ) {
    super();
  }

  isSatisfiedBy(candidate: T): boolean {
    return this.left.isSatisfiedBy(candidate) && this.right.isSatisfiedBy(candidate);
  }
}

/**
 * Specification that combines two specifications with OR logic
 */
class OrSpecification<T> extends CompositeSpecification<T> {
  constructor(
    private readonly left: Specification<T>,
    private readonly right: Specification<T>
  ) {
    super();
  }

  isSatisfiedBy(candidate: T): boolean {
    return this.left.isSatisfiedBy(candidate) || this.right.isSatisfiedBy(candidate);
  }
}

/**
 * Specification that negates another specification
 */
class NotSpecification<T> extends CompositeSpecification<T> {
  constructor(private readonly spec: Specification<T>) {
    super();
  }

  isSatisfiedBy(candidate: T): boolean {
    return !this.spec.isSatisfiedBy(candidate);
  }
}
