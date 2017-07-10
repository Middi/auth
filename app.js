var express               = require("express"),
    bodyParser            = require("body-parser"),
    mongoose              = require('mongoose'),
    passport              = require("passport"),
    User                  = require("./models/user"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose")


mongoose.connect('mongodb://localhost/auth');



var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(require("express-session")({
    secret: "Table Plate",
    resave: false,
    saveUninitialized: false
}));


// ===========================
// ROUTES
// ===========================


app.get('/', function(req, res){
    res.render('home');
});

app.get('/secret', function(req, res){
    res.render('secret');
});

// AUTH ROUTES

// Sign up page
app.get('/register', function(req, res){
    res.render('register');
});

// Handle submitting form
app.post("/register", function(req,res){
   User.register(new User({username: req.body.username}), req.body.password, function(err, user){
       if(err){
           console.log(err);
           return res.render('register');
       }
       else{
           passport.authenticate("local")(req, res, function(){
              res.redirect('/secret'); 
           });
       }
   });
});


// LOGIN ROUTES

app.get("/login", function(req, res){
   res.render("login"); 
});


// Login Logic
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function(req,res){
   
});



// listen to port
app.listen(process.env.PORT, process.env.IP, function(){
    console.log('server has started');
});


