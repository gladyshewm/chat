import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { FileObject } from '@supabase/storage-js';
import { AuthService } from './auth.service';
import { authPayloadStub, userStub } from './stubs/auth.stub';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthPayload, UserWithToken } from 'generated_graphql';
import { AUTH_REPOSITORY, AuthRepository } from './auth.repository';
import { USER_REPOSITORY, UserRepository } from '../users/users.repository';
import { mockGqlContextResponse } from '../__mocks__/gql-context.mock';
import { AuthRepositoryMock } from './__mocks__/auth.repository';
import { UserRepositoryMock } from './__mocks__/users.repository';
import { fileStub } from './stubs/users.stub';

describe('AuthService', () => {
  let authService: AuthService;
  let authRepository: jest.Mocked<AuthRepository>;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AUTH_REPOSITORY,
          useValue: AuthRepositoryMock,
        },
        {
          provide: USER_REPOSITORY,
          useValue: UserRepositoryMock,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    authRepository = module.get<jest.Mocked<AuthRepository>>(AUTH_REPOSITORY);
    userRepository = module.get<jest.Mocked<UserRepository>>(USER_REPOSITORY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('refreshToken', () => {
    let refreshed: AuthPayload;

    beforeEach(async () => {
      refreshed = await authService.refreshToken();
    });

    it('should call authRepository', () => {
      expect(authRepository.refreshToken).toHaveBeenCalled();
    });

    it('should return user with refreshed tokens successfully', async () => {
      expect(refreshed).toEqual(authPayloadStub());
    });
  });

  describe('getUser', () => {
    let user: UserWithToken | null;
    const mockAccessToken = 'mockAccessToken';

    beforeEach(async () => {
      user = await authService.getUser('mockAccessToken');
    });

    it('should call authRepository with correct data', async () => {
      expect(authRepository.getUser).toHaveBeenCalledWith(mockAccessToken);
    });

    it('should return user successfully', async () => {
      expect(user).toEqual(userStub(mockAccessToken));
    });

    it('should return null if user not found', async () => {
      authService.getUser = jest.fn().mockResolvedValue(null);
      const result = await authService.getUser(mockAccessToken);
      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    let createUserDto: CreateUserDto;
    let createdUser: AuthPayload;

    beforeEach(async () => {
      createUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: '123456',
      };
      createdUser = await authService.createUser(createUserDto);
    });

    it('should call authRepository with correct data', () => {
      const { name, email, password } = createUserDto;
      expect(authRepository.createUser).toHaveBeenCalledWith(
        name,
        email,
        password,
      );
    });

    it('should create user successfully', async () => {
      const { name, email } = createUserDto;
      expect(createdUser).toEqual(authPayloadStub(name, email));
    });

    it('should return correct AuthPayload structure', () => {
      expect(createdUser).toHaveProperty('user');
      expect(createdUser).toHaveProperty('accessToken');
      expect(createdUser).toHaveProperty('refreshToken');
    });
  });

  describe('deleteUser', () => {
    const mockUuid = '3b8d8290-b7d0-450e-a5ad-2b5b6397aff3';
    let isUserDeleted: boolean;

    beforeEach(async () => {
      isUserDeleted = await authService.deleteUser(mockUuid);
    });

    it("should call userRepository.getUserAvatars with user's uuid", async () => {
      expect(userRepository.getUserAvatars).toHaveBeenCalledWith(mockUuid);
    });

    it("should call userRepository.deleteUserProfile with user's uuid", async () => {
      expect(userRepository.deleteUserProfile).toHaveBeenCalledWith(mockUuid);
    });

    it("should call authRepository.deleteUser with user's uuid", async () => {
      expect(authRepository.deleteUser).toHaveBeenCalledWith(mockUuid);
    });

    it('should return true if user is deleted', async () => {
      expect(isUserDeleted).toBeTruthy();
    });

    it('should throw an error if deleting user fails', async () => {
      authRepository.deleteUser.mockRejectedValueOnce(
        new HttpException('', HttpStatus.BAD_REQUEST),
      );
      await expect(authService.deleteUser(mockUuid)).rejects.toThrow(
        HttpException,
      );
    });

    describe('when user has avatars', () => {
      let avatars: FileObject[];

      beforeEach(async () => {
        const avatarsStubs = [fileStub('avatar1'), fileStub('avatar2')];
        userRepository.getUserAvatars = jest
          .fn()
          .mockResolvedValue(avatarsStubs);
        avatars = await userRepository.getUserAvatars(mockUuid);
      });

      it("should return user's avatars", async () => {
        expect(avatars).toHaveLength(2);
      });

      it('should call userRepository.removeAvatarFromStorage with correct path', async () => {
        const avatarsStubs = [fileStub('avatar1'), fileStub('avatar2')];
        avatarsStubs.forEach((avatar) =>
          expect(userRepository.removeAvatarFromStorage).toHaveBeenCalledWith(
            `profiles/${mockUuid}/${avatar.name}`,
          ),
        );
      });

      it('should throw an error if removing avatar from storage fails', async () => {
        const avatarsStubs = [fileStub('avatar1'), fileStub('avatar2')];
        userRepository.removeAvatarFromStorage.mockResolvedValueOnce(false);

        await expect(authService.deleteUser(mockUuid)).rejects.toThrow(
          HttpException,
        );

        expect(userRepository.getUserAvatars).toHaveBeenCalledWith(mockUuid);
        expect(userRepository.removeAvatarFromStorage).toHaveBeenCalledWith(
          `profiles/${mockUuid}/${avatarsStubs[0].name}`,
        );
        expect(userRepository.removeAvatarFromStorage).toHaveBeenCalledWith(
          `profiles/${mockUuid}/${avatarsStubs[1].name}`,
        );
      });
    });

    describe('when user has no avatars', () => {
      let avatars: FileObject[];

      beforeEach(async () => {
        userRepository.getUserAvatars = jest.fn().mockResolvedValue([]);
        avatars = await userRepository.getUserAvatars(mockUuid);
      });

      it("should return empty array if user's avatars not found", async () => {
        expect(avatars).toEqual([]);
      });
    });
  });

  describe('logInUser', () => {
    let loginUserDto: LoginUserDto;
    let loggedInUser: AuthPayload;
    const mockRes = mockGqlContextResponse();

    beforeEach(async () => {
      loginUserDto = {
        email: 'test@example.com',
        password: '123456',
      };
      loggedInUser = await authService.logInUser(loginUserDto, mockRes);
      jest.spyOn(authService['logger'], 'error');
    });

    it('should call authRepository with correct data', async () => {
      const { email, password } = loginUserDto;
      expect(authRepository.logInUser).toHaveBeenCalledWith(email, password);
    });

    it('should log in user successfully', async () => {
      const { email } = loginUserDto;
      expect(loggedInUser).toEqual(authPayloadStub(email));
    });

    it('should set refresh token in cookie', () => {
      expect(mockRes.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'refreshToken',
        expect.any(Object),
      );
    });

    it('should throw HttpException on login error', async () => {
      jest
        .spyOn(authRepository, 'logInUser')
        .mockRejectedValue(new Error('Invalid credentials'));

      try {
        await authService.logInUser(loginUserDto, mockRes);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Invalid credentials');
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      }

      expect(authService['logger'].error).toHaveBeenCalled();
    });
  });

  describe('logOutUser', () => {
    let logout: boolean;

    beforeEach(async () => {
      logout = await authRepository.logOutUser();
    });

    it('should call authRepository', async () => {
      expect(authRepository.logOutUser).toHaveBeenCalled();
    });

    it('should return true when user is logged out successfully', async () => {
      expect(logout).toBeTruthy();
    });

    it('should return false when user is not logged in', async () => {
      (authRepository.logOutUser as jest.Mock).mockResolvedValue(false);
      const result = await authRepository.logOutUser();
      expect(result).toBeFalsy();
    });
  });
});
