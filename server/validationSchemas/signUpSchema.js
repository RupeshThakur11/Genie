const Joi = require('joi');

const schema = Joi.object().keys({
    name: Joi.string().min(3).max(30).required(),
    phone: Joi.number().integer().min(100000000000).max(999999999999),
    gender:Joi.string().valid(['Male','Female','Other']).required(),
    authType:Joi.string().valid(['facebook','phone']).required(),
    profileImage:Joi.string().allow(''),
    display_name:Joi.string().valid(['First Name','Full Name','Initials']).required(),
    age:Joi.number().required().min(18),
    height:Joi.string().allow(''),
    education:Joi.string().allow(''),
    company_name:Joi.string().allow(''),
    job_title:Joi.string().allow(''),
    lives_in:Joi.string().allow(''),
    car_model:Joi.string().allow(''),
    body_type:Joi.string().allow(''),
    about_me:Joi.string().allow(''),
    fbID:Joi.string().allow(''),
    firebase_token:Joi.string().allow(''),
    hash:Joi.string().allow(''),
    images:Joi.array().items(Joi.string().allow(''))
});

module.exports=schema;