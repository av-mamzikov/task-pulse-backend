# Техническое задание: Реализация полноценного DDD в TaskPulse

## 1. Цель

Трансформировать текущую Clean Architecture в полноценный Domain-Driven Design с тактическими и стратегическими паттернами для поддержки будущего роста и усложнения бизнес-логики.

---

## 2. Текущее состояние

### Что уже есть:

- ✅ Clean Architecture (Core, Infrastructure, Web)
- ✅ Value Objects (TaskTitle, TaskDescription, DueDate, CommentText)
- ✅ Entities (Task, Comment)
- ✅ Repository Interfaces (ITaskRepository)
- ✅ Dependency Inversion

### Что нужно добавить:

- ❌ Domain Events
- ❌ Aggregate Roots
- ❌ Domain Services
- ❌ Specifications
- ❌ Result/Either pattern для обработки ошибок
- ❌ Unit of Work pattern
- ❌ Event Dispatcher

---

## 3. Архитектурные изменения

### 3.1 Структура проекта (новая)

```
src/
├── core/
│   ├── domain/
│   │   ├── aggregates/           # NEW
│   │   │   ├── task/
│   │   │   │   ├── Task.ts       # Aggregate Root
│   │   │   │   ├── Comment.ts    # Entity внутри агрегата
│   │   │   │   └── index.ts
│   │   ├── entities/              # EXISTING (переместить в aggregates)
│   │   ├── value-objects/         # EXISTING
│   │   ├── enums/                 # EXISTING
│   │   ├── events/                # NEW - Domain Events
│   │   │   ├── base/
│   │   │   │   ├── DomainEvent.ts
│   │   │   │   ├── AggregateRoot.ts
│   │   │   │   └── IEventDispatcher.ts
│   │   │   ├── task/
│   │   │   │   ├── TaskCreated.ts
│   │   │   │   ├── TaskStatusChanged.ts
│   │   │   │   ├── TaskPriorityChanged.ts
│   │   │   │   ├── TaskCompleted.ts
│   │   │   │   └── TaskDeleted.ts
│   │   │   └── comment/
│   │   │       ├── CommentAdded.ts
│   │   │       └── CommentDeleted.ts
│   │   ├── services/              # NEW - Domain Services
│   │   │   ├── TaskPriorityService.ts
│   │   │   └── TaskValidationService.ts
│   │   ├── specifications/        # NEW - Specifications
│   │   │   ├── base/
│   │   │   │   └── Specification.ts
│   │   │   └── task/
│   │   │       ├── OverdueTasksSpecification.ts
│   │   │       ├── HighPriorityTasksSpecification.ts
│   │   │       └── CompletableTaskSpecification.ts
│   │   └── exceptions/            # NEW - Domain Exceptions
│   │       ├── DomainException.ts
│   │       ├── InvalidStatusTransitionException.ts
│   │       └── TaskNotFoundException.ts
│   └── application/
│       ├── interfaces/             # EXISTING
│       ├── dtos/                   # EXISTING
│       ├── use-cases/              # EXISTING
│       ├── validators/             # EXISTING
│       └── common/                 # NEW
│           ├── Result.ts           # Result pattern
│           └── Either.ts           # Either pattern
├── infrastructure/
│   ├── database/
│   ├── repositories/
│   ├── events/                     # NEW - Event Infrastructure
│   │   ├── EventDispatcher.ts
│   │   ├── EventHandler.ts
│   │   └── handlers/
│   │       ├── TaskStatusChangedHandler.ts
│   │       └── CommentAddedHandler.ts
│   └── persistence/                # NEW - Unit of Work
│       └── UnitOfWork.ts
└── web/
```

---

## 4. Детальная спецификация компонентов

### 4.1 Domain Events

#### 4.1.1 Базовые интерфейсы

**Файл:** `core/domain/events/base/DomainEvent.ts`

```typescript
export interface DomainEvent {
    occurredOn: Date;
    eventName: string;
    aggregateId: string;
}
```

**Файл:** `core/domain/events/base/AggregateRoot.ts`

```typescript
export abstract class AggregateRoot {
    private _domainEvents: DomainEvent[] = [];

    protected addDomainEvent(event: DomainEvent): void;

    public getDomainEvents(): ReadonlyArray<DomainEvent>;

    public clearDomainEvents(): void;
}
```

**Файл:** `core/domain/events/base/IEventDispatcher.ts`

```typescript
export interface IEventDispatcher {
    dispatch(event: DomainEvent): Promise<void>;

    register(eventName: string, handler: IEventHandler): void;
}

export interface IEventHandler<T extends DomainEvent = DomainEvent> {
    handle(event: T): Promise<void>;
}
```

