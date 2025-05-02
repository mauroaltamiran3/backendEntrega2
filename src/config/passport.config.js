import passport from 'passport';
import local from 'passport-local';
import User from '../models/User.js';
import { createHash, isValidPassword } from '../utils.js';

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use('register', new LocalStrategy(
    { usernameField: 'email', passReqToCallback: true },
    async (req, email, password, done) => {
      const { first_name, last_name } = req.body;
      try {
        console.log('🟡 Intentando registrar usuario con email:', email);
  
        const exist = await User.findOne({ email });
        if (exist) {
          console.log('🔴 Usuario ya existe');
          return done(null, false);
        }
  
        const hashedPassword = createHash(password);
        console.log('🟢 Password hasheado:', hashedPassword);
  
        const user = await User.create({ first_name, last_name, email, password: hashedPassword });
        console.log('✅ Usuario creado:', user);
  
        return done(null, user);
      } catch (err) {
        console.error('🔥 Error en strategy register:', err);
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

  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });
};

export default initializePassport;