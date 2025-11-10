import {Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn,} from 'typeorm';
import {TaskStatus} from '@core/domain/enums/TaskStatus';
import {Priority} from '@core/domain/enums/Priority';

@Entity('tasks')
@Index(['status'])
@Index(['priority'])
@Index(['dueDate'])
export class TaskEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({type: 'varchar', length: 200, nullable: false})
  title!: string;

  @Column({type: 'text', nullable: true})
  description!: string | null;

  @Column({
    type: 'enum',
    enum: Priority,
    nullable: false,
  })
  priority!: Priority;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.New,
    nullable: false,
  })
  status!: TaskStatus;

  @Column({type: 'timestamp', nullable: false})
  dueDate!: Date;

  @CreateDateColumn({type: 'timestamp'})
  createdAt!: Date;

  @UpdateDateColumn({type: 'timestamp'})
  updatedAt!: Date;
}
