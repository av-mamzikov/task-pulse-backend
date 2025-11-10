import {Priority, TaskStatus} from '@core/domain';

export class FilterTasksDto {
  status?: TaskStatus;
  priority?: Priority;

  constructor(status?: TaskStatus, priority?: Priority) {
    this.status = status;
    this.priority = priority;
  }
}
