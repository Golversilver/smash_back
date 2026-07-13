import { PartialType } from '@nestjs/swagger';
import { CreateRosterNoteDto } from './create-roster-note.dto';

export class UpdateRosterNoteDto extends PartialType(CreateRosterNoteDto) {}
