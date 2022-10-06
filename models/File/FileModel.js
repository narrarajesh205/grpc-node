
var { mongoose, Schema } = require('../index');

const { fileSchema } = require('./FileSchema');
var fileModelSchema = Schema(fileSchema);

fileModelSchema.virtual('FID').get(function (){
    let FID;
    if(this._id) FID = this._id;
    return FID;
});

fileModelSchema.statics.insertFileRecord = async function(fileObject){
    return await this.create(fileObject);
}

fileModelSchema.statics.checkFileExistOrNot = async function(FileNames, FldrID, UID){
    return await this.findOne( { $and: [{ 'Owner.UID': UID}, { FldrID: FldrID }, { Name: { $in: FileNames } }]} );
}

fileModelSchema.statics.getUserFiles = async function(TID, UID){
    return await this.find( { TID: TID, 'Owner.UID': UID } );
}

fileModelSchema.statics.getAllFilesInsideFolder = async function(TID, UID, FolderID){
    return await this.find( { TID: TID, 'Owner.UID': UID, FldrID: FolderID } );
}

fileModelSchema.statics.getFilesCountInFolder = async function(TID, UID, FolderID){
    return await this.count( { TID: TID, 'Owner.UID': UID, FldrID: FolderID } );
}

fileModelSchema.statics.moveFiles = async function(TID, UID, FileID, destFolderID){
    return await this.findOneAndUpdate( { TID: TID, 'Owner.UID': UID, _id: FileID }, { FldrID: destFolderID}, { upsert: true } );
}

fileModelSchema.set('toObject', { getters: true });
fileModelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('File', fileModelSchema);