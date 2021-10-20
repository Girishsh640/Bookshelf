var express  = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    bodyParser = require("body-parser"),
    User    =  require("./models/user"),
    nodemailer = require('nodemailer'),
    book    =  require("./models/book"),
    app       = express();

mongoose.connect("mongodb://localhost/bookselves-data", {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));

app.use(require("express-session")({
    secret: "Thor is the strongest avenger!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});


app.get('/', function(req, res){
    res.render("index");
});

app.get('/sell',isLoggedIn, function(req, res){
    res.render("sell");
});

app.get('/books', function(req, res){
    book.find({}, function(err, allbooks){
        if(err){
            console.log(err);
        }
        else{ 
         res.render("Home",{books: allbooks, currentUser: req.user});      
        }
    });
});

app.post('/books', function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var mrp =  Number(req.body.mrp);
    var state = req.body.state;
    var dist = req.body.dist;
    var instname = req.body.instname;
    var city = req.body.city;
    var phoneno = Number(req.body.phoneno);
    var email = req.body.email;
    var author = {
      id: req.user._id,
      username: req.user.username
    };
    var newBook = {name: name, image: image, description: desc,mrp: mrp,
                    author: author,state: state, dist: dist,
                    phoneno: phoneno, city: city, email: email, 
                    instname: instname};
    book.create(newBook, function(err, newlycreated){
        if(err){
            console.log(err);
        }
        else {
              res.redirect("/books");
        }
    });
});

app.get('/register', function(req, res){
    res.render("register");
});

app.post('/register', function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
           if(err){
               console.log(err);
               return res.render("register");
           }
               passport.authenticate("local")(req, res, function(){
                   res.redirect("/books");
               });
    });
});

app.get('/login', function(req, res){
    res.render("login");
});

app.post('/login',passport.authenticate("local",{
   successRedirect: "/books",
   failureRedirect: "/login"
}), function(req, res){});

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/books');
});


app.post('/:id',isLoggedIn ,  function(req, res){
     book.findById(req.params.id, function(err, foundBook) {
                   if(err) {
                       console.log(err);
                          }
                   else {
                         res.render("show",{book: foundBook});
                       }
                   });  
            });

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server starts running!!");
});