#### 4.1.2 Task Events

**Файл:** `core/domain/events/task/TaskCreated.ts`

```typescript
export class TaskCreated implements DomainEvent {
    eventName = 'TaskCreated';
    occurredOn: Date = new Date();

    constructor(
        public readonly aggregateId: string,
        public readonly title: string,
        public readonly priority: Priority,
        public readonly dueDate: Date
    ) {
    }
}
```

**Файл:** `core/domain/events/task/TaskStatusChanged.ts`

```typescript
export class TaskStatusChanged implements DomainEvent {
    eventName = 'TaskStatusChanged';
    occurredOn: Date = new Date();

    constructor(
        public readonly aggregateId: string,
        public readonly oldStatus: TaskStatus,
        public readonly newStatus: TaskStatus,
        public readonly changedBy?: string
    ) {
    }
}
```

**Аналогично создать:**

- `TaskPriorityChanged.ts`
- `TaskCompleted.ts`
- `TaskDeleted.ts`
- `TaskDueDateChanged.ts`

#### 4.1.3 Comment Events

**Файл:** `core/domain/events/comment/CommentAdded.ts`

```typescript
export class CommentAdded implements DomainEvent {
    eventName = 'CommentAdded';
    occurredOn: Date = new Date();

    constructor(
        public readonly aggregateId: string, // taskId
        public readonly commentId: string,
        public readonly text: string
    ) {
    }
}
```

---

### 4.2 Aggregate Roots

#### 4.2.1 Task Aggregate Root

**Файл:** `core/domain/aggregates/task/Task.ts`

**Требования:**

1. Наследуется от `AggregateRoot`
2. Все изменения состояния через методы (не прямое изменение полей)
3. Каждое изменение генерирует Domain Event
4. Валидация бизнес-правил внутри методов
5. Инкапсуляция коллекции комментариев

**Методы:**

```typescript
export class Task extends AggregateRoot {
    // Private fields
    private _id: string;
    private _title: TaskTitle;
    private _description: TaskDescription;
    private _priority: Priority;
    private _status: TaskStatus;
    private _dueDate: DueDate;
    private _comments: Comment[] = [];
    private _createdAt: Date;
    private _updatedAt: Date;

    // Factory method
    static create(
        title: TaskTitle,
        priority: Priority,
        dueDate: DueDate,
        description?: TaskDescription
    ): Task;

    // Business methods
    changeStatus(newStatus: TaskStatus): void;

    changePriority(newPriority: Priority): void;

    updateTitle(newTitle: TaskTitle): void;

    updateDescription(newDescription: TaskDescription): void;

    changeDueDate(newDueDate: DueDate): void;

    addComment(text: CommentText): Comment;

    removeComment(commentId: string): void;

    complete(): void;

    reopen(): void;

    // Getters (read-only access)
    get id(): string;

    get title(): string;

    get status(): TaskStatus;

    get comments(): ReadonlyArray<Comment>;

    // ... остальные getters
}
```

**Бизнес-правила:**

1. Нельзя изменить статус на Done, если есть открытые подзадачи (пока нет, но подготовить)
2. Нельзя изменить dueDate на прошедшую дату
3. Статус можно менять только в определённой последовательности:
    - New → InProgress → Done
    - Done → InProgress (reopen)
    - Нельзя: New → Done напрямую
4. При изменении статуса на Done генерируется `TaskCompleted` event
5. Комментарии можно добавлять только к существующим задачам

#### 4.2.2 Comment Entity (внутри агрегата)

**Файл:** `core/domain/aggregates/task/Comment.ts`

**Требования:**

1. НЕ является Aggregate Root
2. Управляется только через Task
3. Имеет ссылку на taskId
4. Нельзя создать напрямую (только через Task.addComment)

```typescript
export class Comment {
    private constructor(
        private _id: string,
        private _taskId: string,
        private _text: CommentText,
        private _createdAt: Date
    ) {
    }

    // Internal factory (package-private)
    static createForTask(taskId: string, text: CommentText): Comment;

    // Getters
    get id(): string;

    get taskId(): string;

    get text(): string;

    get createdAt(): Date;
}
```

---

### 4.3 Domain Services

#### 4.3.1 TaskPriorityService

**Файл:** `core/domain/services/TaskPriorityService.ts`

**Назначение:** Логика, которая не принадлежит одной entity

