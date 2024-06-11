import { Request } from 'express';
import { User } from '../database/entities/user';
import { JwtPayload } from 'jsonwebtoken';

declare module 'express-serve-static-core' {
  export interface Request {
    user?: any
  }
}

export { Request };
