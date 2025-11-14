import { jwtVerify, SignJWT } from 'jose'
import { createHash } from 'crypto'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
)

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

// Hash password using SHA-256 (matches seed script)
export function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex')
}

// Create JWT token
export async function createToken(payload: JWTPayload): Promise<string> {
  const token = await new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)

  return token
}

// Verify JWT token
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as JWTPayload
  } catch (error) {
    return null
  }
}

// Get token from request cookies
export function getTokenFromCookies(cookies: any): string | null {
  return cookies.get('admin_token')?.value || null
}
