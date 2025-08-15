import { db } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId, amountToAdd } = await req.json();

        if (!userId || !amountToAdd || amountToAdd <= 0) {
            return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
        }

        const coins = await db.coins.upsert({
            where: { userId },
            update: {
                amount: { increment: amountToAdd },
                updatedAt: new Date(),
            },
            create: {
                userId,
                amount: amountToAdd,
            },
        });

        return NextResponse.json({ success: true, coins }, { status: 200 });

    } catch (error) {
        console.error("Erro ao atualizar coins:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
