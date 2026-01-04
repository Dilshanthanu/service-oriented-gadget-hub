export interface JWTPayload {
  [key: string]: any;
  role?: string;
  exp?: number;
}

export const decodeToken = (token: string): JWTPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

export const getUserRoleFromToken = (tokenArg?: string): string | null => {
  const token = tokenArg || localStorage.getItem('token');
  if (!token) return null;

  const payload = decodeToken(token);
  if (!payload) return null;

  // Handle common claims for role including standard and .NET Identity
  const roleClaim =
    payload.role ||
    payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

  if (!roleClaim) return null;

  if (Array.isArray(roleClaim)) {
    return roleClaim[0] || null;
  }

  return roleClaim;
};
