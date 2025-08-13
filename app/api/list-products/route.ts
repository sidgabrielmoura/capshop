// app/api/products/route.ts
import { NextResponse } from "next/server";
import { db } from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next"; 
import { authOptions } from "../auth/[...nextauth]/authOptions";
import { UserSession } from "@/interfaces";

export async function GET() {
  try {
    const useSession = await getServerSession(authOptions)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = (useSession as any)?.user as UserSession
    
    if (!session || !session.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const products = await db.product.findMany({
      where: { userId: session.id }, 
      include: {
        images: true,
        generatedContent: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("💥 Erro no GET /api/products:", error);
    return NextResponse.json(
      { message: "Erro interno" },
      { status: 500 }
    );
  }
}