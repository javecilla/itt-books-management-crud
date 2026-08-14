import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'change-this-secret',
      passReqToCallback: true,
    });
  }

  async validate(
    req,
    payload: { sub: number; username: string; role: string },
  ) {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');

    if (token && this.authService.isTokenRevoked(token)) {
      throw new UnauthorizedException('Token has been revoked');
    }

    return { userId: payload.sub, username: payload.username, role: payload.role };
  }
}
