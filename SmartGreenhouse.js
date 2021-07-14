if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config({path: '.env'})
}
const express = require("express");
const mongoose = require("mongoose");
const { reset } = require("nodemon");
const ejs = require("ejs");
const cors = require ("cors");
const bcrypt = require ("bcrypt");
const flash = require("express-flash");
const session = require("express-session");
const passport = require("passport");
const webpush = require("web-push");
const bodyParser= require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");

const initializePassport = require('./passport-config');

initializePassport(
    passport,
     email => User.find(user => user.email === email),
     id => User.find(user => user.id === id)
)

const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server,{
    cors: {
       origin:  "*",
    }
});


//------------------------------------------------------------------------------------------------------///

app.use(express.json());
app.use("/static", express.static('./static/'));
//URL encoded
app.use(express.urlencoded({extended:false}));
//cors
app.use(cors());
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}))
//Passport
app.use(passport.initialize());
app.use(passport.session());
//EJS
app.set('view engine', 'ejs');

mongoose.connect('mongodb+srv://User3:qazxsw123@cluster0.gu3mc.mongodb.net/smartGreenhouse?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});




//overall Data schema
const dataSchema = new mongoose.Schema({
entryNum:{
    type:Number,
},
sensorID: {
    type: String,
    required: true

},
plantID: {
    type: String,
    required: true

},
cropName:{
    type: String,
    required: true
},
temp: {
    type: Number,
    required: true

},
soil: {
    type: Number,
    required: true,

},
light:{
    type: Number,
    required: true,
},
humidity:{
    type: Number,
    required: true,
},
timestamp: {
    type: Date,
    default: Date.now().toString()

},


});

// Temperature and Humidity
const tempSchema = new mongoose.Schema({
    entryNum:{
        type:Number,
    },
    sensorID: {
        type: String,
        required: true
    },
    plantID: {
        type: String,
        required: true
    
    },
    cropName:{
        type: String,
        required: true
    },
    tempVal: {
        type: Number,
        required: true
    
    },
    humVal: {
        type: Number,

       
    
    },
   
    timestamp: {
        type: Date,
        default: Date.now().toString()
    
    },  
    });


//Light Intensity Schema
const lightSchema = new mongoose.Schema({
entryNum:{
        type:Number,
},
sensorID: {
    type: String,
    required: true

},
plantID: {
    type: String,
    required: true

},
cropName:{
    type: String,
    required: true
},
lightVal: {
    type: Number,
    required: true

},
timestamp: {
    type: Date,
    default: Date.now().toString()

},


});
// Soil Moisture Schema
const soilSchema = new mongoose.Schema({
    entryNum:{
        type:Number,
    },
    sensorID: {
        type: String,
        required: true
    
    },
    plantID: {
        type: String,
        required: true
    
    },
    cropName:{
        type: String,
        required: true
    },
    soilMoisture: {
        type: Number,
        required: true
    
    },

    timestamp: {
        type: Date,
        default: Date.now().toString()
    
    },
    
    
});
 
const userSchema = new mongoose.Schema({
   
    
    name: {
        type: String,
        required: true
    
    },
    email:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    
    },

    timestamp: {
        type: Date,
        default: Date.now().toString()
    
    },
    
    
});

const plantSchema = new mongoose.Schema({
   
    
    cropname: {
        type: String,
        required: true
    
    },
    sensorID:{
        type: String,
        required: true
    },
    plantID: {
        type: String,
        required: true
    
    },
    sm_ul: {
        type: Number,
        required: true
    
    },
    sm_ll: {
        type: Number,
        required: true
    
    },
    t_ul: {
        type: Number,
        required: true
    
    },
    t_ll: {
        type: Number,
        required: true
    
    },

    timestamp: {
        type: Date,
        default: Date.now().toString()
    
    },
    
    
});

    
function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

const publicVapidKey= 
'BDjcoMBooAZwU60UUipuA1d-tH2zoJ3J9WcWt3m3xKZ805mln188eQKQLTfR4TAE1kTGGliV-76EElCBGrFPvuM';
const privateVapidKey='dDrJClJOw2ZckuQ2oAkWoPGGWjmB2t4eEtQ0Gm5RJjU';
const Plant = mongoose.model('plants', plantSchema);
const Reading = mongoose.model('datas', dataSchema);
const LightData = mongoose.model('light', lightSchema);
const TempData = mongoose.model('temphums', tempSchema);
const SoilData = mongoose.model('soils', soilSchema);
const User = mongoose.model('users', userSchema);
dataSchema.set('validateBeforeSave', false);
lightSchema.set('validateBeforeSave', false);
tempSchema.set('validateBeforeSave', false);
soilSchema.set('validateBeforeSave', false);



