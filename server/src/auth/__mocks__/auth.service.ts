import { authPayloadStub, userByTokenStub } from '../stubs/auth.stub';

export const AuthService = jest.fn().mockReturnValue({
  refreshToken: jest.fn().mockResolvedValue(authPayloadStub()),
  getUser: jest.fn((token: string) => {
    return Promise.resolve(userByTokenStub(token));
  }),
  createUser: jest.fn().mockResolvedValue(authPayloadStub()),
  logInUser: jest.fn().mockResolvedValue(authPayloadStub()),
  logOutUser: jest.fn().mockResolvedValue(true),
});
