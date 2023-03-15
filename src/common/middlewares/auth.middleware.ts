import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Response, NextFunction } from 'express';

import { buildResponse } from '../helpers';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private _jwtService: JwtService) {}

  public async use(req: any, _: Response, next: NextFunction) {
    const { headers, query } = req;
    const { authorization } = headers;
    const [accessToken] = authorization?.split(' ')?.reverse() || [];
    let authToken = accessToken;
    if (!accessToken) {
      const { authorization } = query;
      authToken = authorization as string;
    }
    try {
      this._jwtService.verify(authToken || '');
      const decodedUser = this._jwtService.decode(authToken, { json: true });
      req.user = decodedUser;
    } catch (error) {
      throw buildResponse(
        false,
        {
          message: ['Access token is empty or invalid'],
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    next();
  }
}
