# Proposal: Разделение на два агрегата

**Date:** 2025-11-11  
**Status:** 💡 PROPOSAL

---

## Проблема

Текущая архитектура: **Task** содержит **Comment** как entity внутри агрегата.

**Проблемы:**

1. Нужен Lazy Loading (усложнение)
2. Comment редко влияет на Task
3. Потенциальные проблемы с масштабируемостью

---

## Предложение: Два отдельных агрегата

### Task Aggregate (Aggregate Root)

```typescript
class Task extends AggregateRoot {
    private _id: string;
    private _title: TaskTitle;
    private _status: TaskStatus;
    private _priority: Priority;
    private _dueDate: DueDate;

    // НЕТ комментариев!

    changeStatus(newStatus: TaskStatus) {
        // Бизнес-логика
        this.addDomainEvent(new TaskStatusChanged(...));
    }
}
```

### Comment Aggregate (Aggregate Root)

```typescript
class Comment extends AggregateRoot {
    private _id: string;
    private _taskId: string; // Ссылка на Task
    private _text: CommentText;
    private _createdAt: Date;

    static create(taskId: string, text: CommentText): Comment {
        const comment = new Comment(...);
        comment.addDomainEvent(new CommentCreated(...));
        return comment;
    }

    updateText(newText: CommentText) {
        this._text = newText;
        this.addDomainEvent(new CommentTextChanged(...));
    }
}
```

---

## Сравнение подходов

### Текущий: Один агрегат (Task + Comment)

```typescript
// Изменение статуса
const task = await taskRepository.findById(taskId); // БЕЗ комментариев
task.changeStatus(TaskStatus.InProgress);
await taskRepository.update(task);

// Добавление комментария
const task = await taskRepository.findByIdWithComments(taskId); // С комментариями
task.addComment(new CommentText('text'));
await taskRepository.update(task);
```

**Проблемы:**

- Два разных метода загрузки (`findById` vs `findByIdWithComments`)
- Нужно помнить, когда какой использовать
- Сложная логика в Repository

### Предложение: Два агрегата

```typescript
// Изменение статуса
const task = await taskRepository.findById(taskId);
task.changeStatus(TaskStatus.InProgress);
await taskRepository.update(task);

// Добавление комментария
const comment = Comment.create(taskId, new CommentText('text'));
await commentRepository.create(comment);
```

**Преимущества:**

- Простые методы репозитория
- Нет Lazy Loading
- Каждый агрегат независим

---

## Новая архитектура

### Repository Interfaces

```typescript
// ITaskRepository - работает только с Task
interface ITaskRepository {
    create(task: Task): Promise<Task>;

    findById(id: string): Promise<Task | null>;

    findAll(filters?: TaskFilterOptions): Promise<Task[]>;

    update(task: Task): Promise<Task>;

    delete(id: string): Promise<boolean>;
}

// ICommentRepository - работает только с Comment
interface ICommentRepository {
    create(comment: Comment): Promise<Comment>;

    findById(id: string): Promise<Comment | null>;

    findByTaskId(taskId: string): Promise<Comment[]>; // Все комментарии задачи
    update(comment: Comment): Promise<Comment>;

    delete(id: string): Promise<boolean>;
}
```

### Use Cases

```typescript
// UpdateTaskStatusUseCase
class UpdateTaskStatusUseCase {
    constructor(
        private taskRepository: ITaskRepository,
        // НЕ нужен commentRepository!
    ) {
    }

    async execute(taskId: string, newStatus: TaskStatus): Promise<Result<Task>> {
        const task = await this.taskRepository.findById(taskId);

        if (!task) {
            return Result.fail('Task not found');
        }

        task.changeStatus(newStatus);
        const updated = await this.taskRepository.update(task);

        return Result.ok(updated);
    }
}

// AddCommentUseCase
class AddCommentUseCase {
    constructor(
        private taskRepository: ITaskRepository,
        private commentRepository: ICommentRepository
    ) {
    }

    async execute(taskId: string, text: string): Promise<Result<Comment>> {
        // 1. Проверяем, что задача существует
        const task = await this.taskRepository.findById(taskId);

        if (!task) {
            return Result.fail('Task not found');
        }

        // 2. Создаем комментарий как отдельный агрегат
        const comment = Comment.create(taskId, new CommentText(text));

        // 3. Сохраняем через свой репозиторий
        const saved = await this.commentRepository.create(comment);

        return Result.ok(saved);
    }
}

// GetTaskWithCommentsUseCase
class GetTaskWithCommentsUseCase {
    constructor(
        private taskRepository: ITaskRepository,
        private commentRepository: ICommentRepository
    ) {
    }

    async execute(taskId: string): Promise<Result<TaskWithComments>> {
        // Загружаем параллельно
        const [task, comments] = await Promise.all([
            this.taskRepository.findById(taskId),
            this.commentRepository.findByTaskId(taskId)
        ]);

        if (!task) {
            return Result.fail('Task not found');
        }

        return Result.ok({task, comments});
    }
}
```

---

## Консистентность

### Eventual Consistency

При разделении агрегатов используется **eventual consistency**:

