'use client';

/**
 * Decodes a JWT token manually.
 * @param {string} token - The JWT token string.
 * @returns {object|null} - The decoded payload, or null if the token is invalid.
 */
export const decodeToken = (token: any) => {
  if (!token) {
    return null;
  }

  // Split the token into three parts (header, payload, signature)
  const [headerEncoded, payloadEncoded, signatureEncoded] = token.split('.');

  if (!headerEncoded || !payloadEncoded || !signatureEncoded) {
    console.error('Invalid token structure');
    return null;
  }

  try {
    // Decode base64 url-safe encoded header and payload
    // const decodedHeader = JSON.parse(atobUrlSafe(headerEncoded));
    const decodedPayload = JSON.parse(atobUrlSafe(payloadEncoded));

    return decodedPayload; // Return only the payload
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Decodes base64 URL-safe encoded string.
 * @param {string} base64Url - The base64 URL-safe string to decode.
 * @returns {string} - The decoded string.
 */
const atobUrlSafe = (base64Url: any) => {
  // Replace URL-safe characters
  const base64 = base64Url
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(base64Url.length + (4 - base64Url.length % 4) % 4, '=');
  
  return atob(base64); // Decode using atob
};

export const getToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return token;
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

export const storeToken = (token: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};
