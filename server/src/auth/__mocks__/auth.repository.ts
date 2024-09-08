import { AuthRepository } from '../auth.repository';
import { authPayloadStub, userStub } from '../stubs/auth.stub';

/* eslint-disable */
export const AuthRepositoryMock: jest.Mocked<AuthRepository> = {
  refreshToken: jest.fn().mockResolvedValue(authPayloadStub()),
  getUser: jest.fn((token: string) => Promise.resolve(userStub(token))),
  createUser: jest.fn((name: string, email: string, password: string) =>
    Promise.resolve(authPayloadStub(name, email)),
  ),
  deleteUser: jest.fn((uuid: string) => Promise.resolve(true)),
  logInUser: jest.fn((email: string, password: string) =>
    Promise.resolve(authPayloadStub(email)),
  ),
  logOutUser: jest.fn().mockResolvedValue(true),
};