```typescript
export class TaskPriorityService {
    /**
     * Автоматически повышает приоритет задач, которые скоро истекают
     */
    escalatePriorityForOverdueTasks(tasks: Task[]): Task[];

    /**
     * Рассчитывает приоритет на основе срока и текущей загрузки
     */
    calculateDynamicPriority(task: Task, allTasks: Task[]): Priority;
}
```

#### 4.3.2 TaskValidationService

**Файл:** `core/domain/services/TaskValidationService.ts`

```typescript
export class TaskValidationService {
    /**
     * Проверяет, можно ли изменить статус задачи
     */
    canChangeStatus(task: Task, newStatus: TaskStatus): Result<boolean, string>;

    /**
     * Проверяет, можно ли удалить задачу
     */
    canDeleteTask(task: Task): Result<boolean, string>;
}
```

---

### 4.4 Specifications

#### 4.4.1 Base Specification

**Файл:** `core/domain/specifications/base/Specification.ts`

```typescript
export interface Specification<T> {
    isSatisfiedBy(candidate: T): boolean;

    and(other: Specification<T>): Specification<T>;

    or(other: Specification<T>): Specification<T>;

    not(): Specification<T>;
}

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
```

#### 4.4.2 Task Specifications

**Файл:** `core/domain/specifications/task/OverdueTasksSpecification.ts`

```typescript
export class OverdueTasksSpecification extends CompositeSpecification<Task> {
    isSatisfiedBy(task: Task): boolean {
        return task.dueDate < new Date() && task.status !== TaskStatus.Done;
    }
}
```

**Файл:** `core/domain/specifications/task/HighPriorityTasksSpecification.ts`

```typescript
export class HighPriorityTasksSpecification extends CompositeSpecification<Task> {
    isSatisfiedBy(task: Task): boolean {
        return task.priority === Priority.High;
    }
}
```

**Файл:** `core/domain/specifications/task/CompletableTaskSpecification.ts`

```typescript
export class CompletableTaskSpecification extends CompositeSpecification<Task> {
    isSatisfiedBy(task: Task): boolean {
        // Задачу можно завершить, если нет открытых подзадач
        // Пока просто проверяем статус
        return task.status === TaskStatus.InProgress;
    }
}
```

---

### 4.5 Domain Exceptions

#### 4.5.1 Base Exception

**Файл:** `core/domain/exceptions/DomainException.ts`

```typescript
export class DomainException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DomainException';
        Object.setPrototypeOf(this, DomainException.prototype);
    }
}
```

#### 4.5.2 Specific Exceptions

**Файл:** `core/domain/exceptions/InvalidStatusTransitionException.ts`

```typescript
export class InvalidStatusTransitionException extends DomainException {
    constructor(
        public readonly currentStatus: TaskStatus,
        public readonly targetStatus: TaskStatus
    ) {
        super(
            `Cannot transition from ${currentStatus} to ${targetStatus}`
        );
        this.name = 'InvalidStatusTransitionException';
    }
}
```

**Аналогично создать:**

- `TaskNotFoundException.ts`
- `InvalidDueDateException.ts`
- `CommentNotFoundException.ts`

---

### 4.6 Result Pattern

**Файл:** `core/application/common/Result.ts`

```typescript
export class Result<T, E = string> {
    private constructor(
        private readonly _isSuccess: boolean,
        private readonly _value?: T,
        private readonly _error?: E
    ) {
    }

    static ok<T, E = string>(value: T): Result<T, E>;

    static fail<T, E = string>(error: E): Result<T, E>;

    get isSuccess(): boolean;

    get isFailure(): boolean;

    get value(): T;

    get error(): E;

    map<U>(fn: (value: T) => U): Result<U, E>;

    flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E>;
}
```

---

### 4.7 Infrastructure - Event Dispatcher

#### 4.7.1 Event Dispatcher Implementation

**Файл:** `infrastructure/events/EventDispatcher.ts`

```typescript
export class EventDispatcher implements IEventDispatcher {
    private handlers: Map<string, IEventHandler[]> = new Map();

    register(eventName: string, handler: IEventHandler): void;

    async dispatch(event: DomainEvent): Promise<void>;
}
```

#### 4.7.2 Event Handlers

**Файл:** `infrastructure/events/handlers/TaskStatusChangedHandler.ts`

```typescript
export class TaskStatusChangedHandler implements IEventHandler<TaskStatusChanged> {
    async handle(event: TaskStatusChanged): Promise<void> {
        // Логирование
        logger.info(`Task ${event.aggregateId} status changed: ${event.oldStatus} → ${event.newStatus}`);

        // Можно добавить:
        // - Отправка уведомлений
        // - Обновление статистики
        // - Webhook вызовы
    }
}
```

