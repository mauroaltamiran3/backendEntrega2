import passport from 'passport';
import local from 'passport-local';
import User from '../models/User.js';
import { createHash, isValidPassword } from '../utils.js';
import GitHubStrategy from 'passport-github2';
import dotenv from 'dotenv';
import passportJwt from 'passport-jwt';

dotenv.config();
const JWTStrategy = passportJwt.Strategy;
const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.jwtCookie;
  }
  return token;
};

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use('register', new LocalStrategy(
    { usernameField: 'email', passReqToCallback: true },
    async (req, email, password, done) => {
      const { first_name, last_name } = req.body;
      try {
        const exist = await User.findOne({ email });
        if (exist) {
          return done(null, false);
        }
  
        const hashedPassword = createHash(password);
        const user = await User.create({ first_name, last_name, email, password: hashedPassword });
  
        return done(null, user);
      } catch (err) {
        console.error('Error:', err);
        return done(err);
      }
    }
));  

  passport.use('login', new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user || !isValidPassword(user, password)) return done(null, false);
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));

  passport.use('jwtCookie', new JWTStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET
  }, async (jwtPayload, done) => {
    try {
      return done(null, jwtPayload.user);
    } catch (error) {
      return done(error);
    }
  }));
  
  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });

  passport.use('github', new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value || `${profile.username}@github.com`;
  
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          first_name: profile.displayName || profile.username,
          last_name: 'GitHub',
          email,
          password: createHash(Date.now().toString()),
          role: 'user'
        });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));
};

export default initializePassport;