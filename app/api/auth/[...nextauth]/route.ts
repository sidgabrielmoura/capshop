import NextAuth from "next-auth"
import GoogleProfile from 'next-auth/providers/google'
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/app/lib/prisma"

const handler = NextAuth({
    adapter: PrismaAdapter(db),
    providers: [
        GoogleProfile({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        })
    ]
})

export { handler as GET, handler as POST }