const PROTO_PATH = "./filesfolders.proto";
const FileInfo = require('../controllers/fileInfo');

var grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});

var FilesFoldersProto = grpc.loadPackageDefinition(packageDefinition);

const { v4: uuidv4 } = require("uuid");



const server = new grpc.Server();
require('./database.js');
const files = [];

server.addService(FilesFoldersProto.FilesFolderService.service, {
    getAll: async (call, callback) => {
        const dataToSend = {
            tid: call.request.tid,
            uid: call.request.uid,
        };
        let userData = await FileInfo.userData(dataToSend, callback);
        callback(null, {"filesAlls": userData.Files, "foldersAlls": userData.Folders});
    },

    insert: async (call, callback) => {
        const dataToSend = {
            tid: call.request.tid,
            uid: call.request.uid,
            fileName: call.request.fileName,
            fileContent: call.request.fileContent,
            folderName: call.request.folderName,
            folderID: call.request.folderID
        };
        let files = await FileInfo.upload(dataToSend, callback);
        callback(null, {message:"Success"});
    },

    get: async (call, callback) => {
        const dataToSend = {
            tid: call.request.tid,
            uid: call.request.uid,
            fldrid: call.request.fldrid
        };
        let folderData = await FileInfo.viewFolder(dataToSend, callback);
        callback(null, {"filesAlls": folderData.Files});
    },
});

server.bind("127.0.0.1:30043", grpc.ServerCredentials.createInsecure());
console.log("Server running at http://127.0.0.1:30043");
server.start();
