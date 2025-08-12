import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserSession } from "@/interfaces";

export async function GET(req: NextRequest) {
    try {
        // Para Next.js App Router, use getServerSession
        const useSession = await getServerSession(authOptions); // Passe as opções de autenticação
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const session = (useSession as any)?.user as UserSession

        if (!session || !session.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const productId = req.nextUrl.searchParams.get('id');

        if (!productId) {
            return NextResponse.json(
                { message: "Product ID is required" },
                { status: 400 }
            );
        }


        const product = await db.product.findFirst({
            where: {
                userId: session.id,
                id: productId
            },
            include: {
                images: true,
                generatedContent: true,
            },
        })

        if (!product) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error("💥 Erro no GET /api/product:", error);
        return NextResponse.json(
            { message: "Erro interno" },
            { status: 500 }
        );
    }
}