const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const mongoose = require("mongoose");

const app = express();

// Load Routes
const ideas = require("./routes/ideas");
const users = require("./routes/users");

// Passport Config
require("./config/passport")(passport);

// DB Config
const db = require("./config/database");

// Map global promise - get rid of warning
// this way I use global promise instead of default mongoose promise which is deprecated
mongoose.Promise = global.Promise;

// Connect to Database using mongoose
mongoose.connect(db.mongoURI, {
    useMongoClient: true
})
    .then(() => console.log("MongoDB Connected..."))
    .catch(error => console.log(error));

// Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Method override middleware - for updating courses, PUT request
app.use(methodOverride("_method"));

// Express session midleware
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash middleware - for messaging
app.use(flash());

// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
});

// Index Route
app.get("/", (req, res) => {
    const title = "Welcome";
    res.render("index", {
        title
    });
});

// About Route
app.get("/about", (req, res) => {
    res.render("about");
});

// Use Routes
app.use("/ideas", ideas);
app.use("/users", users);

const port = process.env.PORT || 4000;
 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});