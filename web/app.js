
/**
 * Module dependencies.
 */

var express = require('express')
  , session = require('express-session')
  , routes = require('./routes')  
  , notes = require('./routes/notes')
  , trails = require('./routes/trails')
  , sessions = require('./routes/sessions')
  , http = require('http')
  , redis = require('redis')
  , RedisStore = require('connect-redis')(session)
  , passport = require('passport')
  , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
  , db   = require('./models')
  , bcrypt = require('bcrypt-as-promised')
  , flash = require('connect-flash')
  , path = require('path');  

var app = express();

var redisClient;
if (process.env.REDISTOGO_URL) {
  var rtg = url.parse(process.env.REDISTOGO_URL);
  var redisClient = redis.createClient(rtg.port, rtg.hostname);

  redisClient.auth(rtg.auth.split(":")[1]);
} else {
  redisClient = redis.createClient();
}

app.configure(function(){
  var redisSession = session({secret: '1234567890QWERTY', 
    store: new RedisStore({
      client: redisClient      
    }),
    resave: false,
    saveUninitialized: false
  });  

  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(flash());
  app.use(redisSession);
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(checkAuthentication);
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.post('/notes/delete', notes.delete);
app.post('/notes/update', notes.update);
app.post('/notes', notes.new);

app.post('/trails/delete', trails.delete);
app.post('/trails/update', trails.update);
app.post('/trails', trails.new);
app.get('/trails', trails.index);

app.post('/sessions/delete', sessions.delete);
app.post('/sessions/update', sessions.update);
app.post('/sessions', sessions.new);

var authWhitelistPrefixes = ["/auth", "/log", "/js", "/stylesheets", "/img"];
function requiresAuth(url) {
    console.log("checking auth")
    for(var i = 0; i < authWhitelistPrefixes.length; i++) {
        if(!!url.match(new RegExp("^" + authWhitelistPrefixes[i]))) {
            console.log(url + " does not require auth")
            return false
        }
    }    
    return true
}

function renderAuthError(req, res){
    if (req.get('Accept') == "application/json") {
        res.json({err: "you must be logged in to do that"}, 401);
    } else {
        res.redirect("/login");
    }
}

function checkAuthentication(req, res, next) {
  if (requiresAuth(req.url) && !req.user) {
    renderAuthError(req, res)    
  } else {
    next()
  }
}

passport.serializeUser(function(user, done) {    
  done(null, user.id)
})

passport.deserializeUser(function(id, done) {  
  db.User.findById(id).then(function(user, err) {
    return done(null, user)
  }).catch(function(err){
    return done(err)
  })
})


var googleAuthDomain = "www.betahipster.com";
var domainOverride = process.env.GOOGLE_AUTH_DOMAIN;
if (domainOverride) {
  googleAuthDomain = domainOverride;
}

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
     db.User.findOne({where: {googleId: profile.id}}).then(function(user) {
      if (user) {        
        done(null, user);
      } else {        
        db.User.create({googleId: profile.id, displayName: profile.displayName}).then(function(user){                                          
          done(null, user)                    
        }).catch(function(err) {
          done(err, null)          
        })    
      }
    });       
  }
));

app.get('/auth/google', passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login' }));

app.get('/auth/google/callback',
  passport.authenticate('google', { successRedirect: '/',
                                    failureRedirect: '/login' }));

app.get("/login", function(req, res) {
  res.render('login')
})

app.get("/", function(req, res) {
  user = req.user;  
  if (!user) {
    return res.redirect("/login")
  }

  res.send("id is " + user.id, 200)
})

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
