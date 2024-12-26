export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN';
  totalPoints: number;
  createdAt: Date;
  updatedAt: Date;
} 