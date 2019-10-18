const mongoose = require('mongoose');

//connect to mongoose database
mongoose.connect("mongodb://localhost:27017/LeaveManagement",{useNewUrlParser:true,
useUnifiedTopology: true});
//creating leave schema
//const leave
//Creating FacultySchema
const facultySchema={
    UID:String,
    Email:String,
    Name:String,
    Password:String,
    Designation:String,
    Department:String,
    Description:String,
    Phone:Number,
    Leaves:Number,
    Photo:String,
    Leave:[{
        Proof:String,
        From:Date,
        To:Date,
        TOL:String,
        AssignedTo:[{
            ID:String,
            HourFrom:String,
            HourTo:String,
            Date:Date
        }]
    }]
};

//Creating model for the faculty
const Faculty = mongoose.model("Faculty",facultySchema);

//exporting the faculty model to be used in other pages
module.exports = Faculty;