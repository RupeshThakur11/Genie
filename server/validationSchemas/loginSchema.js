const Joi = require('joi');

const schema = Joi.object().keys({
    phone: Joi.number().integer().min(100000000000).max(999999999999),
    authType:Joi.string().valid(['facebook','phone']).required(),
    fbID:Joi.string().allow(''),
    hash:Joi.string().allow('')
});

module.exports=schema;