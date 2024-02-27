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
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const aws_1 = require("./aws");
const build_1 = require("./build");
const copy_1 = require("./copy");
const dotenv = require('dotenv');
dotenv.config();
const subscriber = (0, redis_1.createClient)();
subscriber.connect();
const publisher = (0, redis_1.createClient)();
publisher.connect();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        while (1) {
            const res = yield subscriber.brPop((0, redis_1.commandOptions)({ isolated: true }), 'build-queue', 0);
            //@ts-ignore
            const id = res.element;
            console.log("res from deploy : ");
            yield (0, aws_1.downloadS3Folder)(`repos/${id}`);
            yield (0, build_1.buildProject)(id);
            (0, copy_1.copyFinalBuild)(id);
            publisher.hSet("stauts", id, "deployed");
        }
    });
}
main();
/*
    We cannot use the same client to put and get data from the redis
    we can either put or get data using one client

    in out case we used subcriber to get data using the redis client( named subscriber)
    
    To change the status of the id to deployed we need to create another redis client (named publisher)
    to change the status of the id that has been added to the status table in redis
*/ 
