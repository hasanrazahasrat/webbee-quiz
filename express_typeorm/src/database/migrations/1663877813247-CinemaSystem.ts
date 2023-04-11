import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CinemaSystem1663877813247 implements MigrationInterface {
  /**
   # ToDo: Create a migration that creates all tables for the following user stories

   For an example on how a UI for an api using this might look like, please try to book a show at https://in.bookmyshow.com/.
   To not introduce additional complexity, please consider only one cinema.

   Please list the tables that you would create including keys, foreign keys and attributes that are required by the user stories.

   ## User Stories

   **Movie exploration**
   * As a user I want to see which films can be watched and at what times
   * As a user I want to only see the shows which are not booked out

   **Show administration**
   * As a cinema owner I want to run different films at different times
   * As a cinema owner I want to run multiple films at the same time in different showrooms

   **Pricing**
   * As a cinema owner I want to get paid differently per show
   * As a cinema owner I want to give different seat types a percentage premium, for example 50 % more for vip seat

   **Seating**
   * As a user I want to book a seat
   * As a user I want to book a vip seat/couple seat/super vip/whatever
   * As a user I want to see which seats are still available
   * As a user I want to know where I'm sitting on my ticket
   * As a cinema owner I dont want to configure the seating for every show
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.createMovieCinemaTables(queryRunner);
    await this.createSeatsTable(queryRunner);
    await this.createMovieTicketsTables(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}

  protected async createMovieCinemaTables(queryRunner: QueryRunner) {
    await queryRunner.createTable(
      new Table({
        name: 'movies',
        columns: [
          {
            name: 'id',
            isPrimary: true,
            type: 'integer',
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar' },
          { name: 'url', type: 'varchar' },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    // Create cinemas table
    await queryRunner.createTable(
      new Table({
        name: 'cinemas',
        columns: [
          {
            name: 'id',
            isPrimary: true,
            type: 'integer',
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar'
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    // Create bridge table
    await queryRunner.createTable(
      new Table({
        name: 'movie_cinemas',
        columns: [
          {
            name: 'movie_id',
            type: 'integer'
          },
          {
            name: 'cinema_id',
            type: 'integer'
          },
          {
            name: 'start_time',
            type: 'datetime'
          },
          {
            name: 'end_time',
            type: 'datetime'
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'movie_cinemas',
      new TableForeignKey({
        columnNames: ['movie_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'movies',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'movie_cinemas',
      new TableForeignKey({
        columnNames: ['cinema_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'cinemas',
        onDelete: 'CASCADE',
      }),
    );
  }

  protected async createSeatsTable(queryRunner: QueryRunner) {
    await queryRunner.createTable(
      new Table({
        name: 'seats',
        columns: [
          {
            name: 'id',
            isPrimary: true,
            type: 'integer',
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'cinema_id', type: 'integer' },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'seats',   
      new TableForeignKey({
        columnNames: ['cinema_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'cinemas',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'tickets_types',
        columns: [
          {
            name: 'id',
            isPrimary: true,
            type: 'integer',
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar' },
          { name: 'amount_percentage', type: 'integer' },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );
  }

  protected async createMovieTicketsTables(queryRunner: QueryRunner) {
    await queryRunner.createTable(
      new Table({
        name: 'movie_tickets',
        columns: [
          {
            name: 'id',
            isPrimary: true,
            type: 'integer',
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'movie_id', type: 'integer' },
          { name: 'cinema_id', type: 'integer' },
          { name: 'seat_id', type: 'integer'},
          { name: 'ticket_type_id', type: 'integer'},
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'movie_tickets',   
      new TableForeignKey({
        columnNames: ['movie_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'movies',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'movie_tickets',
      new TableForeignKey({
        columnNames: ['cinema_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'cinemas',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'movie_tickets',
      new TableForeignKey({
        columnNames: ['seat_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'seats',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'movie_tickets',
      new TableForeignKey({
        columnNames: ['ticket_type_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tickets_types',
        onDelete: 'CASCADE',
      }),
    );
  }
}
