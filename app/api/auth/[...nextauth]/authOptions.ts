import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import { db } from "@/app/lib/prisma"

export const authOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, user }: any) {
      if (session.user) {
        session.user.id = user.id;

        const userData = await db.user.findUnique({
          where: { id: user.id },
          select: {
            subscription: {
              select: {
                plan: {
                  select: {
                    name: true,
                    priceCents: true,
                  }
                },
                startedAt: true,
                endsAt: true
              }
            }
          }
        });

        session.user = {
          ...session.user,
          ...userData
        };
      }
      return session;
    },
    secret: process.env.NEXTAUTH_SECRET
  },
}
