//Schema designed for folders

var { mongoose, AutoIncrement, Schema } = require('../index');
const folderSchema = new mongoose.Schema(
  {
    _id: Number,
    TID: { type: Number, index: true },  // Tenant ID
    Owner: {
      UID: { type: Number, index: true }, //User ID
      FName: { type: String, default: undefined }, //User First Name
      LName: { type: String, default: undefined } //User Last Name
    },
    Name: { type: String, index: true },
    Status: { type: String, index: true },
    CrtdOn: { type: Date, index: true, default: Date.now },
    ModOn: { type: Date, default: Date.now }
  },
  { _id: false },
  { autoIndex: false, timestamps: { createdAt: 'CrtdOn', updatedAt: 'ModOn' } }
);
folderSchema.plugin(AutoIncrement, { id: 'foldersCounter', inc_field: '_id' });

module.exports = { folderSchema };
