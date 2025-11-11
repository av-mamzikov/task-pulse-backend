# Aggregate Lazy Loading - Важное уточнение

**Date:** 2025-11-11  
**Topic:** Правильная работа с агрегатами и производительность

---

## Проблема

В DDD **Task** является Aggregate Root, а **Comment** - entity внутри агрегата.

**НО это НЕ означает**, что мы всегда должны загружать весь агрегат целиком!

---

## Правильный подход: Lazy Loading

### ❌ Неправильно (всегда загружать комментарии):

```typescript
// Плохо: загружаем комментарии даже для простого изменения статуса
const task = await taskRepository.findByIdWithComments(taskId);
task.changeStatus(TaskStatus.InProgress);
await taskRepository.update(task);
// → Лишний SELECT из таблицы comments
// → Лишний UPDATE/DELETE/INSERT комментариев
```

### ✅ Правильно (загружать только когда нужно):

```typescript
// Хорошо: загружаем только Task
const task = await taskRepository.findById(taskId);
task.changeStatus(TaskStatus.InProgress);
await taskRepository.update(task);
// → Только SELECT и UPDATE таблицы tasks
// → Быстро и эффективно
```

---

## Когда загружать комментарии?

### БЕЗ комментариев (Lazy Loading):

1. ✅ Создание задачи
2. ✅ Изменение статуса
3. ✅ Изменение приоритета
4. ✅ Изменение названия/описания
5. ✅ Изменение срока выполнения
6. ✅ Удаление задачи
7. ✅ Получение списка задач
8. ✅ Фильтрация задач

### С комментариями (Eager Loading):

1. ✅ Просмотр списка комментариев
2. ✅ Добавление комментария
3. ✅ Редактирование комментария
4. ✅ Удаление комментария

---

## API Repository

### Методы:

```typescript
interface ITaskRepository {
    // Lazy Loading (по умолчанию)
    findById(id: string): Promise<Task | null>;

    // → Загружает только Task (БЕЗ комментариев)

    // Eager Loading (явно)
    findByIdWithComments(id: string): Promise<Task | null>;

    // → Загружает Task + все комментарии

    // Обновление только Task
    update(task: Task): Promise<Task>;

    // → Обновляет только таблицу tasks
    // → Комментарии не трогает

    // Список без комментариев
    findAll(filters?: TaskFilterOptions): Promise<Task[]>;

    // → Загружает только Task'и
}
```

---

## Примеры использования

### Пример 1: Изменение статуса (оптимально)

```typescript
// Use Case: UpdateTaskStatus
async
execute(taskId
:
string, newStatus
:
TaskStatus
):
Promise < Result < Task >> {
    // 1. Загружаем БЕЗ комментариев
    const task = await this.taskRepository.findById(taskId);

    if(!
task
)
{
    return Result.fail('Task not found');
}

// 2. Изменяем статус
try {
    task.changeStatus(newStatus);
} catch (error) {
    return Result.fail(error.message);
}

// 3. Сохраняем (только Task)
const updatedTask = await this.taskRepository.update(task);

return Result.ok(updatedTask);
}

// SQL выполнено:
// SELECT * FROM tasks WHERE id = ?
// UPDATE tasks SET status = ?, updated_at = ? WHERE id = ?
// Комментарии НЕ затронуты!
```

### Пример 2: Добавление комментария

```typescript
// Use Case: AddComment
async
execute(taskId
:
string, commentText
:
string
):
Promise < Result < Comment >> {
    // 1. Загружаем С комментариями (нужны для бизнес-логики)
    const task = await this.taskRepository.findByIdWithComments(taskId);

    if(!
task
)
{
    return Result.fail('Task not found');
}

// 2. Добавляем комментарий через агрегат
const comment = task.addComment(new CommentText(commentText));

// 3. Сохраняем (Task + новый комментарий)
await this.taskRepository.update(task);

return Result.ok(comment);
}

// SQL выполнено:
// SELECT * FROM tasks WHERE id = ?
// SELECT * FROM comments WHERE task_id = ?
// UPDATE tasks SET updated_at = ? WHERE id = ?
// INSERT INTO comments (id, task_id, text, created_at) VALUES (?, ?, ?, ?)
```

### Пример 3: Список задач (оптимально)

```typescript
// Use Case: GetAllTasks
async
execute(filters ? : TaskFilterOptions)
:
Promise < Result < Task[] >> {
    // Загружаем БЕЗ комментариев
    const tasks = await this.taskRepository.findAll(filters);

    return Result.ok(tasks);
}

// SQL выполнено:
// SELECT * FROM tasks WHERE status = ? ORDER BY due_date ASC
// Комментарии НЕ загружаются!
// Быстро даже для 1000+ задач
```

---

## Преимущества Lazy Loading

### Производительность:

| Операция          | Без Lazy Loading                          | С Lazy Loading      | Выигрыш |
|-------------------|-------------------------------------------|---------------------|---------|
| Изменение статуса | 2 SELECT + 1 UPDATE + N DELETE + N INSERT | 1 SELECT + 1 UPDATE | ~70%    |
| Список 100 задач  | 101 SELECT (N+1)                          | 1 SELECT            | ~99%    |
| Фильтрация        | 101 SELECT + обработка                    | 1 SELECT            | ~99%    |

### Масштабируемость:

- ✅ Меньше нагрузка на БД
- ✅ Меньше трафик по сети
- ✅ Меньше потребление памяти
- ✅ Быстрее время ответа API

---

## Важные принципы

### 1. По умолчанию - Lazy Loading

```typescript
// Всегда используем findById() по умолчанию
const task = await taskRepository.findById(id);
```

### 2. Явное указание Eager Loading

```typescript
// Только когда ДЕЙСТВИТЕЛЬНО нужны комментарии
const task = await taskRepository.findByIdWithComments(id);
```

### 3. Repository не решает за вас

```typescript
// ❌ Плохо: Repository сам решает загружать комментарии
findById() // всегда с комментариями

// ✅ Хорошо: Явное управление
findById() // без комментариев
findByIdWithComments() // с комментариями
```

---

## Обновление в Technical Specification

В `TechnicalSpecification.md` добавлены разделы:

1. **Aggregate Boundaries и Lazy Loading** - объяснение концепции
2. **Примеры сценариев работы с агрегатом** - 4 практических примера
3. **Этап 3: Infrastructure Layer** - требования к Repository
4. **Методы Repository** - четкое описание каждого метода

---

## Выводы

1. ✅ **DDD ≠ всегда загружать весь агрегат**
2. ✅ **Lazy Loading - это норма**, Eager Loading - исключение
3. ✅ **Производительность критична** для реальных приложений
4. ✅ **Явное лучше неявного** - метод должен четко показывать, что он делает
5. ✅ **Repository предоставляет выбор**, Use Case решает

---

**Документ:** TechnicalSpecification.md  
**Статус:** ✅ Обновлен  
**Дата:** 2025-11-11
