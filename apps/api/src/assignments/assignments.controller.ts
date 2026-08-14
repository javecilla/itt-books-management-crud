import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';

@Controller('assignments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AssignmentsController {
  constructor(private assignmentsService: AssignmentsService) {}

  @Post()
  @Roles(Role.TEACHER)
  create(@Req() req, @Body() dto: CreateAssignmentDto) {
    return this.assignmentsService.create(req.user.userId, dto);
  }

  @Get('mine')
  @Roles(Role.STUDENT)
  findMine(@Req() req) {
    return this.assignmentsService.findForStudent(req.user.userId);
  }
}
