import users from '../models/users.json';
import { body, validationResult } from 'express-validator';
import createError from 'http-errors';
import bcrypt from 'bcrypt';
import UserModel from '../models/user.model';
import { generateToken } from '../middleware/auth';

export const register = [
  body('firstName')
    .isLength({ min: 1 })
    .trim()
    .withMessage('First name can not be empty'),
  body('lastName')
    .isLength({ min: 1 })
    .trim()
    .withMessage('Last name can not be empty'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email address.'),
  body('password')
    .isLength({ min: 6 })
    .trim()
    .withMessage('Password must be of minimum 6 characters'),
  async (req, res, next) => {
    try {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        const [err] = error.array();
        next(createError.BadRequest(err.msg));
      } else {
        let found = await UserModel.findOne({ email: req.body.email });
        if (found) {
          next(createError.BadRequest('User already exist'));
          return;
        }
        const hash = await bcrypt.hash(req.body.password, 10);

        const user = new UserModel({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: hash,
        });
        const newUser = await user.save();
        if (!newUser.errors) {
          const { firstName, lastName, email } = user;
          const token = await generateToken(user.email);
          return res.status(201).json({
            message: 'Registration Success',
            token,
            user: { firstName, lastName, email },
          });
        }
      }
    } catch (err) {
      next(err);
    }
  },
];

export const login = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email address.'),
  body('password')
    .isLength({ min: 6 })
    .trim()
    .withMessage('Password must be of minimum 6 characters'),
  async (req, res, next) => {
    try {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        const [err] = error.array();
        next(createError.BadRequest(err.msg));
      } else {
        const user = await UserModel.findOne({ email: req.body.email });
        if (user) {
          const isSame = await bcrypt.compare(req.body.password, user.password);
          if (isSame) {
            const token = await generateToken(user.email);
            const { firstName, lastName, email } = user;
            res.status(200).json({
              message: 'Login Success',
              token,
              user: { firstName, lastName, email },
            });
          } else {
            next(createError.Unauthorized('Email or Password wrong.'));
          }
        } else {
          next(createError.Unauthorized('Email or Password wrong.'));
        }
      }
    } catch (err) {
      next(err);
    }
  },
];

export const getUser = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ email: req.user.email });
    if (user) {
      const { firstName, lastName, email } = user;
      res.status(200).json({
        user: {
          firstName,
          lastName,
          email,
        },
      });
    } else {
      next(createError.NotFound('User not found'));
    }
  } catch (err) {
    next(err);
  }
};
