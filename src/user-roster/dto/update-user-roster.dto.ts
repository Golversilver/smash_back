import { PartialType } from '@nestjs/swagger';
import { CreateUserRosterDto } from './create-user-roster.dto';

export class UpdateUserRosterDto extends PartialType(CreateUserRosterDto) {}
