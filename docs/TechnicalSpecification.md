# Техническое задание: TaskPulse MVP

## 1. Общее описание

**TaskPulse** — веб-сервис для управления задачами с трекером статусов. Система позволяет создавать, просматривать, редактировать и удалять задачи с возможностью фильтрации по статусу и приоритету.

## 2. Use Cases

### UC-1: Создание задачи
**Актор:** Пользователь  
**Предусловие:** Пользователь находится на главной странице приложения  
**Основной сценарий:**
1. Пользователь нажимает кнопку "Создать задачу"
2. Система отображает форму создания задачи
3. Пользователь заполняет поля: название, описание, приоритет, срок выполнения
4. Пользователь нажимает "Сохранить"
5. Система валидирует данные
6. Система сохраняет задачу в БД со статусом "Новое"
7. Система отображает обновленный список задач

**Альтернативный сценарий:**
- 5a. Данные не прошли валидацию → система отображает ошибки валидации

### UC-2: Просмотр списка задач
**Актор:** Пользователь  
**Предусловие:** Нет  
**Основной сценарий:**
1. Пользователь открывает приложение
2. Система загружает все задачи из БД
3. Система отображает список задач с основной информацией (название, статус, приоритет, срок)

### UC-3: Изменение статуса задачи
**Актор:** Пользователь  
**Предусловие:** Список задач отображен  
**Основной сценарий:**
1. Пользователь выбирает задачу
2. Пользователь изменяет статус через выпадающий список или кнопки
3. Система обновляет статус задачи в БД
4. Система отображает обновленную информацию о задаче

### UC-4: Удаление задачи
**Актор:** Пользователь  
**Предусловие:** Список задач отображен  
**Основной сценарий:**
1. Пользователь выбирает задачу для удаления
2. Пользователь нажимает кнопку "Удалить"
3. Система запрашивает подтверждение
4. Пользователь подтверждает удаление
5. Система удаляет задачу из БД
6. Система отображает обновленный список задач

**Альтернативный сценарий:**
- 4a. Пользователь отменяет удаление → система возвращается к списку задач

### UC-5: Фильтрация задач
**Актор:** Пользователь  
**Предусловие:** Список задач отображен  
**Основной сценарий:**
1. Пользователь выбирает фильтры (статус и/или приоритет)
2. Система применяет фильтры
3. Система отображает отфильтрованный список задач

### UC-6: Добавление комментария к задаче (опционально)
**Актор:** Пользователь  
**Предусловие:** Задача существует  
**Основной сценарий:**
1. Пользователь открывает детали задачи
2. Пользователь вводит текст комментария
3. Пользователь нажимает "Добавить комментарий"
4. Система сохраняет комментарий в БД
5. Система отображает обновленный список комментариев

## 3. Функциональные требования

### FR-1: Управление задачами
- **FR-1.1:** Система должна позволять создавать задачу с полями: название (обязательное), описание (опциональное), приоритет (обязательное), срок выполнения (обязательное)
- **FR-1.2:** Система должна отображать список всех задач
- **FR-1.3:** Система должна позволять изменять статус задачи между значениями: "Новое", "В работе", "Готово"
- **FR-1.4:** Система должна позволять удалять задачу с подтверждением
- **FR-1.5:** Система должна позволять редактировать поля задачи

### FR-2: Фильтрация и поиск
- **FR-2.1:** Система должна позволять фильтровать задачи по статусу
- **FR-2.2:** Система должна позволять фильтровать задачи по приоритету
- **FR-2.3:** Система должна позволять применять несколько фильтров одновременно

### FR-3: Комментарии (опционально)
- **FR-3.1:** Система должна позволять добавлять текстовые комментарии к задаче
- **FR-3.2:** Система должна отображать все комментарии к задаче с временем создания

