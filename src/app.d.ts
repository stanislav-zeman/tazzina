import type { DefaultSession } from "@auth/sveltekit";

declare module "@auth/sveltekit" {
  interface Session {
    user: {
      id: string;
      role: "admin" | "user";
    } & DefaultSession["user"];
  }
}

declare global {
  namespace App {
    interface Locals {
      auth: import("@auth/sveltekit").SvelteKitAuth["handle"] extends (
        event: infer E,
        ...args: any[]
      ) => any
        ? never
        : never;
    }
    interface PageData {
      session?: import("@auth/sveltekit").Session | null;
    }
    interface Error {}
    interface Platform {}
  }
}

export {};
