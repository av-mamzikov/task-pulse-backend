import {MigrationInterface, QueryRunner, Table, TableIndex} from 'typeorm';

export class CreateTasksTable1699000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum types
    await queryRunner.query(`
      CREATE TYPE "task_status_enum" AS ENUM ('New', 'InProgress', 'Done');
    `);

    await queryRunner.query(`
      CREATE TYPE "priority_enum" AS ENUM ('Low', 'Medium', 'High');
    `);

    // Create tasks table
    await queryRunner.createTable(
      new Table({
        name: 'tasks',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'title',
            type: 'varchar',
            length: '200',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'priority',
            type: 'priority_enum',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'task_status_enum',
            default: "'New'",
            isNullable: false,
          },
          {
            name: 'dueDate',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
      true
    );

    // Create indexes for filtering
    await queryRunner.createIndex(
      'tasks',
      new TableIndex({
        name: 'IDX_TASKS_STATUS',
        columnNames: ['status'],
      })
    );

    await queryRunner.createIndex(
      'tasks',
      new TableIndex({
        name: 'IDX_TASKS_PRIORITY',
        columnNames: ['priority'],
      })
    );

    await queryRunner.createIndex(
      'tasks',
      new TableIndex({
        name: 'IDX_TASKS_DUE_DATE',
        columnNames: ['dueDate'],
      })
    );

    // Create composite index for common filter combinations
    await queryRunner.createIndex(
      'tasks',
      new TableIndex({
        name: 'IDX_TASKS_STATUS_PRIORITY',
        columnNames: ['status', 'priority'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.dropIndex('tasks', 'IDX_TASKS_STATUS_PRIORITY');
    await queryRunner.dropIndex('tasks', 'IDX_TASKS_DUE_DATE');
    await queryRunner.dropIndex('tasks', 'IDX_TASKS_PRIORITY');
    await queryRunner.dropIndex('tasks', 'IDX_TASKS_STATUS');

    // Drop table
    await queryRunner.dropTable('tasks');

    // Drop enum types
    await queryRunner.query(`DROP TYPE "priority_enum"`);
    await queryRunner.query(`DROP TYPE "task_status_enum"`);
  }
}
