import { Test, TestingModule } from '@nestjs/testing';
import { MatchNotesController } from './match-notes.controller';
import { MatchNotesService } from './match-notes.service';

describe('MatchNotesController', () => {
  let controller: MatchNotesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchNotesController],
      providers: [MatchNotesService],
    }).compile();

    controller = module.get<MatchNotesController>(MatchNotesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
