import { Test, TestingModule } from '@nestjs/testing';
import { MatchNotesService } from './match-notes.service';

describe('MatchNotesService', () => {
  let service: MatchNotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchNotesService],
    }).compile();

    service = module.get<MatchNotesService>(MatchNotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
