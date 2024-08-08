import { Response } from 'express';

export interface AuthStrategy {
  validateToken(token: string): Promise<any>;
  refreshToken(): Promise<any>;
  setRefreshTokenCookie(res: Response, refreshToken: string): void;
}
