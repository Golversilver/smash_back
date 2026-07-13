import dataSource from "../data-source";
import { seedCharacters } from "./characters.seeder";
import { seedStages } from "./stages.seeder"
import { seedMatches } from "./matches.seeder"


async function runSeeders(){

    await dataSource.initialize();

    try{

        await dataSource.transaction(async (manager) => {

        await seedCharacters(manager);
        await seedStages(manager);
        await seedMatches(manager);

        });

        console.log('Seeders ejecutados correctamente');
    }catch(error){
        console.error(error)
    } finally {
        await dataSource.destroy()
    }
}

runSeeders();