### FR-4: Валидация данных
- **FR-4.1:** Название задачи: обязательное, длина 1-200 символов
- **FR-4.2:** Описание задачи: опциональное, максимум 2000 символов
- **FR-4.3:** Приоритет: обязательное, значения из списка (Низкий, Средний, Высокий)
- **FR-4.4:** Срок выполнения: обязательное, дата не может быть в прошлом
- **FR-4.5:** Статус: обязательное, значения из списка (Новое, В работе, Готово)

### FR-5: Персистентность данных
- **FR-5.1:** Все данные должны сохраняться в PostgreSQL
- **FR-5.2:** Данные должны сохраняться после перезапуска приложения

## 4. Технические требования

### TR-1: Backend
- **TR-1.1:** Платформа: Node.js (версия 18.x или выше)
- **TR-1.2:** Фреймворк: Express.js
- **TR-1.3:** ORM: TypeORM или Prisma для работы с PostgreSQL
- **TR-1.4:** Валидация: class-validator или Joi
- **TR-1.5:** API документация: Swagger/OpenAPI 3.0
- **TR-1.6:** Логирование: Winston или Pino
- **TR-1.7:** Переменные окружения: dotenv

### TR-2: Frontend
- **TR-2.1:** Фреймворк: React 18.x
- **TR-2.2:** Язык: TypeScript
- **TR-2.3:** Сборщик: Vite
- **TR-2.4:** HTTP клиент: Axios или Fetch API
- **TR-2.5:** Управление состоянием: React Context API или Zustand
- **TR-2.6:** UI библиотека: Material-UI, Ant Design или собственные компоненты
- **TR-2.7:** Валидация форм: React Hook Form + Zod

### TR-3: База данных
- **TR-3.1:** СУБД: PostgreSQL 14.x или выше
- **TR-3.2:** Миграции: TypeORM migrations или Prisma migrate
- **TR-3.3:** Индексы: на поля status, priority для оптимизации фильтрации

### TR-4: Контейнеризация
- **TR-4.1:** Backend должен иметь Dockerfile для сборки образа
- **TR-4.2:** Frontend должен иметь Dockerfile для сборки и раздачи статики
- **TR-4.3:** Docker Compose для локальной разработки (backend + frontend + PostgreSQL)

### TR-5: API
- **TR-5.1:** RESTful API архитектура
- **TR-5.2:** Формат данных: JSON
- **TR-5.3:** HTTP статус коды: стандартные (200, 201, 400, 404, 500)
- **TR-5.4:** CORS: настроен для взаимодействия frontend-backend

### TR-6: Безопасность
- **TR-6.1:** Валидация всех входящих данных на backend
- **TR-6.2:** Защита от SQL инъекций (через ORM)
- **TR-6.3:** Санитизация пользовательского ввода
- **TR-6.4:** Безопасные заголовки HTTP (helmet.js)

### TR-7: Производительность
- **TR-7.1:** Время ответа API: не более 500ms для простых запросов
- **TR-7.2:** Пагинация для списка задач (если более 100 записей)
- **TR-7.3:** Оптимизация SQL запросов с использованием индексов

## 5. Требования к архитектуре приложения

### AR-1: Общая архитектура
- **AR-1.1:** Раздельные репозитории для backend и frontend
- **AR-1.2:** Backend и frontend развертываются независимо
- **AR-1.3:** Взаимодействие через REST API

### AR-2: Backend архитектура (Domain-Driven Design + Clean Architecture)

#### Структура слоев:

**Core Layer (Domain + Application)**

- **Domain (Доменный слой):**
    - **Aggregates:** Task (Aggregate Root), Comment (Entity в составе Task)
    - **Domain Events:** TaskCreated, TaskStatusChanged, TaskCompleted, CommentAdded и др.
    - **Specifications:** OverdueTasksSpecification, HighPriorityTasksSpecification
    - **Domain Services:** TaskPriorityService, TaskValidationService
    - **Value Objects:** TaskTitle, TaskDescription, DueDate, CommentText
    - **Enums:** TaskStatus, Priority
    - **Exceptions:** DomainException, InvalidStatusTransitionException

