import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1720863501665 implements MigrationInterface {
  name = "Migration1720863501665";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "book" (
                "id" SERIAL NOT NULL,
                "title" character varying NOT NULL,
                "author" character varying NOT NULL,
                "num_of_pages" integer NOT NULL,
                CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "reading_interval" (
                "id" SERIAL NOT NULL,
                "start_page" integer NOT NULL,
                "end_page" integer NOT NULL,
                "book_id" integer,
                "user_id" integer,
                CONSTRAINT "PK_53ebf97db0730f15642f25da45c" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'user')
        `);
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "role" "public"."user_role_enum" NOT NULL,
                CONSTRAINT "UQ_USER_EMAIL" UNIQUE ("email"),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "reading_interval"
            ADD CONSTRAINT "FK_READINGINTERVAL_BOOK_BOOKID" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "reading_interval"
            ADD CONSTRAINT "FK_READINGINTERVAL_USER_USERID" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "reading_interval" DROP CONSTRAINT "FK_READINGINTERVAL_USER_USERID"
        `);
    await queryRunner.query(`
            ALTER TABLE "reading_interval" DROP CONSTRAINT "FK_READINGINTERVAL_BOOK_BOOKID"
        `);
    await queryRunner.query(`
            DROP TABLE "user"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."user_role_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "reading_interval"
        `);
    await queryRunner.query(`
            DROP TABLE "book"
        `);
  }
}
