import express from 'express';
import { auth } from '../middleware/auth';

const router = express.Router();

import { login, register, getUser } from '../controllers/user.controller';

router.post('/auth/login', login);
router.post('/auth/register', register);

router.get('/currentUser', auth, getUser);

export default router;
