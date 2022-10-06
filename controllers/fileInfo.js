const FileModel = require("../models/File/FileModel");
const FolderModel = require("../models/Folder/FolderModel");
const UserModel = require("../models/User/UserModel");

class fileInfo{

    async upload(data, callback){
      try{
        let { tid, uid, folderID, folderName, fileName, fileContent } = data;

        let currentFolderID = 0;
        if(!fileName){
            callback({ messge: "File missing in the request" }, null );
            return;
        }

        if(!uid){
            callback( { message: "User ID missing in the request"}, null );
            return;
        }

        if(!tid){
            callback( { message: "Tenant ID missing in the request"}, null );
            return;
        }

        if(folderID){
            let filesInFolder = await FileModel.getFilesCountInFolder(tid, uid, folderID);
            if(filesInFolder >= 1){
                callback( { messge: "One folder must contain only one file max" }, null );
                return;
            }
            currentFolderID = folderID;
        }

        let userInfo = await UserModel.getUserDetails(uid);
        let ownerInfo = {};
        ownerInfo.UID = uid;
        ownerInfo.FName = userInfo.FName;
        ownerInfo.LName = userInfo.LName;
        let responseObj = {
            Folders: [],
            Files: []
        };

        if(folderName) {
            let folderExist = await FolderModel.checkFolderExistOrNot(folderName, uid);
            if(folderExist){
                callback( { message: "Folder already exist"}, null);
                return;
            }
            let folderObject = {
                Name: folderName,
                TID: tid,
                Owner: ownerInfo,
                Status: 'A'
            };

            let createFolder = await FolderModel.insertFolderRecord(folderObject);
            currentFolderID = createFolder.FldrID;
            responseObj.Folders.push(createFolder.Name)
        }
        
        //Check already this file exist in DB or not
        let fileExist = await FileModel.checkFileExistOrNot([fileName], currentFolderID, uid);
            if(fileExist){
                callback( { message: "File already exist"} , null );
                return;
            }
        

            let fileObject = {
                Name: fileName,
                Content: fileContent,
                TID: tid,
                Owner: ownerInfo,
                FldrID: currentFolderID,
                Status: 'A'
            };
            let insertFile = await FileModel.insertFileRecord(fileObject);

            responseObj.Files.push(insertFile.Name)
        
        return responseObj;
      }catch(err){
        callback(err, null);
      }
    }

    async userData(data, callback){
        let { uid, tid } = data;
        try{
            if(!uid){
                callback( { message: "User ID missing in the request"}, null );
                return;
            }
    
            if(!tid){
                callback( { message: "Tenant ID missing in the request"} );
                return;
            }

            let userData = {};
            let userFiles = await FileModel.getUserFiles(tid, uid);
            userData.Files = userFiles;
            let userFolders = await FolderModel.getUserFolders(tid, uid);
            userData.Folders = userFolders;
            return userData;
        }catch(err){
            callback(err, null);
        }

    }

    async viewFolder(data, callback){
        let { uid, tid, fldrid } = data;
        try{
            if(!uid){
                callback( { message: "User ID missing in the request"}, null );
                return;
            }
    
            if(!tid){
                callback( { message: "Tenant ID missing in the request"}, null );
                return;
            }

            if(!fldrid){
                callback( { message: "Folder ID missing in the request"}, null);
                return;
            }
            let folderData = {};
            let filesInFolder = await FileModel.getAllFilesInsideFolder(tid, uid, fldrid);
            folderData.Files = filesInFolder;
            return folderData;
        }catch(err){
            callback(err, null);
        }

    }

    async moveFilesFromOneFolderToOther(req, res){
        try{
            let { tid, uid } = req.headers;
            let filesToMove = req.body.fileIDs;
            let destinationFolderID = req.body.destinationFolderID;
    
            if(!uid){
                res.status(400).json( { message: "User ID missing in the request"} );
                return;
            }
    
            if(!tid){
                res.status(400).json( { message: "Tenant ID missing in the request" } );
                return;
            }
    
            if(filesToMove.length == 0){
                res.status(400).json( { message: "File IDs to be move missing in the request" } );
                return;
            }
    
            if(!destinationFolderID){
                res.status(400).json( { message: "Destination Folder ID missing in the request"} );
                return;
            }
    
            if(destinationFolderID){
                let filesInFolder = await FileModel.getFilesCountInFolder(tid, uid, destinationFolderID);
                if(filesInFolder >= 1){
                    res.json( { messge: "One folder must contain only one file max" } );
                    return;
                }
            }

            let filesMoved = [];
            for( let eachFileID of filesToMove){
                let fileMove = await FileModel.moveFiles(tid, uid, eachFileID, destinationFolderID);
                if(fileMove){
                    filesMoved.push(fileMove.Name) 
                }
            }
            res.json(filesMoved);
        }catch(err){
            res.json(err.stack)
        }
    }
}

const FileInfo = new fileInfo();

module.exports = {
    upload: FileInfo.upload.bind(FileInfo),
    userData: FileInfo.userData.bind(FileInfo),
    viewFolder: FileInfo.viewFolder.bind(FileInfo),
    moveFilesFromOneFolderToOther: FileInfo.moveFilesFromOneFolderToOther.bind(FileInfo),
}
