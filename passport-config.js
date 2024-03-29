
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt'); 



function initialize(passport, getUserbyEmail){
  const authenticateUser = async (email, password, done) => {
    const user = getUserbyEmail(email);
    if (user == null){
      return done(null, false, {message: "No user with that email"});
    }
    try {
        if (await bcrypt.compare(password, user.password)/*password === user.password*/){
          return done(null, user);
        }else{
          return done(null, false, {message: "Password Incorrect"});
        }
    }
    catch (e) {
      return done (e);

    }
  }
  passport.use(new LocalStrategy({usernameField: 'email'},
  authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => {
    return done (null, getUserbyId(id));
  })
}
module.exports = initialize;
