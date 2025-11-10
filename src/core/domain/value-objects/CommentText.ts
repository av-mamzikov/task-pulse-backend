export class CommentText {
  private readonly value: string;

  constructor(text: string) {
    if (!text || text.trim().length === 0) {
      throw new Error('Comment text cannot be empty');
    }
    this.value = text.trim();
  }

  getValue(): string {
    return this.value;
  }

  getLength(): number {
    return this.value.length;
  }

  equals(other: CommentText): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
