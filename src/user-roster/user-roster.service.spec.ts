import { Test, TestingModule } from '@nestjs/testing';
import { UserRosterService } from './user-roster.service';

describe('UserRosterService', () => {
  let service: UserRosterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRosterService],
    }).compile();

    service = module.get<UserRosterService>(UserRosterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
