import { commandOptions, createClient } from "redis";
import { downloadS3Folder } from "./aws";
import { buildProject } from "./build";
import { copyFinalBuild } from "./copy";
const dotenv = require('dotenv');
dotenv.config();
const subscriber = createClient();
subscriber.connect();

const publisher = createClient();
publisher.connect();

async function main()
{
    while(1)
    {
        const res = await subscriber.brPop(
            commandOptions({ isolated : true}),
            'build-queue',
            0
        )

        //@ts-ignore
        const id = res.element;

        console.log("res from deploy : ", );
        await downloadS3Folder(`repos/${id}`);
        await buildProject(id);
        copyFinalBuild(id);
        publisher.hSet("stauts", id, "deployed");
    }
}

main();

/*
    We cannot use the same client to put and get data from the redis 
    we can either put or get data using one client

    in out case we used subcriber to get data using the redis client( named subscriber)
    
    To change the status of the id to deployed we need to create another redis client (named publisher)
    to change the status of the id that has been added to the status table in redis
*/