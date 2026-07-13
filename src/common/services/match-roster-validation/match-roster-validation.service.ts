import { Injectable } from '@nestjs/common';
import { MatchsService } from 'src/matchs/matchs.service';
import { UserRosterService } from 'src/user-roster/user-roster.service';

@Injectable()
export class MatchRosterValidationService {

    constructor(
        private readonly userRosterService: UserRosterService,
        private readonly matchService: MatchsService
    ){}

    async ensureSameCharacter(matchId: number, rosterId: number, userId){

        const roster = await this.userRosterService.findOne(rosterId, userId);
        const match = await this.matchService.findOne(matchId);

        if(roster.character.id === match.character1.id  || roster.character.id === match.character2.id){
            return true;
        }

        return false;

    }

}
