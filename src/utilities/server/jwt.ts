import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  VERIFY_TOKEN_SECRET,

  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL,
  VERIFY_TOKEN_TTL,
} = process.env;

export default class JWTAuth {
  private static ACCESS_SECRET = ACCESS_TOKEN_SECRET || 'access_secret_key';
  private static REFRESH_SECRET = REFRESH_TOKEN_SECRET || 'refresh_secret_key';
  private static VERIFY_SECRET = VERIFY_TOKEN_SECRET || 'verify_secret_key';

  private static ACCESS_EXPIRES_IN: SignOptions['expiresIn'] = ACCESS_TOKEN_TTL as any || '15m';
  private static REFRESH_EXPIRES_IN: SignOptions['expiresIn'] = REFRESH_TOKEN_TTL as any || '7d';
  private static VERIFY_EXPIRES_IN: SignOptions['expiresIn'] = VERIFY_TOKEN_TTL as any || '1h';

  /**
   * Create and verify ACCESS tokens
   */
  static access = {
    sign(payload: object, options: SignOptions = {}): string {
      return jwt.sign(payload, JWTAuth.ACCESS_SECRET, {
        expiresIn: JWTAuth.ACCESS_EXPIRES_IN,
        ...options,
      });
    },

    verify<T extends object = JwtPayload>(token: string): T | null {
      try {
        return jwt.verify(token, JWTAuth.ACCESS_SECRET) as T;
      } catch {
        return null;
      }
    },
  };

  /**
   * Create and verify REFRESH tokens
   */
  static refresh = {
    sign(payload: object, options: SignOptions = {}): string {
      return jwt.sign(payload, JWTAuth.REFRESH_SECRET, {
        expiresIn: JWTAuth.REFRESH_EXPIRES_IN,
        ...options,
      });
    },

    verify<T extends object = JwtPayload>(token: string): T | null {
      try {
        return jwt.verify(token, JWTAuth.REFRESH_SECRET) as T;
      } catch {
        return null;
      }
    },
  };

  /**
   * Create and verify VERIFICATION tokens
   */
  static verification = {
    sign(payload: object, options: SignOptions = {}): string {
      return jwt.sign(payload, JWTAuth.VERIFY_SECRET, {
        expiresIn: JWTAuth.VERIFY_EXPIRES_IN,
        ...options,
      });
    },

    verify<T extends object = JwtPayload>(token: string): T | null {
      try {
        return jwt.verify(token, JWTAuth.VERIFY_SECRET) as T;
      } catch {
        return null;
      }
    },
  };
}
