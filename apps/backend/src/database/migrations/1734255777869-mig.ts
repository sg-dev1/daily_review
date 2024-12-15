import { MigrationInterface, QueryRunner } from "typeorm";

export class Mig1734255777869 implements MigrationInterface {
    name = 'Mig1734255777869'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_entity" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email"), CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_9b998bada7cff93fcb953b0c37" ON "user_entity" ("username") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_9b998bada7cff93fcb953b0c37"`);
        await queryRunner.query(`DROP TABLE "user_entity"`);
    }

}
