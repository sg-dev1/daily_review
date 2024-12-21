import { MigrationInterface, QueryRunner } from "typeorm";

export class Mig1734795145111 implements MigrationInterface {
    name = 'Mig1734795145111'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_entity" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email"), CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_9b998bada7cff93fcb953b0c37" ON "user_entity" ("username") `);
        await queryRunner.query(`CREATE TABLE "text_snippet" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL, "text" character varying NOT NULL, "bookTitle" character varying NOT NULL, "bookAuthor" character varying NOT NULL, "note" character varying NOT NULL, "location" character varying NOT NULL, CONSTRAINT "PK_faa9e995b8fcc54435feb168239" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "text_snippet"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9b998bada7cff93fcb953b0c37"`);
        await queryRunner.query(`DROP TABLE "user_entity"`);
    }

}
