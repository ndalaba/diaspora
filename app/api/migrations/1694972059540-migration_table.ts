import { MigrationInterface, QueryRunner } from "typeorm";

export class migrationTable1694972059540 implements MigrationInterface {
    name = 'migrationTable1694972059540'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`modules\` (\`id\` int NOT NULL AUTO_INCREMENT, \`uid\` varchar(100) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`active\` bit NOT NULL, INDEX \`IDX_f96a68570f29f80339d956131f\` (\`uid\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`offices\` DROP COLUMN \`position\``);
        await queryRunner.query(`ALTER TABLE \`offices\` ADD \`position\` tinyint NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`offices\` DROP COLUMN \`position\``);
        await queryRunner.query(`ALTER TABLE \`offices\` ADD \`position\` int NOT NULL`);
        await queryRunner.query(`DROP INDEX \`IDX_f96a68570f29f80339d956131f\` ON \`modules\``);
        await queryRunner.query(`DROP TABLE \`modules\``);
    }

}
