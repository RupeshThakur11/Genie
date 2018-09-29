const Joi = require('joi');

const schema = Joi.object().keys({
    image: Joi.object().keys({
    	fieldName : Joi.string(),
    	originalFilename : Joi.string(),
    	path : Joi.string(),
    	headers : Joi.object(),
    	size : Joi.number(),
    	name : Joi.string(),
    	type:Joi.string().valid(['image/jpeg','image/png'])
    })
});

module.exports=schema;