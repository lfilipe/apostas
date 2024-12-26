import { User, AuthResponse } from '../types';

const mockUser: User = {
  id: '1',
  name: 'Usuário Teste',
  email: 'teste@exemplo.com',
  role: 'USER',
  totalPoints: 0
};

const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6IlVzdcOhcmlvIFRlc3RlIiwiZW1haWwiOiJ0ZXN0ZUBlbWFpbC5jb20ifQ.8Y7h6NHLhBYV-0uXZZ1tM4dXKmVVZqO5_TNGd1j_Gw8';

export const mockLogin = async (email: string, password: string): Promise<AuthResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'teste@email.com' && password === '123456') {
        resolve({
          user: mockUser,
          token: mockToken
        });
      } else {
        reject(new Error('Credenciais inválidas'));
      }
    }, 1000); // Simula um delay de 1 segundo
  });
}; 