import { MigrationInterface, QueryRunner } from "typeorm";

export class Mig1735057009092 implements MigrationInterface {
    name = 'Mig1735057009092'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "text_snippet" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "text" character varying NOT NULL, "bookTitle" character varying NOT NULL, "bookAuthor" character varying NOT NULL, "note" character varying NOT NULL, "location" character varying NOT NULL, "userId" integer NOT NULL, "reviewCount" integer NOT NULL, CONSTRAINT "PK_faa9e995b8fcc54435feb168239" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_78a916df40e02a9deb1c4b75ed" ON "user" ("username") `);
        await queryRunner.query(`ALTER TABLE "text_snippet" ADD CONSTRAINT "FK_e692e1f84216c26bebb3343b1d7" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "text_snippet" DROP CONSTRAINT "FK_e692e1f84216c26bebb3343b1d7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_78a916df40e02a9deb1c4b75ed"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "text_snippet"`);
    }

}
