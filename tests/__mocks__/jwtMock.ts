// Mock for @/utilities/server/jwt
export const JWTAuth = {
  generateToken: jest.fn(() => 'mock-token'),
  access: {
    sign: jest.fn(() => 'mock-access-token')
  }
};