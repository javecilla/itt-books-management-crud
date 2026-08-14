import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(username: string, password: string, role: Role) {
    const hashed = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: { username, password: hashed, role },
      select: { id: true, username: true, role: true, createdAt: true },
    });
  }

  findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  findAllStudents() {
    return this.prisma.user.findMany({
      where: { role: Role.STUDENT },
      select: { id: true, username: true, role: true },
      orderBy: { username: 'asc' },
    });
  }
}
