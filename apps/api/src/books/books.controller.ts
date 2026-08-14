import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';

@Controller('books')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Post()
  @Roles(Role.TEACHER)
  create(@Req() req, @Body() dto: CreateBookDto) {
    return this.booksService.create(req.user.userId, dto);
  }

  @Get()
  @Roles(Role.TEACHER)
  findMine(@Req() req) {
    return this.booksService.findAllByTeacher(req.user.userId);
  }
}