**Аналогично создать:**

- `TaskCreatedHandler.ts`
- `TaskCompletedHandler.ts`
- `CommentAddedHandler.ts`

---

### 4.8 Unit of Work

**Файл:** `infrastructure/persistence/UnitOfWork.ts`

```typescript
export class UnitOfWork {
    constructor(
        private dataSource: DataSource,
        private eventDispatcher: IEventDispatcher
    ) {
    }

    async commit(): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Сохранить изменения
            await queryRunner.commitTransaction();

            // Отправить domain events
            await this.dispatchEvents();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    private async dispatchEvents(): Promise<void>;
}
```

---

## 5. Изменения в существующих компонентах

### 5.1 Repository Interface

**Файл:** `core/application/interfaces/ITaskRepository.ts`

**Добавить:**

```typescript
export interface ITaskRepository {
    // Existing methods
    create(task: Task): Promise<Task>;

    findById(id: string): Promise<Task | null>;

    findAll(filters?: TaskFilterOptions): Promise<Task[]>;

    update(task: Task): Promise<Task>;

    delete(id: string): Promise<boolean>;

    // NEW - Specifications support
    findBySpecification(spec: Specification<Task>): Promise<Task[]>;

    // NEW - Aggregate loading with comments
    findByIdWithComments(id: string): Promise<Task | null>;
}
```

### 5.2 TaskRepository Implementation

**Файл:** `infrastructure/repositories/TaskRepository.ts`

**Изменения:**

1. Загружать комментарии вместе с задачей (eager loading)
2. Сохранять комментарии как часть агрегата
3. Диспатчить domain events после сохранения
4. Поддержка specifications

```typescript
export class TaskRepository implements ITaskRepository {
    constructor(
        private eventDispatcher: IEventDispatcher
    ) {
    }

    async create(task: Task): Promise<Task> {
        // Сохранить task
        // Сохранить comments
        // Диспатчить events
        const events = task.getDomainEvents();
        for (const event of events) {
            await this.eventDispatcher.dispatch(event);
        }
        task.clearDomainEvents();
        return task;
    }

    async findBySpecification(spec: Specification<Task>): Promise<Task[]> {
        const allTasks = await this.findAll();
        return allTasks.filter(task => spec.isSatisfiedBy(task));
    }
}
```

### 5.3 Use Cases Updates

**Пример:** `core/application/use-cases/UpdateTaskStatusUseCase.ts`

**Было:**

```typescript
async
execute(taskId
:
string, newStatus
:
TaskStatus
):
Promise < Task > {
    const task = await this.taskRepository.findById(taskId);
    task.status = newStatus; // Прямое изменение
    return await this.taskRepository.update(task);
}
```

**Стало:**

```typescript
async
execute(taskId
:
string, newStatus
:
TaskStatus
):
Promise < Result < Task, string >> {
    const task = await this.taskRepository.findById(taskId);

    if(!
task
)
{
    return Result.fail('Task not found');
}

try {
    task.changeStatus(newStatus); // Метод с бизнес-логикой
    const updatedTask = await this.taskRepository.update(task);
    return Result.ok(updatedTask);
} catch (error) {
    if (error instanceof InvalidStatusTransitionException) {
        return Result.fail(error.message);
    }
    throw error;
}
}
```

---

## 6. План реализации (пошаговый)

### Этап 1: Базовая инфраструктура (2-3 часа)

1. ✅ Создать структуру папок
2. ✅ Реализовать `DomainEvent` interface
3. ✅ Реализовать `AggregateRoot` base class
4. ✅ Реализовать `IEventDispatcher` interface
5. ✅ Реализовать `EventDispatcher` в infrastructure
6. ✅ Реализовать `Result` pattern

### Этап 2: Domain Events (2-3 часа)

1. ✅ Создать все Task events
2. ✅ Создать все Comment events
3. ✅ Создать event handlers в infrastructure
4. ✅ Зарегистрировать handlers в DI container

### Этап 3: Aggregate Root (3-4 часа)

1. ✅ Рефакторинг Task → Task Aggregate Root
2. ✅ Добавить все бизнес-методы
3. ✅ Добавить генерацию events
4. ✅ Реализовать бизнес-правила
5. ✅ Рефакторинг Comment как entity внутри агрегата

### Этап 4: Specifications (1-2 часа)

1. ✅ Реализовать base Specification
2. ✅ Создать все Task specifications
3. ✅ Добавить поддержку в repository

### Этап 5: Domain Services (1-2 часа)

