import { Stage } from "src/stages/entities/stage.entity";
import { EntityManager } from "typeorm";

export async function seedStages(manager: EntityManager){

  const repository = manager.getRepository(Stage);

const stages = [
  { name: 'Battlefield'},
  { name: 'Small Battlefield'},
  { name: 'Final Destination'},
  { name: 'Pokemon Stadium 2'},
  { name: 'Smashville' },
  { name: 'Town and City'},
  { name: 'Hollow Bastion'},
  { name: 'Kalos Pokemon League'},
];

 await repository.upsert(stages, ['name']);

}