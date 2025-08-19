import { NextResponse } from "next/server";
import { db } from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name || !body.price || !body.userId) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    const plan = await db.plan.create({
      data: {
        name: body.name,
        priceCents: body.price,
        subscriptions: {
          create: {
            user: {
              connect: { id: body.userId }
            }
          }
        }
      }
    })

    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error("💥 Erro no POST /api/create-plan:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
