import { Module } from '@nestjs/common';
import { StagesService } from './stages.service';
import { StagesController } from './stages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stage } from './entities/stage.entity';

@Module({
  controllers: [StagesController],
  providers: [StagesService],
  imports: [TypeOrmModule.forFeature([Stage])]
})
export class StagesModule {}
