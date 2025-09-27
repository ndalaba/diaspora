import { MigrationInterface, QueryRunner } from "typeorm";

export class migrationTable1693587090470 implements MigrationInterface {
    name = 'migrationTable1693587090470'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`association_members\` (\`id\` int NOT NULL AUTO_INCREMENT, \`uid\` varchar(100) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` int NULL, \`association_id\` int NULL, INDEX \`IDX_572eae04f50aeab0cb511f48fc\` (\`uid\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`association_members\` ADD CONSTRAINT \`FK_38e49d0b0fbec599eb789d5f85b\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`association_members\` ADD CONSTRAINT \`FK_14a9791fde0bc1427ce0e0abb61\` FOREIGN KEY (\`association_id\`) REFERENCES \`associations\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`association_members\` DROP FOREIGN KEY \`FK_14a9791fde0bc1427ce0e0abb61\``);
        await queryRunner.query(`ALTER TABLE \`association_members\` DROP FOREIGN KEY \`FK_38e49d0b0fbec599eb789d5f85b\``);
        await queryRunner.query(`DROP INDEX \`IDX_572eae04f50aeab0cb511f48fc\` ON \`association_members\``);
        await queryRunner.query(`DROP TABLE \`association_members\``);
    }

}
