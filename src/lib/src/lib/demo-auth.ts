import { UserRole } from "@prisma/client";

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  passwordHash: string;
  role: UserRole;
};

const globalForDemoAuth = globalThis as unknown as {
  demoUsers: Map<string, DemoUser> | undefined;
};

const demoUsers = globalForDemoAuth.demoUsers ?? new Map<string, DemoUser>();

if (process.env.NODE_ENV !== "production") {
  globalForDemoAuth.demoUsers = demoUsers;
}

export function isDemoAuthEnabled() {
  return process.env.NODE_ENV !== "production" && process.env.CLEARFUND_DEMO_MODE === "true";
}

export function findDemoUser(email: string) {
  return demoUsers.get(email.toLowerCase());
}

export function createDemoUser(user: DemoUser) {
  demoUsers.set(user.email.toLowerCase(), user);
  return user;
}
