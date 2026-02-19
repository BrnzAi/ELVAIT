import NextAuth from 'next-auth';
import { authConfig } from './config';

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export { hashPassword, verifyPassword, validatePassword } from './password';
export {
  generateToken,
  createVerificationToken,
  verifyVerificationToken,
  createPasswordResetToken,
  verifyPasswordResetToken,
} from './tokens';
