import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1720865342926 implements MigrationInterface {
  name = "Migration1720865342926";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "book"
            ADD "num_of_read_pages" integer
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "book" DROP COLUMN "num_of_read_pages"
        `);
  }
}
