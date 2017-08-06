const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const PORT = process.env.PORT || 8080;

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bcrypt = require('bcrypt');

const RedisStore = require('connect-redis')(session);


let db = require('./models');
let users = db.Users;

const app = express();
const hbs = exphbs.create({
  dafaultLayout : 'main',
  extname : 'hbs'
});



app.engine('hbs, hbs.engine');
app.set('view engine', 'hbs');

app.use(session({
  store: new RedisStore(),
  secret: 'keyboard cat',
  resave: false,
  saveUnitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


app.use(express.static('public'));

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

passport.use(new LocalStrategy((username, password, done) => {
  users.findOne({ where: {username: username } })
  .then(user => {
    if(user === null) {
      return done(null, false, {message: 'incorrect username or password'});
    }else{
      return done(null, false, {message: 'incorrect username or password'});
    }
  })
  .catch(err => { console.log('error: ', err); });
}));

passport.serializeUser((user, done) => {
  console.log('serializing');
  return done(null, {
    id: user.id,
    username: user.username
  });
});

passport.deserializeUser((user, done) => {
  console.log('deserializing');
  users.findOne({ where: { id: user.id }})
  .then(user => {
    console.log(user);
    return done(null, user);
  });
});

app.listen(PORT, () => {
  db.sequelize.sync();
  console.log(`server running on ${PORT}`);
});