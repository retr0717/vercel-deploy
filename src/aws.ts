const dotenv = require('dotenv');
dotenv.config();

const { S3Client, ListObjectsV2Command, GetObjectCommand , PutObjectCommand} = require('@aws-sdk/client-s3');
import fs from "fs";
const path = require('path');

// const s3Client = new S3Client({
//     endpoint: 'https://blr1.digitaloceanspaces.com', // Replace with your region
//     credentials: {
//         accessKeyId: "DO00V7YVYVAAAWYLV8QQ",
//         secretAccessKey:"tDsyhdH1q4tPs7kr65JtaUrEfMWECLUwQPKB+4fEpz8",
//     },
//     region: 'blr1', // Set your desired region here
// });

const s3Client = new S3Client({
    endpoint: process.env.ENDPOINT, // Replace with your region
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
    },
    region: process.env.REGION, // Set your desired region here
});

export const downloadS3Folder = async (prefix: string) => {

    const params = {
        Bucket: "vercel-storage",
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
                const { Body } = await s3Client.send(new GetObjectCommand({
                    Bucket : "vercel-storage",
                    Key
                }));

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

export const uploadFile = async (fileName : string, localFilePath : string) => {
    const fileContent = fs.readFileSync(localFilePath);

    const uploadParams = {
        Bucket: 'vercel-storage',
        Key: fileName,
        Body: fileContent,
    };

    try
    {
        const response = await s3Client.send(new PutObjectCommand(uploadParams));
        console.log("File uploaded successfully. Response:", response);
    }
    catch(err)
    {
        console.log(err);
    }
}