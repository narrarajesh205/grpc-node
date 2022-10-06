//Schema designed for tenants

var { mongoose, AutoIncrement, Schema } = require('../index');

const tenantSchema = new mongoose.Schema({
    _id: Number,
    Domains: { type: [String], index: true },
    CrtdOn: { type: Date, default: Date.now },
    ModOn: { type: Date, default: Date.now },
}, { _id: false }, { autoIndex: false, timestamps: { createdAt: 'CrtdOn', updatedAt: 'ModOn' } });
tenantSchema.plugin(AutoIncrement, { id: 'tenantCounter', inc_field: '_id' });

module.exports = { tenantSchema };