- **Application (Прикладной слой):**
    - **Interfaces:** ITaskRepository, IEventDispatcher
    - **DTOs:** CreateTaskDto, UpdateTaskDto, TaskResponseDto
    - **Use Cases:** CreateTask, UpdateTaskStatus, AddComment (будущее)
    - **Validators:** CreateTaskValidator, UpdateTaskValidator
    - **Result Pattern:** Type-safe error handling

**Infrastructure Layer**

- Реализация репозиториев (TaskRepository с поддержкой Aggregates)
- Event Dispatcher и Event Handlers
- Конфигурация БД (TypeORM)
- Mappers (Domain ↔ Persistence)
- Dependency Injection Container
- Логирование

**Web/API Layer**
- Express маршруты и контроллеры
- Middleware (error handling, validation, logging)
- Swagger конфигурация
- DTOs для API запросов/ответов

**Принципы DDD:**

- **AR-2.1:** Aggregate Pattern: Task управляет своими Comment
- **AR-2.2:** Domain Events: все изменения состояния генерируют события
- **AR-2.3:** Ubiquitous Language: код отражает бизнес-логику
- **AR-2.4:** Bounded Context: четкие границы домена
- **AR-2.5:** Repository Pattern: работа с агрегатами как с единым целым

**Принципы Clean Architecture:**

- **AR-2.6:** Dependency Inversion: зависимости направлены к Core
- **AR-2.7:** Core не зависит от Infrastructure и Web
- **AR-2.8:** Infrastructure и Web зависят от Core
- **AR-2.9:** Использование интерфейсов для абстракции зависимостей
- **AR-2.10:** Dependency Injection для управления зависимостями

### AR-3: Frontend архитектура

**Структура:**
- **Components:** Переиспользуемые UI компоненты
- **Pages:** Страницы приложения
- **Services:** API клиенты (генерируются из OpenAPI)
- **Hooks:** Кастомные React hooks
- **Types:** TypeScript типы (генерируются из OpenAPI)
- **Utils:** Вспомогательные функции

**Принципы:**
- **AR-3.1:** Компонентный подход
- **AR-3.2:** Разделение логики и представления
- **AR-3.3:** Типизация всех данных

### AR-4: API Code Generation
- **AR-4.1:** Backend генерирует OpenAPI спецификацию (swagger.json)
- **AR-4.2:** Frontend использует OpenAPI Generator или orval для генерации:
  - TypeScript типов
  - API клиентов
  - Валидационных схем
- **AR-4.3:** Спецификация OpenAPI является единым источником истины для контракта API
- **AR-4.4:** Автоматическая регенерация клиентского кода при изменении API

### AR-5: Структура проектов

**Backend структура (DDD):**
```
task-pulse-backend/
├── src/
│   ├── core/
│   │   ├── domain/
│   │   │   ├── aggregates/          # Агрегаты (Task, Comment)
│   │   │   │   └── task/
│   │   │   ├── events/              # Domain Events
│   │   │   │   ├── base/
│   │   │   │   ├── task/
│   │   │   │   └── comment/
│   │   │   ├── specifications/      # Спецификации
│   │   │   │   ├── base/
│   │   │   │   └── task/
│   │   │   ├── services/            # Domain Services
│   │   │   ├── exceptions/          # Domain Exceptions
│   │   │   ├── enums/               # Enums
│   │   │   └── value-objects/       # Value Objects
│   │   └── application/
│   │       ├── common/              # Result Pattern
│   │       ├── interfaces/          # ITaskRepository, IEventDispatcher
│   │       ├── dtos/                # DTOs
│   │       ├── use-cases/           # Use Cases (будущее)
│   │       └── validators/          # Validators
│   ├── infrastructure/
│   │   ├── database/
│   │   │   ├── entities/            # TypeORM Entities
│   │   │   ├── mappers/             # Domain ↔ Persistence
│   │   │   └── migrations/
│   │   ├── repositories/            # TaskRepository
│   │   ├── events/                  # EventDispatcher, Handlers
│   │   ├── config/                  # DI Container
│   │   └── logger/
│   ├── web/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── swagger/
│   ├── docs/                        # Документация
│   └── index.ts
├── Dockerfile
└── package.json
```

