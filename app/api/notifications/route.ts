import { db } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import { UserSession } from "@/interfaces";

export async function POST(req: Request) {
    try {
        const useSession = await getServerSession(authOptions)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const session = (useSession as any)?.user as UserSession

        if (!session || !session.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            )
        }

        const { title, message, type } = await req.json()

        if (!session.id || !title || !message || !type) {
            return NextResponse.json({ error: "Dados em falta" }, { status: 400 })
        }

        const notifications = await db.notification.create({
            data: {
                userId: session.id,
                title,
                message,
                type,
            },
        })

        return NextResponse.json({ success: true, notifications }, { status: 200 })

    } catch (error) {
        console.error("Erro ao atualizar notificações:", error)
        return NextResponse.json({ error: "Erro interno" }, { status: 500 })
    }
}

export async function GET() {
    try {
        const useSession = await getServerSession(authOptions)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const session = (useSession as any)?.user as UserSession

        if (!session || !session.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            )
        }

        if (!session.id) {
            return NextResponse.json({ error: "Dados em falta" }, { status: 400 })
        }

        const notifications = await db.notification.findMany({
            where: { userId: session.id },
        })

        return NextResponse.json({ success: true, notifications }, { status: 200 })

    } catch (error) {
        console.error("Erro ao buscar notificações:", error)
        return NextResponse.json({ error: "Erro interno" }, { status: 500 })
    }
}

export async function PATCH(req: Request) {
  try {
    const { ids } = await req.json()
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "IDs necessários" }, { status: 400 })
    }

    const useSession = await getServerSession(authOptions)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = (useSession as any)?.user as UserSession

    if (!session || !session.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const notifications = await db.notification.updateMany({
      where: { id: { in: ids }, userId: session.id },
      data: { read: true },
    })

    return NextResponse.json({ success: true, notifications }, { status: 200 })
  } catch (error) {
    console.error("Erro ao marcar notificações como lidas:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json()
        if (!id) {
            return NextResponse.json({ error: "ID necessário" }, { status: 400 })
        }

        const useSession = await getServerSession(authOptions)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const session = (useSession as any)?.user as UserSession

        if (!session || !session.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            )
        }

        await db.notification.delete({ where: { id, userId: session.id } })

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        console.error("Erro ao deletar notificação:", error)
        return NextResponse.json({ error: "Erro interno" }, { status: 500 })
    }
}