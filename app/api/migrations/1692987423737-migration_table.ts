import { MigrationInterface, QueryRunner } from 'typeorm'

export class migrationTable1692987423737 implements MigrationInterface {
  name = 'migrationTable1692987423737'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`FK_f22780672ad4abbeabbed7c2df7\` ON \`associations\``)
    await queryRunner.query(
      `ALTER TABLE \`associations\` ADD CONSTRAINT \`FK_f22780672ad4abbeabbed7c2df7\` FOREIGN KEY (\`city_id\`) REFERENCES \`countries\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`associations\` DROP FOREIGN KEY \`FK_f22780672ad4abbeabbed7c2df7\``
    )
    await queryRunner.query(
      `CREATE INDEX \`FK_f22780672ad4abbeabbed7c2df7\` ON \`associations\` (\`city_id\`)`
    )
  }
}
