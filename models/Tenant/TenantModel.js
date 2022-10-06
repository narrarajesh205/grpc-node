
var { mongoose, Schema } = require('../index');
const { tenantSchema } = require('./TenantSchema');
var tenantModelSchema = Schema(tenantSchema);

tenantModelSchema.virtual('TID').get(function (){
    let TID;
    if(this._id) UID = this._id;
    return TID;
});


tenantModelSchema.statics.createTenantByDomain = async function(Email){
    let tenantData = {};
    let domain = Email.split('@')[1];
    let tenantInfo = {
        Domains: [domain]
    }
    let res = await this.create(tenantInfo);
    return res;
}

tenantModelSchema.set('toObject', { getters: true });
tenantModelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Tenant', tenantModelSchema);