import { UserRole } from "@/types/roles";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  export interface Profile {
    roles: (UserRole | string)[];
    address: string;
  }

  export interface Session {
    keycloakAccessToken: string;
    role: UserRole | null;
    address: string;
  }
}

declare module "next-auth/jwt" {
  export interface JWT {
    keycloakAccessToken: string;
    role: UserRole | null;
    address: string;
  }
}
