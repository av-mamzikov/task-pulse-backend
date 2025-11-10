export class TaskTitle {
  private readonly value: string;

  constructor(title: string) {
    if (!title || title.trim().length === 0) {
      throw new Error('Task title cannot be empty');
    }
    if (title.length > 200) {
      throw new Error('Task title cannot exceed 200 characters');
    }
    this.value = title.trim();
  }

  getValue(): string {
    return this.value;
  }

  equals(other: TaskTitle): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