**Frontend структура:**
```
task-pulse-frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   │   └── api/ (generated)
│   ├── types/ (generated)
│   ├── hooks/
│   └── utils/
├── Dockerfile
└── package.json
```

## 6. Последовательность действий для реализации MVP

### Этап 1: Подготовка инфраструктуры
1. Создать два репозитория: `task-pulse-backend` и `task-pulse-frontend`
2. Настроить структуру проектов согласно Clean Architecture
3. Создать Docker Compose для локальной разработки (PostgreSQL)
4. Настроить переменные окружения

### Этап 2: Backend - Core Layer (Domain)

1. **Определить агрегаты домена:**
    - Task (Aggregate Root) - управляет своими комментариями
    - Comment (Entity) - часть агрегата Task
2. **Создать Value Objects:** TaskTitle, TaskDescription, DueDate, CommentText
3. **Создать Enums:** TaskStatus, Priority
4. **Определить Domain Events:**
    - TaskCreated, TaskStatusChanged, TaskCompleted
    - CommentAdded, CommentDeleted
5. **Создать Specifications:** OverdueTasksSpecification, HighPriorityTasksSpecification
6. **Создать Domain Services:** TaskPriorityService, TaskValidationService
7. **Создать Domain Exceptions:** InvalidStatusTransitionException, InvalidDueDateException
8. **Определить интерфейсы:** ITaskRepository, IEventDispatcher
9. **Создать DTOs** для application layer
10. **Реализовать валидаторы** для DTOs
11. **Реализовать Result Pattern** для type-safe error handling

### Этап 3: Backend - Infrastructure Layer

1. Настроить подключение к PostgreSQL (TypeORM)
2. Создать TypeORM entities для tasks и comments
3. Создать миграции для таблиц
4. **Реализовать Mappers** (Domain ↔ Persistence)
5. **Реализовать TaskRepository** с поддержкой:
    - **Lazy Loading:** `findById()` - БЕЗ комментариев (по умолчанию)
    - **Eager Loading:** `findByIdWithComments()` - С комментариями (явно)
    - `update()` - обновляет только Task (комментарии не трогает)
    - `findAll()` - загружает только Task'и (без комментариев)
    - Поддержки Specifications
    - Диспетчеризации Domain Events после commit
6. **Реализовать EventDispatcher** и Event Handlers
7. Настроить **Dependency Injection Container**
8. Настроить логирование

**Важно:** Repository должен по умолчанию работать БЕЗ загрузки комментариев для оптимизации производительности!

### Этап 4: Backend - Use Cases
1. CreateTask use case
2. GetAllTasks use case
3. UpdateTaskStatus use case
4. DeleteTask use case
5. FilterTasks use case
6. AddComment use case (опционально)

### Этап 5: Backend - Web/API Layer
1. Создать Express приложение
2. Настроить middleware (CORS, helmet, error handling, logging)
3. Создать контроллеры для задач
4. Определить маршруты API
5. Настроить Swagger/OpenAPI документацию
6. Сгенерировать swagger.json

### Этап 6: Backend - Тестирование и Докеризация
1. Написать unit тесты для use cases
2. Написать integration тесты для API endpoints
3. Создать Dockerfile для backend
4. Проверить работу в Docker контейнере

### Этап 7: Frontend - Генерация API клиента
1. Получить swagger.json из backend
2. Настроить OpenAPI Generator или orval
3. Сгенерировать TypeScript типы и API клиенты
4. Настроить HTTP клиент (Axios)

### Этап 8: Frontend - Компоненты и UI
1. Создать базовые компоненты:
   - TaskList
   - TaskItem
   - TaskForm
   - FilterPanel
   - CommentSection (опционально)
