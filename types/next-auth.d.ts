import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      subscription?: {
        plan: {
          name: string;
          priceCents?: number | null;
        };
        endsAt?: string | null;
        startedAt?: string;
      };
    };
  }
}
