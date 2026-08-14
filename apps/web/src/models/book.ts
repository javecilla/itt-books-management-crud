export interface Book {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  teacherId: number;
  createdAt: string;
}

export interface CreateBookInput {
  title: string;
  description: string;
  coverImage: string;
}
