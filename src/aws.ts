const { S3Client, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');
import fs from "fs";
const path = require('path');

// const s3Client = new S3Client({ 
//     accessKeyId: process.env.AWS_ACCESS_KEY, 
//     secretAccesskey: process.env.AWS_SECRET_ACCESS_KEY, 
//     region: 'us-east-1'
// });

// Configure AWS credentials and region

const s3Client = new S3Client({
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY, 
        secretAccesskey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

export const downloadS3Folder = async (prefix: string) => {

    const params = {
        Bucket: "vercel",
        Prefix: prefix
    }

    try {
        const allFiles = await s3Client.send(new ListObjectsV2Command(params));

        const allPromises = allFiles.Contents?.map(async ({ Key }: { Key: any }) => {
            return new Promise(async (resolve) => {
                if (!Key) {
                    resolve("");
                    return;
                }
                const finalOutputPath = path.join(__dirname, Key);
                const outputFile = fs.createWriteStream(finalOutputPath);
                const dirName = path.dirname(finalOutputPath);
                if (!fs.existsSync(dirName)) {
                    fs.mkdirSync(dirName, { recursive: true });
                }
                const { Body } = await s3Client.send(new GetObjectCommand(params));
                Body.pipe(outputFile);

                // Listening for the 'finish' event to resolve the promise after writing is complete
                outputFile.on("finish", () => {
                    console.log("File download completed.");
                    resolve("");
                });
            })
        }) || []
        console.log("awaiting");

        await Promise.all(allPromises?.filter((x: any) => x !== undefined));
    }
    catch (err) {
        console.log("Deploy error : ", err);
    }
}