import { AuthPayload, UserWithToken } from 'generated_graphql';

export const authPayloadStub = (): AuthPayload => {
  return {
    user: {
      uuid: '3b8d8290-b7d0-450e-a5ad-2b5b6397aff3',
      name: 'anonymous',
      email: 'anonymous@example.com',
    },
    accessToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6InpMbjBEYVFj',
    refreshToken: 'refreshToken',
  };
};

export const userStub = (): UserWithToken => {
  return {
    user: {
      uuid: '3b8d8290-b7d0-450e-a5ad-2b5b6397aff3',
      name: 'anonymous',
      email: 'anonymous@example.com',
    },
    token: 'eyJhbGciOiJIUzI1NiIsImtpZCI6InpMbjBEYVFj',
  };
};
