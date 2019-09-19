const express = require('express');
const bodyParser = require('body-parser');
let imgURL = "";
const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res){
    res.render("login");
});
app.post("/",function(req,res){
    if(req.body.designation === "faculty" && req.body.email ==="suraj"){
        let URL ="images/"+req.body.email+".jpg";
        imgURL =URL;
        console.log(imgURL);
        res.redirect("/faculty");
    }
    //console.log(req.body);
});
app.get("/faculty",function(req,res){   
    res.render("faculty",{img:imgURL});
});
app.get("/faculty/apply",function(req,res){
    res.render("apply",{img:imgURL});
});
app.listen(process.env.PORT||3000,function(){
    console.log("server started");
});