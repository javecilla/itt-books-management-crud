import { IsInt } from 'class-validator';

export class CreateAssignmentDto {
  @IsInt()
  bookId: number;

  @IsInt()
  studentId: number;
}
