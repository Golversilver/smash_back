import { Test, TestingModule } from '@nestjs/testing';
import { RosterNotesService } from './roster-notes.service';

describe('RosterNotesService', () => {
  let service: RosterNotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RosterNotesService],
    }).compile();

    service = module.get<RosterNotesService>(RosterNotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
