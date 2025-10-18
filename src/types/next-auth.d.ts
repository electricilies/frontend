import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  export interface User {
    keycloakAccessToken: string;
  }

  export interface Session {
    keycloakAccessToken: string;
  }
}

declare module "next-auth/jwt" {
  export interface JWT {
    keycloakAccessToken: string;
  }
}
