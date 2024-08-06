import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { authPayloadStub, userStub } from './stubs/auth.stub';
import { AuthPayload, UserWithToken } from '../graphql';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';
import { LoginUserDto } from './dto/login-user.dto';

jest.mock('./auth.service');

const mockGqlContextRequest = () => {
  const req: Partial<Request> = {};
  // req.accessToken = '';
  return req as Request;
};

const mockGqlContextResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe('AuthResolver', () => {
  let authResolver: AuthResolver;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule],
      providers: [AuthResolver, AuthService],
    }).compile();

    authResolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authResolver).toBeDefined();
  });

  describe('refreshToken', () => {
    let refreshed: AuthPayload;

    beforeEach(async () => {
      refreshed = await authResolver.refreshToken();
    });

    it('should call authService', async () => {
      expect(authService.refreshToken).toHaveBeenCalled();
    });

    it('should return user with updated tokens (access and refresh)', async () => {
      expect(refreshed).toEqual(authPayloadStub());
    });

    it('should return correct AuthPayload structure', () => {
      expect(refreshed).toHaveProperty('user');
      expect(refreshed).toHaveProperty('accessToken');
      expect(refreshed).toHaveProperty('refreshToken');
    });
  });

  describe('getUser', () => {
    let user: UserWithToken | null;

    beforeEach(async () => {
      const mockReq = mockGqlContextRequest();
      user = await authResolver.getUser(mockReq);
    });

    it('should call authService', async () => {
      expect(authService.getUser).toHaveBeenCalled();
    });

    it('should return user and token', async () => {
      expect(user).toEqual(userStub());
    });

    it('should return correct UserWithToken structure', () => {
      expect(user).toHaveProperty('user');
      expect(user).toHaveProperty('token');
    });

    it('should return null for unauthenticated user', async () => {
      authService.getUser.mockResolvedValue(null);
      const result = await authResolver.getUser();
      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    let authPayload: AuthPayload;
    let createInput: CreateUserDto;

    beforeEach(async () => {
      createInput = {
        name: userStub().user.name,
        email: userStub().user.email,
        password: '123456',
      };
      authPayload = await authResolver.createUser(createInput);
    });

    it('should call authService', async () => {
      expect(authService.createUser).toHaveBeenCalledWith(createInput);
    });

    it('should return user and token', async () => {
      expect(authPayload).toEqual(authPayloadStub());
    });

    it('should return correct AuthPayload structure', () => {
      expect(authPayload).toHaveProperty('user');
      expect(authPayload).toHaveProperty('accessToken');
      expect(authPayload).toHaveProperty('refreshToken');
    });
  });

  describe('logInUser', () => {
    let loginInput: LoginUserDto;
    let mockRes: Response;
    let authPayload: AuthPayload;

    beforeEach(async () => {
      loginInput = {
        email: userStub().user.email,
        password: '123456',
      };
      mockRes = mockGqlContextResponse();
      authPayload = await authResolver.logInUser(loginInput, mockRes);
    });

    it('should call authService', async () => {
      expect(authService.logInUser).toHaveBeenCalledWith(loginInput, mockRes);
    });

    it('should return user and token', async () => {
      expect(authPayload).toEqual(authPayloadStub());
    });

    it('should return correct AuthPayload structure', () => {
      expect(authPayload).toHaveProperty('user');
      expect(authPayload).toHaveProperty('accessToken');
      expect(authPayload).toHaveProperty('refreshToken');
    });
  });

  describe('logOutUser', () => {
    let logout: boolean;

    beforeEach(async () => {
      logout = await authResolver.logOutUser();
    });

    it('should call authService', async () => {
      expect(authService.logOutUser).toHaveBeenCalled();
    });

    it('should return true', async () => {
      expect(logout).toBeTruthy();
    });

    it('should handle logout failure', async () => {
      authService.logOutUser.mockResolvedValue(false);
      const result = await authResolver.logOutUser();
      expect(result).toBeFalsy();
    });
  });
});
