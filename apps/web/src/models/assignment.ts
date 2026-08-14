import type { Book } from './book';

export interface Assignment {
  id: number;
  bookId: number;
  studentId: number;
  assignedById: number;
  assignedAt: string;
  book?: Book;
}

export interface CreateAssignmentInput {
  bookId: number;
  studentId: number;
}
