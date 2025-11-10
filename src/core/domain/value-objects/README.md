# Value Objects

Value Objects инкапсулируют бизнес-логику валидации и поведение, связанное с конкретными значениями в домене.

## Принципы Value Objects

1. **Immutability (Неизменяемость)**: После создания значение не может быть изменено
2. **Value Equality (Равенство по значению)**: Два Value Object равны, если их значения равны
3. **Self-validation (Самовалидация)**: Валидация происходит в конструкторе
4. **No Identity (Без идентификатора)**: Определяются только своими атрибутами

## Реализованные Value Objects

### 1. TaskTitle

Представляет название задачи с бизнес-правилами:

```typescript
const title = new TaskTitle('Implement authentication');
console.log(title.getValue()); // 'Implement authentication'
```

**Правила валидации:**
- Не может быть пустым
- Максимум 200 символов
- Автоматически обрезает пробелы

**Методы:**
- `getValue(): string` - получить значение
- `equals(other: TaskTitle): boolean` - сравнение
- `toString(): string` - строковое представление

### 2. TaskDescription

Представляет описание задачи:

```typescript
const desc = new TaskDescription('Detailed task description');
console.log(desc.getValue()); // 'Detailed task description'
console.log(desc.isEmpty()); // false
```

**Правила валидации:**
- Опциональное поле
- Максимум 2000 символов
- Автоматически обрезает пробелы

**Методы:**
- `getValue(): string | null` - получить значение
- `isEmpty(): boolean` - проверка на пустоту
- `equals(other: TaskDescription): boolean` - сравнение
- `toString(): string` - строковое представление

### 3. DueDate

Представляет срок выполнения задачи с бизнес-логикой:

```typescript
const dueDate = new DueDate(new Date('2025-12-31'));
console.log(dueDate.isOverdue()); // false
console.log(dueDate.daysUntilDue()); // количество дней до срока
```

**Правила валидации:**
- Не может быть в прошлом (при создании)
- Дата нормализуется (время обнуляется)

**Методы:**
- `getValue(): Date` - получить значение (копия)
- `isOverdue(): boolean` - проверка просрочки
- `daysUntilDue(): number` - дней до срока
- `equals(other: DueDate): boolean` - сравнение
- `toString(): string` - ISO строка

**Бизнес-логика:**
```typescript
// Проверка просрочки
if (task.dueDate.isOverdue()) {
  console.log('Task is overdue!');
}

// Получение дней до срока
const days = task.dueDate.daysUntilDue();
if (days <= 3) {
  console.log('Task is due soon!');
}
```

### 4. CommentText

Представляет текст комментария:

```typescript
const text = new CommentText('This is a comment');
console.log(text.getValue()); // 'This is a comment'
console.log(text.getLength()); // 17
```

**Правила валидации:**
- Не может быть пустым
- Автоматически обрезает пробелы

**Методы:**
- `getValue(): string` - получить значение
- `getLength(): number` - длина текста
- `equals(other: CommentText): boolean` - сравнение
- `toString(): string` - строковое представление

## Использование в сущностях

### Task Entity

```typescript
import { Task, TaskTitle, TaskDescription, DueDate, Priority, TaskStatus } from '@/core/domain';

const task = new Task(
  'uuid-here',
  new TaskTitle('Implement feature'),
  Priority.High,
  new DueDate(new Date('2025-12-31')),
  new TaskDescription('Feature description')
);

// Доступ к значениям
console.log(task.getTitleValue()); // 'Implement feature'
console.log(task.getDescriptionValue()); // 'Feature description'
console.log(task.getDueDateValue()); // Date object

// Бизнес-логика
if (task.isOverdue()) {
  console.log('Task is overdue!');
}

console.log(`Days until due: ${task.daysUntilDue()}`);
```

### Comment Entity

```typescript
import { Comment, CommentText } from '@/core/domain';

const comment = new Comment(
  'uuid-here',
  'task-uuid',
  new CommentText('Great progress!')
);

// Доступ к значениям
console.log(comment.getTextValue()); // 'Great progress!'
console.log(comment.getTextLength()); // 15
```

## Преимущества использования

### 1. Централизованная валидация

Вместо:
```typescript
if (!title || title.length > 200) {
  throw new Error('Invalid title');
}
```

Просто:
```typescript
const title = new TaskTitle(userInput); // Валидация автоматически
```

### 2. Бизнес-логика в одном месте

```typescript
// Логика проверки срока инкапсулирована
if (task.isOverdue()) {
  // ...
}
```

### 3. Типобезопасность

```typescript
// Нельзя передать обычную строку вместо TaskTitle
function updateTitle(title: TaskTitle) { // Не string!
  // ...
}
```

### 4. Невозможность создать невалидный объект

```typescript
try {
  const title = new TaskTitle(''); // Выбросит ошибку
} catch (error) {
  console.error('Cannot create empty title');
}
```

## Обработка ошибок

Value Objects выбрасывают ошибки при невалидных данных:

```typescript
try {
  const title = new TaskTitle('a'.repeat(201)); // Слишком длинное
} catch (error) {
  console.error(error.message); // 'Task title cannot exceed 200 characters'
}

try {
  const dueDate = new DueDate(new Date('2020-01-01')); // В прошлом
} catch (error) {
  console.error(error.message); // 'Due date cannot be in the past'
}

try {
  const text = new CommentText('   '); // Пустой после trim
} catch (error) {
  console.error(error.message); // 'Comment text cannot be empty'
}
```

## Интеграция с DTOs

Response DTOs автоматически извлекают значения из Value Objects:

```typescript
// TaskResponseDto
{
  id: 'uuid',
  title: task.getTitleValue(), // string
  description: task.getDescriptionValue(), // string | null
  dueDate: task.getDueDateValue(), // Date
  isOverdue: task.isOverdue(), // boolean
  daysUntilDue: task.daysUntilDue() // number
}
```

## Тестирование

Value Objects легко тестировать:

```typescript
describe('TaskTitle', () => {
  it('should create valid title', () => {
    const title = new TaskTitle('Valid title');
    expect(title.getValue()).toBe('Valid title');
  });

  it('should throw error for empty title', () => {
    expect(() => new TaskTitle('')).toThrow('Task title cannot be empty');
  });

  it('should trim whitespace', () => {
    const title = new TaskTitle('  Title  ');
    expect(title.getValue()).toBe('Title');
  });
});
```

## Best Practices

1. **Всегда валидируйте в конструкторе** - не позволяйте создать невалидный объект
2. **Делайте Value Objects immutable** - не добавляйте сеттеры
3. **Реализуйте equals()** - для сравнения по значению
4. **Добавляйте бизнес-логику** - методы типа `isOverdue()`, `daysUntilDue()`
5. **Используйте в сущностях** - заменяйте примитивные типы на Value Objects
