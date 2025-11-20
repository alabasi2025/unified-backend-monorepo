/**
 * SEMOP - JWT Strategy
 * استراتيجية التحقق من JWT
 * 
 * @module JwtStrategy
 * @version 0.2.0
 * @date 2025-11-20
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../services/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'SEMOP_JWT_SECRET_CHANGE_IN_PRODUCTION',
    });
  }

  /**
   * التحقق من صحة الـ JWT Payload
   * @param payload الـ JWT Payload
   * @returns الـ Payload المُحقق منه
   */
  async validate(payload: JwtPayload): Promise<JwtPayload> {
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return payload;
  }
}
