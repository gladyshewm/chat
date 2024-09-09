enum PropertyPath {
  SUPABASE_URL = 'SUPABASE_URL',
  SUPABASE_KEY = 'SUPABASE_KEY',
  SUPABASE_SERVICE_ROLE_KEY = 'SUPABASE_SERVICE_ROLE_KEY',
}

export const mockConfigService = {
  get: jest.fn((propertyPath: PropertyPath) => {
    switch (propertyPath) {
      case 'SUPABASE_URL':
        return 'http://supabase-url';
      case 'SUPABASE_KEY':
        return 'supabase-key';
      case 'SUPABASE_SERVICE_ROLE_KEY':
        return 'service-role-key';
      default:
        return undefined;
    }
  }),
};
