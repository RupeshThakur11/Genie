const express=require('express');
const imageStreams=require('.././imageStreams');
const  Grid = require('gridfs-stream');
const multiparty = require('connect-multiparty')();
const authenticate=require('.././middleware/authenticate');
const router=require('./wishRoutes');
const mongoose = require('mongoose');
const mongodb = mongoose.connection;

// router.route('/image/:id')
// 	.post(authenticate,multiparty,function(req,res){
// 		console.log(req.files);
// 		 var gfs = Grid(mongodb.db, mongoose.mongo);
// 		 imageStreams.uploadImage(gfs,req,res);
// 	});

// router.route('/image/:id')
// 	.get(function(req,res){
// 		 var gfs = Grid(mongodb.db, mongoose.mongo);
// 		 imageStreams.getImage(gfs,req.params.id,res);
// 	});


router.route('/image/upload')
	.post(multiparty,function(req,res){
		console.log(req.files);
		 var gfs = Grid(mongodb.db, mongoose.mongo);
		 imageStreams.uploadImage1(gfs,req,res);
	});

module.exports=router;