//--------------------------------------------------------------------------------------------------------//

webpush.setVapidDetails('mailto:test@test.com', publicVapidKey, privateVapidKey);

app.post("/subscribe", (req,res)=> {
    const subscription =req.body;

    res.status(201).json({});

    const payload = JSON.stringify({
        title: 'Notification',
    });

    webpush.sendNotification(payload).catch(err => {
   console.error(err);     
    }); 

});



io.on('connect', socket => {
    console.log('a user connected');
    console.log(socket.id);
});

app.get("/", /*checkAuthenticated,*/(req, res)=> {
    res.sendFile(path.join(__dirname+"/views/index.html"));
    console.log("this is the html page");
});

app.get("/register", (req,res) => {
    res.render('register');
});

app.post("/register", async (req,res) => {
    console.log(
        req.body.name,
        req.body.email,
        req.body.password
    )
    
    try {
       
        
        let newUser = new User({
            
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
         var hashedPassword = await bcrypt.hash(req.body.password, 10);
        newUser.save(() =>{
            console.log(newUser);
        }); 
        res.redirect('/login')
    } catch (e){
        res.redirect('/register');
        console.log (e);
    }
    
});

app.get("/login", (req,res)=> {
    res.render('login');
});

app.post("/login", passport.authenticate('local', {
    successRedirect: '/',
    failure: 'login',
    failureFlash: true

}));
///----------------------------------------------------------------------------
//==============================================================================

var transporter =  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth:{
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    }
});
var light_mail = {
    from: '"Smart Greenhouse" <smart.greenhousedev@gmail.com>',
    to: 'iamjoelm@gmail.com',
    subject: "SmartGreenhouse Farm: Light",
    text: "This parameter(Light) is being exceeded.",
    
};

var soil_mail = {
    from: '"Smart Greenhouse" <smart.greenhousedev@gmail.com>',
    to: 'iamjoelm@gmail.com',
    subject: "SmartGreenhouse Farm: Soil Moisture",
    text: "This parameter(Soil Moisture) is being exceeded.",
    
};

var temp_mail = {
    from: '"Smart Greenhouse" <smart.greenhousedev@gmail.com>',
    to: 'iamjoelm@gmail.com',
    subject: "SmartGreenhouse Farm: Temp",
    text: "This parameter(Temperature) is being exceeded.",
    
};

var hum_mail = {
    from: '"Smart Greenhouse" <smart.greenhousedev@gmail.com>',
    to: 'iamjoelm@gmail.com',
    subject: "SmartGreenhouse Farm: Humidity",
    text: "This parameter(Humidity) is being exceeded.",
    
};


//==============================================================================
//-----------------------------------------------------------------------------

app.get("/add_plant", (req,res)=> {

    res.sendFile(path.join(__dirname+"/views/add_plant.html"));
    
})

app.post("/add_plant", (req, res) => {
    let newPlant = new Plant({
        cropname: req.body.cropname,
        sensorID: req.body.sensorID,
        plantID: req.body.plantID,
        sm_ll: req.body.sm_ll,
        sm_ul: req.body.sm_ul,
        t_ll: req.body.t_ll,
        t_ul: req.body.t_ul,
    })

    newPlant.save(()=> {
        console.log(newPlant);
    }).then(()=> {
        res.redirect("/add_plant");
    });
    //res.redirect('/add_plant');

});

app.get("/history", (req,res) => {
    //const {page = 1, limit = 10}= req.query;
    Reading.find({}, function(err, records){
    res.render('history',{
            recordList: records

    });
    })
});

app.get("/data", (req,res)=>{
    Reading.find( (err, value) =>{
        if (err)res.status(400).json("Bad Request");
        res.json(value);
    }); 

});
app.get("/data/light", (req,res)=>{
    LightData.find( (err, value) =>{
        if (err)res.status(400).json("Bad Request");
        res.json(value);
    }).sort({$natural: -1}).limit(1); 

});
app.get("/data/soil", (req,res)=>{
    SoilData.find( (err, value) =>{
        if (err)res.status(400).json("Bad Request");
        res.json(value);
    }).sort({$natural: -1}).limit(1); 

});
app.get("/data/temphum", (req,res)=>{
    TempData.find( (err, value) =>{
        if (err)res.status(400).json("Bad Request");
        res.json(value);
    }).sort({$natural: -1}).limit(1); 

});

