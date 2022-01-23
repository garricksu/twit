import { MigrationInterface, QueryRunner } from 'typeorm'

export class fakeFollows1642833493374 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        insert into subscription ("userId", "followerId") values (2, 1);
        insert into subscription ("userId", "followerId") values (3, 1);
        insert into subscription ("userId", "followerId") values (4, 1);
        insert into subscription ("userId", "followerId") values (5, 1);
        insert into subscription ("userId", "followerId") values (6, 1);
        insert into subscription ("userId", "followerId") values (7, 1);
        insert into subscription ("userId", "followerId") values (8, 1);
        insert into subscription ("userId", "followerId") values (9, 1);
        insert into subscription ("userId", "followerId") values (10, 1);
        insert into subscription ("userId", "followerId") values (11, 1);
        insert into subscription ("userId", "followerId") values (12, 1);
        insert into subscription ("userId", "followerId") values (13, 1);
        insert into subscription ("userId", "followerId") values (14, 1);
        insert into subscription ("userId", "followerId") values (15, 1);
        insert into subscription ("userId", "followerId") values (16, 1);
        insert into subscription ("userId", "followerId") values (17, 1);
        insert into subscription ("userId", "followerId") values (18, 1);
        insert into subscription ("userId", "followerId") values (19, 1);
        insert into subscription ("userId", "followerId") values (20, 1);
        insert into subscription ("userId", "followerId") values (21, 1);
        insert into subscription ("userId", "followerId") values (22, 1);
        insert into subscription ("userId", "followerId") values (23, 1);
        insert into subscription ("userId", "followerId") values (24, 1);
        insert into subscription ("userId", "followerId") values (25, 1);
        insert into subscription ("userId", "followerId") values (26, 1);
        insert into subscription ("userId", "followerId") values (27, 1);
        insert into subscription ("userId", "followerId") values (28, 1);
        insert into subscription ("userId", "followerId") values (29, 1);
        insert into subscription ("userId", "followerId") values (30, 1);
        insert into subscription ("userId", "followerId") values (31, 1);
        insert into subscription ("userId", "followerId") values (1, 2);
        insert into subscription ("userId", "followerId") values (1, 3);
        insert into subscription ("userId", "followerId") values (1, 4);
        insert into subscription ("userId", "followerId") values (1, 5);
        insert into subscription ("userId", "followerId") values (1, 6);
        insert into subscription ("userId", "followerId") values (1, 7);
        insert into subscription ("userId", "followerId") values (1, 8);
        insert into subscription ("userId", "followerId") values (1, 9);
        insert into subscription ("userId", "followerId") values (1, 10);
        insert into subscription ("userId", "followerId") values (1, 11);
        insert into subscription ("userId", "followerId") values (1, 12);
        insert into subscription ("userId", "followerId") values (1, 13);
        insert into subscription ("userId", "followerId") values (1, 14);
        insert into subscription ("userId", "followerId") values (1, 15);
        insert into subscription ("userId", "followerId") values (1, 16);
        insert into subscription ("userId", "followerId") values (1, 17);
        insert into subscription ("userId", "followerId") values (1, 22);
        insert into subscription ("userId", "followerId") values (1, 23);
        `)
  }

  public async down(__: QueryRunner): Promise<void> {}
}
