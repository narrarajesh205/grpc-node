const PROTO_PATH = "../filesfolders.proto";

const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});

const FilesFolderService = grpc.loadPackageDefinition(packageDefinition).FilesFolderService;
const client = new FilesFolderService(
    "localhost:30043",
    grpc.credentials.createInsecure()
);

module.exports = client;
