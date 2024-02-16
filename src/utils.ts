import path from 'path';
import fs from 'fs';

export const getAllFiles = ( fpath :  string) => {
    let response : string[] = [];
    
    //get all the files and directories from the given path.
    const allFilesAndFolders = fs.readdirSync(fpath);
    
    allFilesAndFolders.forEach(file => {
        
        //getting all full path of the files and folder from the array.
        const fullPath = path.join(fpath, file);

        if(fs.statSync(fullPath).isDirectory())
        {
            response = response.concat(getAllFiles(fullPath));
        }
        else{
            response.push(fullPath);
        }
    });

    return response;
}