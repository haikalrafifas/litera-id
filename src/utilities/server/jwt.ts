import { SignJWT, jwtVerify, JWTPayload } from 'jose';

const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  VERIFY_TOKEN_SECRET,

  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL,
  VERIFY_TOKEN_TTL,
} = process.env;

function textEncoder(secret: string) {
  return new TextEncoder().encode(secret);
}

export default class JWTAuth {
  private static ACCESS_SECRET = textEncoder(ACCESS_TOKEN_SECRET || 'access_secret_key');
  private static REFRESH_SECRET = textEncoder(REFRESH_TOKEN_SECRET || 'refresh_secret_key');
  private static VERIFY_SECRET = textEncoder(VERIFY_TOKEN_SECRET || 'verify_secret_key');

  private static ACCESS_EXPIRES_IN = ACCESS_TOKEN_TTL || '15m';
  private static REFRESH_EXPIRES_IN = REFRESH_TOKEN_TTL || '7d';
  private static VERIFY_EXPIRES_IN = VERIFY_TOKEN_TTL || '1h';

  /**
   * Create and verify ACCESS tokens
   */
  static access = {
    async sign(payload: object): Promise<string> {
      return await new SignJWT(payload as JWTPayload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime(JWTAuth.ACCESS_EXPIRES_IN)
        .sign(JWTAuth.ACCESS_SECRET);
    },

    async verify<T extends object = JWTPayload>(token: string): Promise<T | null> {
      try {
        const { payload } = await jwtVerify(token, JWTAuth.ACCESS_SECRET);
        return payload as T;
      } catch {
        return null;
      }
    },
  };

  /**
   * Create and verify REFRESH tokens
   */
  static refresh = {
    async sign(payload: object): Promise<string> {
      return await new SignJWT(payload as JWTPayload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime(JWTAuth.REFRESH_EXPIRES_IN)
        .sign(JWTAuth.REFRESH_SECRET);
    },

    async verify<T extends object = JWTPayload>(token: string): Promise<T | null> {
      try {
        const { payload } = await jwtVerify(token, JWTAuth.REFRESH_SECRET);
        return payload as T;
      } catch {
        return null;
      }
    },
  };

  /**
   * Create and verify VERIFICATION tokens
   */
  static verification = {
    async sign(payload: object): Promise<string> {
      return await new SignJWT(payload as JWTPayload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime(JWTAuth.VERIFY_EXPIRES_IN)
        .sign(JWTAuth.VERIFY_SECRET);
    },

    async verify<T extends object = JWTPayload>(token: string): Promise<T | null> {
      try {
        const { payload } = await jwtVerify(token, JWTAuth.VERIFY_SECRET);
        return payload as T;
      } catch {
        return null;
      }
    },
  };
}
