import { Controller, Get, Param, Req, UseGuards } from "@nestjs/common";
import { charactersService } from "./characters.service";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

@Controller('characters')
export class CharactersController{

      constructor(
         private readonly charactersService: charactersService
      ){}

      @Get()
      findAll() {
        return this.charactersService.findAll();
      }

      @Get('findAvailable')
      @UseGuards(JwtAuthGuard)
      @ApiBearerAuth()
      findAvailable(@Req() request: Request & {user: any}) {
        return this.charactersService.findAvailable(request.user.id);
      }
    
      @Get(':id')
      findOne(@Param('id') id: string) {
        return this.charactersService.findOne(+id);
      }

}