2. Создать страницы:
   - MainPage (список задач + фильтры)
   - TaskDetailsPage (опционально)
3. Настроить роутинг (если нужно)

### Этап 9: Frontend - Интеграция с API
1. Создать кастомные hooks для работы с API:
   - useTaskList
   - useCreateTask
   - useUpdateTask
   - useDeleteTask
2. Подключить API к компонентам
3. Реализовать обработку ошибок
4. Добавить индикаторы загрузки

### Этап 10: Frontend - Докеризация
1. Создать production build конфигурацию
2. Создать Dockerfile для frontend (multi-stage build)
3. Настроить nginx для раздачи статики
4. Проверить работу в Docker контейнере

### Этап 11: Интеграционное тестирование
1. Запустить полный стек (backend + frontend + PostgreSQL)
2. Протестировать все use cases
3. Проверить фильтрацию и валидацию
4. Проверить персистентность данных после перезапуска

### Этап 12: Документация и финализация
1. Обновить README для backend (инструкции по запуску, API endpoints)
2. Обновить README для frontend (инструкции по запуску, сборке)
3. Создать docker-compose.yml для production
4. Подготовить инструкции по деплою

## 7. API Endpoints (спецификация)

### Tasks
- `POST /api/tasks` - Создать задачу
- `GET /api/tasks` - Получить список задач (с опциональными query параметрами: status, priority)
- `GET /api/tasks/:id` - Получить задачу по ID
- `PATCH /api/tasks/:id/status` - Обновить статус задачи
- `PUT /api/tasks/:id` - Обновить задачу
- `DELETE /api/tasks/:id` - Удалить задачу

### Comments (опционально)
- `POST /api/tasks/:taskId/comments` - Добавить комментарий
- `GET /api/tasks/:taskId/comments` - Получить комментарии задачи

## 8. Бизнес-правила и инварианты (DDD)

### Aggregate Boundaries и Lazy Loading

#### Aggregate Root: Task

- **Task** является Aggregate Root
- **Comment** является Entity внутри агрегата Task
- Все изменения Comment должны проходить через методы Task

#### Важно: Lazy Loading комментариев

**Комментарии НЕ загружаются автоматически с задачей!**

Это критично для производительности:

1. **Операции с Task (БЕЗ загрузки комментариев):**
    - Создание задачи
    - Изменение статуса задачи
    - Изменение приоритета
    - Изменение названия/описания
    - Изменение срока выполнения
    - Удаление задачи
    - Получение списка задач
    - Фильтрация задач

2. **Операции с комментариями (С загрузкой комментариев):**
    - Просмотр списка комментариев к задаче
    - Добавление комментария
    - Редактирование комментария
    - Удаление комментария

#### Методы Repository:

- `findById(id)` - загружает только Task (без комментариев)
- `findByIdWithComments(id)` - загружает Task + все комментарии
- `update(task)` - обновляет только Task (комментарии не трогает)
- `findAll()` - загружает только Task'и (без комментариев)

### Business Rules

#### Правила изменения статуса:

1. **New → InProgress** ✅ Разрешено
2. **InProgress → Done** ✅ Разрешено
3. **Done → InProgress** ✅ Разрешено (переоткрытие)
4. **New → Done** ❌ Запрещено (должно пройти через InProgress)

#### Правила валидации:

- Название задачи: 1-200 символов, обязательное
- Описание: до 2000 символов, опциональное
- Срок выполнения: не может быть в прошлом
- Комментарий: не может быть пустым

#### Domain Events:

Все изменения состояния генерируют события:

- Создание задачи → `TaskCreated`
- Изменение статуса → `TaskStatusChanged`
- Завершение задачи → `TaskCompleted`
- Изменение приоритета → `TaskPriorityChanged`
- Добавление комментария → `CommentAdded`
- Удаление комментария → `CommentDeleted`

### Specifications (бизнес-правила для запросов):

