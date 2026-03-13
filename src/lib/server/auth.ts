import { SvelteKitAuth } from '@auth/sveltekit';
import Google from '@auth/sveltekit/providers/google';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { upsertUser } from './queries/users.js';

export const { handle, signIn, signOut } = SvelteKitAuth({
  providers: [
    Google({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET
    })
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async signIn(params: any) {
      const { user, account } = params;
      if (account?.provider === 'google' && user.email && user.name) {
        try {
          await upsertUser({
            google_id: account.providerAccountId,
            email: user.email,
            name: user.name,
            avatar_url: user.image ?? null
          });
        } catch (err) {
          console.error('Failed to upsert user:', err);
          return false;
        }
      }
      return true;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt(params: any) {
      const { token, account, profile } = params;
      if (account?.provider === 'google' && profile?.sub) {
        const { findByGoogleId } = await import('./queries/users.js');
        const dbUser = await findByGoogleId(profile.sub);
        if (dbUser) {
          token.sub = dbUser.id;
          token.role = dbUser.role;
        }
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session(params: any) {
      const { session, token } = params;
      if (token.sub) {
        session.user.id = token.sub;
      }
      if (token.role) {
        session.user.role = token.role as 'admin' | 'user';
      }
      return session;
    }
  },
  pages: {
    signIn: '/login'
  }
});
