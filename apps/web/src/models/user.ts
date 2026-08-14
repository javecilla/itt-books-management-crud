export type Role = 'TEACHER' | 'STUDENT';

export interface User {
  id: number;
  username: string;
  role: Role;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}
