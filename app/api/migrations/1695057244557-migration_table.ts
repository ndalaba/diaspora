import { MigrationInterface, QueryRunner } from 'typeorm'

export class migrationTable1695057244557 implements MigrationInterface {
  name = 'migrationTable1695057244557'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`module_user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`uid\` varchar(100) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`read\` tinyint NOT NULL, \`write\` tinyint NOT NULL, \`associationId\` int NULL, \`userId\` int NULL, INDEX \`IDX_fe74a8706344ceda832b95136e\` (\`uid\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(`ALTER TABLE \`modules\` CHANGE \`active\` \`active\` tinyint NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE \`module_user\` ADD CONSTRAINT \`FK_27f90bd75ada636bda3af8bcc4b\` FOREIGN KEY (\`associationId\`) REFERENCES \`associations\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`module_user\` ADD CONSTRAINT \`FK_2a1860cdaa3240f0f4e41745a78\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`module_user\` DROP FOREIGN KEY \`FK_2a1860cdaa3240f0f4e41745a78\``
    )
    await queryRunner.query(
      `ALTER TABLE \`module_user\` DROP FOREIGN KEY \`FK_27f90bd75ada636bda3af8bcc4b\``
    )
    await queryRunner.query(
      `ALTER TABLE \`modules\` CHANGE \`active\` \`active\` tinyint NOT NULL DEFAULT '0'`
    )
    await queryRunner.query(`DROP INDEX \`IDX_fe74a8706344ceda832b95136e\` ON \`module_user\``)
    await queryRunner.query(`DROP TABLE \`module_user\``)
  }
}
