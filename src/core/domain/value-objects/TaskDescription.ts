export class TaskDescription {
  private readonly value: string | null;

  constructor(description?: string) {
    if (description && description.length > 2000) {
      throw new Error('Description cannot exceed 2000 characters');
    }
    this.value = description?.trim() || null;
  }

  getValue(): string | null {
    return this.value;
  }

  isEmpty(): boolean {
    return this.value === null || this.value.length === 0;
  }

  equals(other: TaskDescription): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value || '';
  }
}
