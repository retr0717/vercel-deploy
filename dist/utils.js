"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFiles = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const getAllFiles = (fpath) => {
    let response = [];
    //get all the files and directories from the given path.
    const allFilesAndFolders = fs_1.default.readdirSync(fpath);
    allFilesAndFolders.forEach(file => {
        //getting all full path of the files and folder from the array.
        const fullPath = path_1.default.join(fpath, file);
        if (fs_1.default.statSync(fullPath).isDirectory()) {
            response = response.concat((0, exports.getAllFiles)(fullPath));
        }
        else {
            response.push(fullPath);
        }
    });
    return response;
};
exports.getAllFiles = getAllFiles;
