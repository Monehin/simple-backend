import dotenv from 'dotenv';
dotenv.config();

export const db = process.env.MONGODB_URL;
export const secret = process.env.TOKEN_SECRET;
