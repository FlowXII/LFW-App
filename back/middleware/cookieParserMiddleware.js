import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

const cookieParserMiddleware = cookieParser();

export default cookieParserMiddleware;
