import { compare, getRounds, hash } from "bcryptjs";


export const BCRYPT_COST = 10;

export const PASSWORD_MIN_LENGTH = 8;

// bcrypt only uses the first 72 BYTES of the password. Counted in bytes, not
// characters: "å" is 2 bytes.
export const PASSWORD_MAX_BYTES = 72;

const encoder = new TextEncoder();

export function isPasswordTooLong(password: string): boolean {
  return encoder.encode(password).length > PASSWORD_MAX_BYTES;
}

export async function hashPassword(password: string): Promise<string> {
  if (isPasswordTooLong(password)) {
    throw new Error("Password too long");
  }
  return hash(password, BCRYPT_COST);
}

export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  if (isPasswordTooLong(password)) return false;
  try {
    return await compare(password, stored);
  } catch {
    return false; // malformed stored value
  }
}

export function needsRehash(stored: string): boolean {
  try {
    const rounds = getRounds(stored);
    return !Number.isInteger(rounds) || rounds < BCRYPT_COST;
  } catch {
    return true; // not a valid bcrypt hash
  }
}