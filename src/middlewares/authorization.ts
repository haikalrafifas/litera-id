import ApiResponse from '@/utilities/server/response';

interface RoleCheckOptions {
  only?: string | string[];
  except?: string | string[];
}

/**
 * Middleware to check user roles.
 * 
 * Must be declared after authentication middleware.
 * 
 * @param options 
 * @returns 
 */
export function checkRole(options: RoleCheckOptions) {
  return async function (req: Request, next: () => Promise<Response>) {
    const user = (req as any).user;
  
    if (!user || !user.role) {
      return ApiResponse.error(403, 'Forbidden');
    }
  
    const { only, except } = options;
  
    if (only && !user.role.some((role: string) => only.includes(role))) {
      return ApiResponse.error(403, 'Forbidden');
    }
  
    if (except && user.role.some((role: string) => except.includes(role))) {
      return ApiResponse.error(403, 'Forbidden');
    }
  
    return next();
  }
}
