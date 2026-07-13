import { Character } from "src/characters/entities/character.entity";
import { Match } from "src/matchs/entities/match.entity";
import { DataSource, EntityManager } from "typeorm";

export async function seedMatches(manager: EntityManager){

     const matchRepository = manager.getRepository(Match);
     const characterRepository = manager.getRepository(Character);
     const characers = await characterRepository.find();
     
     const matches: Partial<Match>[] = [];

     for(let i = 0; i < characers.length; i ++){

     for(let j = i; j < characers.length; j ++){
       matches.push({
            character1: characers[i],
            character2: characers[j]
        })
     }
     }

    //  await matchRepository.delete({});

     await matchRepository.save(matches);
}