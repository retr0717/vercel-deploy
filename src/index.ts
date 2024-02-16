import { commandOptions, createClient } from "redis";
import { downloadS3Folder } from "./aws";
const dotenv = require('dotenv');
dotenv.config();
const subscriber = createClient();
subscriber.connect();

async function main()
{
    while(1)
    {
        const res = await subscriber.brPop(
            commandOptions({ isolated : true}),
            'build-queue',
            0
        )

        console.log("res from deploy : ", res);
        await downloadS3Folder(`/repos/${res?.element}`);
    }
}

main();