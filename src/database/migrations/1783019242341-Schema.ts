import { MigrationInterface, QueryRunner } from "typeorm";

export class Schema1783019242341 implements MigrationInterface {
    name = 'Schema1783019242341'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`stages\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`matchNotes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`importance\` enum ('LOW', 'MEDIUM', 'HIGH') NOT NULL, \`is_public\` tinyint NOT NULL, \`userRosterId\` int NULL, \`matchId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`rosterNotes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`importance\` enum ('LOW', 'MEDIUM', 'HIGH') NOT NULL, \`is_public\` tinyint NOT NULL, \`userRosterId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`status\` enum ('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE', UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`userRoster\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`main\` tinyint NOT NULL, \`status\` enum ('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE', \`userId\` int NULL, \`characterId\` int NULL, UNIQUE INDEX \`IDX_36ab11a9deaa3d16bc4aef25f6\` (\`userId\`, \`characterId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`games\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`online\` tinyint NOT NULL, \`win\` tinyint NOT NULL, \`status\` enum ('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE', \`stageId\` int NULL, \`matchId\` int NULL, \`userRosterId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`matches\` (\`id\` int NOT NULL AUTO_INCREMENT, \`character1Id\` int NULL, \`character2Id\` int NULL, UNIQUE INDEX \`IDX_d6201b01e5722a4bf1c164398a\` (\`character1Id\`, \`character2Id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`characters\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`matchNotes\` ADD CONSTRAINT \`FK_80ba34ed708f55ad017a73fa8b2\` FOREIGN KEY (\`userRosterId\`) REFERENCES \`userRoster\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`matchNotes\` ADD CONSTRAINT \`FK_ddadda21130b1f1536511b5d2ee\` FOREIGN KEY (\`matchId\`) REFERENCES \`matches\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rosterNotes\` ADD CONSTRAINT \`FK_791b11d45eae9c06f047feae502\` FOREIGN KEY (\`userRosterId\`) REFERENCES \`userRoster\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`userRoster\` ADD CONSTRAINT \`FK_53442909ddf9d39a71c62963da6\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`userRoster\` ADD CONSTRAINT \`FK_f276f1d851695639a038817d30f\` FOREIGN KEY (\`characterId\`) REFERENCES \`characters\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`games\` ADD CONSTRAINT \`FK_69bd5c627dee090c6abe49f7d49\` FOREIGN KEY (\`stageId\`) REFERENCES \`stages\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`games\` ADD CONSTRAINT \`FK_090c307b7998932e1714965dbab\` FOREIGN KEY (\`matchId\`) REFERENCES \`matches\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`games\` ADD CONSTRAINT \`FK_6e996157aebae3d1ccc81c4411f\` FOREIGN KEY (\`userRosterId\`) REFERENCES \`userRoster\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`matches\` ADD CONSTRAINT \`FK_20b28981d2f4f558a6b669f9dd2\` FOREIGN KEY (\`character1Id\`) REFERENCES \`characters\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`matches\` ADD CONSTRAINT \`FK_93e165b4840795d351ebd7548c1\` FOREIGN KEY (\`character2Id\`) REFERENCES \`characters\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`matches\` DROP FOREIGN KEY \`FK_93e165b4840795d351ebd7548c1\``);
        await queryRunner.query(`ALTER TABLE \`matches\` DROP FOREIGN KEY \`FK_20b28981d2f4f558a6b669f9dd2\``);
        await queryRunner.query(`ALTER TABLE \`games\` DROP FOREIGN KEY \`FK_6e996157aebae3d1ccc81c4411f\``);
        await queryRunner.query(`ALTER TABLE \`games\` DROP FOREIGN KEY \`FK_090c307b7998932e1714965dbab\``);
        await queryRunner.query(`ALTER TABLE \`games\` DROP FOREIGN KEY \`FK_69bd5c627dee090c6abe49f7d49\``);
        await queryRunner.query(`ALTER TABLE \`userRoster\` DROP FOREIGN KEY \`FK_f276f1d851695639a038817d30f\``);
        await queryRunner.query(`ALTER TABLE \`userRoster\` DROP FOREIGN KEY \`FK_53442909ddf9d39a71c62963da6\``);
        await queryRunner.query(`ALTER TABLE \`rosterNotes\` DROP FOREIGN KEY \`FK_791b11d45eae9c06f047feae502\``);
        await queryRunner.query(`ALTER TABLE \`matchNotes\` DROP FOREIGN KEY \`FK_ddadda21130b1f1536511b5d2ee\``);
        await queryRunner.query(`ALTER TABLE \`matchNotes\` DROP FOREIGN KEY \`FK_80ba34ed708f55ad017a73fa8b2\``);
        await queryRunner.query(`DROP TABLE \`characters\``);
        await queryRunner.query(`DROP INDEX \`IDX_d6201b01e5722a4bf1c164398a\` ON \`matches\``);
        await queryRunner.query(`DROP TABLE \`matches\``);
        await queryRunner.query(`DROP TABLE \`games\``);
        await queryRunner.query(`DROP INDEX \`IDX_36ab11a9deaa3d16bc4aef25f6\` ON \`userRoster\``);
        await queryRunner.query(`DROP TABLE \`userRoster\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`rosterNotes\``);
        await queryRunner.query(`DROP TABLE \`matchNotes\``);
        await queryRunner.query(`DROP TABLE \`stages\``);
    }

}
