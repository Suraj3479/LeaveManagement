const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Faculty = require(__dirname +'/model/User.js');

module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField:'email'},(email,password,done)=>{
            //Match user
            console.log(email,password);
            Faculty.findOne({UID:email},function(err,user){
                //console.log(uid);
                if(err) {return done(err);}
                if(!user){
                    return done(null,false,{message:'user id not found'});
                }
                //Match password
                //change this part for hod
                //console.log(user.designation,user.Designation,user.password,user.Password);
                if(user.Designation==='Faculty'){
                    bcrypt.compare(password,user.Password,function(err,isMatch){
                        if(err) throw err;
                        if(isMatch){
                            return done(null,user);
                        }else{
                            return done(null,false,{message:'password incorrect'});
                        }
                    });
                }else if(user.Designation ==='HOD'){
                    bcrypt.compare(password,user.Password,function(err,isMatch){
                        if(err) throw err;
                        if(isMatch){
                            return done(null,user);
                        }else{
                            return done(null,false,{message:'password incorrect'});
                        }
                    });
                }else{
                    return done(null,false,{message:'no match'});
                } 
            });
        })
    );
    passport.serializeUser((user,done)=>{
        done(null,user.id);
    });
    passport.deserializeUser((id,done)=>{
        Faculty.findById(id,(error,user)=>{
            done(error,user);
        });
    });
}