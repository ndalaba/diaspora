import { MigrationInterface, QueryRunner } from "typeorm";

export class migrationTable1693421572370 implements MigrationInterface {
    name = 'migrationTable1693421572370'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`associations\` DROP FOREIGN KEY \`FK_f22780672ad4abbeabbed7c2df7\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`creatorId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`associations\` ADD CONSTRAINT \`FK_d192ab1d0259ac359ba4683847f\` FOREIGN KEY (\`country_id\`) REFERENCES \`countries\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_ace419b148e6439dcc0ce70893d\` FOREIGN KEY (\`creatorId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_ace419b148e6439dcc0ce70893d\``);
        await queryRunner.query(`ALTER TABLE \`associations\` DROP FOREIGN KEY \`FK_d192ab1d0259ac359ba4683847f\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`creatorId\``);
        await queryRunner.query(`ALTER TABLE \`associations\` ADD CONSTRAINT \`FK_f22780672ad4abbeabbed7c2df7\` FOREIGN KEY (\`country_id\`) REFERENCES \`countries\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
