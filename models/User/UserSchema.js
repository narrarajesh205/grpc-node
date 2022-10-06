//Schema designed for users

var { mongoose, AutoIncrement, Schema } = require('../index');

const userSchema = new mongoose.Schema({
    _id: Number,
    TID: { type: Number, index: true }, // Tenant ID
    FName: { type: String },
    LName: { type: String },
    Email: { type: String, required: true },
    Pwd: { type: String, index: true, required: false },
    Status: { type: String, index: true, default: 'I' }, //A-Active, I-InActive
    CrtdOn: { type: Date, default: Date.now },
    ModOn: { type: Date, default: Date.now },
}, { _id: false }, { autoIndex: false, timestamps: { createdAt: 'CrtdOn', updatedAt: 'ModOn' } });
userSchema.plugin(AutoIncrement, { id: 'userCounter', inc_field: '_id' });

module.exports = { userSchema };
