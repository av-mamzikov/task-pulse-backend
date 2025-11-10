export class DueDate {
  private readonly value: Date;

  constructor(date: Date) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(date);
    dueDate.setHours(0, 0, 0, 0);

    if (dueDate < now) {
      throw new Error('Due date cannot be in the past');
    }
    
    this.value = new Date(date);
  }

  getValue(): Date {
    return new Date(this.value);
  }

  isOverdue(): boolean {
    const now = new Date();
    return this.value < now;
  }

  daysUntilDue(): number {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const diff = this.value.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  equals(other: DueDate): boolean {
    return this.value.getTime() === other.value.getTime();
  }

  toString(): string {
    return this.value.toISOString();
  }
}