var light_breach, soil_breach, temp_breach;
var t_breach_time = 0, t_new_breach_time;
var l_breach_time = 0, l_new_breach_time;
var s_breach_time = 0, s_new_breach_time;
var h_breach_time = 0, h_new_breach_time;
// Accept Data from embedded systems
app.post("/data", async  (req,res) => {
 var dataLength = await Reading.countDocuments();
    let newData = new Reading({
        entryNum: dataLength + 1, 
        sensorID: req.body.sensorID,
        plantID: req.body.plantID,
        soil: req.body.soil,
        temp: req.body.temp,
        light: req.body.light,
        humidity: req.body.humidity,
        cropName: req.body.cropName,
        sensorType: req.body.sensorType

    })

    
   
        dataLength = await SoilData.countDocuments();
        var soilData = new SoilData({
            entryNum: dataLength +1,
            sensorID: req.body.sensorID,
            plantID: req.body.plantID,
            soilMoisture: req.body.soil,
            cropName: req.body.cropName,
        })
    
   
         dataLength = await LightData.countDocuments();        
        var lightData = new LightData({
            entryNum: dataLength +1,
            sensorID: req.body.sensorID,
            plantID: req.body.plantID,
            lightVal: req.body.light,
            cropName: req.body.cropName,
        })
   
    
         dataLength = await TempData.countDocuments();
        var tempData = new TempData({
            entryNum: dataLength +1,
            sensorID: req.body.sensorID,
            plantID: req.body.plantID,
            tempVal: req.body.temp,
            humVal: req.body.humidity,
            cropName: req.body.cropName,
        })
    

    




try{
     newData.validate();
     lightData.validate();
     soilData.validate();
     tempData.validate();
     
}
    catch(e){
        console.error(e);
        console.log("Please Validate")
        res.status(400).json(e.message);
    }

    try{
        var newReceived = newData.save();
    
        var lightReceived = lightData.save();
        var soilReceived = soilData.save();
        var tempReceived = tempData.save();
        Promise.all([newReceived, soilReceived, lightReceived, tempReceived]).then((values) => {
            // io.broadcast.emit('sendData', newData);
            res.json(values);
            console.log(values);
          }).then(() => {
            io.emit('sendData', newData);
            
           var d = new Date();
            if (newData.soil<70){
                console.log(s_breach_time);
                s_new_breach_time = d.getMinutes();
                if(s_new_breach_time> 5+s_breach_time || s_breach_time == 0){
                    console.log(s_breach_time);
                    console.log(s_new_breach_time);
                    transporter.sendMail(soil_mail, (err,info) => {
                        if(err){
                            console.log(err);
                        }
                        else{
                            console.log(info.messageId);
                        }
                    });
                    s_breach_time =s_new_breach_time;
                }
            }

            if (newData.temp<21 || newData.temp>32){
                t_new_breach_time = d.getMinutes();
                if(t_new_breach_time> 5+t_breach_time && t_breach_time ==0){
                    transporter.sendMail(temp_mail, (err,info) => {
                        if(err){
                            console.log(err);
                        }
                        else{
                            console.log(info.messageId);
                        }
                    });
                    t_breach_time =t_new_breach_time;
                }
            }

            if (newData.light < 500){
                l_new_breach_time = d.getMinutes();
                if(l_new_breach_time> 5+l_breach_time && l_breach_time ==0){
                    transporter.sendMail(light_mail, (err,info) => {
                        if(err){
                            console.log(err);
                        }
                        else{
                            console.log(info.messageId);
                        }
                    });
                    l_breach_time =l_new_breach_time;
                }
            }
            if (newData.humidity < 50){
                h_new_breach_time = d.getMinutes();
                if(h_new_breach_time> 5+h_breach_time && h_breach_time ==0){
                    transporter.sendMail(hum_mail, (err,info) => {
                        if(err){
                            console.log(err);
                        }
                        else{
                            console.log(info.messageId);
                        }
                    });
                    h_breach_time =h_new_breach_time;
                }
            }
            



          });

    }
    catch(e){

        //console.log("Please Save");
        console.error(e);
    }

    
  


});





//app.listen(5000);
server.listen(5000, '0.0.0.0', function() {
    console.log('Listening to port:  ' + 5000);
});