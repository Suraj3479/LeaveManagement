const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const {ensureAuthenticated} = require("../auth.js");

const app = express();

const router = express.Router();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

//fs.unlinkSync('./public/images/suraj.jpg');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,'./public/images');
    },
    filename: function (req, file, cb) {
      cb(null,file.fieldname +'-' + Date.now()+path.extname(file.originalname));
    }
  });
   
var uploads = multer({ storage: storage }).single('fileToUpload');

const Faculty = require('../model/User.js');
const errors =[];
//let imgURL = ('../images/suraj.jpg');
router.get("/home",ensureAuthenticated,function(req,res){  
    let imgURL = ('/images/'+req.user.Photo); 
    res.render("faculty",{img:imgURL,name:req.user.Name});
});

router.get("/apply",ensureAuthenticated,function(req,res){
    res.render("leaveApply");
});

router.post("/apply",uploads,function(req,res){
    //console.log(req.body);
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log(fullUrl,req.body.facnum);
    //res.redirect("/faculty/home");
    //const fac={};
    Faculty.findOne({UID:req.body.Uid},function(err,results){
        if(!err){
            console.log(results);
            //fac=results;
            var leave = {
                Proof:req.file.filename,
                From:req.body.DateFrom,
                To:req.body.DateTo,
                TOL:req.body.Tol,
                AssignedTo:[{}]
            }
            var num = Number(req.body.facnum);
            for(i=0;i<num;i++){
                let ud = `row${i+1}uid`;
                let from = "row"+(i+1)+"timefrom";
                let to = "row"+(i+1)+"timeto";
                let dt = "row"+(i+1)+"date";
                console.log(req.body.ud,dt);
               var xyz= {
                    ID:req.body[ud],
                    HourFrom:req.body[from],
                    HourTo:req.body[to],
                    Date:req.body[dt]
                }
                console.log(xyz);
                leave.AssignedTo.push(xyz);
            }
            results.Leave.push(leave);
            results.save();
            req.flash('success_msg','Leave successfully applied');
            res.redirect("/faculty/home")
        }      
    });
});

router.get("/hod",ensureAuthenticated,function(req,res){
    res.render("hod");
});

router.get("/hod/registration",ensureAuthenticated,function(req,res){
    res.render("register");
});

router.post("/hod/registration",uploads,function(req,res){
    console.log(req.user.Name);
    console.log(req.file.filename);
    Faculty.findOne({UID:req.body.Uid},function(err,results){
        if(!err){
            if(!results){
                const fac1 = new Faculty({
                    UID:req.body.Uid,
                    Email:req.body.Email,
                    Name:req.body.Name,
                    Password:req.body.Password,
                    Designation:"Faculty",
                    Department:req.body.course_type,
                    Description:req.body.Description,
                    Phone:req.body.Phone,
                    Leaves:2,
                    Photo:req.file.filename,
                    Leave:[]
                });
                if(fac1.Password===req.body.Repassword){
                    bcrypt.genSalt(10,function(err,salt){
                        //const pass=req.body.Repassword;
                        bcrypt.hash(fac1.Password,salt,function(err,hash){
                            if(err) throw err;
                            fac1.Password = hash;
                            fac1.save();
                        });
                    });
                    req.flash('success_msg','New Faculty successfully registered')
                    res.redirect("/faculty/hod");
                }else{
                    req.flash('error_msg','Password does not match!!!');
                    res.redirect('/faculty/hod/registration');
                }  
            }else{
                req.flash('error_msg','User id: '+req.body.Uid+' already exist')
                res.redirect('/faculty/hod/Registration');
            }
        }
    });
});

router.get("/hod/delete",ensureAuthenticated,function(req,res){
    res.render("delete");
});

router.post("/hod/delete",function(req,res){
    let userimg = "";
    Faculty.findOne({UID:req.body.userID},function(err,results){
        if(err) throw err;

        userimg = results.Photo;
    });
    Faculty.findOneAndRemove({UID:req.body.userID},{strict:true},function(err){
        if(err) throw err;
        fs.unlinkSync('./public/images/'+userimg);
        req.flash('success_msg','Faculty successfully deleted')
        res.redirect('/faculty/hod');
    });
});

router.get("/login",function(req,res){
    res.render("stafflogin",{errors:errors});
});

//login handle
router.post("/login",function(req,res,next){
    //console.log(req.body.designation);
    if(req.body.designation==='faculty'){
        passport.authenticate('local',{
            successRedirect:'/faculty/home',
            failureRedirect:'/faculty/login',
            failureFlash:true  
        })(req,res,next);
    }else if(req.body.designation==='hod'){
        passport.authenticate('local',{
            successRedirect:'/faculty/hod',
            failureRedirect:'/faculty/login',
            failureFlash:true  
        })(req,res,next);
    }
});

//logout handle
router.get('/logout',function(req,res){
    req.logout();
    req.flash('success_msg','you are successfully logged out!');
    res.redirect('/faculty/login')
});

module.exports = router;