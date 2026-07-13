import { Test, TestingModule } from '@nestjs/testing';
import { RosterNotesController } from './roster-notes.controller';
import { RosterNotesService } from './roster-notes.service';

describe('RosterNotesController', () => {
  let controller: RosterNotesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RosterNotesController],
      providers: [RosterNotesService],
    }).compile();

    controller = module.get<RosterNotesController>(RosterNotesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
