// app/api/delete-product/route.ts
import { NextResponse, NextRequest } from "next/server";
import { db } from "@/app/lib/prisma";

export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json();
        const { id } = body;
        
        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        // Deletar os registros relacionados primeiro
        await db.image.deleteMany({ where: { productId: id } });
        await db.generatedContent.deleteMany({ where: { productId: id } });

        // Deletar o produto principal
        await db.product.deleteMany({ where: { id: id } });

        return NextResponse.json({ message: "Produto deletado com sucesso" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro ao deletar produto' }, { status: 500 });
    }
}