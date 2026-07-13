import { Module } from '@nestjs/common';
import { UserRosterService } from './user-roster.service';
import { UserRosterController } from './user-roster.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoster } from './entities/user-roster.entity';

@Module({
  controllers: [UserRosterController],
  providers: [UserRosterService],
  imports: [TypeOrmModule.forFeature([UserRoster])],
  exports: [UserRosterService]
})
export class UserRosterModule {}
