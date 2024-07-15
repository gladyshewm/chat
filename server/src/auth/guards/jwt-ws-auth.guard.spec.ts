import { WsAuthGuard } from './jwt-ws-auth.guard';

describe('WsAuthGuard', () => {
  it('should be defined', () => {
    expect(new WsAuthGuard()).toBeDefined();
  });
});
