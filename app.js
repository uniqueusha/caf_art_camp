const express=require('express');
const bodyParser=require("body-parser");
const cors = require('cors');
const app=express();
app.use(express.json({ limit: '100mb' }));  


//route
const studentRoute = require("./src/routes/student.routes");
const adminRoute = require("./src/routes/admin.routes");


app.use(bodyParser.json());
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,POST,PATCH,PUT,DELETE,OPTIONS" 
    );
    next();
});
 app.use(cors());
//route
app.use('/v1/api/student', studentRoute);
app.use('/v1/api/admin', adminRoute);

module.exports = app;