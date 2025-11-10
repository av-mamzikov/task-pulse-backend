import {Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn} from 'typeorm';
import {TaskEntity} from './TaskEntity';

@Entity('comments')
@Index(['taskId'])
@Index(['createdAt'])
export class CommentEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({type: 'uuid', nullable: false})
  taskId!: string;

  @Column({type: 'text', nullable: false})
  text!: string;

  @CreateDateColumn({type: 'timestamp'})
  createdAt!: Date;

  @ManyToOne(() => TaskEntity, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'taskId'})
  task!: TaskEntity;
}