- **OverdueTasksSpecification:** Задачи с просроченным сроком
- **HighPriorityTasksSpecification:** Задачи с высоким приоритетом
- **CompletableTaskSpecification:** Задачи, которые можно завершить
- **ActiveTasksSpecification:** Активные (незавершенные) задачи

### Примеры сценариев работы с агрегатом

#### Сценарий 1: Изменение статуса задачи (БЕЗ комментариев)

```typescript
// 1. Загружаем только Task (без комментариев)
const task = await taskRepository.findById(taskId);

// 2. Изменяем статус через бизнес-метод
task.changeStatus(TaskStatus.InProgress);

// 3. Сохраняем (комментарии не трогаются)
await taskRepository.update(task);
// → Обновляется только таблица tasks
// → Комментарии не загружаются и не обновляются
```

#### Сценарий 2: Добавление комментария (С комментариями)

```typescript
// 1. Загружаем Task С комментариями
const task = await taskRepository.findByIdWithComments(taskId);

// 2. Добавляем комментарий через бизнес-метод
const comment = task.addComment(new CommentText('Новый комментарий'));

// 3. Сохраняем (обновляются и Task и Comments)
await taskRepository.update(task);
// → Обновляется таблица tasks
// → Вставляется новый комментарий в таблицу comments
```

#### Сценарий 3: Просмотр комментариев (только чтение)

```typescript
// Загружаем Task с комментариями для отображения
const task = await taskRepository.findByIdWithComments(taskId);

// Получаем комментарии для отображения
const comments = task.comments; // ReadonlyArray<Comment>
```

#### Сценарий 4: Получение списка задач (БЕЗ комментариев)

```typescript
// Загружаем все задачи БЕЗ комментариев
const tasks = await taskRepository.findAll({status: TaskStatus.InProgress});
// → Выполняется только SELECT из таблицы tasks
// → Комментарии НЕ загружаются
// → Быстро и эффективно для списков
```

## 9. Модель данных (концептуальная)

### Task
- id: UUID (PK)
- title: string (NOT NULL)
- description: string (NULLABLE)
- priority: enum (Low, Medium, High) (NOT NULL)
- status: enum (New, InProgress, Done) (NOT NULL, DEFAULT: New)
- dueDate: timestamp (NOT NULL)
- createdAt: timestamp (NOT NULL)
- updatedAt: timestamp (NOT NULL)

### Comment (опционально)
- id: UUID (PK)
- taskId: UUID (FK → Task.id)
- text: string (NOT NULL)
- createdAt: timestamp (NOT NULL)

## 10. Критерии приемки MVP

### Функциональные критерии:
1. ✅ Пользователь может создать задачу со всеми обязательными полями
2. ✅ Пользователь видит список всех задач
3. ✅ Пользователь может изменить статус задачи (с валидацией переходов)
4. ✅ Пользователь может удалить задачу
5. ✅ Пользователь может фильтровать задачи по статусу и приоритету
6. ✅ Данные сохраняются в PostgreSQL
7. ✅ Данные сохраняются после перезапуска приложения

### Технические критерии:

8. ✅ Backend реализован с использованием DDD паттернов:
    - Aggregates (Task, Comment)
    - Domain Events
    - Specifications
    - Domain Services
    - Value Objects
9. ✅ Все бизнес-правила инкапсулированы в домене
10. ✅ Domain Events диспетчеризуются после изменений
11. ✅ Repository работает с агрегатами как с единым целым
12. ✅ Backend и frontend запускаются в Docker контейнерах
13. ✅ API документирован через Swagger
14. ✅ Frontend использует сгенерированный API клиент из OpenAPI спецификации
15. ✅ TypeScript компиляция без ошибок
16. ✅ ESLint проверка без ошибок

## 11. Ограничения и допущения

### Ограничения:
- Нет аутентификации и авторизации в MVP
- Нет многопользовательского режима
- Нет real-time обновлений
- Нет мобильной версии

### Допущения:
- Один пользователь работает с системой
- Интернет соединение стабильно
- Браузер поддерживает современные веб-стандарты (ES6+)
