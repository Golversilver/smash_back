import { PartialType } from '@nestjs/swagger';
import { CreateMatchNoteDto } from './create-match-note.dto';

export class UpdateMatchNoteDto extends PartialType(CreateMatchNoteDto) {}
