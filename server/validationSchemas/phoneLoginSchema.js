const Joi = require('joi');

const schema = Joi.object().keys({
    phone: Joi.number().integer().min(100000000000).max(999999999999).required(),
    status:Joi.string().valid(['success','failure']).required()
});

module.exports=schema;