import {DomainException} from './DomainException';

/**
 * Exception thrown when a comment cannot be found
 */
export class CommentNotFoundException extends DomainException {
  constructor(public readonly commentId: string) {
    super(`Comment with ID ${commentId} was not found.`);
    this.name = 'CommentNotFoundException';
    Object.setPrototypeOf(this, CommentNotFoundException.prototype);
  }
}
