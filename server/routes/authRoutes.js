const express=require('express');
const User= require('../.././app/models/user');
const imageStreams=require('.././imageStreams');
const  Grid = require('gridfs-stream');
const multiparty = require('connect-multiparty')();
const authenticate=require('.././middleware/authenticate');
const validateApi=require('.././middleware/validateApi');
const _ = require('lodash');
const mongoose = require('mongoose');
const imageSchema=require('.././validationSchemas/imageSchema');
const signUpSchema=require('.././validationSchemas/signUpSchema');
const loginSchema=require('.././validationSchemas/loginSchema');
const Joi=require('joi');
var request = require('request');
var Nexmo=require('nexmo');
const crypto = require('crypto');
const initials=require('initials');
const router=express.Router();
const mongodb = mongoose.connection;
router.route('/signup')
	.post(function(req,res){
		Joi.validate(req.body, signUpSchema, function (err, value) {
			if(err===null){
				req.body.display_name_as=req.body.display_name;
				if(req.body.display_name==='First Name'){
					req.body.display_name=req.body.name.split(' ')[0];
				}
				else if(req.body.display_name==='Full Name'){
					req.body.display_name=req.body.name;
				}
				else{
					req.body.display_name=initials(req.body.name);	
				}
				if(req.body.authType==='phone'){
					User.findOne({phone:req.body.phone}).then(function(user){
						if(!user){
							user=new User(req.body);
							user.save().then(function(){
							return user.generateAuthToken();
							}).then(function(token){
								var response={
									responseCode : 200,
									user : user,
                                    authType : "phone",
                                    phone : req.body.phone
								}
								res.header('x-auth',token).send(response);
							}).catch(function(e){

								var response={
									responseCode : 0,
									message : "Bad request",
                                    authType : "phone",
                                    phone : req.body.phone                                    
								}
								res.send(response);
							});
						}
						else{
								var response={
									responseCode : 0,
									message : "User already exists",
                                    authType : "phone",
                                    phone : req.body.phone                                    
								}
							res.send(response);
						}
					});
				}
				else if(req.body.authType==='facebook'){
					User.findOne({fbID:req.body.fbID}).then(function(user){
						if(!user){
							user=new User(req.body);
							user.save().then(function(){
							return user.generateAuthToken();
							}).then(function(token){
								var response={
									responseCode : 200,
									user : user,
                                    authType : "facebook",
                                    phone : req.body.fbID
								}
								res.header('x-auth',token).send(response);
							}).catch(function(e){

								var response={
									responseCode : 0,
									message : "Bad request",
                                    authType : "facebook",
                                    phone : req.body.fbID                                    
								}
								res.send(response);
							});
						}
						else{
								var response={
									responseCode : 1,
									message : "User already exists",
                                    authType : "facebook",
                                    phone : req.body.fbID                                    
								}
							res.send(response);
						}
					});
				}		
			}
			else{
				var json={
						responseCode:0,
						message:"Bad Request"
					};
					res.send(json);
			} 
		});		
	});

router.route('/login')
	.post(function(req,res){

		Joi.validate(req.body,loginSchema, function (err, value) {
			if(err===null){
				if(req.body.authType==='phone'){
					User.findOne({phone:req.body.phone}).then(function(user){
						if(user){

							user.generateAuthToken().then(function(token){
								var response={
								responseCode : 200,
								user : user,
                                authType : "phone",
                                phone : req.body.phone                                
							}
							res.header('x-auth',token).send(response);
							});
							
							
						}
						else{
							var response={
								responseCode : 0,
								message : "User does not exits",
                                authType : "phone",
                                phone : req.body.phone                                  
							}
							res.send(response);
						}
					});
				}
				else if(req.body.authType==='facebook'){
					User.findOne({fbID:req.body.fbID}).then(function(user){
						if(user){
							user.generateAuthToken().then(function(token){
								var response={
								responseCode : 200,
								user : user,
                                authType : "facebook",
                                phone : req.body.fbID                                
							}
							res.header('x-auth',token).send(response);
							});
						}
						else{
							var response={
								responseCode : 0,
								message : "User does not exits",
                                authType : "facebook",
                                fbID : req.body.fbID                                  
							}
							res.send(response);
						}
					});
				}
			}
			else{
					var json={
						responseCode:0,
						message:"Bad Request"
					};
					res.send(json);
			} 
		}); 
	});

router.route('/logout')
	.delete(authenticate,function(req,res){
		req.user.removeToken(req.token).then(function(){
			res.status(200).send();
		},function(){
			res.status(400).send();
		}).catch(function(err){
			res.status(400).send();
		});
	});
router.route('/me/update')
	.post(authenticate,function(req,res){
		
		Object.keys(req.body).forEach(function(key) {
			if(key==='display_name'){
				req.user.display_name_as=req.body.display_name;
				if(req.body.display_name==='First Name'){
					req.body.display_name=req.user.name.split(' ')[0];
				}
				else if(req.body.display_name==='Full Name'){
					req.body.display_name=req.user.name;
				}
				else{
					req.body.display_name=initials(req.user.name);	
				}	
			}
			req.user[key]=req.body[key];
		});
		req.user.save().then(function(user){
					var json={
						responseCode:200,
						user:user
					};
					res.send(json);
		})
});

module.exports=router;