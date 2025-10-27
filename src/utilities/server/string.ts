import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a random UUID v4
 */
export function generateUUID(): string {
  return uuidv4();
}

/**
 * Options for generating a random string
 */
interface GenerateStringOptions {
  length?: number;       // default: 6
  lowercase?: boolean;   // default: true
  alphanum?: boolean;    // default: true
}

/**
 * Generate a random string based on options
 */
export function generateString(options: GenerateStringOptions = {}): string {
  const {
    length = 6,
    lowercase = true,
    alphanum = true
  } = options;

  let chars = '';
  
  if (alphanum) {
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  } else {
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  }

  let result = '';
  for (let i = 0; i < length; i++) {
    const idx = Math.floor(Math.random() * chars.length);
    result += chars[idx];
  }

  return lowercase ? result.toLowerCase() : result;
}
