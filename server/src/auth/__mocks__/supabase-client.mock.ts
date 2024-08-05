export const mockSupabaseClient = {
  auth: {
    refreshSession: jest.fn(),
    getUser: jest.fn(),
    getSession: jest.fn(),
    signUp: jest.fn(),
    signInWithPassword: jest.fn(),
    signOut: jest.fn(),
  },
  from: jest.fn().mockReturnThis(),
  insert: jest.fn(),
};
