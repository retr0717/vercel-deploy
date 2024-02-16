"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadS3Folder = void 0;
const { S3Client, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');
const fs_1 = __importDefault(require("fs"));
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
const downloadS3Folder = (prefix) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const params = {
        Bucket: "vercel",
        Prefix: prefix
    };
    try {
        const allFiles = yield s3Client.send(new ListObjectsV2Command(params));
        const allPromises = ((_a = allFiles.Contents) === null || _a === void 0 ? void 0 : _a.map(({ Key }) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                if (!Key) {
                    resolve("");
                    return;
                }
                const finalOutputPath = path.join(__dirname, Key);
                const outputFile = fs_1.default.createWriteStream(finalOutputPath);
                const dirName = path.dirname(finalOutputPath);
                if (!fs_1.default.existsSync(dirName)) {
                    fs_1.default.mkdirSync(dirName, { recursive: true });
                }
                const { Body } = yield s3Client.send(new GetObjectCommand(params));
                Body.pipe(outputFile);
                // Listening for the 'finish' event to resolve the promise after writing is complete
                outputFile.on("finish", () => {
                    console.log("File download completed.");
                    resolve("");
                });
            }));
        }))) || [];
        console.log("awaiting");
        yield Promise.all(allPromises === null || allPromises === void 0 ? void 0 : allPromises.filter((x) => x !== undefined));
    }
    catch (err) {
        console.log("Deploy error : ", err);
    }
});
exports.downloadS3Folder = downloadS3Folder;
