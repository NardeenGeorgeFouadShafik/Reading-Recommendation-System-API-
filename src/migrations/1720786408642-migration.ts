import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1720786408642 implements MigrationInterface {
  name = "Migration1720786408642";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE " book"
                RENAME COLUMN "no_of_pages" TO "num_of_pages"
        `);
    await queryRunner.query(`
            CREATE SEQUENCE IF NOT EXISTS "reading_interval_id_seq" OWNED BY "reading_interval"."id"
        `);
    await queryRunner.query(`
            ALTER TABLE "reading_interval"
            ALTER COLUMN "id"
            SET DEFAULT nextval('"reading_interval_id_seq"')
        `);
    await queryRunner.query(`
            ALTER TABLE "reading_interval"
            ALTER COLUMN "id" DROP DEFAULT
        `);
    await queryRunner.query(`
            CREATE SEQUENCE IF NOT EXISTS "reading_interval_id_seq" OWNED BY "reading_interval"."id"
        `);
    await queryRunner.query(`
            ALTER TABLE "reading_interval"
            ALTER COLUMN "id"
            SET DEFAULT nextval('"reading_interval_id_seq"')
        `);
    await queryRunner.query(`
            ALTER TABLE "reading_interval"
            ALTER COLUMN "id" DROP DEFAULT
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "reading_interval"
            ALTER COLUMN "id"
            SET DEFAULT nextval('redaing_interval_id_seq')
        `);
    await queryRunner.query(`
            ALTER TABLE "reading_interval"
            ALTER COLUMN "id" DROP DEFAULT
        `);
    await queryRunner.query(`
            DROP SEQUENCE "reading_interval_id_seq"
        `);
    await queryRunner.query(`
            ALTER TABLE "reading_interval"
            ALTER COLUMN "id"
            SET DEFAULT nextval('redaing_interval_id_seq')
        `);
    await queryRunner.query(`
            ALTER TABLE "reading_interval"
            ALTER COLUMN "id" DROP DEFAULT
        `);
    await queryRunner.query(`
            DROP SEQUENCE "reading_interval_id_seq"
        `);
    await queryRunner.query(`
            ALTER TABLE " book"
                RENAME COLUMN "num_of_pages" TO "no_of_pages"
        `);
  }
}
