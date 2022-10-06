//Schema designed for files

var { mongoose, AutoIncrement, Schema } = require("../index");
const fileSchema = new mongoose.Schema(
  {
    _id: Number,
    TID: { type: Number, index: true }, // Tenant ID
    Owner: {
      UID: { type: Number, index: true }, //User ID
      FName: { type: String, default: undefined }, //User First Name
      LName: { type: String, default: undefined }, //User Last Name
    },
    FldrID: { type: Number, index: true },
    Name: { type: String, index: true },
    Content: { type: String, index: true },
    Status: { type: String, index: true }, //A-Active, T-Trash,
    CrtdOn: { type: Date, index: true, default: Date.now }, // Created On
    ModOn: { type: Date, default: Date.now }  // Modified On
  },
  { _id: false },
  { autoIndex: false, timestamps: { createdAt: "CrtdOn", updatedAt: "ModOn" } }
);
fileSchema.plugin(AutoIncrement, { id: "filesCounter", inc_field: "_id" });

module.exports = { fileSchema };
