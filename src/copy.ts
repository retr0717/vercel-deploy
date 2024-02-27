import path from "path";
import { getAllFiles } from "./utils";
import { uploadFile } from "./aws";

export const copyFinalBuild = (id: string ) => {

    const fPath = path.join(__dirname, `repos/${id}/dist`);

    const allFiles = getAllFiles(fPath);
    allFiles.forEach(file => {
        uploadFile(`dist/${id}/` + file.slice(fPath.length + 1), file);
    })

}