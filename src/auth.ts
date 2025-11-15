import { UserRole } from "@/types/roles";
import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";

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
    async jwt({ token, account, profile }) {
      if (account?.access_token) {
        token.keycloakAccessToken = account.access_token;
      }
      if (profile?.roles) {
        token.role = profile.roles.filter((role: string) =>
          Object.values(UserRole).includes(role as UserRole),
        )[0] as UserRole | null;
      }
      if (profile?.address && profile.address instanceof String) {
        token.address = profile.address as string;
      }
      return token;
    },
    async session({ session, token }) {
      session.keycloakAccessToken = token.keycloakAccessToken;
      session.role = token.role;
      session.address = token.address;
      return session;
    },
  },
});
