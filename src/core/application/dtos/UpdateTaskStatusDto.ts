import {TaskStatus} from '@core/domain';

export class UpdateTaskStatusDto {
  status: TaskStatus;

  constructor(status: TaskStatus) {
    this.status = status;
  }
}
