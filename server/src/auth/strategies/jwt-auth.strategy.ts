import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthStrategy } from './auth.strategy.interface';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'auth/auth.service';
import { Response } from 'express';

@Injectable()
export class JwtAuthStrategy implements AuthStrategy {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async validateToken(token: string): Promise<any> {
    try {
      return this.jwtService.verifyAsync(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async refreshToken(): Promise<any> {
    return this.authService.refreshToken();
  }

  setRefreshTokenCookie(res: Response, refreshToken: string): void {
    this.authService.setRefreshTokenCookie(res, refreshToken);
  }
}