```typescript
// Пример: Удаление задачи
class DeleteTaskUseCase {
    async execute(taskId: string): Promise<Result<void>> {
        // 1. Удаляем задачу
        const deleted = await this.taskRepository.delete(taskId);

        if (!deleted) {
            return Result.fail('Task not found');
        }

        // 2. Асинхронно удаляем комментарии через Domain Event
        // TaskDeleted event → TaskDeletedHandler → удаляет комментарии

        return Result.ok();
    }
}

// Event Handler
class TaskDeletedHandler implements IEventHandler<TaskDeleted> {
    constructor(private commentRepository: ICommentRepository) {
    }

    async handle(event: TaskDeleted): Promise<void> {
        // Удаляем все комментарии задачи
        const comments = await this.commentRepository.findByTaskId(event.aggregateId);

        for (const comment of comments) {
            await this.commentRepository.delete(comment.id);
        }
    }
}
```

**Плюсы:**

- ✅ Задача удаляется сразу
- ✅ Комментарии удаляются асинхронно (eventual consistency)
- ✅ Если удаление комментариев упадет - можно повторить

---

## Domain Events

### Task Events (без изменений)

- TaskCreated
- TaskStatusChanged
- TaskPriorityChanged
- TaskCompleted
- TaskDeleted

### Comment Events (новые)

- CommentCreated
- CommentTextChanged
- CommentDeleted

---

## Преимущества разделения

### 1. Простота

```typescript
// ✅ Просто
const task = await taskRepository.findById(id);

// ❌ Сложно
const task = await taskRepository.findById(id); // или findByIdWithComments?
```

### 2. Производительность

```typescript
// Загрузка списка задач
const tasks = await taskRepository.findAll();
// → 1 SELECT из tasks
// → Комментарии НЕ загружаются автоматически

// Загрузка комментариев отдельно (если нужно)
const comments = await commentRepository.findByTaskId(taskId);
// → 1 SELECT из comments
```

### 3. Масштабируемость

- Task и Comment могут быть в разных БД
- Можно кешировать независимо
- Можно масштабировать горизонтально

### 4. Независимость

- Изменения в Comment не влияют на Task
- Можно добавлять новые поля в Comment без изменения Task
- Проще тестировать

---

## Недостатки разделения

### 1. Eventual Consistency

```typescript
// Задача удалена, но комментарии еще есть (на 100ms)
await taskRepository.delete(taskId);
// Комментарии удалятся через event handler
```

**Решение:** Для TaskPulse это приемлемо, т.к. пользователь не заметит задержку в 100ms.

### 2. Больше кода

- Два репозитория вместо одного
- Два набора Use Cases
- Event Handlers для синхронизации

**Решение:** Код проще и понятнее, хоть и больше.

### 3. Нет транзакционности между агрегатами

```typescript
// Нельзя сделать в одной транзакции:
await taskRepository.update(task);
await commentRepository.create(comment);
// Если второе упадет - первое уже сохранено
```

**Решение:** Использовать Domain Events и Saga pattern для сложных операций.

---

## Рекомендация

### 🎯 Разделить на два агрегата!

**Причины:**

1. ✅ **Comment не влияет на инварианты Task**
    - Нет бизнес-правил типа "нельзя завершить без комментария"

2. ✅ **Eventual consistency приемлема**
    - Задержка в 100ms незаметна для пользователя

3. ✅ **Проще реализация**
    - Нет Lazy Loading
    - Простые репозитории

4. ✅ **Лучше масштабируемость**
    - Независимое кеширование
    - Можно разнести по разным БД

5. ✅ **Следует принципам DDD**
    - "Design aggregates based on business invariants, not data relationships"
    - Vaughn Vernon: "Keep aggregates small"

---

## План миграции

### Этап 1: Создать Comment как Aggregate Root

1. Создать `Comment` aggregate в `domain/aggregates/comment/`
2. Добавить методы `create()`, `updateText()`, `delete()`
3. Добавить Domain Events: `CommentCreated`, `CommentTextChanged`, `CommentDeleted`

### Этап 2: Создать ICommentRepository

1. Определить интерфейс `ICommentRepository`
2. Реализовать `CommentRepository`
3. Добавить в DI Container

### Этап 3: Обновить Task Aggregate

1. Удалить `_comments` из Task
2. Удалить методы `addComment()`, `removeComment()`
3. Упростить `TaskRepository` (убрать Lazy Loading)

### Этап 4: Создать Use Cases

1. `AddCommentUseCase`
2. `UpdateCommentUseCase`
3. `DeleteCommentUseCase`
4. `GetTaskCommentsUseCase`

### Этап 5: Event Handlers

1. `TaskDeletedHandler` - удаляет комментарии при удалении задачи
2. Другие handlers по необходимости

---

## Заключение

Разделение на два агрегата - **правильное архитектурное решение** для TaskPulse:

- ✅ Проще код
- ✅ Лучше производительность
- ✅ Лучше масштабируемость
- ✅ Следует best practices DDD

**Рекомендация:** Провести рефакторинг.

---

**Автор:** AI Assistant  
**Дата:** 2025-11-11  
**Статус:** 💡 PROPOSAL - требует обсуждения
