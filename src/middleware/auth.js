import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { secret } from '../../config';

export const auth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    next(createError.Unauthorized('INVALID credentials'));
    return;
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      next(createError.Unauthorized('INVALID credentials'));
      return;
    }
    req.user = user;
    next();
  });
};

export const generateToken = async (email) => {
  console.log(secret, 'NO SECRET');

  try {
    const payload = { email, iat: Math.floor(Date.now()) };
    const options = { expiresIn: '1d' };
    const token = await jwt.sign(payload, secret, options);
    return token;
  } catch (err) {
    throw new Error(err);
  }
};
