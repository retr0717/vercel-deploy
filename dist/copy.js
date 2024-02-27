"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyFinalBuild = void 0;
const path_1 = __importDefault(require("path"));
const utils_1 = require("./utils");
const aws_1 = require("./aws");
const copyFinalBuild = (id) => {
    const fPath = path_1.default.join(__dirname, `repos/${id}/dist`);
    const allFiles = (0, utils_1.getAllFiles)(fPath);
    allFiles.forEach(file => {
        (0, aws_1.uploadFile)(`dist/${id}/` + file.slice(fPath.length + 1), file);
    });
};
exports.copyFinalBuild = copyFinalBuild;
