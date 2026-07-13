import { Test, TestingModule } from '@nestjs/testing';
import { UserRosterController } from './user-roster.controller';
import { UserRosterService } from './user-roster.service';

describe('UserRosterController', () => {
  let controller: UserRosterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserRosterController],
      providers: [UserRosterService],
    }).compile();

    controller = module.get<UserRosterController>(UserRosterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
