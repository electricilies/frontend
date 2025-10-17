import NextAuth from 'next-auth';
import Keycloak from 'next-auth/providers/keycloak';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    {
      ...Keycloak({}),
      token: `${process.env.AUTH_KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
      authorization: `${process.env.AUTH_KEYCLOAK_ISSUER}/protocol/openid-connect/auth`,
      userinfo: `${process.env.AUTH_KEYCLOAK_ISSUER}/protocol/openid-connect/userinfo`,
    },
  ],
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },
    async jwt({ token, user, account, profile }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose the Keycloak access_token to the client-side session
      if (token.accessToken) {
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
});
