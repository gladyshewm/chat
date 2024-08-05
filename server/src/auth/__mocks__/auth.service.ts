import { authPayloadStub, userStub } from '../stubs/auth.stub';

export const AuthService = jest.fn().mockReturnValue({
  refreshToken: jest.fn().mockResolvedValue(authPayloadStub()),
  getUser: jest.fn().mockResolvedValue(userStub()),
  createUser: jest.fn().mockResolvedValue(authPayloadStub()),
  logInUser: jest.fn().mockResolvedValue(authPayloadStub()),
  logOutUser: jest.fn().mockResolvedValue(true),
});
