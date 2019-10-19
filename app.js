const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressLayout = require('express-ejs-layouts');
const _ = require('lodash');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const passportLocal = require('passport-local');
const flash = require('connect-flash');
const expressSession = require('express-session');

const app = express();

require(__dirname +'/passportnew.js')(passport);
//app.use(expressLayout);
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

let imgURL = "";

//creating document
const Faculty = require(__dirname +'/model/User.js');


//const facArray = [fac1,fac2];
// Faculty.find({},function(err,results){
//     if(!err){
//         if(results.length === 0){
//             const fac1 = new Faculty({
//                 UID:"1CR17CS123",
//                 Email:"sura17cs@cmrit.ac.in",
//                 Name:"Kishor",
//                 Password:"1234",
//                 Designation:"HOD",
//                 Department:"Computer Science",
//                 Description:"I am cse HOD",
//                 Phone:1234567890,
//                 Leaves:2,
//                 Photo:"xyz",
//                 Status:"On Duty",
//                 Leave:[]
//             });
//             bcrypt.genSalt(10,function(err,salt){
//                 bcrypt.hash(fac1.Password,salt,function(err,hash){
//                     if(err) throw err;
//                     fac1.Password = hash;
//                     fac1.save();
//                 });
//             });
//         }
//     }
// });

//Express session
app.use(expressSession({
    secret:"secret",
    resave:true,
    saveUninitialized:true
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect to flash
app.use(flash());

//global variable
app.use(function(req,res,next){
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    next();
});

const errors =[];

//linking to route page
app.use('/faculty',require('./routes/users.js'));

app.get("/",function(req,res){
   res.render("index");
});

app.listen(process.env.PORT||5000,function(){
    console.log("server started");
});