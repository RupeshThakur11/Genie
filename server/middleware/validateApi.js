const crypto = require('crypto');
var validateApi = function(req,res,next){
	var authType=req.body.authType;
	let hash;
	if(authType==='phone'){
		var phone=req.body.phone;
		const secret = process.env.login_hash_secret;
		hash = crypto.createHmac('sha256', secret)
               				.update(phone)
               				.digest('hex');
	}
	else if(authType==='facebook'){
		var fbID=req.body.fbID;
		const secret = process.env.login_hash_secret;
		hash = crypto.createHmac('sha256', secret)
               				.update(fbID)
               				.digest('hex');
	}

	if(req.body.hash===hash){
		next();
	}
	else{
		res.status(400).send("Invalid Request");
	}
};

module.exports=validateApi;