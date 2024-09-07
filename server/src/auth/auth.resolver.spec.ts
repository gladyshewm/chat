import { Test, TestingModule } from '@nestjs/testing';
import { Response, Request } from 'express';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { authPayloadStub, userByTokenStub, userStub } from './stubs/auth.stub';
import { AuthPayload, UserWithToken } from '../graphql';
import { AUTH_STRATEGY } from './strategies/auth-strategy.token';
import { JwtAuthStrategy } from './strategies/jwt-auth.strategy';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

jest.mock('./auth.service');

const mockGqlContextRequest = (accessToken?: string) => {
  return {
    accessToken,
  } as unknown as Request;
};

const mockGqlContextResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe('AuthResolver', () => {
  let authResolver: AuthResolver;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      providers: [
        AuthResolver,
        AuthService,
        {
          provide: AUTH_STRATEGY,
          useClass: JwtAuthStrategy,
        },
      ],
    }).compile();

    authResolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
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

    describe('when token is provided', () => {
      const mockReq = mockGqlContextRequest('mockAccessToken');

      beforeEach(async () => {
        user = await authResolver.getUser(mockReq);
      });

      it('should call authService', async () => {
        expect(authService.getUser).toHaveBeenCalled();
      });

      it('should call authService with correct token', async () => {
        expect(authService.getUser).toHaveBeenCalledWith('mockAccessToken');
      });

      it('should return user and token', async () => {
        const token = mockReq.accessToken as string;
        expect(user).toEqual(userByTokenStub(token));
      });

      it('should return correct UserWithToken structure', () => {
        expect(user).toHaveProperty('user');
        expect(user).toHaveProperty('token');
      });
    });

    describe('when token is not provided', () => {
      const mockReq = mockGqlContextRequest();

      beforeEach(async () => {
        user = await authResolver.getUser(mockReq);
      });

      it('should return null for unauthenticated user', async () => {
        expect(user).toBeNull();
      });

      it('should not call authService', async () => {
        expect(authService.getUser).not.toHaveBeenCalled();
      });
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

    it('should call authService with correct data', async () => {
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

    it('should call authService with correct data', async () => {
      expect(authService.logInUser).toHaveBeenCalledWith(loginInput, mockRes);
    });

    it('should return user and token', async () => {
      expect(authPayload).toEqual(authPayloadStub());
    });

    it('should return correct AuthPayload structure', () => {
      expect(authPayload).toHaveProperty('user');
      expect(authPayload.user).toHaveProperty('uuid');
      expect(authPayload.user).toHaveProperty('name');
      expect(authPayload.user).toHaveProperty('email');
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

    it('should return true when user is logged out successfully', async () => {
      expect(logout).toBeTruthy();
    });

    it('should return false when user is not logged in', async () => {
      (authService.logOutUser as jest.Mock).mockResolvedValue(false);
      const result = await authResolver.logOutUser();
      expect(result).toBeFalsy();
    });
  });
});
