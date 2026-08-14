import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  private readonly revokedTokens = new Map<string, number>();

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, username: user.username, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, username: user.username, role: user.role },
    };
  }

  logout(token: string) {
    const decoded = this.jwtService.decode(token) as { exp?: number } | null;
    const expiresAt = decoded?.exp ?? Math.floor(Date.now() / 1000) + 8 * 60 * 60;

    this.cleanupRevokedTokens();
    this.revokedTokens.set(token, expiresAt);

    return { message: 'Logged out successfully' };
  }

  isTokenRevoked(token: string) {
    this.cleanupRevokedTokens();
    return this.revokedTokens.has(token);
  }

  private cleanupRevokedTokens() {
    const now = Math.floor(Date.now() / 1000);

    for (const [token, expiresAt] of this.revokedTokens.entries()) {
      if (expiresAt <= now) {
        this.revokedTokens.delete(token);
      }
    }
  }
}
