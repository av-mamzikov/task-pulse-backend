import {MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex} from 'typeorm';

export class CreateCommentsTable1699000001000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create comments table
    await queryRunner.createTable(
      new Table({
        name: 'comments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'taskId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'text',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
      true
    );

    // Create foreign key to tasks table
    await queryRunner.createForeignKey(
      'comments',
      new TableForeignKey({
        name: 'FK_COMMENTS_TASK',
        columnNames: ['taskId'],
        referencedTableName: 'tasks',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    );

    // Create indexes for filtering and sorting
    await queryRunner.createIndex(
      'comments',
      new TableIndex({
        name: 'IDX_COMMENTS_TASK_ID',
        columnNames: ['taskId'],
      })
    );

    await queryRunner.createIndex(
      'comments',
      new TableIndex({
        name: 'IDX_COMMENTS_CREATED_AT',
        columnNames: ['createdAt'],
      })
    );

    // Create composite index for common queries (get comments by task, sorted by date)
    await queryRunner.createIndex(
      'comments',
      new TableIndex({
        name: 'IDX_COMMENTS_TASK_CREATED',
        columnNames: ['taskId', 'createdAt'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.dropIndex('comments', 'IDX_COMMENTS_TASK_CREATED');
    await queryRunner.dropIndex('comments', 'IDX_COMMENTS_CREATED_AT');
    await queryRunner.dropIndex('comments', 'IDX_COMMENTS_TASK_ID');

    // Drop foreign key
    await queryRunner.dropForeignKey('comments', 'FK_COMMENTS_TASK');

    // Drop table
    await queryRunner.dropTable('comments');
  }
}
