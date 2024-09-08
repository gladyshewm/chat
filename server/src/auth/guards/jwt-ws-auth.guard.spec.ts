import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { WsException } from '@nestjs/websockets';
import { AuthStrategy } from '../strategies/auth.strategy.interface';
import { JwtWsAuthGuard } from './jwt-ws-auth.guard';

describe('JwtWsAuthGuard', () => {
  let guard: JwtWsAuthGuard;
  let mockAuthStrategy: jest.Mocked<AuthStrategy>;
  let mockContext: ExecutionContext;
  let mockGqlContext: any;
  let mockConnectionParams: { Authorization: string };

  beforeEach(() => {
    mockAuthStrategy = {
      validateToken: jest.fn(),
      refreshToken: jest.fn(),
      setRefreshTokenCookie: jest.fn(),
    };
    mockConnectionParams = {
      Authorization: 'Bearer validToken',
    };
    mockGqlContext = {
      connectionParams: mockConnectionParams,
    };
    mockContext = {
      switchToWs: jest.fn().mockReturnThis(),
      getData: jest.fn().mockReturnValue(mockGqlContext),
    } as unknown as ExecutionContext;

    jest.spyOn(GqlExecutionContext, 'create').mockReturnValue({
      getContext: jest.fn().mockReturnValue(mockGqlContext),
    } as any);

    guard = new JwtWsAuthGuard(mockAuthStrategy);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access if valid token is provided', async () => {
    const user = { sub: '123' };
    mockAuthStrategy.validateToken.mockResolvedValue(user);

    const result = await guard.canActivate(mockContext);

    expect(result).toBeTruthy();
    expect(mockAuthStrategy.validateToken).toHaveBeenCalledWith('validToken');
    expect(mockGqlContext.user).toBe(user);
    expect(mockGqlContext['user_uuid']).toBe(user.sub);
  });

  it('should throw WsException if no access token is provided', async () => {
    mockGqlContext.connectionParams = undefined;

    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      new WsException({ message: 'Connection params not found' }),
    );
    expect(mockAuthStrategy.validateToken).not.toHaveBeenCalled();
  });

  it('should attempt to refresh token if access token verification fails', async () => {
    const user = { uuid: '123' };
    const newAccessToken = 'newAccessToken';

    mockAuthStrategy.validateToken.mockRejectedValue(
      new Error('Invalid token'),
    );
    mockAuthStrategy.refreshToken.mockResolvedValue({
      user,
      accessToken: newAccessToken,
    });

    const result = await guard.canActivate(mockContext);

    expect(result).toBeTruthy();
    expect(mockAuthStrategy.refreshToken).toHaveBeenCalled();
    expect(mockGqlContext.user).toBe(user);
    expect(mockGqlContext['user_uuid']).toBe(user.uuid);
    expect(mockConnectionParams.Authorization).toBe(`Bearer ${newAccessToken}`);
  });

  it('should throw WsException if refresh token fails', async () => {
    mockAuthStrategy.validateToken.mockRejectedValue(
      new Error('Invalid token'),
    );
    mockAuthStrategy.refreshToken.mockRejectedValue(
      new Error('Refresh token expired'),
    );

    await expect(guard.canActivate(mockContext)).rejects.toThrow(WsException);
    expect(mockAuthStrategy.refreshToken).toHaveBeenCalled();
  });

  it('should throw WsException if authorization header format is invalid', async () => {
    mockConnectionParams.Authorization = 'InvalidFormat';

    await expect(guard.canActivate(mockContext)).rejects.toThrow(WsException);
    expect(mockAuthStrategy.validateToken).not.toHaveBeenCalled();
  });
});
