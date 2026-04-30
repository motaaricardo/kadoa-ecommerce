import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt', maxAge: 60 * 60 * 8 }, // 8h admin sessions
  pages: { signIn: '/admin/login' },
  providers: [
    CredentialsProvider({
      name: 'Admin',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(creds) {
        if (!creds?.email || !creds?.password) return null;
        const adminEmail = await prisma.setting.findUnique({ where: { key: 'admin_email' } });
        const adminHash = await prisma.setting.findUnique({ where: { key: 'admin_password_hash' } });
        if (!adminEmail || !adminHash) return null;
        if (creds.email.toLowerCase() !== adminEmail.value.toLowerCase()) return null;
        const ok = await bcrypt.compare(creds.password, adminHash.value);
        if (!ok) return null;
        return { id: 'admin', email: adminEmail.value, name: 'Admin', role: 'admin' } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) (token as any).role = (user as any).role;
      return token;
    },
    async session({ session, token }) {
      (session as any).role = (token as any).role;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
