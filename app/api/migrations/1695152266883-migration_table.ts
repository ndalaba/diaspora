import { MigrationInterface, QueryRunner } from "typeorm";

export class migrationTable1695152266883 implements MigrationInterface {
    name = 'migrationTable1695152266883'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`module_user\` DROP FOREIGN KEY \`FK_27f90bd75ada636bda3af8bcc4b\``);
        await queryRunner.query(`ALTER TABLE \`module_user\` DROP FOREIGN KEY \`FK_2a1860cdaa3240f0f4e41745a78\``);
        await queryRunner.query(`ALTER TABLE \`module_user\` DROP FOREIGN KEY \`FK_a6d6fe0ab3da7b8247051fff52e\``);
        await queryRunner.query(`ALTER TABLE \`module_user\` DROP COLUMN \`associationId\``);
        await queryRunner.query(`ALTER TABLE \`module_user\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`module_user\` DROP COLUMN \`moduleId\``);
        await queryRunner.query(`ALTER TABLE \`module_user\` ADD \`association_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`module_user\` ADD \`user_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`module_user\` ADD \`module_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`module_user\` ADD CONSTRAINT \`FK_ea29c45e658de59b496022f301e\` FOREIGN KEY (\`association_id\`) REFERENCES \`associations\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`module_user\` ADD CONSTRAINT \`FK_220bc9d73fbfc538d278ad730c7\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`module_user\` ADD CONSTRAINT \`FK_6376ee89570a106e25c0937e612\` FOREIGN KEY (\`module_id\`) REFERENCES \`modules\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`module_user\` DROP FOREIGN KEY \`FK_6376ee89570a106e25c0937e612\``);
        await queryRunner.query(`ALTER TABLE \`module_user\` DROP FOREIGN KEY \`FK_220bc9d73fbfc538d278ad730c7\``);
        await queryRunner.query(`ALTER TABLE \`module_user\` DROP FOREIGN KEY \`FK_ea29c45e658de59b496022f301e\``);
        await queryRunner.query(`ALTER TABLE \`module_user\` DROP COLUMN \`module_id\``);
        await queryRunner.query(`ALTER TABLE \`module_user\` DROP COLUMN \`user_id\``);
        await queryRunner.query(`ALTER TABLE \`module_user\` DROP COLUMN \`association_id\``);
        await queryRunner.query(`ALTER TABLE \`module_user\` ADD \`moduleId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`module_user\` ADD \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`module_user\` ADD \`associationId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`module_user\` ADD CONSTRAINT \`FK_a6d6fe0ab3da7b8247051fff52e\` FOREIGN KEY (\`moduleId\`) REFERENCES \`modules\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`module_user\` ADD CONSTRAINT \`FK_2a1860cdaa3240f0f4e41745a78\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`module_user\` ADD CONSTRAINT \`FK_27f90bd75ada636bda3af8bcc4b\` FOREIGN KEY (\`associationId\`) REFERENCES \`associations\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
