const express=require('express');
const imageStreams=require('.././imageStreams');
const  Grid = require('gridfs-stream');
const uniqueRandom=require('unique-random');
const shuffle=require('shuffle-array');
const multiparty = require('connect-multiparty')();
const authenticate=require('.././middleware/authenticate');
const mongoose = require('mongoose');
const mongodb = mongoose.connection;
const router=require('./authRoutes');
const User= require('../.././app/models/user');
router.route('/wish/:id')
	.get(authenticate,function(req,res){
		var user=req.user;
		var interestedIn=req.params.id;
		var oppositeGenderUsers = new Array();
		// user.gender==='Male'?'Female':(user.gender==='Female'?'Male':'Other')
		User.findByGender(interestedIn,user.likes.concat(user.dislikes)).then(function(users){
			if(users.length>=10){ 
				var arrayUsers= new Array();
				arrayUsers=shuffle.pick(users,{'picks':10});
				user.profiles_sent=arrayUsers;
				user.likes.concat(user.dislikes).map(id=>{
					user.profiles_sent.push(id);
				});
				user.save().then(function(user){
					var json={
						responseCode:200,
						users:arrayUsers
					};
					res.send(json);
				}).catch(function(e){
					console.log(e);
				});
			}
			else if(users.length>=2){
				if(users.length%2!=0){
					users.pop();
				}
				
				user.profiles_sent=users;
				user.likes.concat(user.dislikes).map(id=>{
					user.profiles_sent.push(id);
				});
				user.save().then(function(user){
					var json={
						responseCode:200,
						users:users
					};
					res.send(json);
				}).catch(function(e){
					console.log(e);
				});
			}
			else{
				var json={
					responseCode:0,
					message:"No users left"
				}
				res.send(json);
			}
		}).catch(function(err){
			console.log(err);
		});
	})
	.post(authenticate,function(req,res){
			req.user.likes.push(req.body.liked);
			req.user.dislikes.push(req.body.disliked);
			var interestedIn=req.params.id;
			req.user.save().then(function(user){
			User.findByGender(interestedIn,user.profiles_sent).then(function(users){
				if(users.length>=2){
					var arrayUsers= new Array();
					arrayUsers=shuffle.pick(users,{'picks':2});
					user.profiles_sent.push(arrayUsers[0]);
					user.profiles_sent.push(arrayUsers[1]);
					user.save().then(function(user){
						var json={
							responseCode:200,
							users:arrayUsers
						};
						res.send(json);
					}).catch(function(e){
						console.log(e);
					});
				}
				else{
					var json={
					responseCode:0,
					message:"No users left"
					}
					res.send(json);
				}
			}).catch(function(err){
				console.log(err);
			});
		});
	});
router.route('/me/wish')
	.get(authenticate,function(req,res){
		var user=req.user;
		user.status='online';
		var json={
			responseCode:200,
			user:user
		};
		res.send(user);
	})
	.post(authenticate,function(req,res){
			if(req.body.liked==true){
				req.user.likes.push(req.user._id);
			}
			else{
				req.user.dislikes.push(req.user._id);
			}
			req.user.save().then(function(user){
				var json={
					responseCode:200,
					user:user
				};
				res.send(user);						
			});
	});
module.exports=router;