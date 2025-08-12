import NextAuth from 'next-auth/next'
import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from 'next-auth/providers/google'

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
            }
            return session;
        },
    },
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };