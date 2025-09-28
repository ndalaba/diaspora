import { MigrationInterface, QueryRunner } from 'typeorm'

export class migrationTable1695145261286 implements MigrationInterface {
  name = 'migrationTable1695145261286'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`module_user\` ADD \`moduleId\` int NULL`)
    await queryRunner.query(
      `ALTER TABLE \`module_user\` ADD CONSTRAINT \`FK_a6d6fe0ab3da7b8247051fff52e\` FOREIGN KEY (\`moduleId\`) REFERENCES \`modules\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`module_user\` DROP FOREIGN KEY \`FK_a6d6fe0ab3da7b8247051fff52e\``
    )
    await queryRunner.query(`ALTER TABLE \`module_user\` DROP COLUMN \`moduleId\``)
  }
}
