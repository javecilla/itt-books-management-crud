import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  create(teacherId: number, dto: CreateBookDto) {
    return this.prisma.book.create({
      data: { ...dto, teacherId },
    });
  }

  findAllByTeacher(teacherId: number) {
    return this.prisma.book.findMany({ where: { teacherId } });
  }

  findAll() {
    return this.prisma.book.findMany();
  }
}