1. ✅ Реализовать TaskPriorityService
2. ✅ Реализовать TaskValidationService
3. ✅ Интегрировать в use cases

### Этап 6: Exceptions (1 час)

1. ✅ Создать базовый DomainException
2. ✅ Создать все специфичные exceptions
3. ✅ Обновить обработку ошибок в use cases

### Этап 7: Repository Updates (2-3 часа)

1. ✅ Обновить ITaskRepository
2. ✅ Обновить TaskRepository implementation
3. ✅ Добавить поддержку specifications
4. ✅ Добавить event dispatching
5. ✅ Добавить загрузку комментариев

### Этап 8: Use Cases Refactoring (2-3 часа)

1. ✅ Обновить все use cases для использования Result
2. ✅ Использовать методы агрегата вместо прямого изменения
3. ✅ Добавить обработку domain exceptions

### Этап 9: Unit of Work (опционально, 2-3 часа)

1. ✅ Реализовать UnitOfWork
2. ✅ Интегрировать с repositories
3. ✅ Обновить use cases

### Этап 10: Testing & Documentation (2-3 часа)

1. ✅ Написать unit тесты для агрегатов
2. ✅ Написать тесты для specifications
3. ✅ Обновить документацию
4. ✅ Создать примеры использования

**Общее время: 18-27 часов**

---

## 7. Критерии приемки

### 7.1 Функциональные

- ✅ Все изменения Task проходят через методы агрегата
- ✅ При каждом изменении генерируются domain events
- ✅ Events обрабатываются handlers
- ✅ Бизнес-правила валидируются в domain layer
- ✅ Specifications работают для фильтрации
- ✅ Result pattern используется во всех use cases
- ✅ Domain exceptions обрабатываются корректно

### 7.2 Архитектурные

- ✅ Domain layer не зависит от Infrastructure
- ✅ Все бизнес-логика в domain layer
- ✅ Infrastructure только для технических деталей
- ✅ Use cases оркеструют domain objects
- ✅ События диспатчатся после успешного сохранения

### 7.3 Качество кода

- ✅ 100% type-safety (no any)
- ✅ Все public методы документированы
- ✅ Unit тесты покрывают бизнес-логику
- ✅ Код следует SOLID принципам

---

## 8. Примеры использования после реализации

### 8.1 Создание задачи

```typescript
// Use Case
const title = new TaskTitle('Implement DDD');
const dueDate = new DueDate(new Date('2025-12-31'));
const task = Task.create(title, Priority.High, dueDate);

await taskRepository.create(task);
// → Генерируется TaskCreated event
// → Handler логирует создание
```

### 8.2 Изменение статуса

```typescript
const task = await taskRepository.findById(taskId);
task.changeStatus(TaskStatus.InProgress);
// → Валидация перехода статуса
// → Генерируется TaskStatusChanged event
await taskRepository.update(task);
// → Handler отправляет уведомление
```

### 8.3 Использование Specifications

```typescript
const overdueSpec = new OverdueTasksSpecification();
const highPrioritySpec = new HighPriorityTasksSpecification();

const criticalTasks = await taskRepository.findBySpecification(
    overdueSpec.and(highPrioritySpec)
);
```

### 8.4 Domain Service

```typescript
const priorityService = new TaskPriorityService();
const escalatedTasks = priorityService.escalatePriorityForOverdueTasks(allTasks);
```

---

## 9. Риски и митигация

### Риск 1: Over-engineering для простого проекта

**Митигация:** Реализовать поэтапно, можно остановиться после Этапа 3

### Риск 2: Сложность для новых разработчиков

**Митигация:** Подробная документация и примеры

### Риск 3: Производительность (events overhead)

**Митигация:** Асинхронная обработка events, батчинг

### Риск 4: Увеличение времени разработки

**Митигация:** Шаблоны и генераторы для boilerplate кода

---

## 10. Дальнейшее развитие

После реализации базового DDD можно добавить:

1. **Event Sourcing** - хранение истории изменений через events
2. **CQRS** - разделение команд и запросов
3. **Sagas** - для сложных бизнес-процессов
4. **Bounded Contexts** - при добавлении новых модулей
5. **Integration Events** - для взаимодействия с внешними системами

---

## 11. Ссылки и ресурсы

- Domain-Driven Design (Eric Evans)
- Implementing Domain-Driven Design (Vaughn Vernon)
- [DDD Reference](https://www.domainlanguage.com/ddd/reference/)
- [Enterprise Craftsmanship Blog](https://enterprisecraftsmanship.com/)

---

**Автор:** AI Assistant  
**Дата:** 2025-11-10  
**Версия:** 1.0
