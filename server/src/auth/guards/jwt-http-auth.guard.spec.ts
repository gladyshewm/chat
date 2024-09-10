import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtHttpAuthGuard } from './jwt-http-auth.guard';
import { AuthStrategy } from '../strategies/auth.strategy.interface';
import {
  mockGqlContextRequest,
  mockGqlContextResponse,
} from '../../__mocks__/gql-context.mock';

describe('JwtHttpAuthGuard', () => {
  let guard: JwtHttpAuthGuard;
  let mockAuthStrategy: jest.Mocked<AuthStrategy>;
  let mockRequest: any;
  let mockResponse: any;
  let mockGqlContext: any;
  let mockContext: ExecutionContext;

  beforeEach(() => {
    mockAuthStrategy = {
      validateToken: jest.fn(),
      refreshToken: jest.fn(),
      setRefreshTokenCookie: jest.fn(),
    };
    mockRequest = mockGqlContextRequest();
    mockResponse = mockGqlContextResponse();
    mockGqlContext = {
      req: mockRequest,
      res: mockResponse,
    };
    mockContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue(mockRequest),
    } as unknown as ExecutionContext;

    jest.spyOn(GqlExecutionContext, 'create').mockReturnValue({
      getContext: jest.fn().mockReturnValue(mockGqlContext),
    } as any);

    guard = new JwtHttpAuthGuard(mockAuthStrategy);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access if valid token is provided', async () => {
    const user = { sub: '123' };
    mockAuthStrategy.validateToken.mockResolvedValue(user);
    mockRequest.headers.authorization = 'Bearer validToken';

    const result = await guard.canActivate(mockContext);

    expect(result).toBe(true);
    expect(mockAuthStrategy.validateToken).toHaveBeenCalledWith('validToken');
    expect(mockRequest.user).toBe(user);
    expect(mockGqlContext['user_uuid']).toBe(user.sub);
  });

  it('should throw UnauthorizedException if no access token is provided', async () => {
    mockRequest.headers.authorization = undefined;

    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(mockAuthStrategy.validateToken).not.toHaveBeenCalled();
  });

  it('should attempt to refresh token if access token verification fails', async () => {
    const user = { uuid: '123' };
    const newAccessToken = 'newAccessToken';
    const newRefreshToken = 'newRefreshToken';

    mockAuthStrategy.validateToken.mockRejectedValue(
      new Error('Invalid token'),
    );
    mockAuthStrategy.refreshToken.mockResolvedValue({
      user,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });

    mockRequest.headers.authorization = 'Bearer invalidToken';
    mockRequest.cookies['refreshToken'] = 'validRefreshToken';

    const result = await guard.canActivate(mockContext);

    expect(result).toBe(true);
    expect(mockAuthStrategy.refreshToken).toHaveBeenCalled();
    expect(mockAuthStrategy.setRefreshTokenCookie).toHaveBeenCalledWith(
      mockResponse,
      newRefreshToken,
    );
    expect(mockResponse.setHeader).toHaveBeenCalledWith(
      'X-New-Access-Token',
      newAccessToken,
    );
    expect(mockRequest.user).toBe(user);
    expect(mockGqlContext['user_uuid']).toBe(user.uuid);
  });

  it('should throw UnauthorizedException if refresh token is not provided', async () => {
    mockAuthStrategy.validateToken.mockRejectedValue(
      new Error('Invalid token'),
    );

    mockRequest.headers.authorization = 'Bearer invalidToken';
    mockRequest.cookies['refreshToken'] = undefined;

    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(mockAuthStrategy.refreshToken).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException if refreshToken fails', async () => {
    mockAuthStrategy.validateToken.mockRejectedValue(
      new Error('Invalid token'),
    );
    mockAuthStrategy.refreshToken.mockRejectedValue(
      new Error('Refresh token expired'),
    );

    mockRequest.headers.authorization = 'Bearer invalidToken';
    mockRequest.cookies['refreshToken'] = 'expiredRefreshToken';

    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(mockAuthStrategy.refreshToken).toHaveBeenCalled();
  });
});
