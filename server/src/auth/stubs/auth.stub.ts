import { AuthPayload, UserWithToken } from 'generated_graphql';

export const authPayloadStub = (name?: string, email?: string): AuthPayload => {
  return {
    user: {
      uuid: '3b8d8290-b7d0-450e-a5ad-2b5b6397aff3',
      name: name || 'anonymous',
      email: email || 'anonymous@example.com',
    },
    accessToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6InpMbjBEYVFj',
    refreshToken: 'refreshToken',
  };
};

export const userStub = (token?: string): UserWithToken => {
  return {
    user: {
      uuid: '3b8d8290-b7d0-450e-a5ad-2b5b6397aff3',
      name: 'anonymous',
      email: 'anonymous@example.com',
    },
    token: token || 'eyJhbGciOiJIUzI1NiIsImtpZCI6InpMbjBEYVFj',
  };
};
