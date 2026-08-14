import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  async create(assignedById: number, dto: CreateAssignmentDto) {
    const existing = await this.prisma.assignment.findUnique({
      where: {
        bookId_studentId: {
          bookId: dto.bookId,
          studentId: dto.studentId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('This book is already assigned to this student');
    }

    return this.prisma.assignment.create({
      data: {
        bookId: dto.bookId,
        studentId: dto.studentId,
        assignedById,
      },
    });
  }

  findForStudent(studentId: number) {
    return this.prisma.assignment.findMany({
      where: { studentId },
      include: { book: true },
    });
  }
}
