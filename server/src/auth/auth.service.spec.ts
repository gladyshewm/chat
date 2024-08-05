import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { SupabaseService } from '../supabase/supabase.service';
import { authPayloadStub, userStub } from './stubs/auth.stub';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserInfo } from 'src/graphql';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Response } from 'express';
import { mockSupabaseClient } from './__mocks__/supabase-client.mock';

jest.mock('../supabase/supabase.service');

describe('AuthService', () => {
  let authService: AuthService;
  // let supabaseService: jest.Mocked<SupabaseService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: SupabaseService,
          useValue: {
            getClient: jest.fn().mockReturnValue(mockSupabaseClient),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    // supabaseService = module.get(SupabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('refreshToken', () => {
    it('should return user with refreshed tokens successfully', async () => {
      const user = authPayloadStub().user;
      const mockRefreshData = {
        data: {
          user: {
            id: user.uuid,
            user_metadata: { name: user.name },
            email: user.email,
          },
          session: {
            access_token: authPayloadStub().accessToken,
            refresh_token: authPayloadStub().refreshToken,
          },
        },
        error: null,
      };
      mockSupabaseClient.auth.refreshSession.mockResolvedValue(mockRefreshData);

      const result = await authService.refreshToken();

      expect(result).toEqual(authPayloadStub());
    });

    it('should throw an error if refresh token fails', async () => {
      const mockRefreshData = {
        data: null,
        error: { message: 'Error refreshing token' },
      };
      mockSupabaseClient.auth.refreshSession.mockResolvedValue(mockRefreshData);

      await expect(authService.refreshToken()).rejects.toThrow(HttpException);
    });
  });

  describe('getUser', () => {
    let user: UserInfo;

    beforeEach(() => {
      user = authPayloadStub().user;
    });

    it('should return user successfully', async () => {
      const mockUserData = {
        data: {
          user: {
            id: user.uuid,
            user_metadata: { name: user.name },
            email: user.email,
          },
        },
        error: null,
      };
      const sessionData = {
        data: {
          session: {
            access_token: authPayloadStub().accessToken,
          },
        },
        error: null,
      };
      mockSupabaseClient.auth.getUser.mockResolvedValue(mockUserData);
      mockSupabaseClient.auth.getSession.mockResolvedValue(sessionData);

      const result = await authService.getUser();

      expect(result).toEqual(userStub());
    });

    it('should return null if user not found', async () => {
      const mockUserData = {
        data: {
          user: null,
        },
        error: null,
      };
      const sessionData = {
        data: {
          session: null,
        },
        error: null,
      };
      mockSupabaseClient.auth.getUser.mockResolvedValue(mockUserData);
      mockSupabaseClient.auth.getSession.mockResolvedValue(sessionData);

      const result = await authService.getUser();

      expect(result).toBeNull();
    });

    it('should throw an error if session not found', async () => {
      const mockUserData = {
        data: {
          user: {
            id: user.uuid,
            user_metadata: { name: user.name },
            email: user.email,
          },
        },
        error: null,
      };
      const sessionData = {
        data: {
          session: null,
        },
        error: null,
      };
      mockSupabaseClient.auth.getUser.mockResolvedValue(mockUserData);
      mockSupabaseClient.auth.getSession.mockResolvedValue(sessionData);

      await expect(authService.getUser()).rejects.toThrow(
        new HttpException(
          'Сессия пользователя не найдена',
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });

  describe('createUser', () => {
    let createUserDto: CreateUserDto;

    beforeEach(() => {
      createUserDto = {
        name: userStub().user.name,
        email: userStub().user.email,
        password: '123456',
      };
    });

    it('should create user successfully', async () => {
      const mockSignUpData = {
        data: {
          user: {
            id: '123',
          },
          session: {
            access_token: authPayloadStub().accessToken,
            refresh_token: authPayloadStub().refreshToken,
          },
        },
        error: null,
      };
      mockSupabaseClient.auth.signUp.mockResolvedValue(mockSignUpData);
      mockSupabaseClient.from().insert.mockResolvedValue({
        error: null,
      });

      const result = await authService.createUser(createUserDto);

      expect(result).toEqual({
        user: {
          uuid: expect.any(String),
          name: createUserDto.name,
          email: createUserDto.email,
        },
        accessToken: mockSignUpData.data.session.access_token,
        refreshToken: mockSignUpData.data.session.refresh_token,
      });
    });

    it('should throw an error if user creation fails', async () => {
      const mockSignUpData = {
        data: null,
        error: { message: 'Error creating user' },
      };
      mockSupabaseClient.auth.signUp.mockResolvedValue(mockSignUpData);

      await expect(authService.createUser(createUserDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('logInUser', () => {
    let loginUserDto: LoginUserDto;

    it('should log in user successfully', async () => {
      loginUserDto = {
        email: userStub().user.email,
        password: '123456',
      };

      const mockSignInData = {
        data: {
          user: {
            id: userStub().user.uuid,
            user_metadata: { name: userStub().user.name },
            email: userStub().user.email,
          },
          session: {
            access_token: authPayloadStub().accessToken,
            refresh_token: authPayloadStub().refreshToken,
          },
        },
        error: null,
      };
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue(
        mockSignInData,
      );

      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      const result = await authService.logInUser(loginUserDto, mockResponse);

      expect(result).toEqual({
        user: {
          uuid: userStub().user.uuid,
          name: userStub().user.name,
          email: userStub().user.email,
        },
        accessToken: mockSignInData.data.session.access_token,
        refreshToken: mockSignInData.data.session.refresh_token,
      });
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'refreshToken',
        expect.any(Object),
      );
    });

    it('should throw UnauthorizedException on login error', async () => {
      loginUserDto = {
        email: userStub().user.email,
        password: 'wrongPassword',
      };

      const mockSignInData = {
        data: null,
        error: { message: 'Invalid credentials' },
      };
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue(
        mockSignInData,
      );

      const mockResponse = {} as Response;

      await expect(
        authService.logInUser(loginUserDto, mockResponse),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('logOutUser', () => {
    it('should log out user successfully when authenticated', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: {} },
        error: null,
      });
      mockSupabaseClient.auth.signOut.mockResolvedValue({ error: null });

      const result = await authService.logOutUser();

      expect(result).toBe(true);
      expect(mockSupabaseClient.auth.signOut).toHaveBeenCalled();
    });

    it('should return false when user is not authenticated', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const result = await authService.logOutUser();

      expect(result).toBe(false);
      expect(mockSupabaseClient.auth.signOut).not.toHaveBeenCalled();
    });

    it('should throw HttpException on logout error', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: {} },
        error: null,
      });
      mockSupabaseClient.auth.signOut.mockResolvedValue({
        error: 'Logout failed',
      });

      await expect(authService.logOutUser()).rejects.toThrow(HttpException);
    });
  });
});
