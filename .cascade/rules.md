# Cascade Rules - Task Pulse Backend

## Imports

Always use path aliases with barrel exports instead of relative paths:

```typescript
// ✅ Correct
import {TaskStatus, Priority, TaskTitle} from '@core/domain';

// ❌ Wrong
import {TaskStatus} from '../enums/TaskStatus';
import {TaskStatus} from '..';
```

### Available path aliases:

- `@core/*` → `src/core/*`
- `@infrastructure/*` → `src/infrastructure/*`
- `@web/*` → `src/web/*`
