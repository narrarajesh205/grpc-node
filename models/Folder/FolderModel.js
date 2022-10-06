
var { mongoose, Schema } = require('../index');

const { folderSchema } = require('./FolderSchema');
var folderModelSchema = Schema(folderSchema);

folderModelSchema.virtual('FldrID').get(function (){
    let FldrID;
    if(this._id) FldrID = this._id;
    return FldrID;
});

folderModelSchema.statics.insertFolderRecord = async function(folderObject){
    return await this.create(folderObject);
}

folderModelSchema.statics.checkFolderExistOrNot = async function(FolderName, UID){
    return await this.findOne( { $and: [{ 'Owner.UID': UID}, { Name: FolderName }]} );
}

folderModelSchema.statics.getUserFolders = async function(TID, UID){
    return await this.find( { TID: TID, 'Owner.UID': UID } );
}


folderModelSchema.set('toObject', { getters: true });
folderModelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Folder', folderModelSchema);