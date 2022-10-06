

const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
var Schema = mongoose.Schema;

mongoose.plugin((schema) => {
    schema.options.toJSON = {
        virtuals: true,
        transform(doc, ret) {
            delete ret.id;
        }
    };
    schema.pre('findOneAndUpdate', function (next) {
        this.update({}, { $set: { ModOn: new Date() } })
        next()
    });
});

module.exports = {
    mongoose,
    AutoIncrement,
    Schema
}